import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NodeData } from '../../../../components/graph/nodes/conversation-node';

interface NodeVisitData {
  id: string;
  data?: {
    explanation?: string;
    text?: string;
    ratings?: string[];
    question?: string;
  };
}

interface IndividualConversationData {
  userId?: string;
  data: NodeVisitData[];
}

interface GraphNode {
  id: string;
  type: string;
  data: NodeData;
}

interface PerQuestionTabProps {
  data: {
    data: {
      graph: {
        nodes: GraphNode[];
      };
      data: IndividualConversationData[];
    };
  };
}

const PerQuestionTab: React.FC<PerQuestionTabProps> = ({ data }) => {
  const { graph, data: responses } = data.data;
  const conversationNodes = graph.nodes.filter((node) => node.type === 'conversation');
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
            <p className="font-semibold text-black">{response.userId}:</p>
            <p className="text-black">{answer.data.text || answer.data.ratings?.join(', ')}</p>
          </div>
        );
      }
      return null;
    });
  };

  const currentNode = conversationNodes[currentQuestionIndex];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Node {currentNode.id}</h2>
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
        {currentNode.data.text ? (
          <>
            <p className="font-semibold mb-2 text-black">{currentNode.data.text}</p>
            {renderAnswers(currentNode.id)}
          </>
        ) : currentNode.data.instruction ? (
          responses.map((response) => {
            const answer = response.data.find((n) => n.id === currentNode.id);
            if (answer && answer.data) {
              return (
                <div key={`${response.userId}-${currentNode.id}`} className="mb-2">
                  <p className="font-semibold text-black">
                    {response.userId}: {answer.data.question}
                  </p>
                  <p className="ml-4 text-black">{answer.data.text || answer.data.ratings?.join(', ')}</p>
                </div>
              );
            }
            return null;
          })
        ) : null}
      </div>
    </div>
  );
};

export default PerQuestionTab;
