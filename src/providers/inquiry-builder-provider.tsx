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
import { applyGraphChangeset, formatGraph } from '@/utils/graphs/graph-utils';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Edge, Node, OnEdgesChange, OnNodesChange, useEdgesState, useNodesState } from '@xyflow/react';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

interface ContextType {
  initialized: boolean;

  id?: string;
  lastUpdated: Date;
  form: FormData;

  draftGraph: { edges: Edge[]; nodes: Node[] };

  deleteInquiry: (onSuccess?: () => void, onError?: () => void) => Promise<void>;

  updateForm: (form: FormData) => void;
  saveForm: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  updateGraph: (draftGraph: { nodes: Node[]; edges: Edge[] }) => void;
  updateGraphNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  updateGraphEdges: React.Dispatch<React.SetStateAction<Edge[]>>;

  resetGraph: () => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  saveGraph: (saveDraft?: boolean, onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  save: (
    data: { form?: FormData; graph?: { nodes: Node[]; edges: Edge[] } },
    fields: string[],
    onSuccess?: (id: string) => void,
    onError?: () => void,
  ) => Promise<void>;

  saveFormAndGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  generatingGraph: boolean;
  generateGraph: (templateOverride: boolean, message?: string) => void;
  onGraphGenerated: (callback: (message: string) => void) => void;
}

const InquiryContext = createContext<ContextType | undefined>(undefined);

function InquiryBuilderProvider({ id, children }: InquiryProviderProps) {
  // States
  const [initialized, setInitialized] = useState(false);
  const [subscriptionId] = useState<string>(uuidv4());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [form, updateForm] = useState<FormData>({} as FormData);

  // Graph Generation States
  const [generatingGraph, setGeneratingGraph] = useState(false);
  const [pendingGraph, setPendingGraph] = useState(false);
  const [explanation, setExplanation] = useState<string>('');

  // Hooks
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Memoized graph object
  const draftGraph = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  // Events
  const onGraphGeneratedRef = useRef<(message: string) => void>();

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
      if (getInquiry.data.draftGraph) updateGraph(getInquiry.data.draftGraph);
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
        const result = JSON.parse(prediction.result)[0];
        const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/);
        const markdownMatch = result.match(/```markdown\n([\s\S]*?)\n```/);
        const changeset = JSON.parse(jsonMatch[1]);
        const newGraph = applyGraphChangeset(draftGraph, changeset);

        setExplanation(markdownMatch[1]);
        updateGraph(formatGraph(newGraph));

        setGeneratingGraph(false);
        setPendingGraph(true);
      }
    },
    onError: () => setGeneratingGraph(false),
  });

  useEffect(() => {
    if (pendingGraph) {
      onGraphGeneratedRef.current?.(explanation);
      setPendingGraph(false);
    }
  }, [pendingGraph]);

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
   * Generic save function that can save both form and graph.
   * @param data {Object} The data to save (either form or graph).
   * @param fields {string[]} The fields to update.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const save = async (
    data: { form?: FormData; graph?: { nodes: Node[]; edges: Edge[] }; draftGraph?: { nodes: Node[]; edges: Edge[] } },
    fields: string[],
    onSuccess?: (id: string) => void,
    onError?: () => void,
  ) => {
    if (!initialized && !data.form) {
      if (onError) onError();
      return;
    }

    try {
      const func = id ? updateFormMutation : createFormMutation;
      const result = await func({ variables: { id, data, fields } });

      if (result.data) {
        setLastUpdated(new Date(result.data.upsertInquiry.updatedAt));
        if (onSuccess) onSuccess(result.data.upsertInquiry.id as string);
      } else {
        throw new Error('Failed to save the data.');
      }
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
    await save(
      {
        form: {
          ...form,
          // Default title if not provided.
          title: form.title ?? 'Untitled Form',
        },
      },
      ['form'],
      onSuccess,
      onError,
    );
  };

  /**
   * Updates the graph of the inquiry.
   * @param draftGraph {Object} The graph object to update.
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
  const saveGraph = async (saveDraft?: boolean, onSuccess?: (id: string) => void, onError?: () => void) => {
    if (saveDraft) {
      await save({ draftGraph }, ['draftGraph'], onSuccess, onError);
    } else {
      await save({ graph: draftGraph }, ['graph'], onSuccess, onError);
    }
  };

  /**
   * Saves both the form and graph of the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const saveFormAndGraph = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    await save(
      {
        form: {
          ...form,
          // Default title if not provided.
          title: form.title ?? 'Untitled Form',
        },
        draftGraph,
      },
      ['form', 'draftGraph'],
      onSuccess,
      onError,
    );
  };

  /**
   * Triggers the start of the graph generation process for the inquiry using
   * the graph generator agent.
   */
  const generateGraph = async (templateOverride: boolean, message?: string) => {
    setGeneratingGraph(true);
    let userMessage;
    const agentId = await getAgentIdByName('Stakeholder | Graph Edit Agent (Sonnet)', client);

    if (templateOverride) {
      userMessage = [
        `You are generating a graph for <title>${form.title}</title>`,
        `The user is looking for the following goals to be completed: <goals>${form.goals}</goals>`,
        `Taking the exact graph structure in <conversationGraph>, adapt the graph to be about the <goals> listed above. Simply upsert all of the existing nodes, do not remove any nodes, add any new nodes or add or remove any edges. Simply return the "nodesToUpsert". Absolutey do NOT include "nodesToDelete", "edgesToAdd" or "edgesToDelete". You will ONLY be using the existing nodes and overriding them.`,
      ].join('\n');
    } else {
      userMessage = [
        `You are updating a graph for <title>${form.title}</title>`,
        `The user is looking for the following goals to be completed in this update: <goals>${message}</goals>`,
        `Ensure the updates or new structure aligns with the user's goals, is relevant to the content in <conversationGraph>, and adheres to the <graphRules>.`,
      ].join('\n');
    }

    addPrediction({
      variables: {
        subscriptionId,
        agentId,
        variables: {
          userMessage,
          conversationGraph: JSON.stringify(draftGraph),
        },
      },
    });
  };

  const contextValue = {
    initialized,

    id,
    lastUpdated,
    form,
    draftGraph,

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

    save,
    saveFormAndGraph,

    generatingGraph,

    generateGraph,
    onGraphGenerated: (callback: (message: string) => void) => {
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
