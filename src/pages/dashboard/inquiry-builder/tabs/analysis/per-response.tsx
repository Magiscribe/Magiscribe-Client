import { ADD_PREDICTION } from '@/clients/mutations';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import Button from '@/components/controls/button';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { NodeVisitAnalysisData, TabProps } from '@/types/conversation';
import { getAgentIdByName } from '@/utils/agents';
import { useApolloClient, useMutation, useSubscription } from '@apollo/client';
import { faChevronLeft, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useMemo, useState } from 'react';

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
  const usersPerPage = 40;

  const client = useApolloClient();
  const [addPrediction] = useMutation(ADD_PREDICTION);

  if (!responses?.length) return <div className="p-4 text-slate-700 dark:text-white">No data available</div>;

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

  const totalPages = Math.ceil(responses.length / usersPerPage);
  const displayedUsers = responses.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

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
      <div className="my-4">
        <h2 className="font-bold mb-2">Select User</h2>
        <div className="grid grid-cols-4 sm:grid-col-3 lg:grid-cols-4 gap-2">
          {displayedUsers.map(({ id, userId, data }) => (
            <button
              key={`${id}-${userId}`}
              onClick={() => setSelectedUser((prev) => (prev === id ? null : (id as string)))}
              className={`p-2 text-sm rounded-md ${
                selectedUser === id
                  ? 'bg-blue-500 dark:bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white'
              }`}
            >
              {data.userDetails?.name || 'Unknown'} ({data.userDetails?.email || id})
            </button>
          ))}
        </div>
        {responses.length > usersPerPage && (
          <div className="flex justify-end mt-4 space-x-2">
            {[faChevronLeft, faChevronRight].map((icon, index) => (
              <Button
                key={index}
                onClick={() => setCurrentPage((prev) => Math.max(0, Math.min(totalPages - 1, prev + (index ? 1 : -1))))}
                disabled={index ? currentPage === totalPages - 1 : currentPage === 0}
              >
                <FontAwesomeIcon icon={icon} />
              </Button>
            ))}
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
}
