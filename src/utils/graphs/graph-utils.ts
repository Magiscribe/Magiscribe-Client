import Dagre from '@dagrejs/dagre';
import { Edge, Node } from '@xyflow/react';
import { v4 as uuid } from 'uuid';
import { OptimizedGraph, OptimizedNode, StrippedEdge, StrippedGraph, StrippedNode } from './graph';

/**
 * Creates a graph structure from input data.
 * @param {any} input - Input data for graph creation
 * @returns {Object} Graph structure with nodes and edges
 */
export function createGraph(input: { nodes: Node[]; edges: Edge[] }): { nodes: Node[]; edges: Edge[] } {
  const newNodes: Node[] = input.nodes.map((node: Node) => ({
    id: node.id,
    type: node.type,
    position: { x: node.position?.x, y: node.position?.y },
    data: node.data,
  }));

  const newEdges: Edge[] = input.edges.map((edge: Edge) => ({
    id: uuid(),
    source: edge.source.toString(),
    target: edge.target.toString(),
  }));

  return { nodes: newNodes, edges: newEdges };
}

/**
 * Formats and sets the graph, optionally auto-positioning nodes.
 * @param {Object} graph - Graph structure with nodes and edges
 * @param {boolean} autoPosition - Whether to auto-position nodes
 * @param {Function} setNodes - Function to set nodes
 * @param {Function} setEdges - Function to set edges
 */
export function formatGraph(graph: { nodes: Node[]; edges: Edge[] }, autoPosition: boolean = false) {
  let formattedNodes = graph.nodes;

  if (autoPosition) {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'LR' });

    // TODO: Fix this so that it correctly sets the width and height of the nodes on the first render.
    //       Currently, it sets the width and height to 400 on the first render because it does not have
    //       the measured width and height of the nodes.
    formattedNodes.forEach((node) => {
      g.setNode(node.id, {
        width: node.measured?.width ? node.measured.width + 100 : 400,
        height: node.measured?.height ? node.measured.height + 100 : 400,
      });
    });
    graph.edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    Dagre.layout(g);

    formattedNodes = formattedNodes.map((node) => {
      const dagNode = g.node(node.id);
      return {
        ...node,
        position: {
          x: dagNode.x - dagNode.width / 2,
          y: dagNode.y - dagNode.height / 2,
        },
      };
    });
  }

  return { nodes: formattedNodes, edges: graph.edges };
}

/**
 * Strips nodes of non-essential data.
 * @param node {Node} A node object
 * @returns {StrippedNode} A node object without a position
 */
export function stripNode(node: Node): StrippedNode {
  return {
    id: node.id,
    type: node.type,
    data: node.data,
  };
}

/**
 * Strips edge ids of non-essential data.
 * @param edge {Edge} An edge object
 * @returns {StrippedEdge} An edge object without an id
 */
export function stripEdgeId(edge: Edge): StrippedEdge {
  return {
    source: edge.source,
    target: edge.target,
  };
}

/**
 * Strips graph of non-essential data.
 * @param graph { nodes: Node[]; edges: Edge[] } A graph structure with nodes and edges
 * @returns {StrippedGraph} A graph structure without node positions and edge ids
 */
export function stripGraph(graph: { nodes: Node[]; edges: Edge[] }): StrippedGraph {
  return {
    nodes: graph.nodes.map(stripNode),
    edges: graph.edges.map(stripEdgeId),
  };
}

/**
 * Converts a StrippedGraph to an OptimizedGraph with Map-based structure.
 * @param graph {StrippedGraph} A stripped graph structure
 * @returns {OptimizedGraph} An optimized graph structure using Maps
 */
export function convertToOptimizedGraph(graph: StrippedGraph): OptimizedGraph {
  const nodes: { [key: string]: OptimizedNode } = {};
  const edges: { [key: string]: { source: string; target: string } } = {};
  const outgoingEdges: { [key: string]: string[] } = {};

  graph.nodes.forEach((node) => {
    nodes[node.id] = { ...node, outgoingEdges: [] };
  });

  graph.edges.forEach((edge, index) => {
    const edgeId = `edge-${index}`;
    edges[edgeId] = edge;

    if (!outgoingEdges[edge.source]) {
      outgoingEdges[edge.source] = [];
    }
    outgoingEdges[edge.source].push(edgeId);
  });

  Object.keys(nodes).forEach((id) => {
    nodes[id].outgoingEdges = outgoingEdges[id] || [];
  });

  return { nodes, edges };
}
