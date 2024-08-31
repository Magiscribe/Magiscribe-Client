import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
  GraphNode,
  ConversationNodeData,
  TabProps,
  IndividualConversationData,
  NodeVisitData,
} from '@/types/conversation';

const PerQuestionTab: React.FC<TabProps> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { graph, nodeVisitData: responses } = data;

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

  if (!responses || !conversationNodes.length) {
    return <div className="p-4">No data available</div>;
  }

  const currentNode = conversationNodes[currentQuestionIndex];
  const nodeData = currentNode.data;

  const renderAnswers = (nodeId: string) => {
    const nodeResponses = groupedResponses[nodeId] || {};
    return Object.entries(nodeResponses).map(([userId, userResponses]) => (
      <div key={`${userId}-${nodeId}`} className="ml-4 mb-4">
        <p className="text-black font-semibold">{userId}:</p>
        {userResponses.map((response, index) => {
          const isDynamicGeneration = response.data?.text !== undefined;
          const answerContent = response.data?.text || response.data?.ratings?.join(', ') || 'No response';

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
