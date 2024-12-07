import {
  ADD_PREDICTION,
  CREATE_INQUIRY,
  DELETE_INQUIRY,
  DELETE_MEDIA_ASSET,
  UPDATE_INQUIRY,
} from '@/clients/mutations';
import { GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import {
  AddPredictionMutation,
  CreateInquiryMutation,
  DeleteInquiryMutation,
  DeleteMediaAssetMutation,
  GetInquiryQuery,
  PredictionAddedSubscription,
  PredictionType,
  UpdateInquiryMutation,
} from '@/graphql/graphql';
import { InquiryDataForm } from '@/graphql/types';
import { ImageMetadata } from '@/types/conversation';
import { getAgentIdByName } from '@/utils/agents';
import { applyGraphChangeset, formatGraph } from '@/utils/graphs/graph-utils';
import { parseCodeBlocks } from '@/utils/markdown';
import { removeDeletedImagesFromS3 } from '@/utils/s3';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Edge, Node, OnEdgesChange, OnNodesChange, useEdgesState, useNodesState } from '@xyflow/react';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface InquiryProviderProps {
  id?: string;
  children: React.ReactNode;
}

export interface Metadata {
  images: ImageMetadata[];
  text: string;
}

interface ContextType {
  initialized: boolean;

  id?: string;
  lastUpdated: Date;
  form: InquiryDataForm;
  metadata: Metadata;
  graph: { edges: Edge[]; nodes: Node[] };

  deleteInquiry: (onSuccess?: () => void, onError?: () => void) => Promise<void>;

  updateForm: (form: InquiryDataForm) => void;
  updateMetadata: (metadata: Metadata) => void;
  saveMetadata: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;
  saveForm: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  updateGraph: (graph: { nodes: Node[]; edges: Edge[] }) => void;
  updateGraphNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  updateGraphEdges: React.Dispatch<React.SetStateAction<Edge[]>>;

  resetGraph: () => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  saveGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;
  publishGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  save: (
    data: { form?: InquiryDataForm; metadata?: Metadata; graph?: { nodes: Node[]; edges: Edge[] } },
    fields: string[],
    onSuccess?: (id: string) => void,
    onError?: () => void,
  ) => Promise<void>;

  saveFormAndGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  generatingGraph: boolean;
  generateGraph: (templateOverride: boolean, message: string) => void;

  onGraphGenerationStarted: (callback: (message: string) => void) => void;
  onGraphGenerationCompleted: (callback: (message: string) => void) => void;
  onGraphGenerationError: (callback: () => void) => void;
}

const InquiryContext = createContext<ContextType | undefined>(undefined);

function InquiryBuilderProvider({ id, children }: InquiryProviderProps) {
  // States
  const [initialized, setInitialized] = useState(false);
  const [subscriptionId] = useState<string>(uuidv4());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [form, updateForm] = useState<InquiryDataForm>({
    title: 'Untitled Inquiry',
    goals: '',
  } as InquiryDataForm);
  const [metadata, setMetadata] = useState<Metadata>({
    images: [],
    text: '',
  });

  // Graph Generation States
  const [generatingGraph, setGeneratingGraph] = useState(false);
  const [pendingGraph, setPendingGraph] = useState(false);
  const [explanation, setExplanation] = useState<string>('');

  // Hooks
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Memoized graph object
  const graph = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  // Events
  const onGraphGenerationStartedRef = useRef<(message: string) => void>();
  const onGraphGenerationCompletedRef = useRef<(message: string) => void>();
  const onGraphGenerationErrorRef = useRef<() => void>();

  /**
   * Fetches the inquiry data from the server.
   */
  useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    skip: !id,
    onCompleted: ({ getInquiry }) => {
      if (!getInquiry) return;
      setLastUpdated(new Date(getInquiry.updatedAt));
      if (getInquiry.data.form) updateForm(getInquiry.data.form);
      if (getInquiry.data.metadata) setMetadata(getInquiry.data.metadata);
      if (getInquiry.data.draftGraph) updateGraph(getInquiry.data.draftGraph);
      setInitialized(true);
    },
  });

  /**
   * Subscribes to the prediction added subscription to get the generated graph.
   */
  useSubscription<PredictionAddedSubscription>(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId },
    onData: ({ data: subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;
      try {
        if (prediction?.type === PredictionType.Success) {
          // Node: The prediction result is always present when the type is success.
          const result = JSON.parse(prediction.result!)[0];
          const matches = parseCodeBlocks(result, ['json', 'markdown']);

          const changeset = JSON.parse(matches['json'] as string);
          const newGraph = applyGraphChangeset(graph, changeset);

          setExplanation(matches['markdown'] as string);
          updateGraph(formatGraph(newGraph));

          setGeneratingGraph(false);
          setPendingGraph(true);
        } else if (prediction?.type === PredictionType.Error) {
          onGraphGenerationErrorRef.current?.();
          setGeneratingGraph(false);
        }
      } catch {
        onGraphGenerationErrorRef.current?.();
        setGeneratingGraph(false);
      }
    },
    onError: () => {
      setGeneratingGraph(false);
      onGraphGenerationErrorRef.current?.();
    },
  });

  useEffect(() => {
    if (pendingGraph) {
      onGraphGenerationCompletedRef.current?.(explanation);
      setPendingGraph(false);
    }
  }, [pendingGraph]);

  // Mutations
  const client = useApolloClient();
  const [createFormMutation] = useMutation<CreateInquiryMutation>(CREATE_INQUIRY);
  const [updateFormMutation] = useMutation<UpdateInquiryMutation>(UPDATE_INQUIRY);
  const [addPrediction] = useMutation<AddPredictionMutation>(ADD_PREDICTION);
  const [deleteObject] = useMutation<DeleteInquiryMutation>(DELETE_INQUIRY);
  const [deleteMediaAsset] = useMutation<DeleteMediaAssetMutation>(DELETE_MEDIA_ASSET);

  /**
   * Deletes the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const deleteInquiry = async (onSuccess?: () => void, onError?: () => void) => {
    try {
      const images = metadata.images ?? [];
      await Promise.all(images.map(async (image) => await deleteMediaAsset({ variables: { id: image.id } })));

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
    data: {
      form?: InquiryDataForm;
      metadata?: Metadata;
      graph?: { nodes: Node[]; edges: Edge[] };
      draftGraph?: { nodes: Node[]; edges: Edge[] };
    },
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
        form,
      },
      ['form'],
      onSuccess,
      onError,
    );
  };

  /**
   * Saves the form of the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const saveMetadata = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    await save(
      {
        metadata: {
          ...metadata,
        },
      },
      ['metadata'],
      onSuccess,
      onError,
    );
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
    await save({ draftGraph: graph }, ['draftGraph'], onSuccess, onError);
  };

  /**
   * Publishes a graph for public consumption.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const publishGraph = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    removeDeletedImagesFromS3({
      nodes: graph.nodes,
      metadata,
      setMetadata,
      deleteImage: async (id: string) => {
        await deleteMediaAsset({ variables: { id } });
      },
    });
    await save({ graph }, ['graph'], onSuccess, onError);
  };

  /**
   * Saves both the form and graph of the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const saveAll = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    await save(
      {
        metadata: {
          ...metadata,
        },
        form,
        draftGraph: graph,
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
  const generateGraph = async (templateOverride: boolean, message: string) => {
    setGeneratingGraph(true);
    let userMessage;
    const agentId = await getAgentIdByName('Graph Edit Agent', client);

    if (templateOverride) {
      userMessage = [
        `You are generating a graph for ${form.title}`,
        `The following is personal information about the user <personalInfo>${message}</personalInfo>`,
        `Taking the exact graph structure in <conversationGraph>, adapt the graph to include the <personalInfo> listed above. Simply upsert information node "provideResponse" and open-ended question node "askQuestion" with as much information about the user as possible. The content should be identical in these two nodes. Note, we are NOT doing the typical thing of providing an instruction, rather we are dumping as much information as possible into the nodes.`,
      ].join('\n');
    } else {
      userMessage = [
        `You are updating a graph for <title>${form.title}</title>`,
        `The user is looking for the following goals to be completed in this update: <goals>${message}</goals>`,
        `Ensure the updates or new structure aligns with the user's goals, is relevant to the content in <conversationGraph>, and adheres to the <graphRules>.`,
      ].join('\n');
    }

    onGraphGenerationStartedRef.current?.(message);

    addPrediction({
      variables: {
        subscriptionId,
        agentId,
        input: {
          userMessage,
          conversationGraph: JSON.stringify(graph),
        },
      },
    });
  };

  const contextValue = {
    initialized,

    id,
    lastUpdated,
    form,
    metadata,
    graph,

    deleteInquiry,

    updateForm,
    saveForm,

    updateMetadata: setMetadata,
    saveMetadata,

    updateGraph,
    updateGraphNodes: setNodes,
    updateGraphEdges: setEdges,

    resetGraph,

    onNodesChange,
    onEdgesChange,
    saveGraph,
    publishGraph,

    save,
    saveFormAndGraph: saveAll,

    generatingGraph,

    generateGraph,
    onGraphGenerationCompleted: (callback: (message: string) => void) => {
      onGraphGenerationCompletedRef.current = callback;
    },
    onGraphGenerationStarted: (callback: (message: string) => void) => {
      onGraphGenerationStartedRef.current = callback;
    },
    onGraphGenerationError: (callback: () => void) => {
      onGraphGenerationErrorRef.current = callback;
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
