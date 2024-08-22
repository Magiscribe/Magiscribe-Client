import {
  addEdge,
  Background,
  Controls,
  DefaultEdgeOptions,
  Edge,
  FitViewOptions,
  MiniMap,
  Node,
  NodeTypes,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  XYPosition,
} from '@xyflow/react';
import React, { useCallback, useRef, useState } from 'react';
import ConditionNode from './nodes/condition-node';
import ConversationNode from './nodes/conversation-node';
import { EndNode, StartNode } from './nodes/start-end-node';
import CustomModal from '../modal';
import InformationNode from './nodes/information-node';

const fitViewOptions: FitViewOptions = {
  nodes: [{ id: 'start' }],
  padding: 0.2,
};
const defaultEdgeOptions: DefaultEdgeOptions = {
  style: {
    strokeWidth: 4,
    strokeLinecap: 'butt',
    stroke: '#ffff',
  },
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

  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [addNodeParams, setAddNodeParams] = useState<{ position: XYPosition; source: string }>({
    position: { x: 0, y: 0 },
    source: '',
  });

  const nodeTypes: NodeTypes = {
    start: StartNode,
    end: EndNode,
    conversation: ConversationNode,
    conditional: ConditionNode,
    information: InformationNode,
  };

  const onConnect: OnConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;
      setAddNodeParams({
        position: screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        }),
        source: connectingNodeId.current,
      });
      setAddNodeModalOpen(true);
    },
    [screenToFlowPosition],
  );

  const addNode = (type: 'conversation' | 'conditional' | 'end') => {
    const newNodeId = `${Date.now()}`;
    setNodes((prev) => [
      ...prev,
      {
        id: newNodeId,
        type,
        position: addNodeParams.position,
        data: { text: '' },
      },
    ]);
    setEdges((prev) => [
      ...prev,
      {
        id: `${addNodeParams.source}-${newNodeId}`,
        source: addNodeParams.source,
        target: newNodeId,
        animated: true,
      },
    ]);
    setAddNodeModalOpen(false);
  };

  return (
    <div className="relative w-full h-full text-black" ref={reactFlowWrapper}>
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
      >
        <MiniMap
          zoomable
          pannable
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            background: 'rgba(255,255,255,0)',
          }}
        />
        <Background />
        <Controls />
      </ReactFlow>

      <div className="absolute bottom-0 left-0 p-4">
        <CustomModal open={addNodeModalOpen} onClose={() => setAddNodeModalOpen(false)} title="Add Node">
          <div className="grid grid-cols-1 gap-4">
            {['conversation', 'conditional', 'end'].map((type) => (
              <button
                key={type}
                onClick={() => addNode(type as 'conversation' | 'conditional')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Node
              </button>
            ))}
          </div>
        </CustomModal>
      </div>
    </div>
  );
}

export default function GraphInput(props: TreeInputProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}
