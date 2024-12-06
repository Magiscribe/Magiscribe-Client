import { applyEdgeChanges, applyNodeChanges, Edge, Node, OnEdgesChange, OnNodesChange } from '@xyflow/react';
import { createContext, Dispatch, SetStateAction, useCallback, useContext } from 'react';
import useUndoable from 'use-undoable';

interface GraphContextProps {
  graph: { nodes: Node[]; edges: Edge[] };

  resetInitialState: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => void;

  triggerUpdate: (t: 'nodes' | 'edges', v: Node[] | Edge[]) => void;
  setGraph: Dispatch<SetStateAction<{ nodes: Node[]; edges: Edge[] }>>;

  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const GraphContext = createContext<GraphContextProps | undefined>(undefined);

const GraphProvider = ({ children }: { children: React.ReactNode }) => {
  const [graph, setGraph, { undo, redo, canUndo, canRedo, resetInitialState }] = useUndoable<{
    nodes: Node[];
    edges: Edge[];
  }>(
    {
      nodes: [],
      edges: [],
    },
    {
      behavior: 'destroyFuture',
      historyLimit: 'infinity',
    },
  );

  const triggerUpdate = useCallback(
    (t: string, v: Node[] | Edge[], ignore = false) => {
      setGraph(
        (e) => ({
          nodes: t === 'nodes' ? (v as Node[]) : e.nodes,
          edges: t === 'edges' ? (v as Edge[]) : e.edges,
        }),
        'destroyFuture',
        ignore,
      );
    },
    [setGraph],
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // Don't save these changes in the history.
      const ignore = ['select', 'position', 'dimensions'].includes(changes[0].type);
      triggerUpdate('nodes', applyNodeChanges(changes, graph.nodes), ignore);
    },
    [triggerUpdate, graph.nodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      // Don't save these changes in the history.
      const ignore = ['select'].includes(changes[0].type);
      triggerUpdate('edges', applyEdgeChanges(changes, graph.edges), ignore);
    },
    [triggerUpdate, graph.edges],
  );

  const values = {
    graph,
    triggerUpdate,
    resetInitialState,
    setGraph,
    onNodesChange,
    onEdgesChange,
    undo,
    redo,
    canUndo,
    canRedo,
  };

  return <GraphContext.Provider value={values}>{children}</GraphContext.Provider>;
};

export const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraphContext must be used within a GraphProvider');
  }
  return context;
};

export default GraphProvider;
