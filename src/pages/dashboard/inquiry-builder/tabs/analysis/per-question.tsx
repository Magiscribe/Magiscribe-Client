import { ADD_PREDICTION } from '@/clients/mutations';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import Button from '@/components/controls/button';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { GraphNode, NodeVisitAnalysisData, QuestionNodeData, TabProps } from '@/types/conversation';
import { getAgentIdByName } from '@/utils/agents';
import { useApolloClient, useMutation, useSubscription } from '@apollo/client';
import { faChevronLeft, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useMemo, useState } from 'react';

export type ResponseSummary = {
  [nodeId: string]: {
    text: string;
    lastUpdated: string;
  };
};

const truncateText = (text: string, maxLength: number = 250): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

const PerQuestionTab: React.FC<TabProps> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [subscriptionId] = useState<string>(`per_question_summary_${Date.now()}`);
  const [summaries, setSummaries] = useWithLocalStorage<ResponseSummary>({}, `${data.id}-per-question-summary`);
  const { graph, responses } = data;

  const client = useApolloClient();
  const [addPrediction] = useMutation(ADD_PREDICTION);

  const questionNodes = useMemo(
    () =>
      graph.nodes.filter(
        (node): node is GraphNode & { data: QuestionNodeData } => node.type === 'question' && node.data !== undefined,
      ),
    [graph.nodes],
  );

  const userIdToDetalsMap = useMemo(() => {
    const map = new Map();
    responses.forEach((response) => {
      map.set(response.id, response.data.userDetails);
    });
    return map;
  }, [responses]);

  const groupedResponses = useMemo(() => {
    const grouped: { [nodeId: string]: { [id: string]: NodeVisitAnalysisData[] } } = {};
    responses.forEach((response) => {
      response.data.history.forEach((nodeVisit: NodeVisitAnalysisData) => {
        if (!grouped[nodeVisit.id]) {
          grouped[nodeVisit.id] = {};
        }
        if (!grouped[nodeVisit.id][response.id || 'anonymous']) {
          grouped[nodeVisit.id][response.id || 'anonymous'] = [];
        }
        grouped[nodeVisit.id][response.id || 'anonymous'].push(nodeVisit);
      });
    });
    return grouped;
  }, [responses]);

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: {
      subscriptionId,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction && prediction.type === 'SUCCESS') {
        setIsGeneratingSummary(false);
        const result = JSON.parse(JSON.parse(prediction.result)[0]);
        if (result && result.summary) {
          setSummaries((prev) => ({
            ...prev,
            [questionNodes[currentQuestionIndex].id]: {
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

  const generateSummary = useCallback(async () => {
    setIsGeneratingSummary(true);
    const agentId = await getAgentIdByName('Per Question Summary', client);

    if (agentId) {
      const currentNode = questionNodes[currentQuestionIndex];
      const nodeResponses = groupedResponses[currentNode.id] || {};
      const formattedResponses = Object.values(nodeResponses)
        .flat()
        .map((response) => ({
          text: response.data?.response?.text || '',
          rating: response.data?.response?.ratings?.join(', ') || 'No rating',
        }));

      const input = {
        question: currentNode.data.text,
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
      console.error('Per Question Summary Agent not found');
      setIsGeneratingSummary(false);
    }
  }, [questionNodes, currentQuestionIndex, groupedResponses, client, addPrediction, subscriptionId]);

  if (!responses || !questionNodes.length) {
    return <div className="p-4 text-white">No data available</div>;
  }

  const currentNode = questionNodes[currentQuestionIndex];
  const nodeData = currentNode.data;
  const currentSummary = summaries[currentNode.id];

  const renderAnswers = (nodeId: string) => {
    const nodeResponses = groupedResponses[nodeId] || {};
    return Object.entries(nodeResponses).map(([userId, userResponses]) => {
      const userEmail = userIdToDetalsMap.get(userId)?.email;
      const userName = userIdToDetalsMap.get(userId)?.name;
      return (
        <div key={`${userId}-${nodeId}`} className="ml-4 mb-4">
          <p className="text-slate-700 dark:text-white font-semibold">
            {userEmail || userName ? userName + ' (' + userEmail + ')' : userId}:
          </p>
          {userResponses.map((response, index) => {
            const isDynamicGeneration = response.data?.text !== undefined;
            const responseText = response.data?.response?.text;
            const responseRatings = response.data?.response?.ratings;

            let answerContent = 'No response';
            if (responseText && responseRatings) {
              answerContent = `${responseText} (Ratings: ${responseRatings.join(', ')})`;
            } else if (responseText) {
              answerContent = responseText;
            } else if (responseRatings) {
              answerContent = `Ratings: ${responseRatings.join(', ')}`;
            }

            return (
              <div key={`${userId}-${nodeId}-${index}`} className="ml-4 mt-2">
                {isDynamicGeneration ? (
                  <>
                    <p className="text-slate-700 dark:text-white font-medium">
                      #{index + 1}: {response.data?.text}
                    </p>
                    <p className="text-slate-700 dark:text-white ml-4">{answerContent}</p>
                  </>
                ) : (
                  <p className="text-slate-700 dark:text-white">
                    <span className="font-medium">#{index + 1}:</span> {answerContent}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-slate-700 px-4 py-8 rounded-2xl shadow-xl text-slate-700 dark:text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Per Question</h2>
        <Button onClick={generateSummary} disabled={isGeneratingSummary}>
          {isGeneratingSummary ? (
            <>
              Generating... <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
            </>
          ) : currentSummary ? (
            'Regenerate Summary'
          ) : (
            'Generate Summary'
          )}
        </Button>
      </div>
      <div className="my-4">
        <h2 className="font-bold mb-2">Select Question</h2>
        <div className="grid grid-cols-4 sm:grid-col-3 lg:grid-cols-6 gap-2">
          {questionNodes.map((node, index) => (
            <Button
              key={node.id}
              onClick={() => setCurrentQuestionIndex(index)}
              variant={currentQuestionIndex === index ? 'primary' : 'secondary'}
              title={node.data.text || `Question ${index + 1}`}
            >
              {truncateText(node.data.text || `Question ${index + 1}`)}
            </Button>
          ))}
        </div>
      </div>
      {currentSummary && (
        <div className="my-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
          <h3 className="font-bold mb-2">Summary</h3>
          <p>{currentSummary.text}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Last Updated: {currentSummary.lastUpdated}</p>
        </div>
      )}
      <div>
        <h2 className="font-bold mb-2">Responses</h2>
        <div className="mb-6 p-4">
          <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-600 rounded">
            <p className="font-semibold mb-2 text-slate-700 dark:text-white">{nodeData.text}</p>
            {renderAnswers(currentNode.id)}
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          {[faChevronLeft, faChevronRight].map((icon, index) => (
            <Button
              variant="secondary"
              key={index}
              onClick={() =>
                setCurrentQuestionIndex(
                  (prev) => (prev + (index ? 1 : -1) + questionNodes.length) % questionNodes.length,
                )
              }
            >
              <FontAwesomeIcon icon={icon} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerQuestionTab;
