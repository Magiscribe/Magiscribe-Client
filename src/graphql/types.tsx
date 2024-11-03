import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSONObject: { input: any; output: any; }
};

export type Agent = {
  __typename?: 'Agent';
  capabilities: Array<Capability>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logicalCollection: Collection;
  memoryEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  outputFilter?: Maybe<Scalars['String']['output']>;
  reasoning?: Maybe<AgentReasoning>;
  subscriptionFilter?: Maybe<Scalars['String']['output']>;
};

export type AgentInput = {
  capabilities: Array<InputMaybe<Scalars['String']['input']>>;
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  logicalCollection: Scalars['String']['input'];
  memoryEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  outputFilter?: InputMaybe<Scalars['String']['input']>;
  reasoning?: InputMaybe<AgentReasoningInput>;
  subscriptionFilter?: InputMaybe<Scalars['String']['input']>;
};

export type AgentReasoning = {
  __typename?: 'AgentReasoning';
  llmModel: Scalars['String']['output'];
  prompt: Scalars['String']['output'];
  variablePassThrough: Scalars['Boolean']['output'];
};

export type AgentReasoningInput = {
  llmModel: Scalars['String']['input'];
  prompt: Scalars['String']['input'];
  variablePassThrough: Scalars['Boolean']['input'];
};

export type Capability = {
  __typename?: 'Capability';
  alias: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  llmModel: Scalars['String']['output'];
  logicalCollection: Collection;
  name: Scalars['String']['output'];
  outputFilter?: Maybe<Scalars['String']['output']>;
  outputMode: Scalars['String']['output'];
  prompts: Array<Prompt>;
  subscriptionFilter?: Maybe<Scalars['String']['output']>;
};

export type CapabilityInput = {
  alias: Scalars['String']['input'];
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  llmModel?: InputMaybe<Scalars['String']['input']>;
  logicalCollection: Scalars['String']['input'];
  name: Scalars['String']['input'];
  outputFilter?: InputMaybe<Scalars['String']['input']>;
  outputMode?: InputMaybe<Scalars['String']['input']>;
  prompts?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subscriptionFilter?: InputMaybe<Scalars['String']['input']>;
};

export type Collection = {
  __typename?: 'Collection';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CollectionInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type Inquiry = {
  __typename?: 'Inquiry';
  createdAt: Scalars['Float']['output'];
  data: Scalars['JSONObject']['output'];
  id: Scalars['ID']['output'];
  responses?: Maybe<Array<InquiryResponse>>;
  updatedAt: Scalars['Float']['output'];
  userId: Scalars['ID']['output'];
};

export type InquiryData = {
  __typename?: 'InquiryData';
  draftGraph?: Maybe<Scalars['JSONObject']['output']>;
  form: InquiryDataForm;
  graph?: Maybe<Scalars['JSONObject']['output']>;
};

export type InquiryDataForm = {
  __typename?: 'InquiryDataForm';
  goals: Scalars['String']['output'];
  title: Scalars['String']['output'];
  voice?: Maybe<Scalars['String']['output']>;
};

export type InquiryResponse = {
  __typename?: 'InquiryResponse';
  createdAt: Scalars['Float']['output'];
  data: InquiryResponseData;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['Float']['output'];
  userId?: Maybe<Scalars['ID']['output']>;
};

export type InquiryResponseData = {
  __typename?: 'InquiryResponseData';
  history: Array<Scalars['JSONObject']['output']>;
  userDetails?: Maybe<Scalars['JSONObject']['output']>;
};

export type Model = {
  __typename?: 'Model';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  region: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMediaAsset?: Maybe<Scalars['String']['output']>;
  addPrediction?: Maybe<Scalars['String']['output']>;
  deleteAgent?: Maybe<Agent>;
  deleteCapability?: Maybe<Capability>;
  deleteCollection?: Maybe<Collection>;
  deleteInquiry?: Maybe<Inquiry>;
  deletePrompt?: Maybe<Prompt>;
  generateAudio?: Maybe<Scalars['String']['output']>;
  upsertAgent?: Maybe<Agent>;
  upsertCapability?: Maybe<Capability>;
  upsertCollection?: Maybe<Collection>;
  upsertInquiry: Inquiry;
  upsertInquiryResponse: InquiryResponse;
  upsertPrompt?: Maybe<Prompt>;
};


export type MutationAddMediaAssetArgs = {
  fileName: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
};


export type MutationAddPredictionArgs = {
  agentId: Scalars['ID']['input'];
  attachments?: InputMaybe<Array<Scalars['JSONObject']['input']>>;
  subscriptionId: Scalars['ID']['input'];
  variables?: InputMaybe<Scalars['JSONObject']['input']>;
};


export type MutationDeleteAgentArgs = {
  agentId: Scalars['ID']['input'];
};


export type MutationDeleteCapabilityArgs = {
  capabilityId: Scalars['ID']['input'];
};


export type MutationDeleteCollectionArgs = {
  collectionId: Scalars['ID']['input'];
};


export type MutationDeleteInquiryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePromptArgs = {
  promptId: Scalars['ID']['input'];
};


export type MutationGenerateAudioArgs = {
  text: Scalars['String']['input'];
  voice: Scalars['String']['input'];
};


export type MutationUpsertAgentArgs = {
  agent: AgentInput;
};


export type MutationUpsertCapabilityArgs = {
  capability: CapabilityInput;
};


export type MutationUpsertCollectionArgs = {
  input: CollectionInput;
};


export type MutationUpsertInquiryArgs = {
  data: Scalars['JSONObject']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationUpsertInquiryResponseArgs = {
  data: Scalars['JSONObject']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  inquiryId: Scalars['ID']['input'];
};


export type MutationUpsertPromptArgs = {
  prompt: PromptInput;
};

export type Prediction = {
  __typename?: 'Prediction';
  id: Scalars['ID']['output'];
  result?: Maybe<Scalars['String']['output']>;
  subscriptionId: Scalars['ID']['output'];
  type: Scalars['String']['output'];
};

export enum PredictionType {
  Data = 'DATA',
  Error = 'ERROR',
  Received = 'RECEIVED',
  Success = 'SUCCESS'
}

export type Prompt = {
  __typename?: 'Prompt';
  id: Scalars['ID']['output'];
  logicalCollection: Collection;
  name: Scalars['String']['output'];
  text: Scalars['String']['output'];
};

export type PromptInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  logicalCollection: Scalars['String']['input'];
  name: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAgent?: Maybe<Agent>;
  getAgentWithPrompts?: Maybe<Agent>;
  getAllAgents: Array<Agent>;
  getAllAudioVoices: Array<Voice>;
  getAllCapabilities: Array<Capability>;
  getAllCollections: Array<Collection>;
  getAllModels: Array<Model>;
  getAllPrompts?: Maybe<Array<Maybe<Prompt>>>;
  getCapability?: Maybe<Capability>;
  getCollection?: Maybe<Collection>;
  getInquiries?: Maybe<Array<Inquiry>>;
  getInquiry?: Maybe<Inquiry>;
  getInquiryResponseCount: Scalars['Int']['output'];
  getInquiryResponses?: Maybe<Array<InquiryResponse>>;
  getPrompt?: Maybe<Prompt>;
};


export type QueryGetAgentArgs = {
  agentId: Scalars['ID']['input'];
};


export type QueryGetAgentWithPromptsArgs = {
  agentId: Scalars['ID']['input'];
};


export type QueryGetAllAgentsArgs = {
  logicalCollection?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllCapabilitiesArgs = {
  logicalCollection?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllPromptsArgs = {
  logicalCollection?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetCapabilityArgs = {
  capabilityId: Scalars['ID']['input'];
};


export type QueryGetCollectionArgs = {
  collectionId: Scalars['ID']['input'];
};


export type QueryGetInquiryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetInquiryResponseCountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetInquiryResponsesArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPromptArgs = {
  promptId: Scalars['ID']['input'];
};

export enum Role {
  Admin = 'admin',
  Default = 'default',
  Member = 'member'
}

export type Subscription = {
  __typename?: 'Subscription';
  predictionAdded?: Maybe<Prediction>;
};


export type SubscriptionPredictionAddedArgs = {
  subscriptionId: Scalars['ID']['input'];
};

export type Voice = {
  __typename?: 'Voice';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type GenerateAudioMutationVariables = Exact<{
  voice: Scalars['String']['input'];
  text: Scalars['String']['input'];
}>;


export type GenerateAudioMutation = { __typename?: 'Mutation', generateAudio?: string | null };

export type AddPredictionMutationVariables = Exact<{
  subscriptionId: Scalars['ID']['input'];
  agentId: Scalars['ID']['input'];
  variables?: InputMaybe<Scalars['JSONObject']['input']>;
  attachments?: InputMaybe<Array<Scalars['JSONObject']['input']> | Scalars['JSONObject']['input']>;
}>;


export type AddPredictionMutation = { __typename?: 'Mutation', addPrediction?: string | null };

export type UpsertAgentMutationVariables = Exact<{
  agent: AgentInput;
}>;


export type UpsertAgentMutation = { __typename?: 'Mutation', upsertAgent?: { __typename?: 'Agent', id: string, name: string, description: string, reasoning?: { __typename?: 'AgentReasoning', llmModel: string, prompt: string, variablePassThrough: boolean } | null, capabilities: Array<{ __typename?: 'Capability', id: string }> } | null };

export type DeleteAgentMutationVariables = Exact<{
  agentId: Scalars['ID']['input'];
}>;


export type DeleteAgentMutation = { __typename?: 'Mutation', deleteAgent?: { __typename?: 'Agent', id: string } | null };

export type UpsertCapabilityMutationVariables = Exact<{
  capability: CapabilityInput;
}>;


export type UpsertCapabilityMutation = { __typename?: 'Mutation', upsertCapability?: { __typename?: 'Capability', id: string, name: string, alias: string, description: string, llmModel: string, outputMode: string, subscriptionFilter?: string | null, outputFilter?: string | null, prompts: Array<{ __typename?: 'Prompt', id: string, name: string, text: string }> } | null };

export type DeleteCapabilityMutationVariables = Exact<{
  capabilityId: Scalars['ID']['input'];
}>;


export type DeleteCapabilityMutation = { __typename?: 'Mutation', deleteCapability?: { __typename?: 'Capability', id: string } | null };

export type UpsertPromptMutationVariables = Exact<{
  prompt: PromptInput;
}>;


export type UpsertPromptMutation = { __typename?: 'Mutation', upsertPrompt?: { __typename?: 'Prompt', id: string, name: string, text: string } | null };

export type DeletePromptMutationVariables = Exact<{
  promptId: Scalars['ID']['input'];
}>;


export type DeletePromptMutation = { __typename?: 'Mutation', deletePrompt?: { __typename?: 'Prompt', id: string } | null };

export type CreateInquiryMutationVariables = Exact<{
  data: Scalars['JSONObject']['input'];
}>;


export type CreateInquiryMutation = { __typename?: 'Mutation', upsertInquiry: { __typename?: 'Inquiry', id: string, data: any, createdAt: number, updatedAt: number } };

export type UpdateInquiryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: Scalars['JSONObject']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateInquiryMutation = { __typename?: 'Mutation', upsertInquiry: { __typename?: 'Inquiry', id: string, data: any, createdAt: number, updatedAt: number } };

export type DeleteInquiryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteInquiryMutation = { __typename?: 'Mutation', deleteInquiry?: { __typename?: 'Inquiry', id: string } | null };

export type CreateInquiryResponseMutationVariables = Exact<{
  inquiryId: Scalars['ID']['input'];
  data: Scalars['JSONObject']['input'];
}>;


export type CreateInquiryResponseMutation = { __typename?: 'Mutation', upsertInquiryResponse: { __typename?: 'InquiryResponse', id: string } };

export type UpdateInquiryResponseMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  inquiryId: Scalars['ID']['input'];
  data: Scalars['JSONObject']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateInquiryResponseMutation = { __typename?: 'Mutation', upsertInquiryResponse: { __typename?: 'InquiryResponse', id: string } };

export type UpsertCollectionMutationVariables = Exact<{
  input: CollectionInput;
}>;


export type UpsertCollectionMutation = { __typename?: 'Mutation', upsertCollection?: { __typename?: 'Collection', id: string, name: string } | null };

export type DeleteCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID']['input'];
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection?: { __typename?: 'Collection', id: string } | null };

export type GetAllModelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllModelsQuery = { __typename?: 'Query', getAllModels: Array<{ __typename?: 'Model', id: string, name: string }> };

export type GetAgentWithPromptsQueryVariables = Exact<{
  agentId: Scalars['ID']['input'];
}>;


export type GetAgentWithPromptsQuery = { __typename?: 'Query', getAgentWithPrompts?: { __typename?: 'Agent', id: string, name: string, description: string, memoryEnabled: boolean, subscriptionFilter?: string | null, outputFilter?: string | null, reasoning?: { __typename?: 'AgentReasoning', llmModel: string, prompt: string, variablePassThrough: boolean } | null, capabilities: Array<{ __typename?: 'Capability', name: string, id: string, prompts: Array<{ __typename?: 'Prompt', name: string, id: string, text: string }> }> } | null };

export type GetAllAgentsQueryVariables = Exact<{
  logicalCollection?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllAgentsQuery = { __typename?: 'Query', getAllAgents: Array<{ __typename?: 'Agent', id: string, name: string, description: string, capabilities: Array<{ __typename?: 'Capability', name: string, id: string }> }> };

export type GetAgentQueryVariables = Exact<{
  agentId: Scalars['ID']['input'];
}>;


export type GetAgentQuery = { __typename?: 'Query', getAgent?: { __typename?: 'Agent', id: string, name: string, description: string, memoryEnabled: boolean, subscriptionFilter?: string | null, outputFilter?: string | null, reasoning?: { __typename?: 'AgentReasoning', llmModel: string, prompt: string, variablePassThrough: boolean } | null, capabilities: Array<{ __typename?: 'Capability', name: string, id: string }> } | null };

export type GetAllCapabilitiesQueryVariables = Exact<{
  logicalCollection?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllCapabilitiesQuery = { __typename?: 'Query', getAllCapabilities: Array<{ __typename?: 'Capability', id: string, alias: string, name: string, llmModel: string, description: string, outputMode: string, subscriptionFilter?: string | null, outputFilter?: string | null, prompts: Array<{ __typename?: 'Prompt', name: string, id: string, text: string }> }> };

export type GetCapabilityQueryVariables = Exact<{
  capabilityId: Scalars['ID']['input'];
}>;


export type GetCapabilityQuery = { __typename?: 'Query', getCapability?: { __typename?: 'Capability', id: string, llmModel: string, alias: string, name: string, description: string, outputMode: string, subscriptionFilter?: string | null, outputFilter?: string | null, prompts: Array<{ __typename?: 'Prompt', name: string, id: string, text: string }> } | null };

export type GetAllPromptsQueryVariables = Exact<{
  logicalCollection?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllPromptsQuery = { __typename?: 'Query', getAllPrompts?: Array<{ __typename?: 'Prompt', id: string, name: string, text: string } | null> | null };

export type GetPromptQueryVariables = Exact<{
  promptId: Scalars['ID']['input'];
}>;


export type GetPromptQuery = { __typename?: 'Query', getPrompt?: { __typename?: 'Prompt', id: string, name: string, text: string } | null };

export type GetInquiryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInquiryQuery = { __typename?: 'Query', getInquiry?: { __typename?: 'Inquiry', id: string, data: any, createdAt: number, updatedAt: number } | null };

export type GetInquiriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInquiriesQuery = { __typename?: 'Query', getInquiries?: Array<{ __typename?: 'Inquiry', id: string, userId: string, data: any, createdAt: number, updatedAt: number }> | null };

export type GetInquiryResponsesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInquiryResponsesQuery = { __typename?: 'Query', getInquiryResponses?: Array<{ __typename?: 'InquiryResponse', id: string, userId?: string | null, createdAt: number, updatedAt: number, data: { __typename?: 'InquiryResponseData', userDetails?: any | null, history: Array<any> } }> | null };

export type GetInquiryResponseCountQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInquiryResponseCountQuery = { __typename?: 'Query', getInquiryResponseCount: number };

export type GetAllAudioVoicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAudioVoicesQuery = { __typename?: 'Query', getAllAudioVoices: Array<{ __typename?: 'Voice', id: string, name: string }> };

export type GetAllCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCollectionsQuery = { __typename?: 'Query', getAllCollections: Array<{ __typename?: 'Collection', id: string, name: string }> };

export type PredictionAddedSubscriptionVariables = Exact<{
  subscriptionId: Scalars['ID']['input'];
}>;


export type PredictionAddedSubscription = { __typename?: 'Subscription', predictionAdded?: { __typename?: 'Prediction', id: string, subscriptionId: string, result?: string | null, type: string } | null };


export const GenerateAudioDocument = gql`
    mutation generateAudio($voice: String!, $text: String!) {
  generateAudio(voice: $voice, text: $text)
}
    `;
export type GenerateAudioMutationFn = Apollo.MutationFunction<GenerateAudioMutation, GenerateAudioMutationVariables>;

/**
 * __useGenerateAudioMutation__
 *
 * To run a mutation, you first call `useGenerateAudioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAudioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAudioMutation, { data, loading, error }] = useGenerateAudioMutation({
 *   variables: {
 *      voice: // value for 'voice'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useGenerateAudioMutation(baseOptions?: Apollo.MutationHookOptions<GenerateAudioMutation, GenerateAudioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateAudioMutation, GenerateAudioMutationVariables>(GenerateAudioDocument, options);
      }
export type GenerateAudioMutationHookResult = ReturnType<typeof useGenerateAudioMutation>;
export type GenerateAudioMutationResult = Apollo.MutationResult<GenerateAudioMutation>;
export type GenerateAudioMutationOptions = Apollo.BaseMutationOptions<GenerateAudioMutation, GenerateAudioMutationVariables>;
export const AddPredictionDocument = gql`
    mutation addPrediction($subscriptionId: ID!, $agentId: ID!, $variables: JSONObject, $attachments: [JSONObject!]) {
  addPrediction(
    subscriptionId: $subscriptionId
    agentId: $agentId
    variables: $variables
    attachments: $attachments
  )
}
    `;
export type AddPredictionMutationFn = Apollo.MutationFunction<AddPredictionMutation, AddPredictionMutationVariables>;

/**
 * __useAddPredictionMutation__
 *
 * To run a mutation, you first call `useAddPredictionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPredictionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPredictionMutation, { data, loading, error }] = useAddPredictionMutation({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *      agentId: // value for 'agentId'
 *      variables: // value for 'variables'
 *      attachments: // value for 'attachments'
 *   },
 * });
 */
export function useAddPredictionMutation(baseOptions?: Apollo.MutationHookOptions<AddPredictionMutation, AddPredictionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPredictionMutation, AddPredictionMutationVariables>(AddPredictionDocument, options);
      }
export type AddPredictionMutationHookResult = ReturnType<typeof useAddPredictionMutation>;
export type AddPredictionMutationResult = Apollo.MutationResult<AddPredictionMutation>;
export type AddPredictionMutationOptions = Apollo.BaseMutationOptions<AddPredictionMutation, AddPredictionMutationVariables>;
export const UpsertAgentDocument = gql`
    mutation upsertAgent($agent: AgentInput!) {
  upsertAgent(agent: $agent) {
    id
    name
    description
    reasoning {
      llmModel
      prompt
      variablePassThrough
    }
    capabilities {
      id
    }
  }
}
    `;
export type UpsertAgentMutationFn = Apollo.MutationFunction<UpsertAgentMutation, UpsertAgentMutationVariables>;

/**
 * __useUpsertAgentMutation__
 *
 * To run a mutation, you first call `useUpsertAgentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertAgentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertAgentMutation, { data, loading, error }] = useUpsertAgentMutation({
 *   variables: {
 *      agent: // value for 'agent'
 *   },
 * });
 */
export function useUpsertAgentMutation(baseOptions?: Apollo.MutationHookOptions<UpsertAgentMutation, UpsertAgentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertAgentMutation, UpsertAgentMutationVariables>(UpsertAgentDocument, options);
      }
export type UpsertAgentMutationHookResult = ReturnType<typeof useUpsertAgentMutation>;
export type UpsertAgentMutationResult = Apollo.MutationResult<UpsertAgentMutation>;
export type UpsertAgentMutationOptions = Apollo.BaseMutationOptions<UpsertAgentMutation, UpsertAgentMutationVariables>;
export const DeleteAgentDocument = gql`
    mutation deleteAgent($agentId: ID!) {
  deleteAgent(agentId: $agentId) {
    id
  }
}
    `;
export type DeleteAgentMutationFn = Apollo.MutationFunction<DeleteAgentMutation, DeleteAgentMutationVariables>;

/**
 * __useDeleteAgentMutation__
 *
 * To run a mutation, you first call `useDeleteAgentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAgentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAgentMutation, { data, loading, error }] = useDeleteAgentMutation({
 *   variables: {
 *      agentId: // value for 'agentId'
 *   },
 * });
 */
export function useDeleteAgentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAgentMutation, DeleteAgentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAgentMutation, DeleteAgentMutationVariables>(DeleteAgentDocument, options);
      }
export type DeleteAgentMutationHookResult = ReturnType<typeof useDeleteAgentMutation>;
export type DeleteAgentMutationResult = Apollo.MutationResult<DeleteAgentMutation>;
export type DeleteAgentMutationOptions = Apollo.BaseMutationOptions<DeleteAgentMutation, DeleteAgentMutationVariables>;
export const UpsertCapabilityDocument = gql`
    mutation upsertCapability($capability: CapabilityInput!) {
  upsertCapability(capability: $capability) {
    id
    name
    alias
    description
    llmModel
    outputMode
    subscriptionFilter
    outputFilter
    prompts {
      id
      name
      text
    }
  }
}
    `;
export type UpsertCapabilityMutationFn = Apollo.MutationFunction<UpsertCapabilityMutation, UpsertCapabilityMutationVariables>;

/**
 * __useUpsertCapabilityMutation__
 *
 * To run a mutation, you first call `useUpsertCapabilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertCapabilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertCapabilityMutation, { data, loading, error }] = useUpsertCapabilityMutation({
 *   variables: {
 *      capability: // value for 'capability'
 *   },
 * });
 */
export function useUpsertCapabilityMutation(baseOptions?: Apollo.MutationHookOptions<UpsertCapabilityMutation, UpsertCapabilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertCapabilityMutation, UpsertCapabilityMutationVariables>(UpsertCapabilityDocument, options);
      }
export type UpsertCapabilityMutationHookResult = ReturnType<typeof useUpsertCapabilityMutation>;
export type UpsertCapabilityMutationResult = Apollo.MutationResult<UpsertCapabilityMutation>;
export type UpsertCapabilityMutationOptions = Apollo.BaseMutationOptions<UpsertCapabilityMutation, UpsertCapabilityMutationVariables>;
export const DeleteCapabilityDocument = gql`
    mutation deleteCapability($capabilityId: ID!) {
  deleteCapability(capabilityId: $capabilityId) {
    id
  }
}
    `;
export type DeleteCapabilityMutationFn = Apollo.MutationFunction<DeleteCapabilityMutation, DeleteCapabilityMutationVariables>;

/**
 * __useDeleteCapabilityMutation__
 *
 * To run a mutation, you first call `useDeleteCapabilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCapabilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCapabilityMutation, { data, loading, error }] = useDeleteCapabilityMutation({
 *   variables: {
 *      capabilityId: // value for 'capabilityId'
 *   },
 * });
 */
export function useDeleteCapabilityMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCapabilityMutation, DeleteCapabilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCapabilityMutation, DeleteCapabilityMutationVariables>(DeleteCapabilityDocument, options);
      }
export type DeleteCapabilityMutationHookResult = ReturnType<typeof useDeleteCapabilityMutation>;
export type DeleteCapabilityMutationResult = Apollo.MutationResult<DeleteCapabilityMutation>;
export type DeleteCapabilityMutationOptions = Apollo.BaseMutationOptions<DeleteCapabilityMutation, DeleteCapabilityMutationVariables>;
export const UpsertPromptDocument = gql`
    mutation upsertPrompt($prompt: PromptInput!) {
  upsertPrompt(prompt: $prompt) {
    id
    name
    text
  }
}
    `;
export type UpsertPromptMutationFn = Apollo.MutationFunction<UpsertPromptMutation, UpsertPromptMutationVariables>;

/**
 * __useUpsertPromptMutation__
 *
 * To run a mutation, you first call `useUpsertPromptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertPromptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertPromptMutation, { data, loading, error }] = useUpsertPromptMutation({
 *   variables: {
 *      prompt: // value for 'prompt'
 *   },
 * });
 */
export function useUpsertPromptMutation(baseOptions?: Apollo.MutationHookOptions<UpsertPromptMutation, UpsertPromptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertPromptMutation, UpsertPromptMutationVariables>(UpsertPromptDocument, options);
      }
export type UpsertPromptMutationHookResult = ReturnType<typeof useUpsertPromptMutation>;
export type UpsertPromptMutationResult = Apollo.MutationResult<UpsertPromptMutation>;
export type UpsertPromptMutationOptions = Apollo.BaseMutationOptions<UpsertPromptMutation, UpsertPromptMutationVariables>;
export const DeletePromptDocument = gql`
    mutation deletePrompt($promptId: ID!) {
  deletePrompt(promptId: $promptId) {
    id
  }
}
    `;
export type DeletePromptMutationFn = Apollo.MutationFunction<DeletePromptMutation, DeletePromptMutationVariables>;

/**
 * __useDeletePromptMutation__
 *
 * To run a mutation, you first call `useDeletePromptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePromptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePromptMutation, { data, loading, error }] = useDeletePromptMutation({
 *   variables: {
 *      promptId: // value for 'promptId'
 *   },
 * });
 */
export function useDeletePromptMutation(baseOptions?: Apollo.MutationHookOptions<DeletePromptMutation, DeletePromptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePromptMutation, DeletePromptMutationVariables>(DeletePromptDocument, options);
      }
export type DeletePromptMutationHookResult = ReturnType<typeof useDeletePromptMutation>;
export type DeletePromptMutationResult = Apollo.MutationResult<DeletePromptMutation>;
export type DeletePromptMutationOptions = Apollo.BaseMutationOptions<DeletePromptMutation, DeletePromptMutationVariables>;
export const CreateInquiryDocument = gql`
    mutation createInquiry($data: JSONObject!) {
  upsertInquiry(data: $data) {
    id
    data
    createdAt
    updatedAt
  }
}
    `;
export type CreateInquiryMutationFn = Apollo.MutationFunction<CreateInquiryMutation, CreateInquiryMutationVariables>;

/**
 * __useCreateInquiryMutation__
 *
 * To run a mutation, you first call `useCreateInquiryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInquiryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInquiryMutation, { data, loading, error }] = useCreateInquiryMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateInquiryMutation(baseOptions?: Apollo.MutationHookOptions<CreateInquiryMutation, CreateInquiryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInquiryMutation, CreateInquiryMutationVariables>(CreateInquiryDocument, options);
      }
export type CreateInquiryMutationHookResult = ReturnType<typeof useCreateInquiryMutation>;
export type CreateInquiryMutationResult = Apollo.MutationResult<CreateInquiryMutation>;
export type CreateInquiryMutationOptions = Apollo.BaseMutationOptions<CreateInquiryMutation, CreateInquiryMutationVariables>;
export const UpdateInquiryDocument = gql`
    mutation updateInquiry($id: ID!, $data: JSONObject!, $fields: [String!]) {
  upsertInquiry(id: $id, data: $data, fields: $fields) {
    id
    data
    createdAt
    updatedAt
  }
}
    `;
export type UpdateInquiryMutationFn = Apollo.MutationFunction<UpdateInquiryMutation, UpdateInquiryMutationVariables>;

/**
 * __useUpdateInquiryMutation__
 *
 * To run a mutation, you first call `useUpdateInquiryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInquiryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInquiryMutation, { data, loading, error }] = useUpdateInquiryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *      fields: // value for 'fields'
 *   },
 * });
 */
export function useUpdateInquiryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInquiryMutation, UpdateInquiryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInquiryMutation, UpdateInquiryMutationVariables>(UpdateInquiryDocument, options);
      }
export type UpdateInquiryMutationHookResult = ReturnType<typeof useUpdateInquiryMutation>;
export type UpdateInquiryMutationResult = Apollo.MutationResult<UpdateInquiryMutation>;
export type UpdateInquiryMutationOptions = Apollo.BaseMutationOptions<UpdateInquiryMutation, UpdateInquiryMutationVariables>;
export const DeleteInquiryDocument = gql`
    mutation deleteInquiry($id: ID!) {
  deleteInquiry(id: $id) {
    id
  }
}
    `;
export type DeleteInquiryMutationFn = Apollo.MutationFunction<DeleteInquiryMutation, DeleteInquiryMutationVariables>;

/**
 * __useDeleteInquiryMutation__
 *
 * To run a mutation, you first call `useDeleteInquiryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInquiryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInquiryMutation, { data, loading, error }] = useDeleteInquiryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteInquiryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInquiryMutation, DeleteInquiryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInquiryMutation, DeleteInquiryMutationVariables>(DeleteInquiryDocument, options);
      }
export type DeleteInquiryMutationHookResult = ReturnType<typeof useDeleteInquiryMutation>;
export type DeleteInquiryMutationResult = Apollo.MutationResult<DeleteInquiryMutation>;
export type DeleteInquiryMutationOptions = Apollo.BaseMutationOptions<DeleteInquiryMutation, DeleteInquiryMutationVariables>;
export const CreateInquiryResponseDocument = gql`
    mutation createInquiryResponse($inquiryId: ID!, $data: JSONObject!) {
  upsertInquiryResponse(inquiryId: $inquiryId, data: $data) {
    id
  }
}
    `;
export type CreateInquiryResponseMutationFn = Apollo.MutationFunction<CreateInquiryResponseMutation, CreateInquiryResponseMutationVariables>;

/**
 * __useCreateInquiryResponseMutation__
 *
 * To run a mutation, you first call `useCreateInquiryResponseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInquiryResponseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInquiryResponseMutation, { data, loading, error }] = useCreateInquiryResponseMutation({
 *   variables: {
 *      inquiryId: // value for 'inquiryId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateInquiryResponseMutation(baseOptions?: Apollo.MutationHookOptions<CreateInquiryResponseMutation, CreateInquiryResponseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInquiryResponseMutation, CreateInquiryResponseMutationVariables>(CreateInquiryResponseDocument, options);
      }
export type CreateInquiryResponseMutationHookResult = ReturnType<typeof useCreateInquiryResponseMutation>;
export type CreateInquiryResponseMutationResult = Apollo.MutationResult<CreateInquiryResponseMutation>;
export type CreateInquiryResponseMutationOptions = Apollo.BaseMutationOptions<CreateInquiryResponseMutation, CreateInquiryResponseMutationVariables>;
export const UpdateInquiryResponseDocument = gql`
    mutation updateInquiryResponse($id: ID, $inquiryId: ID!, $data: JSONObject!, $fields: [String!]) {
  upsertInquiryResponse(
    id: $id
    inquiryId: $inquiryId
    data: $data
    fields: $fields
  ) {
    id
  }
}
    `;
export type UpdateInquiryResponseMutationFn = Apollo.MutationFunction<UpdateInquiryResponseMutation, UpdateInquiryResponseMutationVariables>;

/**
 * __useUpdateInquiryResponseMutation__
 *
 * To run a mutation, you first call `useUpdateInquiryResponseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInquiryResponseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInquiryResponseMutation, { data, loading, error }] = useUpdateInquiryResponseMutation({
 *   variables: {
 *      id: // value for 'id'
 *      inquiryId: // value for 'inquiryId'
 *      data: // value for 'data'
 *      fields: // value for 'fields'
 *   },
 * });
 */
export function useUpdateInquiryResponseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInquiryResponseMutation, UpdateInquiryResponseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInquiryResponseMutation, UpdateInquiryResponseMutationVariables>(UpdateInquiryResponseDocument, options);
      }
export type UpdateInquiryResponseMutationHookResult = ReturnType<typeof useUpdateInquiryResponseMutation>;
export type UpdateInquiryResponseMutationResult = Apollo.MutationResult<UpdateInquiryResponseMutation>;
export type UpdateInquiryResponseMutationOptions = Apollo.BaseMutationOptions<UpdateInquiryResponseMutation, UpdateInquiryResponseMutationVariables>;
export const UpsertCollectionDocument = gql`
    mutation upsertCollection($input: CollectionInput!) {
  upsertCollection(input: $input) {
    id
    name
  }
}
    `;
export type UpsertCollectionMutationFn = Apollo.MutationFunction<UpsertCollectionMutation, UpsertCollectionMutationVariables>;

/**
 * __useUpsertCollectionMutation__
 *
 * To run a mutation, you first call `useUpsertCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertCollectionMutation, { data, loading, error }] = useUpsertCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpsertCollectionMutation(baseOptions?: Apollo.MutationHookOptions<UpsertCollectionMutation, UpsertCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertCollectionMutation, UpsertCollectionMutationVariables>(UpsertCollectionDocument, options);
      }
export type UpsertCollectionMutationHookResult = ReturnType<typeof useUpsertCollectionMutation>;
export type UpsertCollectionMutationResult = Apollo.MutationResult<UpsertCollectionMutation>;
export type UpsertCollectionMutationOptions = Apollo.BaseMutationOptions<UpsertCollectionMutation, UpsertCollectionMutationVariables>;
export const DeleteCollectionDocument = gql`
    mutation deleteCollection($collectionId: ID!) {
  deleteCollection(collectionId: $collectionId) {
    id
  }
}
    `;
export type DeleteCollectionMutationFn = Apollo.MutationFunction<DeleteCollectionMutation, DeleteCollectionMutationVariables>;

/**
 * __useDeleteCollectionMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionMutation, { data, loading, error }] = useDeleteCollectionMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useDeleteCollectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCollectionMutation, DeleteCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCollectionMutation, DeleteCollectionMutationVariables>(DeleteCollectionDocument, options);
      }
export type DeleteCollectionMutationHookResult = ReturnType<typeof useDeleteCollectionMutation>;
export type DeleteCollectionMutationResult = Apollo.MutationResult<DeleteCollectionMutation>;
export type DeleteCollectionMutationOptions = Apollo.BaseMutationOptions<DeleteCollectionMutation, DeleteCollectionMutationVariables>;
export const GetAllModelsDocument = gql`
    query getAllModels {
  getAllModels {
    id
    name
  }
}
    `;

/**
 * __useGetAllModelsQuery__
 *
 * To run a query within a React component, call `useGetAllModelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllModelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllModelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllModelsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllModelsQuery, GetAllModelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllModelsQuery, GetAllModelsQueryVariables>(GetAllModelsDocument, options);
      }
export function useGetAllModelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllModelsQuery, GetAllModelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllModelsQuery, GetAllModelsQueryVariables>(GetAllModelsDocument, options);
        }
export function useGetAllModelsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllModelsQuery, GetAllModelsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllModelsQuery, GetAllModelsQueryVariables>(GetAllModelsDocument, options);
        }
export type GetAllModelsQueryHookResult = ReturnType<typeof useGetAllModelsQuery>;
export type GetAllModelsLazyQueryHookResult = ReturnType<typeof useGetAllModelsLazyQuery>;
export type GetAllModelsSuspenseQueryHookResult = ReturnType<typeof useGetAllModelsSuspenseQuery>;
export type GetAllModelsQueryResult = Apollo.QueryResult<GetAllModelsQuery, GetAllModelsQueryVariables>;
export const GetAgentWithPromptsDocument = gql`
    query getAgentWithPrompts($agentId: ID!) {
  getAgentWithPrompts(agentId: $agentId) {
    id
    name
    description
    reasoning {
      llmModel
      prompt
      variablePassThrough
    }
    capabilities {
      name
      id
      prompts {
        name
        id
        text
      }
    }
    memoryEnabled
    subscriptionFilter
    outputFilter
  }
}
    `;

/**
 * __useGetAgentWithPromptsQuery__
 *
 * To run a query within a React component, call `useGetAgentWithPromptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAgentWithPromptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAgentWithPromptsQuery({
 *   variables: {
 *      agentId: // value for 'agentId'
 *   },
 * });
 */
export function useGetAgentWithPromptsQuery(baseOptions: Apollo.QueryHookOptions<GetAgentWithPromptsQuery, GetAgentWithPromptsQueryVariables> & ({ variables: GetAgentWithPromptsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAgentWithPromptsQuery, GetAgentWithPromptsQueryVariables>(GetAgentWithPromptsDocument, options);
      }
export function useGetAgentWithPromptsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAgentWithPromptsQuery, GetAgentWithPromptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAgentWithPromptsQuery, GetAgentWithPromptsQueryVariables>(GetAgentWithPromptsDocument, options);
        }
export function useGetAgentWithPromptsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAgentWithPromptsQuery, GetAgentWithPromptsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAgentWithPromptsQuery, GetAgentWithPromptsQueryVariables>(GetAgentWithPromptsDocument, options);
        }
export type GetAgentWithPromptsQueryHookResult = ReturnType<typeof useGetAgentWithPromptsQuery>;
export type GetAgentWithPromptsLazyQueryHookResult = ReturnType<typeof useGetAgentWithPromptsLazyQuery>;
export type GetAgentWithPromptsSuspenseQueryHookResult = ReturnType<typeof useGetAgentWithPromptsSuspenseQuery>;
export type GetAgentWithPromptsQueryResult = Apollo.QueryResult<GetAgentWithPromptsQuery, GetAgentWithPromptsQueryVariables>;
export const GetAllAgentsDocument = gql`
    query getAllAgents($logicalCollection: String) {
  getAllAgents(logicalCollection: $logicalCollection) {
    id
    name
    description
    capabilities {
      name
      id
    }
  }
}
    `;

/**
 * __useGetAllAgentsQuery__
 *
 * To run a query within a React component, call `useGetAllAgentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllAgentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllAgentsQuery({
 *   variables: {
 *      logicalCollection: // value for 'logicalCollection'
 *   },
 * });
 */
export function useGetAllAgentsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllAgentsQuery, GetAllAgentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllAgentsQuery, GetAllAgentsQueryVariables>(GetAllAgentsDocument, options);
      }
export function useGetAllAgentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllAgentsQuery, GetAllAgentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllAgentsQuery, GetAllAgentsQueryVariables>(GetAllAgentsDocument, options);
        }
export function useGetAllAgentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllAgentsQuery, GetAllAgentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllAgentsQuery, GetAllAgentsQueryVariables>(GetAllAgentsDocument, options);
        }
export type GetAllAgentsQueryHookResult = ReturnType<typeof useGetAllAgentsQuery>;
export type GetAllAgentsLazyQueryHookResult = ReturnType<typeof useGetAllAgentsLazyQuery>;
export type GetAllAgentsSuspenseQueryHookResult = ReturnType<typeof useGetAllAgentsSuspenseQuery>;
export type GetAllAgentsQueryResult = Apollo.QueryResult<GetAllAgentsQuery, GetAllAgentsQueryVariables>;
export const GetAgentDocument = gql`
    query getAgent($agentId: ID!) {
  getAgent(agentId: $agentId) {
    id
    name
    description
    reasoning {
      llmModel
      prompt
      variablePassThrough
    }
    capabilities {
      name
      id
    }
    memoryEnabled
    subscriptionFilter
    outputFilter
  }
}
    `;

/**
 * __useGetAgentQuery__
 *
 * To run a query within a React component, call `useGetAgentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAgentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAgentQuery({
 *   variables: {
 *      agentId: // value for 'agentId'
 *   },
 * });
 */
export function useGetAgentQuery(baseOptions: Apollo.QueryHookOptions<GetAgentQuery, GetAgentQueryVariables> & ({ variables: GetAgentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAgentQuery, GetAgentQueryVariables>(GetAgentDocument, options);
      }
export function useGetAgentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAgentQuery, GetAgentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAgentQuery, GetAgentQueryVariables>(GetAgentDocument, options);
        }
export function useGetAgentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAgentQuery, GetAgentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAgentQuery, GetAgentQueryVariables>(GetAgentDocument, options);
        }
export type GetAgentQueryHookResult = ReturnType<typeof useGetAgentQuery>;
export type GetAgentLazyQueryHookResult = ReturnType<typeof useGetAgentLazyQuery>;
export type GetAgentSuspenseQueryHookResult = ReturnType<typeof useGetAgentSuspenseQuery>;
export type GetAgentQueryResult = Apollo.QueryResult<GetAgentQuery, GetAgentQueryVariables>;
export const GetAllCapabilitiesDocument = gql`
    query getAllCapabilities($logicalCollection: String) {
  getAllCapabilities(logicalCollection: $logicalCollection) {
    id
    prompts {
      name
      id
      text
    }
    alias
    name
    llmModel
    description
    outputMode
    subscriptionFilter
    outputFilter
  }
}
    `;

/**
 * __useGetAllCapabilitiesQuery__
 *
 * To run a query within a React component, call `useGetAllCapabilitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCapabilitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCapabilitiesQuery({
 *   variables: {
 *      logicalCollection: // value for 'logicalCollection'
 *   },
 * });
 */
export function useGetAllCapabilitiesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCapabilitiesQuery, GetAllCapabilitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCapabilitiesQuery, GetAllCapabilitiesQueryVariables>(GetAllCapabilitiesDocument, options);
      }
export function useGetAllCapabilitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCapabilitiesQuery, GetAllCapabilitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCapabilitiesQuery, GetAllCapabilitiesQueryVariables>(GetAllCapabilitiesDocument, options);
        }
export function useGetAllCapabilitiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCapabilitiesQuery, GetAllCapabilitiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCapabilitiesQuery, GetAllCapabilitiesQueryVariables>(GetAllCapabilitiesDocument, options);
        }
export type GetAllCapabilitiesQueryHookResult = ReturnType<typeof useGetAllCapabilitiesQuery>;
export type GetAllCapabilitiesLazyQueryHookResult = ReturnType<typeof useGetAllCapabilitiesLazyQuery>;
export type GetAllCapabilitiesSuspenseQueryHookResult = ReturnType<typeof useGetAllCapabilitiesSuspenseQuery>;
export type GetAllCapabilitiesQueryResult = Apollo.QueryResult<GetAllCapabilitiesQuery, GetAllCapabilitiesQueryVariables>;
export const GetCapabilityDocument = gql`
    query getCapability($capabilityId: ID!) {
  getCapability(capabilityId: $capabilityId) {
    id
    llmModel
    prompts {
      name
      id
      text
    }
    alias
    name
    description
    outputMode
    subscriptionFilter
    outputFilter
  }
}
    `;

/**
 * __useGetCapabilityQuery__
 *
 * To run a query within a React component, call `useGetCapabilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCapabilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCapabilityQuery({
 *   variables: {
 *      capabilityId: // value for 'capabilityId'
 *   },
 * });
 */
export function useGetCapabilityQuery(baseOptions: Apollo.QueryHookOptions<GetCapabilityQuery, GetCapabilityQueryVariables> & ({ variables: GetCapabilityQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCapabilityQuery, GetCapabilityQueryVariables>(GetCapabilityDocument, options);
      }
export function useGetCapabilityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCapabilityQuery, GetCapabilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCapabilityQuery, GetCapabilityQueryVariables>(GetCapabilityDocument, options);
        }
export function useGetCapabilitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCapabilityQuery, GetCapabilityQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCapabilityQuery, GetCapabilityQueryVariables>(GetCapabilityDocument, options);
        }
export type GetCapabilityQueryHookResult = ReturnType<typeof useGetCapabilityQuery>;
export type GetCapabilityLazyQueryHookResult = ReturnType<typeof useGetCapabilityLazyQuery>;
export type GetCapabilitySuspenseQueryHookResult = ReturnType<typeof useGetCapabilitySuspenseQuery>;
export type GetCapabilityQueryResult = Apollo.QueryResult<GetCapabilityQuery, GetCapabilityQueryVariables>;
export const GetAllPromptsDocument = gql`
    query getAllPrompts($logicalCollection: String) {
  getAllPrompts(logicalCollection: $logicalCollection) {
    id
    name
    text
  }
}
    `;

/**
 * __useGetAllPromptsQuery__
 *
 * To run a query within a React component, call `useGetAllPromptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPromptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPromptsQuery({
 *   variables: {
 *      logicalCollection: // value for 'logicalCollection'
 *   },
 * });
 */
export function useGetAllPromptsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllPromptsQuery, GetAllPromptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPromptsQuery, GetAllPromptsQueryVariables>(GetAllPromptsDocument, options);
      }
export function useGetAllPromptsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPromptsQuery, GetAllPromptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPromptsQuery, GetAllPromptsQueryVariables>(GetAllPromptsDocument, options);
        }
export function useGetAllPromptsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPromptsQuery, GetAllPromptsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllPromptsQuery, GetAllPromptsQueryVariables>(GetAllPromptsDocument, options);
        }
export type GetAllPromptsQueryHookResult = ReturnType<typeof useGetAllPromptsQuery>;
export type GetAllPromptsLazyQueryHookResult = ReturnType<typeof useGetAllPromptsLazyQuery>;
export type GetAllPromptsSuspenseQueryHookResult = ReturnType<typeof useGetAllPromptsSuspenseQuery>;
export type GetAllPromptsQueryResult = Apollo.QueryResult<GetAllPromptsQuery, GetAllPromptsQueryVariables>;
export const GetPromptDocument = gql`
    query getPrompt($promptId: ID!) {
  getPrompt(promptId: $promptId) {
    id
    name
    text
  }
}
    `;

/**
 * __useGetPromptQuery__
 *
 * To run a query within a React component, call `useGetPromptQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPromptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPromptQuery({
 *   variables: {
 *      promptId: // value for 'promptId'
 *   },
 * });
 */
export function useGetPromptQuery(baseOptions: Apollo.QueryHookOptions<GetPromptQuery, GetPromptQueryVariables> & ({ variables: GetPromptQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPromptQuery, GetPromptQueryVariables>(GetPromptDocument, options);
      }
export function useGetPromptLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPromptQuery, GetPromptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPromptQuery, GetPromptQueryVariables>(GetPromptDocument, options);
        }
export function useGetPromptSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPromptQuery, GetPromptQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPromptQuery, GetPromptQueryVariables>(GetPromptDocument, options);
        }
export type GetPromptQueryHookResult = ReturnType<typeof useGetPromptQuery>;
export type GetPromptLazyQueryHookResult = ReturnType<typeof useGetPromptLazyQuery>;
export type GetPromptSuspenseQueryHookResult = ReturnType<typeof useGetPromptSuspenseQuery>;
export type GetPromptQueryResult = Apollo.QueryResult<GetPromptQuery, GetPromptQueryVariables>;
export const GetInquiryDocument = gql`
    query getInquiry($id: ID!) {
  getInquiry(id: $id) {
    id
    data
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetInquiryQuery__
 *
 * To run a query within a React component, call `useGetInquiryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInquiryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInquiryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInquiryQuery(baseOptions: Apollo.QueryHookOptions<GetInquiryQuery, GetInquiryQueryVariables> & ({ variables: GetInquiryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInquiryQuery, GetInquiryQueryVariables>(GetInquiryDocument, options);
      }
export function useGetInquiryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInquiryQuery, GetInquiryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInquiryQuery, GetInquiryQueryVariables>(GetInquiryDocument, options);
        }
export function useGetInquirySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInquiryQuery, GetInquiryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInquiryQuery, GetInquiryQueryVariables>(GetInquiryDocument, options);
        }
export type GetInquiryQueryHookResult = ReturnType<typeof useGetInquiryQuery>;
export type GetInquiryLazyQueryHookResult = ReturnType<typeof useGetInquiryLazyQuery>;
export type GetInquirySuspenseQueryHookResult = ReturnType<typeof useGetInquirySuspenseQuery>;
export type GetInquiryQueryResult = Apollo.QueryResult<GetInquiryQuery, GetInquiryQueryVariables>;
export const GetInquiriesDocument = gql`
    query getInquiries {
  getInquiries {
    id
    userId
    data
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetInquiriesQuery__
 *
 * To run a query within a React component, call `useGetInquiriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInquiriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInquiriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInquiriesQuery(baseOptions?: Apollo.QueryHookOptions<GetInquiriesQuery, GetInquiriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInquiriesQuery, GetInquiriesQueryVariables>(GetInquiriesDocument, options);
      }
export function useGetInquiriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInquiriesQuery, GetInquiriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInquiriesQuery, GetInquiriesQueryVariables>(GetInquiriesDocument, options);
        }
export function useGetInquiriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInquiriesQuery, GetInquiriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInquiriesQuery, GetInquiriesQueryVariables>(GetInquiriesDocument, options);
        }
export type GetInquiriesQueryHookResult = ReturnType<typeof useGetInquiriesQuery>;
export type GetInquiriesLazyQueryHookResult = ReturnType<typeof useGetInquiriesLazyQuery>;
export type GetInquiriesSuspenseQueryHookResult = ReturnType<typeof useGetInquiriesSuspenseQuery>;
export type GetInquiriesQueryResult = Apollo.QueryResult<GetInquiriesQuery, GetInquiriesQueryVariables>;
export const GetInquiryResponsesDocument = gql`
    query getInquiryResponses($id: ID!) {
  getInquiryResponses(id: $id) {
    id
    userId
    data {
      userDetails
      history
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetInquiryResponsesQuery__
 *
 * To run a query within a React component, call `useGetInquiryResponsesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInquiryResponsesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInquiryResponsesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInquiryResponsesQuery(baseOptions: Apollo.QueryHookOptions<GetInquiryResponsesQuery, GetInquiryResponsesQueryVariables> & ({ variables: GetInquiryResponsesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInquiryResponsesQuery, GetInquiryResponsesQueryVariables>(GetInquiryResponsesDocument, options);
      }
export function useGetInquiryResponsesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInquiryResponsesQuery, GetInquiryResponsesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInquiryResponsesQuery, GetInquiryResponsesQueryVariables>(GetInquiryResponsesDocument, options);
        }
export function useGetInquiryResponsesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInquiryResponsesQuery, GetInquiryResponsesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInquiryResponsesQuery, GetInquiryResponsesQueryVariables>(GetInquiryResponsesDocument, options);
        }
export type GetInquiryResponsesQueryHookResult = ReturnType<typeof useGetInquiryResponsesQuery>;
export type GetInquiryResponsesLazyQueryHookResult = ReturnType<typeof useGetInquiryResponsesLazyQuery>;
export type GetInquiryResponsesSuspenseQueryHookResult = ReturnType<typeof useGetInquiryResponsesSuspenseQuery>;
export type GetInquiryResponsesQueryResult = Apollo.QueryResult<GetInquiryResponsesQuery, GetInquiryResponsesQueryVariables>;
export const GetInquiryResponseCountDocument = gql`
    query getInquiryResponseCount($id: ID!) {
  getInquiryResponseCount(id: $id)
}
    `;

/**
 * __useGetInquiryResponseCountQuery__
 *
 * To run a query within a React component, call `useGetInquiryResponseCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInquiryResponseCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInquiryResponseCountQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInquiryResponseCountQuery(baseOptions: Apollo.QueryHookOptions<GetInquiryResponseCountQuery, GetInquiryResponseCountQueryVariables> & ({ variables: GetInquiryResponseCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInquiryResponseCountQuery, GetInquiryResponseCountQueryVariables>(GetInquiryResponseCountDocument, options);
      }
export function useGetInquiryResponseCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInquiryResponseCountQuery, GetInquiryResponseCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInquiryResponseCountQuery, GetInquiryResponseCountQueryVariables>(GetInquiryResponseCountDocument, options);
        }
export function useGetInquiryResponseCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInquiryResponseCountQuery, GetInquiryResponseCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInquiryResponseCountQuery, GetInquiryResponseCountQueryVariables>(GetInquiryResponseCountDocument, options);
        }
export type GetInquiryResponseCountQueryHookResult = ReturnType<typeof useGetInquiryResponseCountQuery>;
export type GetInquiryResponseCountLazyQueryHookResult = ReturnType<typeof useGetInquiryResponseCountLazyQuery>;
export type GetInquiryResponseCountSuspenseQueryHookResult = ReturnType<typeof useGetInquiryResponseCountSuspenseQuery>;
export type GetInquiryResponseCountQueryResult = Apollo.QueryResult<GetInquiryResponseCountQuery, GetInquiryResponseCountQueryVariables>;
export const GetAllAudioVoicesDocument = gql`
    query getAllAudioVoices {
  getAllAudioVoices {
    id
    name
  }
}
    `;

/**
 * __useGetAllAudioVoicesQuery__
 *
 * To run a query within a React component, call `useGetAllAudioVoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllAudioVoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllAudioVoicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllAudioVoicesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllAudioVoicesQuery, GetAllAudioVoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllAudioVoicesQuery, GetAllAudioVoicesQueryVariables>(GetAllAudioVoicesDocument, options);
      }
export function useGetAllAudioVoicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllAudioVoicesQuery, GetAllAudioVoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllAudioVoicesQuery, GetAllAudioVoicesQueryVariables>(GetAllAudioVoicesDocument, options);
        }
export function useGetAllAudioVoicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllAudioVoicesQuery, GetAllAudioVoicesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllAudioVoicesQuery, GetAllAudioVoicesQueryVariables>(GetAllAudioVoicesDocument, options);
        }
export type GetAllAudioVoicesQueryHookResult = ReturnType<typeof useGetAllAudioVoicesQuery>;
export type GetAllAudioVoicesLazyQueryHookResult = ReturnType<typeof useGetAllAudioVoicesLazyQuery>;
export type GetAllAudioVoicesSuspenseQueryHookResult = ReturnType<typeof useGetAllAudioVoicesSuspenseQuery>;
export type GetAllAudioVoicesQueryResult = Apollo.QueryResult<GetAllAudioVoicesQuery, GetAllAudioVoicesQueryVariables>;
export const GetAllCollectionsDocument = gql`
    query getAllCollections {
  getAllCollections {
    id
    name
  }
}
    `;

/**
 * __useGetAllCollectionsQuery__
 *
 * To run a query within a React component, call `useGetAllCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCollectionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCollectionsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>(GetAllCollectionsDocument, options);
      }
export function useGetAllCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>(GetAllCollectionsDocument, options);
        }
export function useGetAllCollectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>(GetAllCollectionsDocument, options);
        }
export type GetAllCollectionsQueryHookResult = ReturnType<typeof useGetAllCollectionsQuery>;
export type GetAllCollectionsLazyQueryHookResult = ReturnType<typeof useGetAllCollectionsLazyQuery>;
export type GetAllCollectionsSuspenseQueryHookResult = ReturnType<typeof useGetAllCollectionsSuspenseQuery>;
export type GetAllCollectionsQueryResult = Apollo.QueryResult<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>;
export const PredictionAddedDocument = gql`
    subscription predictionAdded($subscriptionId: ID!) {
  predictionAdded(subscriptionId: $subscriptionId) {
    id
    subscriptionId
    result
    type
  }
}
    `;

/**
 * __usePredictionAddedSubscription__
 *
 * To run a query within a React component, call `usePredictionAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePredictionAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePredictionAddedSubscription({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *   },
 * });
 */
export function usePredictionAddedSubscription(baseOptions: Apollo.SubscriptionHookOptions<PredictionAddedSubscription, PredictionAddedSubscriptionVariables> & ({ variables: PredictionAddedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PredictionAddedSubscription, PredictionAddedSubscriptionVariables>(PredictionAddedDocument, options);
      }
export type PredictionAddedSubscriptionHookResult = ReturnType<typeof usePredictionAddedSubscription>;
export type PredictionAddedSubscriptionResult = Apollo.SubscriptionResult<PredictionAddedSubscription>;