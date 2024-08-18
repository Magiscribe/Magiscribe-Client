import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GraphNode, ConversationNodeData, TabProps } from '../../../../types/conversation';

const PerQuestionTab: React.FC<TabProps> = ({ data }) => {
  const { graph, nodeVisitData: responses } = data.data;
  const conversationNodes =
    graph.nodes.filter(
      (node): node is GraphNode & { data: ConversationNodeData } =>
        node.type === 'conversation' && node.data !== undefined && 'type' in node.data,
    ) || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : conversationNodes.length - 1));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev < conversationNodes.length - 1 ? prev + 1 : 0));
  };

  const renderAnswers = (nodeId: string) => {
    return responses.map((response) => {
      const answer = response.data.find((node) => node.id === nodeId);
      if (answer && answer.data) {
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
  };

  const currentNode = conversationNodes[currentQuestionIndex];

  if (!currentNode) {
    return <div className="text-black">No conversation nodes found.</div>;
  }

  const nodeData = currentNode.data;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Node {currentNode.id}</h2>
        <div>
          <button onClick={handlePrevious} className="mr-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button onClick={handleNext} className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
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
  );
};

export default PerQuestionTab;
