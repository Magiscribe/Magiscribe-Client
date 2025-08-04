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
import { InquiryResponseStatus, InquiryResponseUserDetails, InquirySettings } from '@/graphql/types';
import { getAgentIdByName } from '@/utils/agents';
import { NodeData, OptimizedNode } from '@/utils/graphs/graph';
import { GraphManager } from '@/utils/graphs/graph-manager';
import { parseMarkdownCodeBlocks } from '@/utils/markdown';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
  finished: boolean;
  notFound: boolean;
  error: boolean;
}

const INITIAL_STATE: State = {
  loading: false,
  initialized: false,
  finished: false,
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

  userDetails: InquiryResponseUserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<InquiryResponseUserDetails>>;

  settings: InquirySettings;
  state: State;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

function InquiryTraversalProvider({ children, id, preview }: InquiryProviderProps) {
  // Refs
  const settingsRef = useRef<InquirySettings>({} as InquirySettings);
  const graphRef = useRef<GraphManager | null>(null);
  const inquiryResponseIdRef = useRef<string | undefined>(undefined);
  // List of bot+user messages and responses
  const inquiryHistoryRef = useRef<string[]>([]);
  // Just the most recent response
  const mostRecentMessageRef = useRef<string>('');
  // We need two refs so that we can store the whole conversation, and extract the relevant last message

  // Note: This is used to store the last prediction variables so that we can use them in the.
  //       We have to ignore the ESLint rule here because we can be storing any type of data.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastPredictionVariablesRef = useRef<any>(null);

  // States
  const [userDetails, setUserDetails] = useState<InquiryResponseUserDetails>({});
  const [state, setState] = useState<State>({
    loading: false,
    initialized: false,
    finished: false,
    notFound: false,
    error: false,
  });
  const subscriptionId = useRef<string>(uuidv4()).current;

  // Track correlation IDs from integration node predictions
  const integrationCorrelationIds = useRef<Set<string>>(new Set());

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

      const { graph, draftGraph, settings } = getInquiry.data;
      const usedGraph = preview ? draftGraph : graph;

      if (usedGraph) {
        settingsRef.current = settings;
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

          // TODO: Resolve the match bug
          const result = JSON.parse(prediction.result);
          console.log('Received prediction result:', result);
          // If the parsed result is a nested json object or an array, convert it to a string
          // This is to ensure that the content is always a string for proper node traversal
          let content: {
            text: string;
          } = { text: '' };

          if (typeof result === 'string') {
            console.log('Received string result:', result);
            content = parseMarkdownCodeBlocks(result);
          } else if (Array.isArray(result)) {
            console.log('Received array result:', result);
            content = parseMarkdownCodeBlocks(result[0]);
            console.log('Parsed first item from array:', content);
          } else if (typeof result === 'object' && result !== null) {
            console.log('Received object result:', result);
            if ('text' in result && typeof result.text === 'string') {
              content = parseMarkdownCodeBlocks(result.text);
            } else {
              console.log('Received object with no text property:', result);
              content.text = JSON.stringify(result);
            }
          }

          // Always trigger the callback for proper node traversal
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

      // Case: If the condition node hallucinates, we will handle the error by passing it back to the
      //      backend to resolve the error and find the correct node to go to next.
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

      const isEndNode = graphRef.current.getCurrentNode()?.type === 'end';
      if (isEndNode) {
        setState((prev) => ({ ...prev, finished: true }));
      }

      if (!inquiryResponseIdRef.current) {
        const result = await createResponse({
          variables: {
            inquiryId: id,
            subscriptionId,
            data: {
              status: InquiryResponseStatus.Pending,
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
            subscriptionId,
            inquiryId: id,
            data: {
              status: isEndNode ? InquiryResponseStatus.Completed : InquiryResponseStatus.InProgress,
              history: graphRef.current.getNodeHistory(),
            },
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
          inquiryId: id, // Ensure inquiryId is included for token tracking
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
    } else if (node.type === 'integration') {
      console.log('Integration node visited:', node);
      await handleIntegrationNode();
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

    // TODO: Clean this up
    lastPredictionVariablesRef.current = {
      subscriptionId,
      agentId,
      inquiryId: id, // Always pass inquiryId for token tracking
      input: {
        userMessage: currentNode.data.text,
        context: settingsRef.current.context,
        userDetails: userDetails,
        conversationHistory: inquiryHistoryRef.current.join('\n\n'),
      },
    };
    await addPrediction({
      variables: {
        ...lastPredictionVariablesRef.current,
        inquiryId: id, // Pass inquiry ID for MCP support
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
  };

  const handleConditionNode = async () => {
    // Base Case 1: The graph manager is initialized.
    if (!graphRef.current) return;

    const agentId = await getAgentIdByName('Condition Node', client);

    // TODO: Clean this up
    lastPredictionVariablesRef.current = {
      subscriptionId,
      agentId,
      inquiryId: id, // Always pass inquiryId for token tracking
      input: {
        userMessage: [
          `The instruction is: ${JSON.stringify(graphRef.current.getCurrentNode()?.data.conditions)}`,

          // TODO: Remove this so that user can't provide invalid nodes.
          `The valid reachable nodes are: ${graphRef.current
            .getOutgoingNodes()
            .map((node) => node.id)
            .join(', ')}`,
        ].join('\n\n'),
        conversationHistory: inquiryHistoryRef.current.join('\n\n'),
        mostRecentMessage: mostRecentMessageRef.current,
      },
    };
    await addPrediction({
      variables: {
        ...lastPredictionVariablesRef.current,
        inquiryId: id, // Pass inquiry ID for MCP support
      },
    });

    onSubscriptionDataRef.current = (result) => {
      handleNextNode({
        nextNodeId: result.nextNodeId as string,
        data: result,
      });
    };
  };

  /**
   * Handles visiting an integration node.
   * This will execute the selected MCP integration tool via a prediction call.
   * @returns {Promise<void>} A promise that resolves when the integration execution is complete
   */
  const handleIntegrationNode = async (): Promise<void> => {
    // Base Case 1: The graph manager is initialized.
    if (!graphRef.current) return;

    // Base Case 2: The current node is defined
    const currentNode = graphRef.current.getCurrentNode();
    if (!currentNode) return;

    // Base Case 3: Check if integration is properly configured
    const { selectedIntegrationId, prompt } = currentNode.data;
    if (!selectedIntegrationId) {
      handleError(new Error('Integration node is not properly configured. Please contact support.'));
      return;
    }

    const agentId = await getAgentIdByName('Integration Generation', client);

    // Store prediction variables for error handling
    lastPredictionVariablesRef.current = {
      subscriptionId,
      agentId,
      input: {
        userMessage: prompt,
        context: settingsRef.current.context,
        userDetails: userDetails,
        conversationHistory: inquiryHistoryRef.current.join('\n\n'),
      },
    };

    const result = await addPrediction({
      variables: {
        ...lastPredictionVariablesRef.current,
        inquiryId: id, // Pass inquiry ID for MCP support
        integrationId: selectedIntegrationId, // Pass the integration ID
      },
    });

    // Store the correlation ID to track that this prediction is from an integration node
    const correlationId = result.data?.addPrediction?.correlationId;
    if (correlationId) {
      integrationCorrelationIds.current.add(correlationId);
    }

    onSubscriptionDataRef.current = (predictionResult) => {
      // Update the current node with the integration result
      if (currentNode) {
        currentNode.data = { ...currentNode.data, integrationResult: predictionResult.text };
      }

      setState((prev) => ({ ...prev, loading: false }));

      // Add integration result to conversation history but don't show it to user
      inquiryHistoryRef.current.push(`AI Integration Result: ${predictionResult.text}`);

      // Notify subscribers of the updated node
      if (onNodeUpdateRef.current) {
        onNodeUpdateRef.current(currentNode);
      }

      // Move to the next node in the graph after successful integration execution
      const outgoingNodes = graphRef.current?.getOutgoingNodes() || [];
      if (outgoingNodes.length > 0) {
        handleNextNode({
          nextNodeId: outgoingNodes[0].id,
          data: { message: predictionResult.text },
        });
      }
    };
  };

  const messageCounterRef = useRef<number>(1);
  /**
   * Converts the node history into a readable conversation format
   * @returns {string} A stringified version of the conversation history
   */
  const addNodeToHistory = (node: OptimizedNode) => {
    if (!node.data) return;

    const { type, data } = node as { type: string; data: { [key: string]: { [key: string]: string } } };
    const messageParts: string[] = [];

    // Process conversion data, number the messages and prepend "Bot:" and "User:"
    // to messages to help future LLM calls distinguish between them
    // Helps with conditions such as "If the bot has the most recent message, go to abcd" which prevents doom loops
    if (type === 'information') {
      if (data.text) {
        const message = `${messageCounterRef.current}. Bot: ${data.text}`;
        messageParts.push(message);
        mostRecentMessageRef.current = message;
        messageCounterRef.current++;
      }
    } else if (type === 'question') {
      // Group bot message and ratings together
      let botMessage = `${messageCounterRef.current}. Bot: ${data.text || ''}`;
      if (data.ratings) {
        botMessage += ` Bot created ratings: ${JSON.stringify(data.ratings)}`;
      }
      messageParts.push(botMessage);
      mostRecentMessageRef.current = botMessage;
      messageCounterRef.current++;

      // Group user message and ratings together if they exist
      if (data.response?.text || data.response?.ratings) {
        let userMessage = `${messageCounterRef.current}. User: ${data.response.text || ''}`;
        if (data.response.ratings) {
          userMessage += ` User selected ratings: ${JSON.stringify(data.response.ratings)}`;
        }
        messageParts.push(userMessage);
        mostRecentMessageRef.current = userMessage;
        messageCounterRef.current++;
      }
    }

    const conversation = messageParts.join('\n');

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

    settings: settingsRef.current,
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
