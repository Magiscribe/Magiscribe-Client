import {
  faComments,
  faMagicWandSparkles,
  faQuestionCircle,
  faTimes,
  faWandMagic,
} from '@fortawesome/free-solid-svg-icons';
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
import { AnimatePresence, motion } from 'framer-motion';
import React, { DragEvent, useRef, useState } from 'react';
import colors from 'tailwindcss/colors';

import Button from '../controls/button';
import CustomTooltip from '../controls/custom-tooltip';
import CustomModal from '../modals/modal';
import ContextMenu from './context-menu';
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

  // Node context menu state
  const [menu, setMenu] = useState<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    onAddNode: () => void;
  } | null>(null);

  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);

  // New node state
  const connectingNodeId = useRef<string | null>(null);
  const connectingHandleType = useRef<'source' | 'target' | null>(null);
  const newNode = useRef<{ position: XYPosition; source?: string; target?: string; type: string } | null>(null);

  const onConnect: OnConnect = (params) => {
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
  };

  const onConnectStart: OnConnectStart = (_event, { nodeId, handleType }) => {
    connectingNodeId.current = nodeId;
    connectingHandleType.current = handleType;
  };

  const onConnectEnd: OnConnectEnd = (event: MouseEvent | TouchEvent): void => {
    if (!connectingNodeId.current) return;

    openNewNodeModal(
      (event as MouseEvent).clientX,
      (event as MouseEvent).clientY,
      connectingNodeId.current,
      connectingHandleType.current,
    );
  };

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

  const validateNewNode = (type?: string) => {
    if (type === 'start' && nodes.some((node) => node.type === 'start')) {
      return false;
    }
    return true;
  };

  const addNode = (): void => {
    const node = newNode.current;
    if (!node) return;

    if (!validateNewNode()) {
      return;
    }

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

  const onPaneContextMenu = (event: MouseEvent | React.MouseEvent<Element, MouseEvent>): void => {
    if (!reactFlow.current) return;

    event.preventDefault();

    const pane = reactFlow.current.getBoundingClientRect();
    setMenu({
      top: event.clientY < pane.height ? event.clientY : undefined,
      left: event.clientX < pane.width ? event.clientX : undefined,
      right: event.clientX >= pane.width ? pane.width - event.clientX : undefined,
      bottom: event.clientY >= pane.height ? pane.height - event.clientY : undefined,
      onAddNode: () => {
        openNewNodeModal(event.clientX, event.clientY);
        setMenu(null);
      },
    });
  };

  const onPaneClick = () => setMenu(null);

  const onDragStart = (nodeType: string) => {
    newNode.current = { position: { x: 0, y: 0 }, type: nodeType };
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

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
              className="relative w-full max-w-xs px-4 py-2 bg-white border-2 border-slate-400 text-slate-800 font-semibold text-sm rounded-xl shadow-lg disabled:opacity-50 text-left"
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400"
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
        <button
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
            setMenu(null);
          }}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
        >
          {nodeTypesInfo[type as keyof typeof nodeTypesInfo].name}
        </button>
      );
    });

  return (
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
          onPaneContextMenu={onPaneContextMenu}
          onPaneClick={onPaneClick}
          onPaneScroll={onPaneClick}
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
          {menu && <ContextMenu buttons={renderNodeButtonsMenu()} {...menu} />}
        </ReactFlow>

        <div className="absolute bottom-0 left-0 p-4">
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
        </div>
      </div>

      {children}
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
