import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  addEdge,
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
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
import React, { DragEvent, useRef, useState } from 'react';
import colors from 'tailwindcss/colors';

import Button from '../controls/button';
import CustomTooltip from '../controls/custom-tooltip';
import CustomModal from '../modals/modal';
import { edgeTypes, nodeTypes, nodeTypesInfo } from './utils';

interface TreeInputProps {
  children?: React.ReactNode;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange;
}

function Flow({ children, nodes, edges, setNodes, onNodesChange, setEdges, onEdgesChange }: TreeInputProps) {
  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlow = useRef<HTMLDivElement>(null);

  // Hooks
  const { screenToFlowPosition } = useReactFlow();

  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);

  // New node state
  const connectingNodeId = useRef<string | null>(null);
  const connectingHandleType = useRef<'source' | 'target' | null>(null);
  const newNode = useRef<{ position: XYPosition; source?: string; target?: string; type: string } | null>(null);

  /**
   * Handles the start of connecting two nodes.
   */
  const onConnect: OnConnect = (params) => {
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
  };

  /**
   * Handles the start of connecting two nodes.
   * @param event {MouseEvent} - The mouse event that triggered the start of the connection.
   * @param nodeId {string} - The ID of the node that is being connected.
   * @param handleType {'source' | 'target' | null} - The type of handle that is being connected.
   * @returns {void} - Nothing
   */
  const onConnectStart: OnConnectStart = (_event, { nodeId, handleType }) => {
    connectingNodeId.current = nodeId;
    connectingHandleType.current = handleType;
  };

  /**
   * Handles the end of connecting two nodes.
   * @param event {MouseEvent | TouchEvent} - The mouse / touch  event that triggered the end of the connection.
   * @returns {void} - Nothing
   */
  const onConnectEnd: OnConnectEnd = (event: MouseEvent | TouchEvent): void => {
    if (!connectingNodeId.current) return;

    openNewNodeModal(
      (event as MouseEvent).clientX,
      (event as MouseEvent).clientY,
      connectingNodeId.current,
      connectingHandleType.current,
    );
  };

  /**
   * Opens the modal to add a new node and sets the position of the new node.
   * @param x {number} - The x position of the new node.
   * @param y {number} - The y position of the new node.
   * @param connectedNodeId {string | undefined} - The ID of the node that is being connected.
   * @param handleType {'source' | 'target' | null} - The type of handle that is being connected.
   */
  const openNewNodeModal = (
    x: number,
    y: number,
    connectedNodeId?: string,
    handleType?: 'source' | 'target' | null,
  ) => {
    newNode.current = {
      position: { x, y },
      source: handleType === 'source' ? connectedNodeId : undefined,
      target: handleType === 'target' ? connectedNodeId : undefined,
      type: '',
    };
    setAddNodeModalOpen(true);
  };

  /**
   * Performs validation on the new node to ensure it can be added.
   * @param type {string} - The type of the new node.
   * @returns {boolean} - Whether the new node is valid and can be added.
   */
  const validateNewNode = (type?: string) => {
    // If there is more than one start node, don't allow adding another
    if (type === 'start' && nodes.some((node) => node.type === 'start')) {
      return false;
    }

    return true;
  };

  /**
   * Adds a new node to the graph.
   * @returns {void} - Nothing
   */
  const addNode = (): void => {
    const node = newNode.current;
    if (!node) return;

    if (!validateNewNode()) {
      return;
    }

    // Guarantee unique ID
    const newNodeId = Math.random().toString(36).slice(2, 6);

    setNodes((prev) => [
      ...prev,
      {
        id: newNodeId,
        type: node.type,
        position: node.position,
        data: { text: '' },
      },
    ]);

    const edgeNode = node.source || node.target;
    if (edgeNode) {
      setEdges((prev) => [
        ...prev,
        {
          id: `${node.source ? edgeNode : newNodeId}-${node.target ? edgeNode : newNodeId}`,
          source: node.source ? edgeNode : newNodeId,
          target: node.target ? edgeNode : newNodeId,
        },
      ]);
    }

    setAddNodeModalOpen(false);
  };

  /**
   * Handles the start of dragging a node from the sidebar.
   * @param nodeType
   */
  const onDragStart = (nodeType: string) => {
    newNode.current = { position: { x: 0, y: 0 }, type: nodeType };
  };

  /**
   * Handles dragging over the flow to allow dropping nodes.
   */
  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  /**
   * Handles dropping a node onto the flow.
   */
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const node = newNode.current;
    if (!node) return;

    node.position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode();
  };

  const renderNodeButtons = () => (
    <div className="w-full flex flex-row space-x-4">
      {Object.keys(nodeTypesInfo).map((type) => {
        const disabled = !validateNewNode(type);

        return (
          <div key={type} className="w-44 flex items-center z-10">
            <button
              draggable={!disabled}
              onDragStart={() => (disabled ? null : onDragStart(type))}
              disabled={disabled}
              className="relative w-full max-w-xs px-4 py-2 bg-white dark:bg-slate-700 border-2 border-slate-400 text-slate-800 dark:text-white font-semibold text-sm rounded-xl shadow-lg disabled:opacity-50 text-left"
            >
              <FontAwesomeIcon
                icon={nodeTypesInfo[type as keyof typeof nodeTypesInfo].icon}
                className="mr-2 text-blue-600"
              />
              {nodeTypesInfo[type as keyof typeof nodeTypesInfo].name}
              <CustomTooltip
                placement="bottom-start"
                triggerOnHover
                render={() => (
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-white"
                  />
                )}
              >
                <p className="text-xs font-normal">{nodeTypesInfo[type as keyof typeof nodeTypesInfo].description}</p>
              </CustomTooltip>
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderNodeButtonsMenu = (position?: { x: number; y: number }, source?: string, target?: string) =>
    Object.keys(nodeTypesInfo).map((type) => {
      const disabled = !validateNewNode(type);

      return (
        <Button
          key={type}
          disabled={disabled}
          onClick={(e) => {
            newNode.current = {
              source,
              target,
              position: screenToFlowPosition({ x: (position?.x ?? e.clientX) - 125, y: position?.y ?? e.clientY }),
              type,
            };
            addNode();
          }}
        >
          {nodeTypesInfo[type as keyof typeof nodeTypesInfo].name}
        </Button>
      );
    });

  return (
    <>
      <div className="relative w-full h-full text-black">
        <div className="absolute w-full flex flex-row top-0 left-0 p-4 space-x-4">
          <h3 className="text-xl font-semibold text-left text-white min-w-44">
            Nodes
            <br />
            <span className="-mt-2 text-xs">Drag and drop to add nodes</span>
          </h3>
          {renderNodeButtons()}
        </div>
        <div className="w-full h-full text-black" ref={reactFlowWrapper}>
          <ReactFlow
            ref={reactFlow}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'button',
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: colors.slate[200],
              },
              markerStart: {
                type: MarkerType.ArrowClosed,
                orient: 'auto-start-reverse',
                color: colors.slate[200],
              },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            <Controls position="bottom-left" showInteractive={false} />
          </ReactFlow>
        </div>

        {children}
      </div>

      <CustomModal open={addNodeModalOpen} onClose={() => setAddNodeModalOpen(false)} title="Add Node">
        <div className="grid grid-cols-1 gap-4">
          {renderNodeButtonsMenu(
            newNode.current
              ? {
                  x: newNode.current?.position.x,
                  y: newNode.current?.position.y,
                }
              : undefined,
            newNode.current?.source,
            newNode.current?.target,
          )}
        </div>
      </CustomModal>
    </>
  );
}

export default function GraphInput(props: TreeInputProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}
