import { ADD_PREDICTION, CREATE_INQUIRY_REPONSE, UPDATE_INQUIRY_RESPONSE } from '@/clients/mutations';
import { GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { getAgentIdByName } from '@/utils/agents';
import { NodeData, OptimizedNode } from '@/utils/graphs/graph';
import { GraphManager } from '@/utils/graphs/graph-manager';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface InquiryProviderProps {
  children: React.ReactNode;
  id: string;
}

interface HandleNextNodeProps {
  nextNodeId?: string;
  data?: NodeData;
}

interface State {
  loading: boolean;
  initialized: boolean;
}

interface InquiryContextType {
  handleNextNode: (props?: HandleNextNodeProps) => Promise<void>;
  onNodeUpdate: (callback: (node: OptimizedNode) => void) => void;
  form: { [key: string]: string };
  state: State;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

function InquiryProvider({ children, id }: InquiryProviderProps) {
  // Refs
  const formRef = useRef<{ [key: string]: string }>({});
  const graphRef = useRef<GraphManager | null>(null);
  const inquiryResponseIdRef = useRef<string | undefined>(undefined);
  const inquiryHistoryRef = useRef<string[]>([]);

  // States
  const [state, setState] = useState<State>({ loading: false, initialized: false });
  const subscriptionId = useRef<string>(`inquiry_${Date.now()}`).current;

  // Event handlers
  const onSubscriptionDataRef = useRef<(data: NodeData) => void>(() => {});
  const onNodeUpdateRef = useRef<(node: OptimizedNode) => void>(() => {});

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
        formRef.current = getInquiry.data.form;
        graphRef.current = new GraphManager(getInquiry.data.graph);
        graphRef.current.onNodeVisit = handleOnNodeVisit;
        graphRef.current.onNodeAddedToHistory = addNodeToHistory;
        setState((prev) => ({ ...prev, initialized: true }));
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
        setState((prev) => ({ ...prev, loading: true }));

        // TODO: Avoid double parsing. Will require changes to the backend.
        const result = JSON.parse(JSON.parse(prediction.result));
        if (onSubscriptionDataRef.current) {
          onSubscriptionDataRef.current(result);
        }
      }
    },
    onError: () => {
      setState((prev) => ({ ...prev, loading: false }));
    },
  });

  /**
   * Handles moving to the next node.
   * @param {HandleNextNodeProps} props - The next node ID and data to pass to the next node.
   * @returns {Promise<void>} A promise that resolves when the next node is visited
   */
  const handleNextNode = useCallback(
    async ({ nextNodeId, data }: HandleNextNodeProps = {}) => {
      if (!graphRef.current) return;

      setState((prev) => ({ ...prev, loading: true }));

      if (!inquiryResponseIdRef.current) {
        const result = await createResponse({
          variables: {
            inquiryId: id,
            data: graphRef.current.getNodeHistory(),
          },
        });
        inquiryResponseIdRef.current = result.data.upsertInquiryResponse.id;
      } else {
        await updateResponse({
          variables: {
            id: inquiryResponseIdRef.current,
            inquiryId: id,
            data: graphRef.current.getNodeHistory(),
          },
        });
      }

      const carryOverData = graphRef.current.getCurrentNode()?.data;
      await graphRef.current.updateCurrentNodeData({ response: data, ...carryOverData });
      await graphRef.current.goToNextNode(nextNodeId);
    },
    [createResponse, id, updateResponse],
  );

  /**
   * Handles when a new node is visited.
   * @param node {OptimizedNode} The node that was visited
   * @returns {Promise<void>} A promise that resolves when the node is visited
   */
  const handleOnNodeVisit = useCallback(async (node: OptimizedNode) => {
    if (node.data?.dynamicGeneration) {
      await handleDynamicGeneration();
    } else if (node.type === 'condition') {
      await handleConditionNode();
    } else if (onNodeUpdateRef.current) {
      setState((prev) => ({ ...prev, loading: false }));
      onNodeUpdateRef.current(node);
    }
  }, []);

  /**
   * Handles visiting a node with dynamic generation.
   * Here, we will send a prediction to the backend to generate dynamic content that is then placed
   * on the node. A callback is triggered at the end to notify subscribers of the new node data.
   * @returns {Promise<void>} A promise that resolves when the dynamic generation is complete
   */
  const handleDynamicGeneration = useCallback(async () => {
    // Base Case 1: The graph manager is initialized.
    if (!graphRef.current) return;

    // Base Case 2: The current node is defined (may be the case if the graph is empty).
    const currentNode = graphRef.current.getCurrentNode();
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
          userMessage: currentNode.data.text,
          nodeVisitData: inquiryHistoryRef.current.join('\n\n'),
        },
      },
    });

    onSubscriptionDataRef.current = (result) => {
      if (currentNode) {
        currentNode.data = { ...currentNode.data, ...result };
      }
      if (onNodeUpdateRef.current) {
        onNodeUpdateRef.current(currentNode);
      }
    };
  }, [addPrediction, client, subscriptionId]);

  const handleConditionNode = useCallback(async () => {
    // Base Case 1: The graph manager is initialized.
    if (!graphRef.current) return;

    const agentId = await getAgentIdByName('Stakeholder | Condition Node', client);

    await addPrediction({
      variables: {
        subscriptionId,
        agentId,
        variables: {
          userMessage: `The current node is: ${graphRef.current.getCurrentNode()?.id}. \nThe instruction is: ${graphRef.current.getCurrentNode()?.data.text}`,
          conversationGraph: JSON.stringify(graphRef.current.getGraph()),
          nodeVisitData: inquiryHistoryRef.current.join('\n\n'),
        },
      },
    });

    onSubscriptionDataRef.current = (result) => {
      handleNextNode({
        nextNodeId: result.nextNodeId as string,
        data: result,
      });
    };
  }, [addPrediction, client, handleNextNode, subscriptionId]);

  /**
   * Converts the node history into a readable conversation format
   * @returns {string} A stringified version of the conversation history
   */
  const addNodeToHistory = useCallback((node: OptimizedNode) => {
    if (!node.data) return;

    const { type, data } = node as { type: string; data: { [key: string]: { [key: string]: string } } };
    let conversation = '';

    if (type === 'information') {
      if (data.text) {
        conversation = `Bot: ${data.text}`;
      }
    } else if (type === 'conversation') {
      const parts = [
        data.text && `Bot: ${data.text}`,
        data.ratings && `Available ratings: ${JSON.stringify(data.ratings)}`,
        data.response?.text && `User: ${data.response.text}`,
        data.response?.ratings && `User selected ratings: ${JSON.stringify(data.response.ratings)}`,
      ].filter(Boolean);

      conversation = parts.join('\n');
    }

    if (conversation) {
      inquiryHistoryRef.current.push(conversation);
    }
  }, []);

  const contextValue = {
    onNodeUpdate: useCallback((callback: (node: OptimizedNode) => void) => {
      onNodeUpdateRef.current = callback;
    }, []),
    handleNextNode,
    form: formRef.current,
    state,
  };

  return <InquiryContext.Provider value={contextValue}>{children}</InquiryContext.Provider>;
}

function useInquiry() {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
}

export { InquiryProvider, useInquiry };
