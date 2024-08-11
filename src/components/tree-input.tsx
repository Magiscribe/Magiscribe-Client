import {
  addEdge,
  DefaultEdgeOptions,
  Edge,
  FitViewOptions,
  Node,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import React, { useCallback, useRef } from 'react';
import TextUpdaterNode from './text-updater';

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const proOptions = { hideAttribution: true };

interface TreeInputProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;

  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange;
}

function Flow({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }: TreeInputProps) {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = { text: TextUpdaterNode };

  const onConnect: OnConnect = useCallback((params) => {
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;
      const id = Math.random().toString();
      const newNode: Node = {
        id,
        position: screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        }),
        data: {
          label: 'Node',
          handles: {
            source: true,
            target: true,
          },
        },
        origin: [0.5, 0.0],
        type: 'text',
      };
      const edge: Edge = { id, source: connectingNodeId.current, target: id };
      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(edge));
    },
    [screenToFlowPosition],
  );

  return (
    <div className="w-full h-full text-black" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={proOptions}
        nodeOrigin={[0.5, 0]}
      />
    </div>
  );
}

export default function TreeInput(props: TreeInputProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}
