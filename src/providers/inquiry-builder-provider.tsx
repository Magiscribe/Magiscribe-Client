import { ADD_PREDICTION, CREATE_INQUIRY, DELETE_INQUIRY, UPDATE_INQUIRY } from '@/clients/mutations';
import { GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import {
  AddPredictionMutation,
  CreateInquiryMutation,
  DeleteInquiryMutation,
  GetInquiryQuery,
  UpdateInquiryMutation,
} from '@/graphql/graphql';
import { getAgentIdByName } from '@/utils/agents';
import { createGraph, formatGraph } from '@/utils/graphs/graph-utils';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Edge, Node, OnEdgesChange, OnNodesChange, useEdgesState, useNodesState } from '@xyflow/react';
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface InquiryProviderProps {
  id?: string;
  children: React.ReactNode;
}

export interface FormData {
  title: string;
  description: string;
  goals: string;
}

const DEFAULT_GRAPH = { nodes: [{ id: '0', type: 'start', position: { x: 0, y: 0 }, data: {} }], edges: [] };

interface ContextType {
  initialized: boolean;

  id?: string;
  lastUpdated: Date;
  form: FormData;
  graph: { edges: Edge[]; nodes: Node[] };

  deleteInquiry: (onSuccess?: () => void, onError?: () => void) => Promise<void>;

  updateForm: (form: FormData) => void;
  saveForm: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  updateGraph: (graph: { nodes: Node[]; edges: Edge[] }) => void;
  updateGraphNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  updateGraphEdges: React.Dispatch<React.SetStateAction<Edge[]>>;

  resetGraph: () => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  saveGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  generatingGraph: boolean;
  generateGraph: () => void;
  onGraphGenerated?: (callback: () => void) => void;
}

const InquiryContext = createContext<ContextType | undefined>(undefined);

function InquiryBuilderProvider({ id, children }: InquiryProviderProps) {
  // States
  const [initialized, setInitialized] = useState(false);
  const [subscriptionId] = useState<string>(uuidv4());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [form, updateForm] = useState<FormData>({} as FormData);
  const [generatingGraph, setGeneratingGraph] = useState(false);

  // Hooks
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Memoized graph object
  const graph = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  // Events
  const onGraphGeneratedRef = useRef<() => void>();

  /**
   * Fetches the inquiry data from the server.
   */
  useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    skip: !id,
    onCompleted: ({ getInquiry }) => {
      if (!getInquiry) return;
      setLastUpdated(new Date(getInquiry.updatedAt));
      updateForm(getInquiry.data.form);
      updateGraph(getInquiry.data.graph ?? DEFAULT_GRAPH);
      setInitialized(true);
    },
  });

  /**
   * Subscribes to the prediction added subscription to get the generated graph.
   */
  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;
      if (prediction?.type === 'SUCCESS') {
        setGeneratingGraph(false);
        const graph = createGraph(JSON.parse(JSON.parse(prediction.result)));
        updateGraph(formatGraph(graph, true));
        if (onGraphGeneratedRef.current) onGraphGeneratedRef.current();
      }
    },
    onError: () => setGeneratingGraph(false),
  });

  // Mutations
  const client = useApolloClient();
  const [createFormMutation] = useMutation<CreateInquiryMutation>(CREATE_INQUIRY);
  const [updateFormMutation] = useMutation<UpdateInquiryMutation>(UPDATE_INQUIRY);
  const [addPrediction] = useMutation<AddPredictionMutation>(ADD_PREDICTION);
  const [deleteObject] = useMutation<DeleteInquiryMutation>(DELETE_INQUIRY);

  /**
   * Deletes the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const deleteInquiry = async (onSuccess?: () => void, onError?: () => void) => {
    try {
      await deleteObject({ variables: { id } });
      if (onSuccess) onSuccess();
    } catch {
      if (onError) onError();
    }
  };

  /**
   * Saves the form of the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const saveForm = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    try {
      const func = id ? updateFormMutation : createFormMutation;
      const result = await func({
        variables: {
          id,
          data: {
            form: {
              ...form,

              // Default title if not provided.
              title: form.title ?? 'Untitled Form',
            },
          },
          fields: ['form'],
        },
      });
      if (onSuccess) onSuccess(result.data?.upsertInquiry.id as string);
    } catch {
      if (onError) onError();
    }
  };

  /**
   * Updates the graph of the inquiry.
   * @param graph {Object} The graph object to update.
   */
  const updateGraph = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    setNodes(nodes);
    setEdges(edges);
  };

  /**
   * Clears the graph and initializes it with a start node.
   */
  const resetGraph = () => {
    updateGraph({ nodes: [{ id: '0', type: 'start', position: { x: 0, y: 0 }, data: {} }], edges: [] });
  };

  /**
   * Saves the graph of the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const saveGraph = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    if (!initialized) {
      if (onError) onError();
      return;
    }

    try {
      const func = id ? updateFormMutation : createFormMutation;
      const result = await func({ variables: { id, data: { graph, fields: ['graph'] } } });

      if (result.data) {
        setLastUpdated(new Date(result.data.upsertInquiry.updatedAt));
        if (onSuccess) onSuccess(result.data.upsertInquiry.id as string);
      } else {
        throw new Error('Failed to save the graph.');
      }
    } catch {
      if (onError) onError();
    }
  };

  /**
   * Triggers the start of the graph generation process for the inquiry using
   * the graph generator agent.
   */
  const generateGraph = async () => {
    const agentId = await getAgentIdByName('Stakeholder | Graph Generator', client);
    setGeneratingGraph(true);

    addPrediction({
      variables: {
        subscriptionId,
        agentId,
        variables: {
          ...form,
          userMessage: [
            `You are generating a graph for ${form.title}`,
            `The user is looking for the following goals to be completed: ${form.goals}`,
          ].join('\n'),
        },
      },
    });
  };

  const contextValue = {
    initialized,

    id,
    lastUpdated,
    form,
    graph,

    deleteInquiry,

    updateForm,
    saveForm,

    updateGraph,
    updateGraphNodes: setNodes,
    updateGraphEdges: setEdges,

    resetGraph,

    onNodesChange,
    onEdgesChange,
    saveGraph,

    generatingGraph,
    generateGraph,
    onGraphGenerated: (callback: () => void) => {
      onGraphGeneratedRef.current = callback;
    },
  };

  return <InquiryContext.Provider value={contextValue}>{children}</InquiryContext.Provider>;
}

function useInquiryBuilder() {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error('useInquiryBuilder must be used within an InquiryBuilderProvider');
  }
  return context;
}

export { InquiryBuilderProvider, useInquiryBuilder };
