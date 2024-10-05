import { OptimizedGraph, OptimizedNode, StrippedEdge, StrippedGraph, StrippedNode } from './graph';
import Dagre from '@dagrejs/dagre';
import { Edge, Node } from '@xyflow/react';
import { v4 as uuid } from 'uuid';

/**
 * Creates a graph structure from input data.
 * @param {string} input - Input data for graph creation
 * @returns {Object} Graph structure with nodes and edges
 */
export function parseGraph(input: string): { nodes: Node[]; edges: Edge[] } {
  const parsed = JSON.parse(input);

  const nodes: Node[] = parsed.nodes;
  const edges: Edge[] = parsed.edges.map((edge: Edge) => ({
    id: uuid(),
    source: edge.source.toString(),
    target: edge.target.toString(),
  }));

  return { nodes, edges };
}

/*================================ Changeset ==============================*/

interface ChangeSet {
  nodesToUpsert?: Node[];
  nodesToDelete?: string[];
  edgesToAdd?: Edge[];
  edgesToDelete?: Edge[];
}

export function applyGraphChangeset(
  graph: { nodes: Node[]; edges: Edge[] },
  changeset: ChangeSet,
): { nodes: Node[]; edges: Edge[] } {
  const updatedNodes = applyNodeChanges(graph.nodes, changeset);
  const updatedEdges = applyEdgeChanges(graph.edges, changeset, updatedNodes);

  return { nodes: updatedNodes, edges: updatedEdges };
}

function applyNodeChanges(nodes: Node[], changeset: ChangeSet): Node[] {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  changeset.nodesToUpsert?.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  changeset.nodesToDelete?.forEach((id) => {
    nodeMap.delete(id);
  });

  return Array.from(nodeMap.values());
}

function applyEdgeChanges(edges: Edge[], changeset: ChangeSet, updatedNodes: Node[]): Edge[] {
  const validNodeIds = new Set(updatedNodes.map((node) => node.id));
  const edgeSet = new Set(edges.map((edge) => `${edge.source}-${edge.target}`));

  const updatedEdges = edges.filter(
    (edge) =>
      validNodeIds.has(edge.source) &&
      validNodeIds.has(edge.target) &&
      !changeset.edgesToDelete?.some(
        (deleteEdge) => deleteEdge.source === edge.source && deleteEdge.target === edge.target,
      ),
  );

  changeset.edgesToAdd?.forEach((edge) => {
    if (validNodeIds.has(edge.source) && validNodeIds.has(edge.target)) {
      const edgeKey = `${edge.source}-${edge.target}`;
      if (!edgeSet.has(edgeKey)) {
        updatedEdges.push({ ...edge, id: uuid() });
        edgeSet.add(edgeKey);
      }
    }
  });

  return updatedEdges;
}

/*================================ Formatting ==============================*/

/**
 * Formats and sets the graph, optionally auto-positioning nodes.
 * @param {Object} graph - Graph structure with nodes and edges
 * @param {boolean} autoPosition - Whether to auto-position nodes
 * @param {Function} setNodes - Function to set nodes
 * @param {Function} setEdges - Function to set edges
 */
export function formatGraph(graph: { nodes: Node[]; edges: Edge[] }) {
  let formattedNodes = graph.nodes;

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

  return { nodes: formattedNodes, edges: graph.edges };
}

/*================================ Stripping ==============================*/

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
 * Strips edges of non-essential data.
 * @param edge {Edge} An edge object
 * @returns {StrippedEdge} An edge object without an id
 */
export function stripEdge(edge: Edge): StrippedEdge {
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
    edges: graph.edges.map(stripEdge),
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
