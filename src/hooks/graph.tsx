import { useCallback } from 'react';
import { Edge, Node, useEdgesState, useNodesState } from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'start',
    position: { x: 0, y: 0 },
    data: {},
  },
];

const initialEdges: Edge[] = [];

/**
 * Custom hook for managing graph state.
 * @returns {Object} Graph state and update functions
 */
export const useGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const resetGraph = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    resetGraph,
  };
};