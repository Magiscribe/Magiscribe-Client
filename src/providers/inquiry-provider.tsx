import { ADD_PREDICTION, CREATE_INQUIRY_REPONSE, UPDATE_INQUIRY_RESPONSE } from '@/clients/mutations';
import { GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { getAgentIdByName } from '@/utils/agents';
import { GraphManager } from '@/utils/graphs/graph-manager';
import { NodeData, OptimizedNode } from '@/utils/graphs/graph';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { createContext, useContext, useRef, useState } from 'react';

interface InquiryProviderProps {
  children: React.ReactNode;
  id: string;
}

interface HandleNextNodeProps {
  nextNodeId?: string;
  data?: NodeData;
}

interface InquiryContextType {
  handleNextNode: (props?: HandleNextNodeProps) => Promise<void>;
  onNodeUpdate: (callback: (node: OptimizedNode) => void) => void;

  initialized: boolean;
  loading: boolean;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

function InquiryProvider({ children, id }: InquiryProviderProps) {
  // Refs
  const graph = useRef<GraphManager | null>(null);

  // States
  const inquiryResponseId = useRef<string | undefined>(undefined);
  const [subscriptionId] = useState<string>(`inquiry_${Date.now()}`);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Event handlers
  const onSubscriptionData = useRef<(data: NodeData) => void>(() => {});
  const onNodeUpdate = useRef<(node: OptimizedNode) => void>(() => {});

  // Mutations and Apollo client
  const [addPrediction] = useMutation(ADD_PREDICTION);
  const [createResponse] = useMutation(CREATE_INQUIRY_REPONSE);
  const [updateResponse] = useMutation(UPDATE_INQUIRY_RESPONSE);
  const client = useApolloClient();

  /**
   * Fetches the data object on mount when an ID is provided.
   * Will automatically start the inquiry process.
   */
  useQuery(GET_INQUIRY, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    onCompleted: ({ getInquiry }) => {
      if (getInquiry.data.graph) {
        graph.current = new GraphManager(getInquiry.data.graph);
        graph.current.onNodeVisit(handleOnNodeVisit);
        setInitialized(true);
      }
    },
    onError: () => {
      console.log('error');
    },
  });

  /**
   * Subscribes to the predictionAdded subscription.
   * When a result from a prediction is received, it will trigger the onSubscriptionData callback.
   */
  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction?.type === 'SUCCESS') {
        setLoading(false);

        // TODO: Avoid double parsing. Will require changes to the backend.
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
   * Handles moving to the next node.
   * @param {HandleNextNodeProps} props - The next node ID and data to pass to the next node.
   * @returns {Promise<void>} A promise that resolves when the next node is visited
   */
  async function handleNextNode({ nextNodeId, data }: HandleNextNodeProps = {}): Promise<void> {
    if (!graph.current) return;

    if (!inquiryResponseId.current) {
      const result = await createResponse({
        variables: {
          inquiryId: id,
          data: graph.current.getNodeHistory(),
        },
      });
      inquiryResponseId.current = result.data.upsertInquiryResponse.id;
    } else {
      await updateResponse({
        variables: {
          id: inquiryResponseId.current,
          inquiryId: id,
          data: graph.current.getNodeHistory(),
        },
      });
    }

    // Carries over data if the node has dynamic generation so we know what the node generated.
    const carryOverdata = graph.current.getCurrentNode()?.data?.dynamicGeneration ? graph.current.getCurrentNode()?.data : {};

    await graph.current.updateCurrentNodeData({
      ...data,
      ...carryOverdata,
    });
    await graph.current.goToNextNode(nextNodeId);
  }

  /**
   * Handles when a new node is visited.
   * @param node {OptimizedNode} The node that was visited
   * @returns {Promise<void>} A promise that resolves when the node is visited
   */
  async function handleOnNodeVisit(node: OptimizedNode): Promise<void> {
    if (node.data.dynamicGeneration) {
      await handleDynamicGeneration();
    } else if (node.type === 'condition') {
      await handleConditionNode();
    } else if (onNodeUpdate.current) {
      onNodeUpdate.current(node);
    }
  }

  /**
   * Handles visiting a node with dynamic generation.
   * Here, we will send a prediction to the backend to generate dynamic content that is then placed
   * on the node. A callback is triggered at the end to notify subscribers of the new node data.
   * @returns {Promise<void>} A promise that resolves when the dynamic generation is complete
   */
  async function handleDynamicGeneration(): Promise<void> {
    // Base Case 1: The graph manager is initialized.
    if (!graph.current) return;

    // Base Case 2: The current node is defined (may be the case if the graph is empty).
    const currentNode = graph.current.getCurrentNode();
    if (!currentNode) return;

    const agentId = await getAgentIdByName(
      `Stakeholder | Dynamic ${currentNode.type === 'conversation' ? 'Question' : 'Information'} Generation`,
      client,
    );

    await addPrediction({
      variables: {
        subscriptionId,
        agentId,
        variables: {
          userMessage: `We are at at node ${currentNode.id}`,
          conversationGraph: JSON.stringify(graph.current.getGraph()),
          nodeVisitData: JSON.stringify(graph.current.getNodeHistory()),
        },
      },
    });

    onSubscriptionData.current = (result) => {
      if (currentNode) {
        currentNode.data = {
          ...currentNode.data,
          text: result.text,
        };
      }
      if (onNodeUpdate.current) {
        onNodeUpdate.current(currentNode);
      }
    };
  }

  async function handleConditionNode() {
    // Base Case 1: The graph manager is initialized.
    if (!graph.current) return;

    const agentId = await getAgentIdByName('Stakeholder | Condition Node', client);

    await addPrediction({
      variables: {
        subscriptionId,
        agentId,
        variables: {
          userMessage: `We are at at node ${graph.current.getCurrentNode()?.id}`,
          conversationGraph: JSON.stringify(graph.current.getGraph()),
          nodeVisitData: JSON.stringify(graph.current.getNodeHistory()),
        },
      },
    });

    onSubscriptionData.current = (result) => {
      handleNextNode({
        nextNodeId: result.nextNodeId as string,
        data: result,
      });
    };
  }

  /**
   * Sets a callback for when a node is updated.
   * @param callback {Function} A callback function that receives the updated node.
   */
  function setOnNodeUpdate(callback: (node: OptimizedNode) => void) {
    onNodeUpdate.current = callback;
  }

  return (
    <InquiryContext.Provider
      value={{
        onNodeUpdate: setOnNodeUpdate,
        handleNextNode,
        loading,
        initialized,
      }}
    >
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

export { InquiryProvider };
