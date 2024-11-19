import React, { useState, useMemo } from 'react';
import { GET_INQUIRIES_RESPONSES, GET_INQUIRY } from '@/clients/queries';
import { ADD_PREDICTION } from '@/clients/mutations';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { GetInquiryQuery, GetInquiryResponsesQuery, InquiryResponseFilters } from '@/graphql/graphql';
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/controls/button';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { NodeVisitAnalysisData } from '@/types/conversation';
import { getAgentIdByName } from '@/utils/agents';
import FilterControls from './filter-controls';
import { GraphNode } from '@/types/conversation';

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
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [subscriptionId] = useState<string>(`per_response_summary_${Date.now()}`);
  const [summaries, setSummaries] = useWithLocalStorage<ResponseSummary>({}, `${id}-per-response-summary`);

  // Add filters state
  const [appliedFilters, setAppliedFilters] = useState<InquiryResponseFilters>({
    createdAt: {},
    name: {},
    email: {},
  });

  const client = useApolloClient();
  const [addPrediction] = useMutation(ADD_PREDICTION);

  // Query for form and graph data
  const {
    loading: graphLoading,
    data: inquiryData,
    error: graphError,
  } = useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    errorPolicy: 'all',
  });

  // Query for responses with filters
  const {
    loading: dataLoading,
    data: inquiryResponseData,
    error: dataError,
  } = useQuery<GetInquiryResponsesQuery>(GET_INQUIRIES_RESPONSES, {
    variables: {
      id,
      filters: appliedFilters,
    },
    errorPolicy: 'all',
  });

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

  // Subscription for summary generation
  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: {
      subscriptionId,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction && prediction.type === 'SUCCESS' && selectedUser) {
        setIsGeneratingSummary(false);
        const result = JSON.parse(JSON.parse(prediction.result)[0]);
        if (result && result.summary) {
          setSummaries((prev) => ({
            ...prev,
            [selectedUser]: {
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

  const responses = inquiryResponseData?.getInquiryResponses ?? [];

  const nodesMap = useMemo(
    () =>
      Object.fromEntries((inquiryData?.getInquiry?.data?.graph?.nodes || []).map((node: GraphNode) => [node.id, node])),
    [inquiryData?.getInquiry?.data?.graph?.nodes],
  );

  const usersPerPage = 40;
  const totalPages = Math.ceil(responses.length / usersPerPage);
  const displayedUsers = responses.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

  const userResponse = responses.find((u) => u.id === selectedUser);
  const userData = userResponse?.data.history ?? [];

  // Check if any filters are actually applied
  const hasActiveFilters = Object.values(appliedFilters).some((filter) => filter && Object.keys(filter).length > 0);

  const generateSummary = async () => {
    if (!selectedUser) return;

    setIsGeneratingSummary(true);
    const agentId = await getAgentIdByName('Per Response Summary', client);

    if (agentId) {
      const userResponse = inquiryResponseData?.getInquiryResponses?.find((u) => u.id === selectedUser);
      const userData = userResponse?.data.history ?? [];

      const formattedResponses = userData.map((node) => ({
        question: node.data?.text || '',
        answer: node.data?.response?.text || '',
        ratings: node.data?.response?.ratings?.join(', ') || 'No rating',
      }));

      const input = {
        userId: selectedUser,
        responses: formattedResponses,
      };

      try {
        await addPrediction({
          variables: {
            subscriptionId,
            agentId,
            variables: { userMessage: JSON.stringify(input) },
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
    <div className="bg-white dark:bg-slate-700 px-4 py-8 rounded-2xl shadow-xl text-slate-700 dark:text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Per Response</h2>
        {selectedUser && (
          <Button onClick={generateSummary} disabled={isGeneratingSummary}>
            {isGeneratingSummary ? (
              <>
                Generating... <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
              </>
            ) : summaries[selectedUser] ? (
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
                selectedUser === userId
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

      {selectedUser && summaries[selectedUser] && (
        <div className="my-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-md">
          <h3 className="font-bold mb-2">Summary</h3>
          <p>{summaries[selectedUser].text}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Last Updated: {summaries[selectedUser].lastUpdated}
          </p>
        </div>
      )}

      <div>
        {selectedUser && (
          <h2 className="font-bold mb-2">
            User Response <> | {selectedUser}</>
          </h2>
        )}
        {selectedUser &&
          userData.map((node, i) => {
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
      </div>
    </div>
  );
};

export default PerResponseTab;
