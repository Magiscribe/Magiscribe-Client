import { ADD_PREDICTION, CREATE_INQUIRY_RESPONSE, UPDATE_INQUIRY_RESPONSE } from '@/clients/mutations';
import { GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import {
  AddPredictionMutation,
  CreateInquiryResponseMutation,
  GetInquiryQuery,
  PredictionType,
  UpdateInquiryResponseMutation,
} from '@/graphql/graphql';
import { getAgentIdByName } from '@/utils/agents';
import { NodeData, OptimizedNode } from '@/utils/graphs/graph';
import { GraphManager } from '@/utils/graphs/graph-manager';
import { parseMarkdownCodeBlocks } from '@/utils/markdown';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface InquiryProviderProps {
  /**
   * The child components that will be wrapped by the InquiryProvider
   */
  children: React.ReactNode;

  /**
   * A unique identifier for the inquiry
   */
  id: string;

  /**
   * An optional preview string for the inquiry. This will prevent the inquiry from being saving
   * data to the database.
   */
  preview?: boolean;
}

interface HandleNextNodeProps {
  nextNodeId?: string;
  data?: NodeData;
}

interface State {
  loading: boolean;
  initialized: boolean;
  notFound: boolean;
  error: boolean;
}

const INITIAL_STATE: State = {
  loading: false,
  initialized: false,
  notFound: false,
  error: false,
};

interface InquiryContextType {
  id: string;
  preview?: boolean;
  validGraph?: boolean;

  graph: GraphManager | null;

  handleNextNode: (props?: HandleNextNodeProps) => Promise<void>;

  onNodeUpdate: (callback: (node: OptimizedNode) => void) => void;
  onNodeError: (callback: (error: Error) => void) => void;

  userDetails: { [key: string]: string };
  setUserDetails: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;

  form: { [key: string]: string };
  state: State;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

function InquiryTraversalProvider({ children, id, preview }: InquiryProviderProps) {
  // Refs
  const formRef = useRef<{ [key: string]: string }>({});
  const graphRef = useRef<GraphManager | null>(null);
  const inquiryResponseIdRef = useRef<string | undefined>(undefined);
  const inquiryHistoryRef = useRef<string[]>([]);

  // Note: This is used to store the last prediction variables so that we can use them in the.
  //       We have to ignore the ESLint rule here because we can be storing any type of data.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastPredictionVariablesRef = useRef<any>();

  // States
  const [userDetails, setUserDetails] = useState<{ [key: string]: string }>({});
  const [state, setState] = useState<State>({
    loading: false,
    initialized: false,
    notFound: false,
    error: false,
  });
  const subscriptionId = useRef<string>(`inquiry_${Date.now()}`).current;

  // Event handlers

  /**
   * A callback that is triggered when a new prediction is received from the backend.
   */
  const onSubscriptionDataRef = useRef<(data: NodeData) => void>(() => {});

  /**
   * A callback that is triggered when a node is updated.
   */
  const onNodeUpdateRef = useRef<(node: OptimizedNode) => void>(() => {});

  /**
   * A callback that is triggered when an error occurs in the node.
   * This is used to handle errors in the node traversal process.
   * @param error {Error} The error that occurred
   * @returns {Promise<void>} A promise that resolves when the error is handled
   */
  const onNodeErrorRef = useRef<(error: Error) => void>(() => {});

  // Mutations and Apollo client
  const [addPrediction] = useMutation<AddPredictionMutation>(ADD_PREDICTION);
  const [createResponse] = useMutation<CreateInquiryResponseMutation>(CREATE_INQUIRY_RESPONSE);
  const [updateResponse] = useMutation<UpdateInquiryResponseMutation>(UPDATE_INQUIRY_RESPONSE);
  const client = useApolloClient();

  /**
   * Fetches the data object on mount when an ID is provided.
   * Will automatically start the inquiry process.
   */
  useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    onCompleted: ({ getInquiry }) => {
      if (!getInquiry) {
        setState({ ...INITIAL_STATE, notFound: true });
        return;
      }

      const { graph, draftGraph, form } = getInquiry.data;
      const usedGraph = preview ? draftGraph : graph;

      if (usedGraph) {
        formRef.current = form;
        graphRef.current = new GraphManager(usedGraph);
        setState({ ...INITIAL_STATE, initialized: true });
      } else {
        setState({ ...INITIAL_STATE, notFound: true });
      }
    },
    onError: () => {
      setState({ ...INITIAL_STATE, notFound: true });
    },
  });

  /**
   * Subscribes to the predictionAdded subscription.
   * When a result from a prediction is received, it will trigger the onSubscriptionData callback.
   */
  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId },
    onData: ({ data: subscriptionData }) => {
      try {
        const prediction = subscriptionData.data?.predictionAdded;

        if (prediction?.type === PredictionType.Success) {
          setState((prev) => ({ ...prev, loading: false }));

          const result = JSON.parse(prediction.result);
          const content = parseMarkdownCodeBlocks(result[0]);

          if (onSubscriptionDataRef.current) {
            onSubscriptionDataRef.current(content);
          }
        } else if (prediction?.type === PredictionType.Error) {
          setState((prev) => ({ ...prev, loading: false, error: true }));
          handleError(new Error(`An error occurred on our end, please try again later.`), false);
        }
      } catch (e) {
        setState((prev) => ({ ...prev, loading: true }));

        if (e instanceof Error) {
          handleError(e);
        }
      }
    },
    onError: (e) => {
      setState((prev) => ({ ...prev, loading: true }));
      handleError(e);
    },
  });

  /**
   * Handles moving to the next node.
   * @param {HandleNextNodeProps} props - The next node ID and data to pass to the next node.
   * @returns {Promise<void>} A promise that resolves when the next node is visited
   */
  async function handleNextNode({ nextNodeId, data }: HandleNextNodeProps = {}) {
    if (!graphRef.current) return;
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // TODO: Simplify this
      const carryOverData = graphRef.current.getCurrentNode()?.data;
      await graphRef.current.updateCurrentNodeData({ response: data, ...carryOverData });

      const validNode = await graphRef.current.goToNextNode(nextNodeId);

      if (!validNode) {
        handleError(
          new Error(
            [
              `A node with the ID ${nextNodeId} was not found.`,
              `The valid reachable nodes are: ${graphRef.current
                .getOutgoingNodes()
                .map((node) => node.id)
                .join(', ')}`,
            ].join('\n'),
          ),
        );
      }

      if (preview) {
        console.log('Preview mode, not saving response');
        return;
      }

      if (!inquiryResponseIdRef.current) {
        const result = await createResponse({
          variables: {
            inquiryId: id,
            data: {
              userDetails,
              history: graphRef.current.getNodeHistory(),
            },
          },
        });
        inquiryResponseIdRef.current = result.data?.upsertInquiryResponse.id;
      } else if (inquiryResponseIdRef.current) {
        await updateResponse({
          variables: {
            id: inquiryResponseIdRef.current,
            inquiryId: id,
            data: {
              history: graphRef.current.getNodeHistory(),
            },
            fields: ['history'],
          },
        });
      }
    } catch (error) {
      console.error('Error in handleNextNode:', error);
      setState((prev) => ({ ...prev, error: true }));
    }
  }

  /**
   * Handles an error that occurs during the node traversal process.
   * Optionally, it can retry the process if the retry flag is set to true.
   * @param error
   * @param retry
   */
  async function handleError(error: Error, retry = true) {
    if (onNodeErrorRef.current) {
      onNodeErrorRef.current(error);
    }

    if (retry) {
      await addPrediction({
        variables: {
          ...lastPredictionVariablesRef.current,
          input: {
            ...(lastPredictionVariablesRef.current?.input ?? {}),
            errorHandling: error?.message || 'An error occurred,  please identify and resolve the issue.',
          },
        },
      });
    }
  }

  /**
   * Handles when a new node is visited.
   * @param node {OptimizedNode} The node that was visited
   * @returns {Promise<void>} A promise that resolves when the node is visited
   */
  const handleOnNodeVisit = async (node: OptimizedNode) => {
    if (node.data?.dynamicGeneration) {
      await handleDynamicGeneration();
    } else if (node.type === 'condition') {
      await handleConditionNode();
    } else if (onNodeUpdateRef.current) {
      setState((prev) => ({ ...prev, loading: false }));
      onNodeUpdateRef.current(node);
    }
  };

  /**
   * Handles visiting a node with dynamic generation.
   * Here, we will send a prediction to the backend to generate dynamic content that is then placed
   * on the node. A callback is triggered at the end to notify subscribers of the new node data.
   * @returns {Promise<void>} A promise that resolves when the dynamic generation is complete
   */
  const handleDynamicGeneration = async (): Promise<void> => {
    // Base Case 1: The graph manager is initialized.
    if (!graphRef.current) return;

    // Base Case 2: The current node is defined (may be the case if the graph is empty).
    const currentNode = graphRef.current.getCurrentNode();
    if (!currentNode) return;

    const agentId = await getAgentIdByName(
      `Dynamic ${currentNode.type === 'question' ? 'Question' : 'Information'} Generation`,
      client,
    );
    const mostRecentMessage = inquiryHistoryRef.current[inquiryHistoryRef.current.length - 1];

    // TODO: Clean this up
    lastPredictionVariablesRef.current = {
      subscriptionId,
      agentId,
      input: {
        userMessage: currentNode.data.text,
        userDetails: `Name: ${userDetails.name}`,
        conversationHistory: inquiryHistoryRef.current.join('\n\n'),
        mostRecentMessage,
      },
    };
    await addPrediction({
      variables: lastPredictionVariablesRef.current,
    });

    onSubscriptionDataRef.current = (result) => {
      if (currentNode) {
        currentNode.data = { ...currentNode.data, ...result };
      }
      if (onNodeUpdateRef.current) {
        onNodeUpdateRef.current(currentNode);
      }
    };
  };

  const handleConditionNode = async () => {
    // Base Case 1: The graph manager is initialized.
    if (!graphRef.current) return;

    const agentId = await getAgentIdByName('Condition Node', client);
    const mostRecentMessage = inquiryHistoryRef.current[inquiryHistoryRef.current.length - 1] || '';

    // TODO: Clean this up
    lastPredictionVariablesRef.current = {
      subscriptionId,
      agentId,
      input: {
        userMessage: [
          `The instruction is: ${graphRef.current.getCurrentNode()?.data.text}`,

          // TODO: Remove this so that user can't provide invalid nodes.
          `The valid reachable nodes are: ${graphRef.current
            .getOutgoingNodes()
            .map((node) => node.id)
            .join(', ')}`,
        ].join('\n\n'),
        conversationHistory: inquiryHistoryRef.current.join('\n\n'),
        mostRecentMessage,
      },
    };
    await addPrediction({
      variables: lastPredictionVariablesRef.current,
    });

    onSubscriptionDataRef.current = (result) => {
      handleNextNode({
        nextNodeId: result.nextNodeId as string,
        data: result,
      });
    };
  };

  /**
   * Converts the node history into a readable conversation format
   * @returns {string} A stringified version of the conversation history
   */
  const addNodeToHistory = (node: OptimizedNode) => {
    if (!node.data) return;

    const { type, data } = node as { type: string; data: { [key: string]: { [key: string]: string } } };
    let conversation = '';

    if (type === 'information') {
      if (data.text) {
        conversation = `Bot: ${data.text}`;
      }
    } else if (type === 'question') {
      const parts = [
        data.ratings && `Bot created ratings: ${JSON.stringify(data.ratings)} \n`,
        data.text && `Bot: ${data.text} \n`,
        data.response?.ratings && `User selected ratings: ${JSON.stringify(data.response.ratings)} \n`,
        data.response?.text && `User: ${data.response.text} \n`,
      ].filter(Boolean);

      conversation = parts.join('\n');
    }

    if (conversation) {
      inquiryHistoryRef.current.push(conversation);
    }
  };

  useEffect(() => {
    if (!graphRef.current) return;
    graphRef.current.onNodeVisit = handleOnNodeVisit;
    graphRef.current.onNodeAddedToHistory = addNodeToHistory;
  }, [handleOnNodeVisit, addNodeToHistory]);

  const contextValue: InquiryContextType = {
    id,
    preview,

    graph: graphRef.current,

    onNodeUpdate: (callback: (node: OptimizedNode) => void) => {
      onNodeUpdateRef.current = callback;
    },
    onNodeError: (callback: (error: Error) => void) => {
      onNodeErrorRef.current = callback;
    },
    handleNextNode,

    userDetails,
    setUserDetails,

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

export { InquiryTraversalProvider, useInquiry };
