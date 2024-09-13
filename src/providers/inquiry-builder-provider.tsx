import { ADD_PREDICTION, CREATE_INQUIRY, DELETE_INQUIRY, UPDATE_INQUIRY } from '@/clients/mutations';
import { GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import useReactFlowGraph from '@/hooks/graph';
import { getAgentIdByName } from '@/utils/agents';
import { createGraph, formatGraph } from '@/utils/graphs/graph-utils';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Edge, Node, OnEdgesChange, OnNodesChange } from '@xyflow/react';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface InquiryProviderProps {
  id?: string;
  children: React.ReactNode;
}

export interface FormData {
  title: string;
  description: string;
  organizationName: string;
  inputGoals: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface Inquiry {
  id: string;
  data: {
    form: FormData;
    graph: GraphData;
  };
}

interface ContextType {
  id?: string;
  form: FormData;
  graph: { edges: Edge[]; nodes: Node[] };

  deleteInquiry: (onSuccess?: () => void, onError?: () => void) => Promise<void>;

  updateForm: (form: FormData) => void;
  saveForm: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  updateGraph: (graph: { nodes: Node[]; edges: Edge[] }) => void;
  updateGraphNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  updateGraphEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  saveGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  generatingGraph: boolean;
  generateGraph: () => void;
}

const InquiryContext = createContext<ContextType | undefined>(undefined);

function InquiryBuilderProvider({ id, children }: InquiryProviderProps) {
  // States
  const [subscriptionId] = useState<string>(uuidv4());
  const [form, updateForm] = useState<FormData>({} as FormData);
  const [generatingGraph, setGeneratingGraph] = useState(false);

  // Hooks
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } = useReactFlowGraph();

  // Memoized graph object
  const graph = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  /**
   * Fetches the inquiry data from the server.
   */
  useQuery(GET_INQUIRY, {
    variables: { id },
    skip: !id,
    onCompleted: ({ getInquiry }) => {
      updateForm(getInquiry.data.form);
      updateGraph(getInquiry.data.graph);
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
      }
    },
    onError: () => setGeneratingGraph(false),
  });

  // Mutations
  const client = useApolloClient();
  const [createFormMutation] = useMutation<{ upsertInquiry: Inquiry }>(CREATE_INQUIRY);
  const [updateFormMutation] = useMutation<{ upsertInquiry: Inquiry }>(UPDATE_INQUIRY);
  const [addPrediction] = useMutation(ADD_PREDICTION);
  const [deleteObject] = useMutation(DELETE_INQUIRY);

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
      const result = await func({ variables: { id, data: { form }, fields: ['form'] } });
      if (onSuccess) onSuccess(result.data?.upsertInquiry.id as string);
    } catch {
      if (onError) onError();
    }
  };

  /**
   * Updates the graph of the inquiry.
   * @param graph {Object} The graph object to update.
   */
  const updateGraph = (graph: GraphData) => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
  };

  /**
   * Saves the graph of the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const saveGraph = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    try {
      const func = id ? updateFormMutation : createFormMutation;
      const result = await func({ variables: { id, data: { graph, fields: ['graph'] } } });
      if (onSuccess) onSuccess(result.data?.upsertInquiry.id as string);
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
            `You are generating a graph for ${form.title} at the organization ${form.organizationName}.`,
            `The user is looking for the following goals to be completed: ${form.inputGoals}`,
          ].join('\n'),
        },
      },
    });
  };

  const contextValue = {
    id,
    form,
    graph,

    deleteInquiry,

    updateForm,
    saveForm,

    updateGraph,
    updateGraphNodes: setNodes,
    updateGraphEdges: setEdges,
    onNodesChange,
    onEdgesChange,
    saveGraph,

    generatingGraph,
    generateGraph,
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
