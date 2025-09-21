import { ADD_PREDICTION, DELETE_INQUIRY_RESPONSE } from '@/clients/mutations';
import { GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import UserResponses from '@/components/analysis/user-responses';
import Button from '@/components/controls/button';
import ConfirmationModal from '@/components/modals/confirm-modal';
import MarkdownCustom from '@/components/markdown-custom';
import { AddPredictionMutation, DeleteInquiryResponseMutation, GetInquiryQuery } from '@/graphql/graphql';
import { useFilteredResponses } from '@/hooks/useFilteredResponses';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { useAddAlert } from '@/providers/alert-provider';
import { getAgentIdByName } from '@/utils/agents';
import { parseCodeBlocks } from '@/utils/markdown';
import { useApolloClient, useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface PerResponseTabProps {
  id: string;
}

type ResponseSummary = {
  [userId: string]: {
    text: string;
    lastUpdated: string;
  };
};

const PerResponseTab: React.FC<PerResponseTabProps> = ({ id }) => {
  const [seletedResponse, setSelectedUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [subscriptionId] = useState<string>(uuidv4());
  const [summaries, setSummaries] = useWithLocalStorage<ResponseSummary>({}, `${id}-per-response-summary`);
  const [showSummary, setShowSummary] = useState(true);

  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Hooks
  const addAlert = useAddAlert();

  // Apollo hooks
  const client = useApolloClient();
  const [addPrediction] = useMutation<AddPredictionMutation>(ADD_PREDICTION);
  const [deleteInquiryResponse] = useMutation<DeleteInquiryResponseMutation>(DELETE_INQUIRY_RESPONSE);

  // Query for settings and graph data
  const {
    loading: graphLoading,
    data: inquiryData,
    error: graphError,
  } = useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    errorPolicy: 'all',
  });

  /*================================ API CALLS ==============================*/

  // Use shared filtered responses hook
  const {
    responses: inquiryResponses,
    loading: dataLoading,
    error: dataError,
    refetch: refetchInquiryResponses,
  } = useFilteredResponses({ id });
  // Subscription for summary generation
  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: {
      subscriptionId,
    },
    onData: ({ data: subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction && prediction.type === 'SUCCESS' && seletedResponse) {
        setIsGeneratingSummary(false);

        // Parse the prediction result - it should be a markdown summary in triple backticks
        const rawResult = JSON.parse(prediction.result)[0];
        const parsedBlocks = parseCodeBlocks(rawResult, ['markdown']);
        const summaryText = parsedBlocks.markdown || rawResult; // Fallback to raw result if no markdown block

        if (summaryText) {
          setSummaries((prev) => ({
            ...prev,
            [seletedResponse]: {
              text: summaryText,
              lastUpdated: new Date().toLocaleString(),
            },
          }));
          // Show the summary when regeneration completes
          setShowSummary(true);
        }
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
      setIsGeneratingSummary(false);
    },
  });

  // Auto-select first response when responses are loaded
  useEffect(() => {
    if (!seletedResponse && inquiryResponses && inquiryResponses.length > 0) {
      setSelectedUser(inquiryResponses[0].id);
    }
  }, [inquiryResponses, seletedResponse]);

  /*================================ EVENT HANDLERS ==============================*/

  /**
   * Deletes a response from the inquiry
   * @param responseId
   */
  const handleDeleteResponse = async () => {
    if (!seletedResponse) return;

    const responseId = seletedResponse;

    try {
      await deleteInquiryResponse({
        variables: {
          id: responseId,
          inquiryId: id,
        },
      });
    } catch (error) {
      console.error('Error deleting response:', error);
      addAlert('Error deleting response', 'error');
    }

    // Resets the selected user and refetches the responses, then closes the modal.
    setSelectedUser(null);
    refetchInquiryResponses();
    setIsDeleteModalOpen(false);
  };

  /*================================ HELPER ==============================*/

  const responses = inquiryResponses ?? [];

  const usersPerPage = 40;
  const totalPages = Math.ceil(responses.length / usersPerPage);
  const displayedUsers = responses.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

  const userResponse = responses.find((u) => u.id === seletedResponse);
  const userData = userResponse?.data.history ?? [];

  const generateSummary = async () => {
    if (!seletedResponse) return;

    setIsGeneratingSummary(true);
    const agentId = await getAgentIdByName('Summary Generator', client);

    if (agentId) {
      const userResponse = inquiryResponses?.find((u) => u.id === seletedResponse);
      const userData = userResponse?.data.history ?? [];

      const formattedResponses = userData.map((node) => ({
        question: node.data?.text || '',
        answer: node.data?.response?.text || '',
        ratings: node.data?.response?.ratings?.join(', ') || 'No rating',
      }));

      const input = {
        userId: seletedResponse,
        responses: formattedResponses,
      };

      try {
        await addPrediction({
          variables: {
            subscriptionId,
            agentId,
            inquiryId: id,
            input: { userMessage: JSON.stringify(input) },
          },
        });
      } catch (error) {
        console.error('Error sending message to agent:', error);
        setIsGeneratingSummary(false);
      }
    } else {
      console.error('Per Response Summary Agent not found');
      setIsGeneratingSummary(false);
    }
  };

  /*================================ EFFECTS ==============================*/

  // Automatically select the first response when responses are loaded
  useEffect(() => {
    if (responses.length > 0 && !seletedResponse) {
      const firstResponseId = responses[0].id;
      setSelectedUser(firstResponseId);
    }
  }, [responses, seletedResponse]);

  /*================================ RENDERING ==============================*/

  if (graphLoading || dataLoading) return <p className="text-slate-700 dark:text-white">Loading...</p>;
  if (graphError || dataError) return <p className="text-slate-700 dark:text-white">Error loading data</p>;

  return (
    <>
      <div className="bg-white dark:bg-slate-700 px-4 py-8 rounded-2xl shadow-xl text-slate-700 dark:text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Per Response</h2>
          {seletedResponse && (
            <div className="flex gap-2">
              {summaries[seletedResponse] && (
                <Button onClick={() => setShowSummary(!showSummary)} variant="secondary">
                  {showSummary ? 'Hide Summary' : 'Show Summary'}
                </Button>
              )}
              <Button onClick={generateSummary} disabled={isGeneratingSummary}>
                {isGeneratingSummary ? (
                  <>
                    Generating... <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
                  </>
                ) : summaries[seletedResponse] ? (
                  'Regenerate Summary'
                ) : (
                  'Generate Summary'
                )}
              </Button>
            </div>
          )}
        </div>
        <div className="my-4">
          <h2 className="font-bold mb-2">Select User</h2>
          <div className="grid grid-cols-4 sm:grid-col-3 lg:grid-cols-4 gap-2">
            {displayedUsers.map(({ id: userId, data }) => (
              <button
                key={userId}
                onClick={() => setSelectedUser((prev) => (prev === userId ? null : userId))}
                className={`p-2 text-sm rounded-md ${
                  seletedResponse === userId
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white'
                }`}
              >
                {(() => {
                  const name = data.userDetails?.name;
                  const email = data.userDetails?.email || userId;

                  if (!name || name === 'Unknown' || name === 'null') {
                    return email;
                  }

                  return `${name} (${email})`;
                })()}
              </button>
            ))}
          </div>
          {responses.length > usersPerPage && (
            <div className="flex justify-end mt-4 space-x-2">
              <Button onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))} disabled={currentPage === 0}>
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>{' '}
        {seletedResponse && summaries[seletedResponse] && showSummary && (
          <div className="my-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-md">
            <div className="prose prose-sm max-w-none">
              <MarkdownCustom>{summaries[seletedResponse].text}</MarkdownCustom>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Last Updated: {summaries[seletedResponse].lastUpdated}
            </p>
          </div>
        )}
        <hr className="my-6 border-slate-300 dark:border-slate-600" />
        <div className="w-full">
          {seletedResponse && (
            <>
              <div className="flex justify-between items-center mb-4">
                {' '}
                <h2 className="font-bold">
                  User Response |{' '}
                  {(() => {
                    const name = userResponse?.data.userDetails?.name;
                    const email = userResponse?.data.userDetails?.email;

                    if (!name || name === 'Unknown' || name === 'null') {
                      return email || seletedResponse;
                    }

                    return name;
                  })()}
                </h2>
                <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger" size="small" icon={faTrash}>
                  Delete Response
                </Button>
              </div>

              <UserResponses inquiryData={inquiryData} userData={userData} />
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        text="Are you sure you want to delete this response?"
        confirmText="Delete"
        onConfirm={handleDeleteResponse}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default PerResponseTab;
