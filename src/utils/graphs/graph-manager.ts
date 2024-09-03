import { Edge, Node } from '@xyflow/react';
import { NodeData, OptimizedGraph, OptimizedNode, StrippedNode } from '@/utils/graphs/graph';
import { stripAndOptimizeGraph } from './graph-utils';

/**
 * Graph manager class.
 * Handles graph traversal, node history, and callbacks related to node visits and events.
 */
export class GraphManager {
  private graph: OptimizedGraph;
  private currentNode: OptimizedNode | null;
  private nodeHistory: StrippedNode[];
  private onNodeVisitCallback: (node: OptimizedNode) => void;

  /**
   * Creates a new graph manager instance.
   * @param graphData {Object} - Graph structure with nodes and edges
   * @throws {Error} - If graph does not have a start node
   */
  constructor(graphData: { nodes: Node[]; edges: Edge[] }) {
    this.graph = stripAndOptimizeGraph(graphData);
    this.currentNode = Object.values(this.graph.nodes).find((node) => node.type === 'start') ?? null;
    this.currentNode = this.currentNode ? this.deepCopy(this.currentNode) : null;
    this.nodeHistory = [];
    this.onNodeVisitCallback = () => {};

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
      ? outgoingEdges.find((edgeId) => this.graph.edges[edgeId]?.target === nextNodeId)
      : outgoingEdges[0];

    if (!nextEdgeId) return;

    const edge = this.graph.edges[nextEdgeId];
    if (!edge) return;

    const nextNode = this.graph.nodes[edge.target];
    if (!nextNode) return;

    this.addNodeToHistory(this.currentNode);

    this.currentNode = this.deepCopy(nextNode);
    this.onNodeVisitCallback(nextNode);
  }

  /**
   * Sets a callback for when a node is visited.
   */
  onNodeVisit(callback: (node: OptimizedNode) => void): void {
    this.onNodeVisitCallback = callback;
  }

  /**
   * Returns the graph structure.
   * @returns {Object} The graph structure
   */
  getGraph(): OptimizedGraph {
    return this.graph;
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
   * @returns {Array} The node history
   */
  getNodeHistory(): StrippedNode[] {
    return this.nodeHistory;
  }
}
