import React, { useMemo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useApolloClient, useMutation, useSubscription } from '@apollo/client';
import { ADD_PREDICTION } from '@/clients/mutations';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { getAgentIdByName } from '@/utils/agents';
import { NodeVisitAnalysisData, TabProps } from '@/types/conversation';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';

type ResponseSummary = {
  [userId: string]: {
    text: string;
    lastUpdated: string;
  };
};

export default function PerResponseTab({ data }: TabProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [subscriptionId] = useState<string>(`per_response_summary_${Date.now()}`);
  const [summaries, setSummaries] = useWithLocalStorage<ResponseSummary>({}, `${data.id}-per-response-summary`);

  const { responses = [], graph } = data;
  const usersPerPage = 42;

  const client = useApolloClient();
  const [addPrediction] = useMutation(ADD_PREDICTION);

  if (!responses?.length) return <div className="p-4">No data available</div>;

  const nodesMap = useMemo(
    () => Object.fromEntries((graph?.nodes || []).map((node) => [node.id, node])),
    [graph?.nodes],
  );

  const userResponse = responses.find((u) => u.id === selectedUser);
  const userData = userResponse?.data.history ?? [];

  const generateSummary = useCallback(async () => {
    if (!selectedUser) return;

    setIsGeneratingSummary(true);
    const agentId = await getAgentIdByName('Stakeholder | Per Question Summary', client);

    if (agentId) {
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
  }, [selectedUser, responses, client, addPrediction, subscriptionId]);

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

  const renderNodeContent = (node: NodeVisitAnalysisData) => {
    if (node?.data?.response) {
      const question = node.data.text;
      const responseText = node.data.response.text;
      const ratings = node.data.response.ratings;

      return (
        <>
          <p className="font-semibold text-black">{question}</p>
          <hr className="my-2" />
          <p className="text-black">
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
    }
    return null;
  };

  const totalPages = Math.ceil(responses.length / usersPerPage);
  const displayedUsers = responses.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

  return (
    <div className="bg-white px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Per Response</h2>
        {selectedUser && (
          <button
            onClick={generateSummary}
            disabled={isGeneratingSummary}
            className={`px-4 py-2 rounded-md text-white ${
              isGeneratingSummary ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isGeneratingSummary ? (
              <>
                Generating... <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
              </>
            ) : summaries[selectedUser] ? (
              'Regenerate Summary'
            ) : (
              'Generate Summary'
            )}
          </button>
        )}
      </div>
      <div className="my-4">
        <h2 className="font-bold mb-2">Select User</h2>
        <div className="grid grid-cols-4 sm:grid-col-3 lg:grid-cols-4 gap-2">
          {displayedUsers.map(({ id, userId, data }) => (
            <button
              key={`${id}-${userId}`}
              onClick={() => setSelectedUser((prev) => (prev === id ? null : (id as string)))}
              className={`p-2 text-sm rounded-md ${
                selectedUser === id ? 'bg-blue-500 text-white' : 'bg-slate-200 text-black'
              }`}
            >
              {data.userDetails?.name || 'Unknown'} ({id})
            </button>
          ))}
        </div>
        {responses.length > usersPerPage && (
          <div className="flex justify-end mt-4 space-x-2">
            {[faChevronLeft, faChevronRight].map((icon, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage((prev) => Math.max(0, Math.min(totalPages - 1, prev + (index ? 1 : -1))))}
                disabled={index ? currentPage === totalPages - 1 : currentPage === 0}
                className="p-2 border-2 border-white rounded-full disabled:opacity-50"
              >
                <FontAwesomeIcon icon={icon} />
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedUser && summaries[selectedUser] && (
        <div className="my-4 p-4 bg-blue-100 rounded-md">
          <h3 className="font-bold mb-2">Summary</h3>
          <p>{summaries[selectedUser].text}</p>
          <p className="text-sm text-gray-600 mt-2">Last Updated: {summaries[selectedUser].lastUpdated}</p>
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
            if (graphNode?.type === 'conversation') {
              return (
                <div key={i} className="mb-4 p-4 bg-slate-200 rounded-2xl">
                  {renderNodeContent(node)}
                </div>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
}
