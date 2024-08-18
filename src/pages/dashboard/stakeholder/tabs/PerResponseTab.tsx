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

interface PerResponseTabProps {
  data: {
    data: {
      graph: {
        nodes: GraphNode[];
      };
      data: IndividualConversationData[];
    };
  };
}

const PerResponseTab: React.FC<PerResponseTabProps> = ({ data }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const users = data.data.data;

  const currentUser = users[currentUserIndex];

  const handlePrevious = () => {
    setCurrentUserIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1));
  };

  const handleNext = () => {
    setCurrentUserIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
  };

  const renderNodeContent = (node: NodeVisitData, graphNode: GraphNode) => {
    if (graphNode.data.text) {
      return (
        <>
          <p className="font-semibold text-black">
            {node.id}. {graphNode.data.text}
          </p>
          <p className="text-black">{node.data?.text || node.data?.ratings?.join(', ')}</p>
        </>
      );
    } else if (graphNode.data.instruction) {
      return (
        <>
          <p className="font-semibold text-black">
            {node.id}. {node.data?.question}
          </p>
          <p className="text-black">{node.data?.text || node.data?.ratings?.join(', ')}</p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User: {currentUser.userId}</h2>
        <div>
          <button onClick={handlePrevious} className="mr-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button onClick={handleNext} className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      {currentUser.data.map((node) => {
        const graphNode = data.data.graph.nodes.find((n) => n.id === node.id);
        if (graphNode && graphNode.type === 'conversation') {
          return (
            <div key={node.id} className="mb-4 p-4 bg-gray-100 rounded">
              {renderNodeContent(node, graphNode)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default PerResponseTab;
