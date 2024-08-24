import { ADD_PREDICTION } from '@/clients/mutations';
import { GET_DATA } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { getAgentIdByName } from '@/utils/agents';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Edge, Node } from '@xyflow/react';
import React, { createContext, useContext, useRef, useState } from 'react';

interface GraphContextType {
  currentNode: React.MutableRefObject<Node | null | undefined>;
  visitedNodes: React.MutableRefObject<{ id: string; data: any }[]>;

  handleNextNode: (props?: HandleNextNodeProps) => Promise<void>;
  setOnNodeVisit: (callback: (node: Node) => void) => void;

  loading: boolean;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

interface GraphProviderProps {
  children: React.ReactNode;
  id: string;
}

interface HandleNextNodeProps {
  nextNodeId?: string;
  data?: any;
}

export function GraphProvider({ children, id }: GraphProviderProps) {
  // Subscription ID
  const [subscriptionId] = useState<string>(`inquiry_${Date.now()}`);

  // Graph State
  const graph = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const currentNode = useRef<Node | null | undefined>(null);
  const visitedNodes = useRef<{ id: string; data: any }[]>([]);
  
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);
  const onSubscriptionData = useRef<(data: any) => void>(() => {});
  const onNodeVisit = useRef<(node: Node) => void>(() => {});

  // Queries and Mutations
  const [addPrediction] = useMutation(ADD_PREDICTION);
  const client = useApolloClient();

  useQuery(GET_DATA, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    onCompleted: ({ dataObject }) => {
      if (dataObject.data.graph) {
        graph.current = dataObject.data.graph;
        currentNode.current = dataObject.data.graph.nodes.find((node: Node) => node.type === 'start');
        handleNextNode();
      }
    },
    onError: () => {
      console.log('error');
    },
  });

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: {
      subscriptionId,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction && prediction.type === 'SUCCESS') {
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

  const handleNextNode = async ({ nextNodeId, data }: HandleNextNodeProps = {}) => {
    const edges = graph.current.edges.filter((edge) => edge.source === currentNode.current?.id);

    let edge;
    if (nextNodeId) {
      edge = edges.find((edge) => edge.target === nextNodeId);
    } else {
      edge = edges[0];
    }
    if (!edge) {
      return;
    }

    const nextNode = graph.current.nodes.find((node) => node.id === edge.target);
    if (!nextNode) {
      return;
    }

    visitedNodes.current.push({
      id: currentNode.current!.id,
      data,
    });
    currentNode.current = nextNode;

    if (nextNode.data.dynamicGeneration) {
      console.log(nextNode.type);
      const agentId = await getAgentIdByName(
        nextNode.type === 'conversation' ? 'Stakeholder | Dynamic Question Generation' : 'Stakeholder | Dynamic Information Generation'
        , client);

      await addPrediction({
        variables: {
          subscriptionId,
          agentId,
          variables: {
            userMessage: `We are at at node ${currentNode.current.id}`,
            conversationGraph: JSON.stringify(graph.current),
            nodeVisitData: JSON.stringify(visitedNodes.current),
          },
        },
      });

      onSubscriptionData.current = (result) => {
        currentNode.current!.data = {
          text: result.text,
        }
        if (onNodeVisit.current) {
          onNodeVisit.current(currentNode.current!);
        }
      };
    } else

    if (nextNode.type === 'condition') {
      const agentId = await getAgentIdByName('Stakeholder | Condition Node', client);

      await addPrediction({
        variables: {
          subscriptionId,
          agentId,
          variables: {
            userMessage: `We are at at node ${currentNode.current.id}`,
            conversationGraph: JSON.stringify(graph.current),
            nodeVisitData: JSON.stringify(visitedNodes.current),
          },
        },
      });

      onSubscriptionData.current = (result) => {
        handleNextNode({
          nextNodeId: result.nextNodeId,
          data: result,
        });
      };
    } else 

    if (onNodeVisit.current) {
      onNodeVisit.current(currentNode.current);
    }
  };

  const setOnNodeVisit = (callback: (node: Node) => void) => {
    onNodeVisit.current = callback;
  };

  return (
    <GraphContext.Provider value={{ setOnNodeVisit, currentNode, visitedNodes, handleNextNode, loading }}>
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}
