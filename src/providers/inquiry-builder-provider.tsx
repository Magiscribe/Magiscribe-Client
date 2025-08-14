import {
  ADD_PREDICTION,
  CREATE_INQUIRY,
  DELETE_INQUIRY,
  DELETE_MEDIA_ASSET,
  UPDATE_INQUIRY,
  UPDATE_INQUIRY_OWNERS,
} from '@/clients/mutations';
import { GET_INQUIRY, GET_INQUIRY_INTEGRATIONS } from '@/clients/queries';
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
  UpdateInquiryOwnersMutation,
  UserDataInput,
} from '@/graphql/graphql';
import { InquirySettings } from '@/graphql/types';
import { useGraphContext } from '@/hooks/graph-state';
import { ImageMetadata } from '@/types/conversation';
import { getAgentIdByName } from '@/utils/agents';
import { applyGraphChangeset, formatGraph } from '@/utils/graphs/graph-utils';
import { parseCodeBlocks } from '@/utils/markdown';
import { removeDeletedImagesFromS3 } from '@/utils/s3';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Edge, Node } from '@xyflow/react';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface InquiryProviderProps {
  id?: string;
  children: React.ReactNode;
}

export interface Metadata {
  images: ImageMetadata[];
  text: string;
  inviteList: UserDataInput[];
}

interface ContextType {
  initialized: boolean;

  id?: string;
  lastUpdated: Date;
  settings: InquirySettings;
  metadata: Metadata;
  owners: string[];
  graph: { edges: Edge[]; nodes: Node[] };

  deleteInquiry: (onSuccess?: () => void, onError?: () => void) => Promise<void>;

  setSettings: (settings: InquirySettings) => void;
  updateMetadata: (metadata: Metadata) => void;
  updateOwners: (owners: string[]) => void;
  saveMetadata: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;
  saveSettings: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;
  saveOwners: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

  setGraph: (graph: { edges: Edge[]; nodes: Node[] }) => void;
  saveGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;
  publishGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;
  refreshGraph: () => void;

  save: (
    data: { settings?: InquirySettings; metadata?: Metadata; graph?: { nodes: Node[]; edges: Edge[] } },
    fields: string[],
    onSuccess?: (id: string) => void,
    onError?: () => void,
  ) => Promise<void>;

  saveSettingsAndGraph: (onSuccess?: (id: string) => void, onError?: () => void) => Promise<void>;

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
  const [settings, setSettings] = useState<InquirySettings>({
    title: 'Untitled Inquiry',
    goals: '',
  } as InquirySettings);
  const [metadata, setMetadata] = useState<Metadata>({
    images: [],
    text: '',
    inviteList: [],
  });

  const [owners, setOwners] = useState<string[]>([]);

  // Graph Generation States
  const [generatingGraph, setGeneratingGraph] = useState(false);
  const [pendingGraph, setPendingGraph] = useState(false);
  const [explanation, setExplanation] = useState<string>('');

  // Hooks
  const graphContext = useGraphContext();
  const { graph, setGraph, resetInitialState } = graphContext;

  // Events
  const onGraphGenerationStartedRef = useRef<(message: string) => void>(() => {});
  const onGraphGenerationCompletedRef = useRef<(message: string) => void>(() => {});
  const onGraphGenerationErrorRef = useRef<() => void>(() => {});

  /**
   * Fetches the inquiry data from the server.
   */
  useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    skip: !id,
    onCompleted: ({ getInquiry }) => {
      if (!getInquiry) return;
      setLastUpdated(new Date(getInquiry.updatedAt));
      if (getInquiry.data.settings) setSettings(getInquiry.data.settings);
      if (getInquiry.data.metadata) setMetadata(getInquiry.data.metadata);
      if (getInquiry.data.draftGraph) setGraph(getInquiry.data.draftGraph);
      if (getInquiry.data.draftGraph) resetInitialState(getInquiry.data.draftGraph);
      if (getInquiry.userId) setOwners(getInquiry.userId);
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
          setGraph(formatGraph(newGraph));

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
  const [createInquiryMutation] = useMutation<CreateInquiryMutation>(CREATE_INQUIRY);
  const [updateInquiryMutation] = useMutation<UpdateInquiryMutation>(UPDATE_INQUIRY);
  const [addPrediction] = useMutation<AddPredictionMutation>(ADD_PREDICTION);
  const [deleteObject] = useMutation<DeleteInquiryMutation>(DELETE_INQUIRY);
  const [deleteMediaAsset] = useMutation<DeleteMediaAssetMutation>(DELETE_MEDIA_ASSET);
  const [updateInquiryOwners] = useMutation<UpdateInquiryOwnersMutation>(UPDATE_INQUIRY_OWNERS);

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
   * Generic save function that can save both settings and graph.
   * @param data {Object} The data to save (either settings or graph).
   * @param fields {string[]} The fields to update.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const save = async (
    data: {
      settings?: InquirySettings;
      userId?: string[];
      metadata?: Metadata;
      graph?: { nodes: Node[]; edges: Edge[] };
      draftGraph?: { nodes: Node[]; edges: Edge[] };
    },
    fields: string[],
    onSuccess?: (id: string) => void,
    onError?: () => void,
  ) => {
    if (!initialized && !data.settings) {
      if (onError) onError();
      return;
    }

    try {
      const func = id ? updateInquiryMutation : createInquiryMutation;
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
   * Saves the settings of the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const saveSettings = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    await save(
      {
        settings,
      },
      ['settings'],
      onSuccess,
      onError,
    );
  };

  /**
   * Saves the settings of the inquiry.
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

  const saveOwners = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    try {
      await updateInquiryOwners({
        variables: {
          id,
          owners,
        },
      });
      if (onSuccess) onSuccess(id as string);
    } catch {
      if (onError) onError();
    }
  };

  /**
   * Clears the graph and initializes it with a start node.
   */
  const resetGraph = () => {
    setGraph({ nodes: [{ id: '0', type: 'start', position: { x: 0, y: 0 }, data: {} }], edges: [] });
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
   * Saves both the settings and graph of the inquiry.
   * @param onSuccess {Function} The function to call on success.
   * @param onError {Function} The function to call on error.
   */
  const saveAll = async (onSuccess?: (id: string) => void, onError?: () => void) => {
    await save(
      {
        metadata: {
          ...metadata,
        },
        settings,
        draftGraph: graph,
      },
      ['settings', 'draftGraph'],
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
        `You are generating a graph for <title>${settings.title}</title>`,
        `The user is looking for the following goals to be completed: <goals>${message}</goals>`,
        `Taking the exact graph structure in <conversationGraph>, adapt the graph to be about the <goals> listed above. Simply upsert all of the existing nodes, do not remove any nodes, add any new nodes or add or remove any edges. Simply return the "nodesToUpsert". Absolutey do NOT include "nodesToDelete", "edgesToAdd" or "edgesToDelete". You will ONLY be using the existing nodes and overriding them.`,
      ].join('\n');
    } else {
      userMessage = [
        `You are updating a graph for <title>${settings.title}</title>`,
        `The user is looking for the following goals to be completed in this update: <goals>${message}</goals>`,
        `Ensure the updates or new structure aligns with the user's goals, is relevant to the content in <conversationGraph>, and adheres to the <graphRules>.`,
      ].join('\n');
    }

    onGraphGenerationStartedRef.current?.(message);

    addPrediction({
      variables: {
        subscriptionId,
        agentId,
        inquiryId: id,
        input: {
          userMessage,
          conversationGraph: JSON.stringify(graph),
        },
      },
    });
  };

  /**
   * Refreshes the graph to update integration nodes with latest available integrations.
   * This is useful when new integrations are added and need to be reflected in the graph.
   */
  const refreshGraph = () => {
    // Refetch the integrations query to update all integration nodes
    if (id) {
      client.refetchQueries({
        include: [GET_INQUIRY_INTEGRATIONS],
      });
    }
  };

  const contextValue = {
    initialized,

    id,
    lastUpdated,
    settings,
    metadata,
    owners,
    graph,

    deleteInquiry,

    setSettings,
    saveSettings,

    updateMetadata: setMetadata,
    saveMetadata,

    setGraph,
    updateOwners: setOwners,
    saveOwners,
    resetGraph,

    saveGraph,
    publishGraph,
    refreshGraph,

    save,
    saveSettingsAndGraph: saveAll,

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
