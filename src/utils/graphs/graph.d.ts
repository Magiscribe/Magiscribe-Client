import { Edge, Node } from '@xyflow/react';

export type StrippedNode = Omit<Node, 'position'>;
export type StrippedEdge = Omit<Edge, 'id'>;

export interface StrippedGraph {
  nodes: StrippedNode[];
  edges: StrippedEdge[];
}

export type NodeData = Node['data'];

export type OptimizedNode = StrippedNode & { outgoingEdges: string[] };

export interface OptimizedGraph {
  nodes: { [key: string]: OptimizedNode };
  edges: { [key: string]: { source: string; target: string } };
}
