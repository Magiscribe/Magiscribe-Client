import { ADD_PREDICTION, DELETE_INQUIRY_RESPONSE } from '@/clients/mutations';
import { GET_INQUIRIES_RESPONSES, GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import Button from '@/components/controls/button';
import ConfirmationModal from '@/components/modals/confirm-modal';
import {
  AddPredictionMutation,
  DeleteInquiryResponseMutation,
  GetInquiryQuery,
  GetInquiryResponsesQuery,
  InquiryResponseFilters,
} from '@/graphql/graphql';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { useAddAlert } from '@/providers/alert-provider';
import { GraphNode, NodeVisitAnalysisData } from '@/types/conversation';
import { getAgentIdByName } from '@/utils/agents';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';

import FilterControls from './filter-controls';

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
  const [subscriptionId] = useState<string>(`per_response_summary_${Date.now()}`);
  const [summaries, setSummaries] = useWithLocalStorage<ResponseSummary>({}, `${id}-per-response-summary`);

  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Add filters state
  const [appliedFilters, setAppliedFilters] = useState<InquiryResponseFilters>({
    createdAt: {},
    name: {},
    email: {},
  });

  // Hooks
  const addAlert = useAddAlert();

  // Apollo hooks
  const client = useApolloClient();
  const [addPrediction] = useMutation<AddPredictionMutation>(ADD_PREDICTION);
  const [deleteInquiryResponse] = useMutation<DeleteInquiryResponseMutation>(DELETE_INQUIRY_RESPONSE);

  // Query for form and graph data
  const {
    loading: graphLoading,
    data: inquiryData,
    error: graphError,
  } = useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    errorPolicy: 'all',
  });

  /*================================ API CALLS ==============================*/

  // Query for responses with filters
  const {
    loading: dataLoading,
    data: inquiryResponseData,
    error: dataError,
    refetch: refetchInquiryResponses,
  } = useQuery<GetInquiryResponsesQuery>(GET_INQUIRIES_RESPONSES, {
    variables: {
      id,
      filters: appliedFilters,
    },
    errorPolicy: 'all',
  });

  // Subscription for summary generation
  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: {
      subscriptionId,
    },
    onData: ({ data: subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction && prediction.type === 'SUCCESS' && seletedResponse) {
        setIsGeneratingSummary(false);
        const result = JSON.parse(JSON.parse(prediction.result)[0]);
        if (result && result.summary) {
          setSummaries((prev) => ({
            ...prev,
            [seletedResponse]: {
              text: result.summary,
              lastUpdated: new Date().toLocaleString(),
            },
          }));
        }
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
      setIsGeneratingSummary(false);
    },
  });

  /*================================ EVENT HANDLERS ==============================*/

  // Handle filter application
  const handleApplyFilters = (filters: InquiryResponseFilters) => {
    const cleanedFilters: InquiryResponseFilters = {};

    if (filters.createdAt && Object.keys(filters.createdAt).length > 0) {
      cleanedFilters.createdAt = filters.createdAt;
    }

    if (filters.name && Object.keys(filters.name).length > 0) {
      cleanedFilters.name = filters.name;
    }

    if (filters.email && Object.keys(filters.email).length > 0) {
      cleanedFilters.email = filters.email;
    }

    setAppliedFilters(cleanedFilters);
  };

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

  const responses = inquiryResponseData?.getInquiryResponses ?? [];

  const nodesMap = useMemo(
    () =>
      Object.fromEntries((inquiryData?.getInquiry?.data?.graph?.nodes || []).map((node: GraphNode) => [node.id, node])),
    [inquiryData?.getInquiry?.data?.graph?.nodes],
  );

  const usersPerPage = 40;
  const totalPages = Math.ceil(responses.length / usersPerPage);
  const displayedUsers = responses.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

  const userResponse = responses.find((u) => u.id === seletedResponse);
  const userData = userResponse?.data.history ?? [];

  // Check if any filters are actually applied
  const hasActiveFilters = Object.values(appliedFilters).some((filter) => filter && Object.keys(filter).length > 0);

  const generateSummary = async () => {
    if (!seletedResponse) return;

    setIsGeneratingSummary(true);
    const agentId = await getAgentIdByName('Summary Generator', client);

    if (agentId) {
      const userResponse = inquiryResponseData?.getInquiryResponses?.find((u) => u.id === seletedResponse);
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

  /*================================ RENDERING ==============================*/

  const renderNodeContent = (node: NodeVisitAnalysisData) => {
    const nodeText = node?.data?.text;
    if (node?.data?.response) {
      const responseText = node.data.response.text;
      const ratings = node.data.response.ratings;

      return (
        <>
          <p className="font-semibold text-slate-700 dark:text-white">{nodeText}</p>
          <hr className="my-2 border-slate-300 dark:border-slate-600" />
          <p className="text-slate-700 dark:text-white">
            {responseText && <span>{responseText}</span>}
            {ratings?.length && ratings?.length > 0 && (
              <span>
                {responseText ? ' - ' : ''}
                {ratings.join(', ')}
              </span>
            )}
          </p>
        </>
      );
    } else {
      return <p className="font-semibold text-slate-700 dark:text-white">{nodeText}</p>;
    }
  };

  if (graphLoading || dataLoading) return <p className="text-slate-700 dark:text-white">Loading...</p>;
  if (graphError || dataError) return <p className="text-slate-700 dark:text-white">Error loading data</p>;

  return (
    <>
      <div className="bg-white dark:bg-slate-700 px-4 py-8 rounded-2xl shadow-xl text-slate-700 dark:text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Per Response</h2>
          {seletedResponse && (
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
          )}
        </div>

        <div className="mt-6 mb-6">
          <FilterControls
            onApplyFilters={handleApplyFilters}
            hasActiveFilters={hasActiveFilters}
            initialFilters={appliedFilters}
          />
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
                {data.userDetails?.name || 'Unknown'} ({data.userDetails?.email || userId})
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
        </div>

        {seletedResponse && summaries[seletedResponse] && (
          <div className="my-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-md">
            <h3 className="font-bold mb-2">Summary</h3>
            <p>{summaries[seletedResponse].text}</p>
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
                <h2 className="font-bold">
                  User Response |{' '}
                  {userResponse?.data.userDetails?.name
                    ? userResponse?.data.userDetails?.name
                    : (userResponse?.data.userDetails?.email ?? seletedResponse)}
                </h2>

                <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger" size="small" icon={faTrash}>
                  Delete Response
                </Button>
              </div>

              {userData.map((node, i) => {
                const graphNode = nodesMap[node.id];
                if (graphNode?.type === 'question' || graphNode?.type === 'information') {
                  return (
                    <div key={i} className="mb-4 p-4 bg-slate-200 dark:bg-slate-600 rounded-2xl">
                      {renderNodeContent(node)}
                    </div>
                  );
                }
                return null;
              })}
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
