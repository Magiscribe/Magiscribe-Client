import Dagre from '@dagrejs/dagre';
import { Edge, Node } from '@xyflow/react';
import { v4 as uuid } from 'uuid';

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
export function formatAndSetGraph(
  graph: { nodes: Node[]; edges: Edge[] },
  autoPosition: boolean = false,
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
) {
  let formattedNodes = graph.nodes;

  if (autoPosition) {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'TB' });

    formattedNodes.forEach((node) => {
      g.setNode(node.id, { width: 400, height: 400 });
    });
    graph.edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    Dagre.layout(g);

    formattedNodes = formattedNodes.map((node) => ({
      ...node,
      position: { x: g.node(node.id).x, y: g.node(node.id).y },
    }));
  }

  setNodes(formattedNodes);
  setEdges(graph.edges);
}

/**
 * Strips nodes of non-essential data.
 * @param node {Node} A node object
 * @returns {Omit<Node, 'position'>} A node object without a position
 */
export function stripNode(node: Node): Omit<Node, 'position'> {
  return {
    id: node.id,
    type: node.type,
    data: node.data,
  };
}

/**
 * Strips edge ids of non-essential data.
 * @param edge {Edge} An edge object
 * @returns { source: string; target: string } An edge object without an id
 */
export function stripEdgeId(edge: Edge): Omit<Edge, 'id'> {
  return {
    source: edge.source,
    target: edge.target,
  };
}

/**
 * Strips graph of non-essential data.
 * @param graph { nodes: Node[]; edges: Edge[] } A graph structure with nodes and edges
 * @returns { nodes: Omit<Node, 'position'>[]; edges: Omit<Edge, 'id'>[] } A graph structure with nodes and edges
 */
export function stripGraph(graph: { nodes: Node[]; edges: Edge[] }): {
  nodes: Omit<Node, 'position'>[];
  edges: Omit<Edge, 'id'>[];
} {
  return {
    nodes: graph.nodes.map(stripNode),
    edges: graph.edges.map(stripEdgeId),
  };
}
