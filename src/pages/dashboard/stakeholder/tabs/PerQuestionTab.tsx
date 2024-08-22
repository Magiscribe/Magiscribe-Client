import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GraphNode, ConversationNodeData, TabProps } from '@/types/conversation';

const PerQuestionTab: React.FC<TabProps> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { graph, nodeVisitData: responses } = data.data;

  const conversationNodes = useMemo(
    () =>
      graph.nodes.filter(
        (node): node is GraphNode & { data: ConversationNodeData } =>
          node.type === 'conversation' && node.data !== undefined && 'type' in node.data,
      ),
    [graph.nodes],
  );

  if (!conversationNodes.length) {
    return <div className="p-4">No conversation nodes found.</div>;
  }

  const currentNode = conversationNodes[currentQuestionIndex];
  const nodeData = currentNode.data;

  const renderAnswers = (nodeId: string) =>
    responses.map((response) => {
      const answer = response.data.find((node) => node.id === nodeId);
      if (answer?.data) {
        return (
          <div key={`${response.userId}-${nodeId}`} className="ml-4 mb-2">
            <p className="text-black">
              <span className="font-semibold">{response.userId}:</span>{' '}
              {answer.data.text || answer.data.ratings?.join(', ') || answer.data.scalars?.join(', ')}
            </p>
          </div>
        );
      }
      return null;
    });

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Select Question</h2>
        <div className="grid grid-cols-4 sm:grid-col-3 lg:grid-cols-6 gap-2">
          {conversationNodes.map((node, index) => (
            <button
              key={node.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`p-2 text-sm rounded-md ${
                currentQuestionIndex === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {node.data.instruction || node.data.text || `Question ${index + 1}`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Node {currentNode.id}</h2>
        <div className="mb-6 p-4 bg-gray-100 rounded">
          {nodeData.text ? (
            <>
              <p className="font-semibold mb-2 text-black">{nodeData.text}</p>
              {renderAnswers(currentNode.id)}
            </>
          ) : nodeData.instruction ? (
            <>
              <p className="font-semibold mb-2 text-black">{nodeData.instruction}</p>
              {renderAnswers(currentNode.id)}
            </>
          ) : null}
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
  );
};

export default PerQuestionTab;
