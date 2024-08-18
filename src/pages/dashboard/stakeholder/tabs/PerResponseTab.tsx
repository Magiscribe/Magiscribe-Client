import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { TabProps, IndividualConversationData, GraphNode, ConversationNodeData } from '../../../../types/conversation';

const PerResponseTab: React.FC<TabProps> = ({ data }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const { nodeVisitData: users = [], graph } = data.data;

  // Early return if there's no data
  if (!users.length) {
    return <div className="p-4">No data available</div>;
  }

  const currentUser = users[currentUserIndex];

  const handlePrevious = () => {
    setCurrentUserIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1));
  };

  const handleNext = () => {
    setCurrentUserIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
  };

  const nodesMap = useMemo(() => {
    return (graph?.nodes || []).reduce(
      (acc, node) => {
        acc[node.id] = node;
        return acc;
      },
      {} as Record<string, GraphNode>,
    );
  }, [graph?.nodes]);

  const renderNodeContent = (node: IndividualConversationData['data'][0], graphNode: GraphNode) => {
    if (graphNode?.data && 'type' in graphNode.data) {
      const conversationData = graphNode.data as ConversationNodeData;
      const { text: graphText, instruction } = conversationData;
      const { data: nodeData } = node;

      if (graphText || instruction) {
        return (
          <>
            <p className="font-semibold text-black">
              {node.id}. {graphText || nodeData?.text}
            </p>
            <p className="text-black">
              {nodeData?.text || nodeData?.ratings?.join(', ') || nodeData?.scalars?.join(', ')}
            </p>
          </>
        );
      }
    }
    return null;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User: {currentUser.userId || 'Unknown'}</h2>
        <div>
          <button onClick={handlePrevious} className="mr-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button onClick={handleNext} className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      {currentUser.data?.map((node) => {
        const graphNode = nodesMap[node.id];
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
