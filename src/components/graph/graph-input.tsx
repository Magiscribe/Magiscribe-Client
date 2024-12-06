import { faChevronLeft, faChevronRight, faQuestionCircle, faRedo, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  addEdge,
  applyNodeChanges,
  Background,
  ControlButton,
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
  graph: { nodes: Node[]; edges: Edge[] };
  triggerUpdate: (t: 'nodes' | 'edges', v: Node[] | Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

function Flow({
  children,
  graph,
  triggerUpdate,
  onNodesChange,
  onEdgesChange,
  canRedo,
  canUndo,
  undo,
  redo,
}: TreeInputProps) {
  // Hooks
  const { screenToFlowPosition } = useReactFlow();

  // States
  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [isNodeBarVisible, setIsNodeBarVisible] = useState(true);

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
      triggerUpdate('edges', addEdge({ source: node.source, target: newNodeId } as Edge, graph.edges));
      triggerUpdate(
        'nodes',
        applyNodeChanges(
          [
            {
              item: { id: newNodeId, type: node.type, position: node.position, data: { text: '' } },
              type: 'add',
            },
          ],
          graph.nodes,
        ),
      );
    } else {
      triggerUpdate(
        'nodes',
        applyNodeChanges(
          [
            {
              item: { id: newNodeId, type: node.type, position: node.position, data: { text: '' } },
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

  const renderNodeButtons = () => (
    <>
      {Object.keys(nodeTypesInfo).map((type) => {
        const disabled = !validateNewNode(type);

        return (
          <div key={type} className="w-44 flex items-center">
            <div className="relative w-full text-slate-800 dark:text-white ">
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
                className="relative w-full max-w-xs px-4 py-2 bg-white dark:bg-slate-700 border-2 border-slate-400 font-semibold text-sm rounded-xl shadow-lg disabled:opacity-50 text-left"
              >
                <FontAwesomeIcon
                  icon={nodeTypesInfo[type as keyof typeof nodeTypesInfo].icon}
                  className="mr-2 text-blue-600 dark:text-blue-400"
                />
                {nodeTypesInfo[type as keyof typeof nodeTypesInfo].name}
              </button>
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
            </div>
          </div>
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
        <div className="absolute flex flex-row top-0 left-0 p-4 space-x-4 z-10">
          <div className="flex flex-col space-y-2 text-white">
            <h3 className="text-xl font-semibold text-left">Nodes</h3>
            {isNodeBarVisible && <p className="-mt-2 text-xs text-nowrap">Drag and drop to add nodes</p>}
          </div>
          <div className="w-full flex flex-row space-x-4 m-auto">
            {isNodeBarVisible && renderNodeButtons()}
            <Button
              variant="transparentWhite"
              onClick={() => setIsNodeBarVisible(!isNodeBarVisible)}
              className="z-10"
              size="small"
              icon={isNodeBarVisible ? faChevronLeft : faChevronRight}
            />
          </div>
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
              <ControlButton disabled={!canUndo} onClick={undo}>
                <FontAwesomeIcon icon={faUndo} />
              </ControlButton>
              <ControlButton disabled={!canRedo} onClick={redo}>
                <FontAwesomeIcon icon={faRedo} />
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
