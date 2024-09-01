import React, { useMemo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useApolloClient, useMutation, useSubscription } from '@apollo/client';
import { ADD_PREDICTION } from '@/clients/mutations';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { getAgentIdByName } from '@/utils/agents';
import {
  GraphNode,
  ConversationNodeData,
  TabProps,
  IndividualConversationData,
  NodeVisitData,
} from '@/types/conversation';

export type ResponseSummary = { [nodeId: string]: string }

const PerQuestionTab: React.FC<TabProps> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [subscriptionId] = useState<string>(`per_question_summary_${Date.now()}`);
  const { graph, nodeVisitData: responses, summaries, setSummary: setSummary } = data;
  
  const client = useApolloClient();
  const [addPrediction] = useMutation(ADD_PREDICTION);

  const conversationNodes = useMemo(
    () =>
      graph.nodes.filter(
        (node): node is GraphNode & { data: ConversationNodeData } =>
          node.type === 'conversation' && node.data !== undefined,
      ),
    [graph.nodes],
  );

  const groupedResponses = useMemo(() => {
    const grouped: { [nodeId: string]: { [userId: string]: NodeVisitData[] } } = {};
    responses.forEach((response: IndividualConversationData) => {
      response.data.forEach((nodeVisit: NodeVisitData) => {
        if (!grouped[nodeVisit.id]) {
          grouped[nodeVisit.id] = {};
        }
        if (!grouped[nodeVisit.id][response.userId || 'anonymous']) {
          grouped[nodeVisit.id][response.userId || 'anonymous'] = [];
        }
        grouped[nodeVisit.id][response.userId || 'anonymous'].push(nodeVisit);
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
        console.log('LOGGY DOGGY', result);
        if (result && result.summary) {
          setSummary(result.summary, conversationNodes[currentQuestionIndex].id);
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
    const agentId = await getAgentIdByName('Stakeholder | Per Question Summary', client);

    if (agentId) {
      const currentNode = conversationNodes[currentQuestionIndex];
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
  }, [conversationNodes, currentQuestionIndex, groupedResponses, client, addPrediction, subscriptionId]);

  if (!responses || !conversationNodes.length) {
    return <div className="p-4">No data available</div>;
  }

  const currentNode = conversationNodes[currentQuestionIndex];
  const nodeData = currentNode.data;
  const currentSummary = summaries[currentNode.id];

  const renderAnswers = (nodeId: string) => {
    const nodeResponses = groupedResponses[nodeId] || {};
    return Object.entries(nodeResponses).map(([userId, userResponses]) => (
      <div key={`${userId}-${nodeId}`} className="ml-4 mb-4">
        <p className="text-black font-semibold">{userId}:</p>
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
                  <p className="text-black font-medium">
                    #{index + 1}: {response.data?.text}
                  </p>
                  <p className="text-black ml-4">{answerContent}</p>
                </>
              ) : (
                <p className="text-black">
                  <span className="font-medium">#{index + 1}:</span> {answerContent}
                </p>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="bg-white px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Per Question</h2>
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
          ) : currentSummary ? (
            'Regenerate Summary'
          ) : (
            'Generate Summary'
          )}
        </button>
      </div>
      <div className="my-4">
        <h2 className="font-bold mb-2">Select Question</h2>
        <div className="grid grid-cols-4 sm:grid-col-3 lg:grid-cols-6 gap-2">
          {conversationNodes.map((node, index) => (
            <button
              key={node.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`p-2 text-sm rounded-md ${
                currentQuestionIndex === index ? 'bg-blue-500 text-white' : 'bg-slate-200 text-black'
              }`}
            >
              {node.data.text || `Question ${index + 1}`}
            </button>
          ))}
        </div>
      </div>
      {currentSummary && (
        <div className="my-4 p-4 bg-blue-100 rounded-md">
          <h3 className="font-bold mb-2">Summary</h3>
          <p>{currentSummary}</p>
        </div>
      )}
      <div>
        <h2 className="font-bold mb-2">Responses</h2>
        <div className="mb-6 p-4">
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <p className="font-semibold mb-2 text-black">{nodeData.text}</p>
            {renderAnswers(currentNode.id)}
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          {[faChevronLeft, faChevronRight].map((icon, index) => (
            <button
              key={index}
              onClick={() =>
                setCurrentQuestionIndex(
                  (prev) => (prev + (index ? 1 : -1) + conversationNodes.length) % conversationNodes.length,
                )
              }
              className="p-2 border-2 border-white rounded-full"
            >
              <FontAwesomeIcon icon={icon} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerQuestionTab;
