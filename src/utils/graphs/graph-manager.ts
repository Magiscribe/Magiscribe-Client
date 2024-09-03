import { NodeData, OptimizedGraph, OptimizedNode, StrippedGraph, StrippedNode } from '@/utils/graphs/graph';
import { Edge, Node } from '@xyflow/react';
import { convertToOptimizedGraph, stripGraph } from './graph-utils';

/**
 * Graph manager class.
 * Handles graph traversal, node history, and callbacks related to node visits and events.
 */
export class GraphManager {
  // Graphs
  private originalGraph: StrippedGraph;
  private traversalGraph: OptimizedGraph;

  // State
  private currentNode: OptimizedNode | null;
  private nodeHistory: StrippedNode[];

  //  Callbacks
  private onNodeVisitCallback?: (node: OptimizedNode) => void;
  public set onNodeVisit(callback: (node: OptimizedNode) => void) {
    this.onNodeVisitCallback = callback
  }

  private onNodeAddedToHistoryCallback?:  (node: OptimizedNode) => void;
  public set onNodeAddedToHistory(callback: (node: OptimizedNode) => void) {
    this.onNodeAddedToHistoryCallback = callback
  }

  /**
   * Creates a new graph manager instance.
   * @param graphData {Object} - Graph structure with nodes and edges
   * @throws {Error} - If graph does not have a start node
   */
  constructor(graph: { nodes: Node[]; edges: Edge[] }) {
    // Graphs
    this.originalGraph = stripGraph(graph);
    this.traversalGraph = convertToOptimizedGraph(this.originalGraph);
    
    // State
    this.currentNode = Object.values(this.traversalGraph.nodes).find((node) => node.type === 'start') ?? null;
    this.currentNode = this.currentNode ? this.deepCopy(this.currentNode) : null;
    this.nodeHistory = [];

    if (!this.currentNode) {
      throw new Error('Graph must have a start node.');
    }
  }

  /**
   * Deep copies an object.
   * @param obj {Object} - Object to deep copy
   * @returns {Object} - Deep copied object
   */
  private deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Adds a node to the history.
   * @param {Object} node - Node to add to the history
   */
  private addNodeToHistory({ id, data, type }: StrippedNode): void {
    this.nodeHistory.push({ id, type, data });
  }

  /**
   * Updates the current node data.
   * @note This is emphemeral and does not update the graph structure.
   *       When you revisit the node, the data will be reset.
   *       This is useful to having a node history with different data or to modify the data temporarily.
   * @param {Object} data - New data for the current node
   */
  async updateCurrentNodeData(data: NodeData): Promise<void> {
    if (this.currentNode) {
      this.currentNode.data = data;
    }
  }

  /**
   * Moves to the next node.
   * @param {string} nextNodeId - ID of the next node to move to
   */
  async goToNextNode(nextNodeId?: string): Promise<void> {
    if (!this.currentNode) return;

    const outgoingEdges = this.currentNode.outgoingEdges;
    if (!outgoingEdges.length) return;

    const nextEdgeId = nextNodeId
      ? outgoingEdges.find((edgeId) => this.traversalGraph.edges[edgeId]?.target === nextNodeId)
      : outgoingEdges[0];

    if (!nextEdgeId) return;

    const edge = this.traversalGraph.edges[nextEdgeId];
    if (!edge) return;

    const nextNode = this.traversalGraph.nodes[edge.target];
    if (!nextNode) return;

    this.addNodeToHistory(this.currentNode);
    this.onNodeAddedToHistoryCallback?.(this.currentNode);

    this.currentNode = this.deepCopy(nextNode);
    this.onNodeVisitCallback?.(nextNode);
  }

  /**
   * Returns the graph structure.
   * @returns {Object} The graph structure
   */
  getGraph(): StrippedGraph {
    return this.originalGraph;
  }

  /**
   * Returns the current node.
   * @returns {Object} The current node
   */
  getCurrentNode(): OptimizedNode | null {
    return this.currentNode;
  }

  /**
   * Returns the node history.
   * @returns {Object[]} The node history
   */
  getNodeHistory(): StrippedNode[] {
    return this.nodeHistory;
  }
}
