import { ADD_PREDICTION } from '@/clients/mutations';
import { GET_DATA } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { getAgentIdByName } from '@/utils/agents';
import { stripAndOptimizeGraph, stripGraph, StrippedNode } from '@/utils/graphUtils';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { createContext, useContext, useRef, useState } from 'react';

// Updated StrippedGraph interface
interface StrippedGraph {
  nodes: Map<string, StrippedNode & { outgoingEdges: string[] }>;
  edges: Map<string, {source: string; target: string}>;
}

interface InquiryProviderProps {
  children: React.ReactNode;
  id: string;
}

interface HandleNextNodeProps {
  nextNodeId?: string;
  data?: StrippedNode['data'];
}

interface InquiryContextType {
  currentNode: React.MutableRefObject<(StrippedNode & { outgoingEdges: string[] }) | null | undefined>;
  nodeHistory: React.MutableRefObject<{ id: string; data: StrippedNode['data'] | undefined }[]>;

  handleNextNode: (props?: HandleNextNodeProps) => Promise<void>;
  setOnNodeVisit: (callback: (node: StrippedNode & { outgoingEdges: string[] }) => void) => void;

  loading: boolean;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children, id }: InquiryProviderProps) {
  const [subscriptionId] = useState<string>(`inquiry_${Date.now()}`);

  // Updated Graph State
  const graph = useRef<StrippedGraph>({
    nodes: new Map(),
    edges: new Map()
  });
  const currentNode = useRef<(StrippedNode & { outgoingEdges: string[] }) | null | undefined>(null);
  const nodeHistory = useRef<{ id: string; data: StrippedNode['data'] | undefined }[]>([]);

  console.log('State', {
    graph: graph.current,
    currentNode: currentNode.current,
    nodeHistory: nodeHistory.current
  })

  const [loading, setLoading] = useState<boolean>(false);
  const onSubscriptionData = useRef<(data: StrippedNode['data']) => void>(() => {});
  const onNodeVisit = useRef<(node: StrippedNode & { outgoingEdges: string[] }) => void>(() => {});

  const [addPrediction] = useMutation(ADD_PREDICTION);
  const client = useApolloClient();

  useQuery(GET_DATA, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    onCompleted: ({ dataObject }) => {
      if (dataObject.data.graph) {
        const strippedGraph = stripAndOptimizeGraph(dataObject.data.graph);
        graph.current.nodes = new Map(
          Array.from(strippedGraph.nodes.entries()).map(([id, node]) => [
            id,
            { ...node, outgoingEdges: Array.from(strippedGraph.outgoingEdges.get(id) || []) }
          ])
        );
        graph.current.edges = strippedGraph.edges;
        currentNode.current = Array.from(graph.current.nodes.values()).find((node) => node.type === 'start');
        handleNextNode();
      }
    },
    onError: () => {
      console.log('error');
    },
  });

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction?.type === 'SUCCESS') {
        setLoading(false);
        const result = JSON.parse(JSON.parse(prediction.result));
        if (onSubscriptionData.current) {
          onSubscriptionData.current(result);
        }
      }
    },
    onError: () => {
      setLoading(false);
    },
  });

  async function handleNextNode({ nextNodeId, data }: HandleNextNodeProps = {}): Promise<void> {
    if (!currentNode.current) {
      return;
    }

    const outgoingEdges = currentNode.current.outgoingEdges;
    if (!outgoingEdges.length) return;

    let nextEdgeId: string | undefined;
    if (nextNodeId) {
      nextEdgeId = outgoingEdges.find(edgeId => {
        const edge = graph.current.edges.get(edgeId);
        return edge && edge.target === nextNodeId;
      });
    } else {
      nextEdgeId = outgoingEdges[0];
    }

    if (!nextEdgeId) return;

    const edge = graph.current.edges.get(nextEdgeId);
    if (!edge) return;

    const nextNode = graph.current.nodes.get(edge.target);
    if (!nextNode) return;

    nodeHistory.current.push({
      id: currentNode.current.id,
      data: currentNode.current.type !== 'condition' ? data : undefined,
    });

    currentNode.current = nextNode;

    if (nextNode.data.dynamicGeneration) {
      const agentId = await getAgentIdByName(
        `Stakeholder | Dynamic ${nextNode.type === 'conversation' ? 'Question' : 'Information'} Generation`,
        client,
      );

      await addPrediction({
        variables: {
          subscriptionId,
          agentId,
          variables: {
            userMessage: `We are at at node ${currentNode.current.id}`,
            conversationGraph: JSON.stringify(Object.fromEntries(graph.current.nodes)),
            nodeVisitData: JSON.stringify(nodeHistory.current),
          },
        },
      });

      onSubscriptionData.current = (result) => {
        if (currentNode.current) {
          currentNode.current.data = {
            ...currentNode.current.data,
            text: result.text,
          };
        }
        if (onNodeVisit.current) {
          onNodeVisit.current(currentNode.current!);
        }
      };

      return;
    }

    if (nextNode.type === 'condition') {
      const agentId = await getAgentIdByName('Stakeholder | Condition Node', client);

      await addPrediction({
        variables: {
          subscriptionId,
          agentId,
          variables: {
            userMessage: `We are at at node ${currentNode.current.id}`,
            conversationGraph: JSON.stringify(Object.fromEntries(graph.current.nodes)),
            nodeVisitData: JSON.stringify(nodeHistory.current),
          },
        },
      });

      onSubscriptionData.current = (result) => {
        handleNextNode({
          nextNodeId: result.nextNodeId as string,
          data: result,
        });
      };

      return;
    }

    if (onNodeVisit.current) {
      onNodeVisit.current(currentNode.current);
      return;
    }
  }

  function setOnNodeVisit(callback: (node: StrippedNode & { outgoingEdges: string[] }) => void) {
    onNodeVisit.current = callback;
  }

  return (
    <InquiryContext.Provider value={{ setOnNodeVisit, currentNode, nodeHistory: nodeHistory, handleNextNode, loading }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
}