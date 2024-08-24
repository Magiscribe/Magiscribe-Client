import { ADD_PREDICTION } from '@/clients/mutations';
import { GET_DATA } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { getAgentIdByName } from '@/utils/agents';
import { stripGraph, StrippedGraph, StrippedNode } from '@/utils/graphUtils';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { createContext, useContext, useRef, useState } from 'react';

interface GraphProviderProps {
  children: React.ReactNode;
  id: string;
}

interface HandleNextNodeProps {
  nextNodeId?: string;
  data?: StrippedNode['data'];
}

interface GraphContextType {
  currentNode: React.MutableRefObject<StrippedNode | null | undefined>;
  nodeHistory: React.MutableRefObject<{ id: string; data: StrippedNode['data'] | undefined }[]>;

  handleNextNode: (props?: HandleNextNodeProps) => Promise<void>;
  setOnNodeVisit: (callback: (node: StrippedNode) => void) => void;

  loading: boolean;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export function GraphProvider({ children, id }: GraphProviderProps) {
  // Subscription ID
  const [subscriptionId] = useState<string>(`inquiry_${Date.now()}`);

  // Graph State
  const graph = useRef<StrippedGraph>({ nodes: [], edges: [] });
  const currentNode = useRef<StrippedNode | null | undefined>(null);
  const nodeHistory = useRef<{ id: string; data: StrippedNode['data'] | undefined }[]>([]);

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);
  const onSubscriptionData = useRef<(data: StrippedNode['data']) => void>(() => {});
  const onNodeVisit = useRef<(node: StrippedNode) => void>(() => {});

  // Queries and Mutations
  const [addPrediction] = useMutation(ADD_PREDICTION);
  const client = useApolloClient();

  useQuery(GET_DATA, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    onCompleted: ({ dataObject }) => {
      if (dataObject.data.graph) {
        graph.current = stripGraph(dataObject.data.graph);
        currentNode.current = dataObject.data.graph.nodes.find((node: StrippedNode) => node.type === 'start');
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

  /**
   * Handles moving to the next node in the conversation graph.
   * @param {HandleNextNodeProps} props The properties to use when moving to the next node.
   * @returns {Promise<void>}
   */
  async function handleNextNode({ nextNodeId, data }: HandleNextNodeProps = {}): Promise<void> {
    // Base Case 1: The current node is set.
    if (!currentNode.current) {
      return;
    }

    // Base Case 2: The current node has 1 or more source edges.
    const edge = graph.current.edges
      .filter((edge) => edge.source === currentNode.current?.id)
      .find((edge) => (nextNodeId ? edge.target === nextNodeId : true));
    if (!edge) return;

    // Base Case 3: The connected edges lead to 1 or more target nodes.
    const nextNode = graph.current.nodes.find((node) => node.id === edge.target);
    if (!nextNode) return;

    nodeHistory.current.push({
      id: currentNode.current.id,
      data,
    });

    // Move the the next node.
    currentNode.current = nextNode;

    // If the next node is a dynamic generation node, we need to
    // make a prediction to get the text for the node.
    if (nextNode.data.dynamicGeneration) {
      console.log(nextNode.type);
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
            conversationGraph: JSON.stringify(graph.current),
            nodeVisitData: JSON.stringify(nodeHistory.current),
          },
        },
      });

      onSubscriptionData.current = (result) => {
        if (currentNode.current) {
          currentNode.current.data = {
            text: result.text,
          };
        }
        if (onNodeVisit.current) {
          onNodeVisit.current(currentNode.current!);
        }
      };

      return;
    }

    // If the next node is a condition node, we need to make a prediction to get the next node,
    // we will traverse to.
    if (nextNode.type === 'condition') {
      const agentId = await getAgentIdByName('Stakeholder | Condition Node', client);

      await addPrediction({
        variables: {
          subscriptionId,
          agentId,
          variables: {
            userMessage: `We are at at node ${currentNode.current.id}`,
            conversationGraph: JSON.stringify(graph.current),
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

    // If the next does not require any predictions, we can trigger a callback to notify
    // the consumer with the current node.
    if (onNodeVisit.current) {
      onNodeVisit.current(currentNode.current);

      return;
    }
  }

  /**
   * Sets a callback to be called when a node is visited.
   * @param callback {Function} A callback function that will be called when a node is visited.
   */
  function setOnNodeVisit(callback: (node: StrippedNode) => void) {
    onNodeVisit.current = callback;
  }

  return (
    <GraphContext.Provider value={{ setOnNodeVisit, currentNode, nodeHistory: nodeHistory, handleNextNode, loading }}>
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
