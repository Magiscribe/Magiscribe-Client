import { useGraphContext } from '@/hooks/graph-state';
import { faRedo, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  addEdge,
  applyNodeChanges,
  Background,
  ControlButton,
  Controls,
  MarkerType,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  XYPosition,
} from '@xyflow/react';
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';

import Button from '../controls/button';
import CustomTooltip from '../controls/custom-tooltip';
import CustomModal from '../modals/modal';
import { edgeTypes, getDefaultNodeData, nodeTypes, nodeTypesInfo } from './utils';

interface TreeInputProps {
  children?: React.ReactNode;
}

function Flow({ children }: TreeInputProps) {
  // Hooks
  const { screenToFlowPosition } = useReactFlow();
  const { graph, setGraph, triggerUpdate, canRedo, canUndo, onEdgesChange, onNodesChange, redo, undo } =
    useGraphContext();
  const { t } = useTranslation();

  // States
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
    triggerUpdate('edges', addEdge(params, graph.edges));
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
    if (type === 'start' && graph.nodes.some((node) => node.type === 'start')) {
      return false;
    }

    return true;
  };

  /**
   * Adds a new node to the graph based on the current new node state.
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

    const edgeNode = node.source || node.target;
    if (edgeNode) {
      // Since we are setting both the nodes and edges at the same time, we use the setGraph function
      // to do this in a single render cycle so that the undo/redo history captures both changes as a single action.
      setGraph((prev) => ({
        nodes: [
          ...prev.nodes,
          {
            id: newNodeId,
            type: node.type,
            position: node.position,
            data: getDefaultNodeData(node.type as keyof typeof nodeTypesInfo),
          },
        ],
        edges: [...prev.edges, { id: `${edgeNode}-${newNodeId}`, source: edgeNode, target: newNodeId }],
      }));
    } else {
      triggerUpdate(
        'nodes',
        applyNodeChanges(
          [
            {
              item: {
                id: newNodeId,
                type: node.type,
                position: node.position,
                data: getDefaultNodeData(node.type as keyof typeof nodeTypesInfo),
              },
              type: 'add',
            },
          ],
          graph.nodes,
        ),
      );
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

  const handleUndo = () => {
    if (!canUndo) {
      return;
    }

    undo();
  };

  const handleRedo = () => {
    if (!canRedo) {
      return;
    }

    redo();
  };

  // Use Effect to register the undo and redo keyboard shortcuts
  useEffect(() => {
    const handleUndoRedo = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        handleUndo();
      } else if ((event.ctrlKey && event.key === 'y') || (event.ctrlKey && event.key === 'Z')) {
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleUndoRedo);

    return () => {
      document.removeEventListener('keydown', handleUndoRedo);
    };
  }, [handleUndo, handleRedo]);

  const renderNodeButtons = () => (
    <>
      {Object.keys(nodeTypesInfo).map((type) => {
        const disabled = !validateNewNode(type);

        return (
          <CustomTooltip
            key={type}
            placement="bottom"
            triggerOnHover
            delay={1000}
            render={() => (
              <button
                draggable={!disabled}
                onDragStart={() => (disabled ? null : onDragStart(type))}
                onClick={(event) => {
                  const buttonRect = event.currentTarget.getBoundingClientRect();

                  // Adds the new node to the graph directly below the button that was clicked
                  // to create the new node
                  newNode.current = {
                    source: undefined,
                    target: undefined,
                    position: screenToFlowPosition({
                      x: buttonRect.left,
                      y: buttonRect.bottom + 20,
                    }),
                    type,
                  };

                  addNode();
                }}
                disabled={disabled}
                className="w-12 h-12 bg-white dark:bg-slate-700 border-2 border-slate-400 rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <FontAwesomeIcon
                  icon={nodeTypesInfo[type as keyof typeof nodeTypesInfo].icon}
                  className="text-blue-600 dark:text-blue-400 text-lg"
                />
              </button>
            )}
          >
            <div className="text-xs font-normal text-slate-900 dark:text-white">
              <div className="font-semibold mb-1">{nodeTypesInfo[type as keyof typeof nodeTypesInfo].name}</div>
              <div>{nodeTypesInfo[type as keyof typeof nodeTypesInfo].description}</div>
            </div>
          </CustomTooltip>
        );
      })}
    </>
  );

  const renderNodeButtonsMenu = (position?: { x: number; y: number }, source?: string, target?: string) =>
    Object.keys(nodeTypesInfo).map((type) => {
      const disabled = !validateNewNode(type);

      return (
        <Button
          key={type}
          disabled={disabled}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
        <div className="absolute flex flex-row top-0 left-0 p-4 z-10">
          <div className="flex flex-row space-x-3">{renderNodeButtons()}</div>
        </div>
        <div className="w-full h-full text-black">
          <ReactFlow
            nodes={graph.nodes}
            edges={graph.edges}
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
            maxZoom={1.3}
            panOnScroll={true}
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
            <Controls position="bottom-left" showInteractive={false}>
              <ControlButton disabled={!canRedo} onClick={redo} aria-label={t('builder.redoAction')} title={t('builder.redoAction')}>
                <FontAwesomeIcon icon={faRedo} />
              </ControlButton>
              <ControlButton disabled={!canUndo} onClick={undo} aria-label={t('builder.undoAction')} title={t('builder.undoAction')}>
                <FontAwesomeIcon icon={faUndo} />
              </ControlButton>
            </Controls>
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
