/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSONObject: { input: any; output: any; }
};

export type AddMediaAssetResponse = {
  __typename?: 'AddMediaAssetResponse';
  id: Scalars['String']['output'];
  signedUrl: Scalars['String']['output'];
};

export type AddPredictionResponse = {
  __typename?: 'AddPredictionResponse';
  correlationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
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

export type AverageInquiryResponseTime = {
  __typename?: 'AverageInquiryResponseTime';
  minutes: Scalars['Float']['output'];
  responseCount: Scalars['Int']['output'];
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

export type FloatFilter = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
};

export type Inquiry = {
  __typename?: 'Inquiry';
  createdAt: Scalars['Float']['output'];
  data: InquiryData;
  id: Scalars['ID']['output'];
  responses?: Maybe<Array<InquiryResponse>>;
  updatedAt: Scalars['Float']['output'];
  userId?: Maybe<Array<Scalars['ID']['output']>>;
};

export type InquiryData = {
  __typename?: 'InquiryData';
  draftGraph?: Maybe<Scalars['JSONObject']['output']>;
  graph?: Maybe<Scalars['JSONObject']['output']>;
  integrations: Array<Integration>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  settings: InquirySettings;
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
  status: InquiryResponseStatus;
  userDetails?: Maybe<InquiryResponseUserDetails>;
};

export type InquiryResponseFilters = {
  createdAt?: InputMaybe<FloatFilter>;
  email?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
};

export enum InquiryResponseStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type InquiryResponseUserDetails = {
  __typename?: 'InquiryResponseUserDetails';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  recieveEmails?: Maybe<Scalars['Boolean']['output']>;
};

export type InquirySettings = {
  __typename?: 'InquirySettings';
  context?: Maybe<Scalars['String']['output']>;
  goals: Scalars['String']['output'];
  notifications?: Maybe<InquirySettingsNotifications>;
  title: Scalars['String']['output'];
  voice?: Maybe<Scalars['String']['output']>;
};

export type InquirySettingsNotifications = {
  __typename?: 'InquirySettingsNotifications';
  recieveEmailOnResponse?: Maybe<Scalars['Boolean']['output']>;
};

export type Integration = {
  __typename?: 'Integration';
  config: Scalars['JSONObject']['output'];
  createdAt: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Float']['output'];
};

export type IntegrationConnectionResult = {
  __typename?: 'IntegrationConnectionResult';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type IntegrationInput = {
  config: Scalars['JSONObject']['input'];
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type McpTool = {
  __typename?: 'MCPTool';
  description: Scalars['String']['output'];
  inputSchema?: Maybe<Scalars['JSONObject']['output']>;
  name: Scalars['String']['output'];
};

export type McpToolsResult = {
  __typename?: 'MCPToolsResult';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  tools: Array<McpTool>;
};

export type Model = {
  __typename?: 'Model';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  region: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addIntegrationToInquiry: Inquiry;
  addMediaAsset?: Maybe<AddMediaAssetResponse>;
  addPrediction: AddPredictionResponse;
  deleteAgent?: Maybe<Agent>;
  deleteCapability?: Maybe<Capability>;
  deleteCollection?: Maybe<Collection>;
  deleteInquiry?: Maybe<Inquiry>;
  deleteInquiryResponse?: Maybe<InquiryResponse>;
  deleteMediaAsset?: Maybe<Scalars['Int']['output']>;
  deletePrompt?: Maybe<Prompt>;
  emailInquiryToUsers?: Maybe<Scalars['String']['output']>;
  generateAudio?: Maybe<Scalars['String']['output']>;
  registerUser: Scalars['Boolean']['output'];
  removeIntegrationFromInquiry: Inquiry;
  setInquiryIntegrations: Array<Integration>;
  updateInquiryOwners: Inquiry;
  upsertAgent?: Maybe<Agent>;
  upsertCapability?: Maybe<Capability>;
  upsertCollection?: Maybe<Collection>;
  upsertInquiry: Inquiry;
  upsertInquiryResponse: InquiryResponse;
  upsertPrompt?: Maybe<Prompt>;
};


export type MutationAddIntegrationToInquiryArgs = {
  inquiryId: Scalars['ID']['input'];
  integrationId: Scalars['ID']['input'];
};


export type MutationAddPredictionArgs = {
  agentId: Scalars['ID']['input'];
  attachments?: InputMaybe<Array<Scalars['JSONObject']['input']>>;
  inquiryId?: InputMaybe<Scalars['ID']['input']>;
  integrationId?: InputMaybe<Scalars['ID']['input']>;
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


export type MutationDeleteInquiryResponseArgs = {
  id: Scalars['ID']['input'];
  inquiryId: Scalars['ID']['input'];
};


export type MutationDeleteMediaAssetArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePromptArgs = {
  promptId: Scalars['ID']['input'];
};


export type MutationEmailInquiryToUsersArgs = {
  inquiryId: Scalars['String']['input'];
  userData: Array<UserDataInput>;
};


export type MutationGenerateAudioArgs = {
  text: Scalars['String']['input'];
  voice: Scalars['String']['input'];
};


export type MutationRemoveIntegrationFromInquiryArgs = {
  inquiryId: Scalars['ID']['input'];
  integrationId: Scalars['ID']['input'];
};


export type MutationSetInquiryIntegrationsArgs = {
  inquiryId: Scalars['ID']['input'];
  integrations: Array<IntegrationInput>;
};


export type MutationUpdateInquiryOwnersArgs = {
  id: Scalars['ID']['input'];
  owners: Array<Scalars['String']['input']>;
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
  subscriptionId: Scalars['ID']['input'];
};


export type MutationUpsertPromptArgs = {
  prompt: PromptInput;
};

export type Prediction = {
  __typename?: 'Prediction';
  correlationId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  result?: Maybe<Scalars['String']['output']>;
  subscriptionId: Scalars['ID']['output'];
  tokenUsage?: Maybe<TokenUsage>;
  type: PredictionType;
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
  checkIfUsersRespondedToInquiry?: Maybe<Array<Scalars['String']['output']>>;
  getAgent?: Maybe<Agent>;
  getAgentWithPrompts?: Maybe<Agent>;
  getAllAgents: Array<Agent>;
  getAllAudioVoices: Array<Voice>;
  getAllCapabilities: Array<Capability>;
  getAllCollections: Array<Collection>;
  getAllModels: Array<Model>;
  getAllPrompts?: Maybe<Array<Maybe<Prompt>>>;
  getAverageInquiryResponseTime: AverageInquiryResponseTime;
  getCapability?: Maybe<Capability>;
  getCollection?: Maybe<Collection>;
  getInquiries?: Maybe<Array<Inquiry>>;
  getInquiry?: Maybe<Inquiry>;
  getInquiryIntegrations: Array<Integration>;
  getInquiryResponse?: Maybe<InquiryResponse>;
  getInquiryResponseCount: Scalars['Int']['output'];
  getInquiryResponses?: Maybe<Array<InquiryResponse>>;
  getInquiryTemplates: Array<Scalars['JSONObject']['output']>;
  getMCPIntegrationTools: McpToolsResult;
  getMediaAsset?: Maybe<Scalars['String']['output']>;
  getPrompt?: Maybe<Prompt>;
  getUserQuota?: Maybe<Quota>;
  getUsersByEmail?: Maybe<Array<Maybe<UserData>>>;
  getUsersById?: Maybe<Array<UserData>>;
  isUserRegistered: Scalars['Boolean']['output'];
  testMCPIntegration: IntegrationConnectionResult;
};


export type QueryCheckIfUsersRespondedToInquiryArgs = {
  inquiryId: Scalars['ID']['input'];
  userEmails: Array<Scalars['String']['input']>;
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


export type QueryGetAverageInquiryResponseTimeArgs = {
  id: Scalars['ID']['input'];
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


export type QueryGetInquiryIntegrationsArgs = {
  inquiryId: Scalars['ID']['input'];
};


export type QueryGetInquiryResponseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetInquiryResponseCountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetInquiryResponsesArgs = {
  filters?: InputMaybe<InquiryResponseFilters>;
  id: Scalars['ID']['input'];
};


export type QueryGetMcpIntegrationToolsArgs = {
  integrationId: Scalars['ID']['input'];
};


export type QueryGetMediaAssetArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPromptArgs = {
  promptId: Scalars['ID']['input'];
};


export type QueryGetUsersByEmailArgs = {
  userEmails: Array<Scalars['String']['input']>;
};


export type QueryGetUsersByIdArgs = {
  userIds: Array<Scalars['String']['input']>;
};


export type QueryTestMcpIntegrationArgs = {
  integration: IntegrationInput;
};

export type Quota = {
  __typename?: 'Quota';
  allowedTokens: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usedInputTokens: Scalars['Int']['output'];
  usedOutputTokens: Scalars['Int']['output'];
  usedTotalTokens: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};

export enum Role {
  Admin = 'admin',
  Default = 'default',
  Member = 'member'
}

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  predictionAdded?: Maybe<Prediction>;
};


export type SubscriptionPredictionAddedArgs = {
  subscriptionId: Scalars['ID']['input'];
};

export type TokenUsage = {
  __typename?: 'TokenUsage';
  inputTokens: Scalars['Int']['output'];
  outputTokens: Scalars['Int']['output'];
  totalTokens: Scalars['Int']['output'];
};

export type UserData = {
  __typename?: 'UserData';
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  primaryEmailAddress: Scalars['String']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserDataInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lastContacted?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  primaryEmailAddress: Scalars['String']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};

export type Voice = {
  __typename?: 'Voice';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
};

export type GenerateAudioMutationVariables = Exact<{
  voice: Scalars['String']['input'];
  text: Scalars['String']['input'];
}>;


export type GenerateAudioMutation = { __typename?: 'Mutation', generateAudio?: string | null };

export type AddMediaAssetMutationVariables = Exact<{ [key: string]: never; }>;


export type AddMediaAssetMutation = { __typename?: 'Mutation', addMediaAsset?: { __typename?: 'AddMediaAssetResponse', signedUrl: string, id: string } | null };

export type DeleteMediaAssetMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteMediaAssetMutation = { __typename?: 'Mutation', deleteMediaAsset?: number | null };

export type AddPredictionMutationVariables = Exact<{
  subscriptionId: Scalars['ID']['input'];
  agentId: Scalars['ID']['input'];
  input?: InputMaybe<Scalars['JSONObject']['input']>;
  attachments?: InputMaybe<Array<Scalars['JSONObject']['input']> | Scalars['JSONObject']['input']>;
  inquiryId?: InputMaybe<Scalars['ID']['input']>;
  integrationId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AddPredictionMutation = { __typename?: 'Mutation', addPrediction: { __typename?: 'AddPredictionResponse', status: string, correlationId: string } };

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


export type CreateInquiryMutation = { __typename?: 'Mutation', upsertInquiry: { __typename?: 'Inquiry', id: string, createdAt: number, updatedAt: number } };

export type UpdateInquiryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: Scalars['JSONObject']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateInquiryMutation = { __typename?: 'Mutation', upsertInquiry: { __typename?: 'Inquiry', id: string, createdAt: number, updatedAt: number } };

export type UpdateInquiryOwnersMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  owners: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type UpdateInquiryOwnersMutation = { __typename?: 'Mutation', updateInquiryOwners: { __typename?: 'Inquiry', id: string, createdAt: number, updatedAt: number } };

export type DeleteInquiryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteInquiryMutation = { __typename?: 'Mutation', deleteInquiry?: { __typename?: 'Inquiry', id: string } | null };

export type CreateInquiryResponseMutationVariables = Exact<{
  inquiryId: Scalars['ID']['input'];
  subscriptionId: Scalars['ID']['input'];
  data: Scalars['JSONObject']['input'];
}>;


export type CreateInquiryResponseMutation = { __typename?: 'Mutation', upsertInquiryResponse: { __typename?: 'InquiryResponse', id: string } };

export type UpdateInquiryResponseMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  inquiryId: Scalars['ID']['input'];
  subscriptionId: Scalars['ID']['input'];
  data: Scalars['JSONObject']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateInquiryResponseMutation = { __typename?: 'Mutation', upsertInquiryResponse: { __typename?: 'InquiryResponse', id: string } };

export type DeleteInquiryResponseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  inquiryId: Scalars['ID']['input'];
}>;


export type DeleteInquiryResponseMutation = { __typename?: 'Mutation', deleteInquiryResponse?: { __typename?: 'InquiryResponse', id: string } | null };

export type SetInquiryIntegrationsMutationVariables = Exact<{
  inquiryId: Scalars['ID']['input'];
  integrations: Array<IntegrationInput> | IntegrationInput;
}>;


export type SetInquiryIntegrationsMutation = { __typename?: 'Mutation', setInquiryIntegrations: Array<{ __typename?: 'Integration', name: string, description: string, type: string, config: any }> };

export type UpsertCollectionMutationVariables = Exact<{
  input: CollectionInput;
}>;


export type UpsertCollectionMutation = { __typename?: 'Mutation', upsertCollection?: { __typename?: 'Collection', id: string, name: string } | null };

export type DeleteCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID']['input'];
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection?: { __typename?: 'Collection', id: string } | null };

export type RegisterUserMutationVariables = Exact<{ [key: string]: never; }>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: boolean };

export type EmailInquiryToUsersMutationVariables = Exact<{
  userData: Array<UserDataInput> | UserDataInput;
  inquiryId: Scalars['String']['input'];
}>;


export type EmailInquiryToUsersMutation = { __typename?: 'Mutation', emailInquiryToUsers?: string | null };

export type GetUserQuotaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuotaQuery = { __typename?: 'Query', getUserQuota?: { __typename?: 'Quota', userId: string, allowedTokens: number, usedTotalTokens: number, usedInputTokens: number, usedOutputTokens: number, updatedAt: string, createdAt: string } | null };

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


export type GetInquiryQuery = { __typename?: 'Query', getInquiry?: { __typename?: 'Inquiry', id: string, userId?: Array<string> | null, createdAt: number, updatedAt: number, data: { __typename?: 'InquiryData', metadata?: any | null, graph?: any | null, draftGraph?: any | null, settings: { __typename?: 'InquirySettings', title: string, goals: string, voice?: string | null, context?: string | null, notifications?: { __typename?: 'InquirySettingsNotifications', recieveEmailOnResponse?: boolean | null } | null } } } | null };

export type GetUsersByIdQueryVariables = Exact<{
  userIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type GetUsersByIdQuery = { __typename?: 'Query', getUsersById?: Array<{ __typename?: 'UserData', primaryEmailAddress: string, username?: string | null, firstName?: string | null, lastName?: string | null, id: string }> | null };

export type GetUsersByEmailQueryVariables = Exact<{
  userEmails: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type GetUsersByEmailQuery = { __typename?: 'Query', getUsersByEmail?: Array<{ __typename?: 'UserData', primaryEmailAddress: string, username?: string | null, firstName?: string | null, lastName?: string | null, id: string } | null> | null };

export type GetInquiriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInquiriesQuery = { __typename?: 'Query', getInquiries?: Array<{ __typename?: 'Inquiry', id: string, userId?: Array<string> | null, createdAt: number, updatedAt: number, data: { __typename?: 'InquiryData', settings: { __typename?: 'InquirySettings', title: string } } }> | null };

export type GetInquiryResponsesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  filters?: InputMaybe<InquiryResponseFilters>;
}>;


export type GetInquiryResponsesQuery = { __typename?: 'Query', getInquiryResponses?: Array<{ __typename?: 'InquiryResponse', id: string, userId?: string | null, createdAt: number, updatedAt: number, data: { __typename?: 'InquiryResponseData', history: Array<any>, userDetails?: { __typename?: 'InquiryResponseUserDetails', name?: string | null, email?: string | null, recieveEmails?: boolean | null } | null } }> | null };

export type GetInquiryResponseQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInquiryResponseQuery = { __typename?: 'Query', getInquiryResponse?: { __typename?: 'InquiryResponse', id: string, userId?: string | null, createdAt: number, updatedAt: number, data: { __typename?: 'InquiryResponseData', history: Array<any>, userDetails?: { __typename?: 'InquiryResponseUserDetails', name?: string | null, email?: string | null, recieveEmails?: boolean | null } | null } } | null };

export type GetInquiryResponseCountQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInquiryResponseCountQuery = { __typename?: 'Query', getInquiryResponseCount: number };

export type GetAllAudioVoicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAudioVoicesQuery = { __typename?: 'Query', getAllAudioVoices: Array<{ __typename?: 'Voice', id: string, name: string, tags: Array<string> }> };

export type GetMediaAssetQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetMediaAssetQuery = { __typename?: 'Query', getMediaAsset?: string | null };

export type GetAllCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCollectionsQuery = { __typename?: 'Query', getAllCollections: Array<{ __typename?: 'Collection', id: string, name: string }> };

export type IsUserRegisteredQueryVariables = Exact<{ [key: string]: never; }>;


export type IsUserRegisteredQuery = { __typename?: 'Query', isUserRegistered: boolean };

export type GetInquiryTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInquiryTemplatesQuery = { __typename?: 'Query', getInquiryTemplates: Array<any> };

export type CheckIfUsersRespondedToInquiryQueryVariables = Exact<{
  userEmails: Array<Scalars['String']['input']> | Scalars['String']['input'];
  inquiryId: Scalars['ID']['input'];
}>;


export type CheckIfUsersRespondedToInquiryQuery = { __typename?: 'Query', checkIfUsersRespondedToInquiry?: Array<string> | null };

export type GetAverageInquiryResponseTimeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAverageInquiryResponseTimeQuery = { __typename?: 'Query', getAverageInquiryResponseTime: { __typename?: 'AverageInquiryResponseTime', minutes: number, responseCount: number } };

export type GetInquiryIntegrationsQueryVariables = Exact<{
  inquiryId: Scalars['ID']['input'];
}>;


export type GetInquiryIntegrationsQuery = { __typename?: 'Query', getInquiryIntegrations: Array<{ __typename?: 'Integration', id: string, name: string, description: string, type: string, config: any }> };

export type TestMcpIntegrationQueryVariables = Exact<{
  integration: IntegrationInput;
}>;


export type TestMcpIntegrationQuery = { __typename?: 'Query', testMCPIntegration: { __typename?: 'IntegrationConnectionResult', success: boolean, error?: string | null } };

export type GetMcpIntegrationToolsQueryVariables = Exact<{
  integrationId: Scalars['ID']['input'];
}>;


export type GetMcpIntegrationToolsQuery = { __typename?: 'Query', getMCPIntegrationTools: { __typename?: 'MCPToolsResult', success: boolean, error?: string | null, tools: Array<{ __typename?: 'MCPTool', name: string, description: string, inputSchema?: any | null }> } };

export type PredictionAddedSubscriptionVariables = Exact<{
  subscriptionId: Scalars['ID']['input'];
}>;


export type PredictionAddedSubscription = { __typename?: 'Subscription', predictionAdded?: { __typename?: 'Prediction', id: string, subscriptionId: string, result?: string | null, type: PredictionType, tokenUsage?: { __typename?: 'TokenUsage', inputTokens: number, outputTokens: number, totalTokens: number } | null } | null };


export const GenerateAudioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"generateAudio"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"voice"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateAudio"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"voice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"voice"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}]}]}}]} as unknown as DocumentNode<GenerateAudioMutation, GenerateAudioMutationVariables>;
export const AddMediaAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addMediaAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMediaAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddMediaAssetMutation, AddMediaAssetMutationVariables>;
export const DeleteMediaAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMediaAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMediaAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteMediaAssetMutation, DeleteMediaAssetMutationVariables>;
export const AddPredictionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addPrediction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPrediction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"subscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"agentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"variables"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"attachments"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}}},{"kind":"Argument","name":{"kind":"Name","value":"inquiryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"integrationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"correlationId"}}]}}]}}]} as unknown as DocumentNode<AddPredictionMutation, AddPredictionMutationVariables>;
export const UpsertAgentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertAgent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agent"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AgentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertAgent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"reasoning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"llmModel"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"variablePassThrough"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpsertAgentMutation, UpsertAgentMutationVariables>;
export const DeleteAgentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAgent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAgent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteAgentMutation, DeleteAgentMutationVariables>;
export const UpsertCapabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertCapability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"capability"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CapabilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertCapability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"capability"},"value":{"kind":"Variable","name":{"kind":"Name","value":"capability"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"llmModel"}},{"kind":"Field","name":{"kind":"Name","value":"outputMode"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionFilter"}},{"kind":"Field","name":{"kind":"Name","value":"outputFilter"}},{"kind":"Field","name":{"kind":"Name","value":"prompts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]} as unknown as DocumentNode<UpsertCapabilityMutation, UpsertCapabilityMutationVariables>;
export const DeleteCapabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCapability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"capabilityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCapability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"capabilityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"capabilityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteCapabilityMutation, DeleteCapabilityMutationVariables>;
export const UpsertPromptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertPrompt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PromptInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertPrompt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prompt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<UpsertPromptMutation, UpsertPromptMutationVariables>;
export const DeletePromptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deletePrompt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promptId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePrompt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"promptId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promptId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletePromptMutation, DeletePromptMutationVariables>;
export const CreateInquiryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createInquiry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertInquiry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateInquiryMutation, CreateInquiryMutationVariables>;
export const UpdateInquiryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateInquiry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertInquiry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateInquiryMutation, UpdateInquiryMutationVariables>;
export const UpdateInquiryOwnersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateInquiryOwners"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owners"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInquiryOwners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"owners"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owners"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateInquiryOwnersMutation, UpdateInquiryOwnersMutationVariables>;
export const DeleteInquiryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteInquiry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInquiry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteInquiryMutation, DeleteInquiryMutationVariables>;
export const CreateInquiryResponseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createInquiryResponse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertInquiryResponse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inquiryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateInquiryResponseMutation, CreateInquiryResponseMutationVariables>;
export const UpdateInquiryResponseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateInquiryResponse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertInquiryResponse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"inquiryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateInquiryResponseMutation, UpdateInquiryResponseMutationVariables>;
export const DeleteInquiryResponseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteInquiryResponse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInquiryResponse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"inquiryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteInquiryResponseMutation, DeleteInquiryResponseMutationVariables>;
export const SetInquiryIntegrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setInquiryIntegrations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integrations"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IntegrationInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setInquiryIntegrations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inquiryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"integrations"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integrations"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]}}]} as unknown as DocumentNode<SetInquiryIntegrationsMutation, SetInquiryIntegrationsMutationVariables>;
export const UpsertCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpsertCollectionMutation, UpsertCollectionMutationVariables>;
export const DeleteCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteCollectionMutation, DeleteCollectionMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"registerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const EmailInquiryToUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"emailInquiryToUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userData"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserDataInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailInquiryToUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userData"}}},{"kind":"Argument","name":{"kind":"Name","value":"inquiryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}}}]}]}}]} as unknown as DocumentNode<EmailInquiryToUsersMutation, EmailInquiryToUsersMutationVariables>;
export const GetUserQuotaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserQuota"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserQuota"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"allowedTokens"}},{"kind":"Field","name":{"kind":"Name","value":"usedTotalTokens"}},{"kind":"Field","name":{"kind":"Name","value":"usedInputTokens"}},{"kind":"Field","name":{"kind":"Name","value":"usedOutputTokens"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetUserQuotaQuery, GetUserQuotaQueryVariables>;
export const GetAllModelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllModels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllModels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetAllModelsQuery, GetAllModelsQueryVariables>;
export const GetAgentWithPromptsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAgentWithPrompts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAgentWithPrompts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"reasoning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"llmModel"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"variablePassThrough"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prompts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"memoryEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionFilter"}},{"kind":"Field","name":{"kind":"Name","value":"outputFilter"}}]}}]}}]} as unknown as DocumentNode<GetAgentWithPromptsQuery, GetAgentWithPromptsQueryVariables>;
export const GetAllAgentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllAgents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"logicalCollection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllAgents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"logicalCollection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"logicalCollection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllAgentsQuery, GetAllAgentsQueryVariables>;
export const GetAgentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAgent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAgent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"reasoning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"llmModel"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"variablePassThrough"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memoryEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionFilter"}},{"kind":"Field","name":{"kind":"Name","value":"outputFilter"}}]}}]}}]} as unknown as DocumentNode<GetAgentQuery, GetAgentQueryVariables>;
export const GetAllCapabilitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllCapabilities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"logicalCollection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCapabilities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"logicalCollection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"logicalCollection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prompts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"llmModel"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"outputMode"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionFilter"}},{"kind":"Field","name":{"kind":"Name","value":"outputFilter"}}]}}]}}]} as unknown as DocumentNode<GetAllCapabilitiesQuery, GetAllCapabilitiesQueryVariables>;
export const GetCapabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCapability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"capabilityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCapability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"capabilityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"capabilityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"llmModel"}},{"kind":"Field","name":{"kind":"Name","value":"prompts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"outputMode"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionFilter"}},{"kind":"Field","name":{"kind":"Name","value":"outputFilter"}}]}}]}}]} as unknown as DocumentNode<GetCapabilityQuery, GetCapabilityQueryVariables>;
export const GetAllPromptsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllPrompts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"logicalCollection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllPrompts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"logicalCollection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"logicalCollection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<GetAllPromptsQuery, GetAllPromptsQueryVariables>;
export const GetPromptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPrompt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promptId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPrompt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"promptId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promptId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<GetPromptQuery, GetPromptQueryVariables>;
export const GetInquiryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getInquiry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInquiry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"goals"}},{"kind":"Field","name":{"kind":"Name","value":"voice"}},{"kind":"Field","name":{"kind":"Name","value":"context"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recieveEmailOnResponse"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"graph"}},{"kind":"Field","name":{"kind":"Name","value":"draftGraph"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetInquiryQuery, GetInquiryQueryVariables>;
export const GetUsersByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsersById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetUsersByIdQuery, GetUsersByIdQueryVariables>;
export const GetUsersByEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsersByEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userEmails"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersByEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userEmails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userEmails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetUsersByEmailQuery, GetUsersByEmailQueryVariables>;
export const GetInquiriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getInquiries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInquiries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetInquiriesQuery, GetInquiriesQueryVariables>;
export const GetInquiryResponsesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getInquiryResponses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InquiryResponseFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInquiryResponses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"recieveEmails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetInquiryResponsesQuery, GetInquiryResponsesQueryVariables>;
export const GetInquiryResponseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getInquiryResponse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInquiryResponse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"recieveEmails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetInquiryResponseQuery, GetInquiryResponseQueryVariables>;
export const GetInquiryResponseCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getInquiryResponseCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInquiryResponseCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<GetInquiryResponseCountQuery, GetInquiryResponseCountQueryVariables>;
export const GetAllAudioVoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllAudioVoices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllAudioVoices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<GetAllAudioVoicesQuery, GetAllAudioVoicesQueryVariables>;
export const GetMediaAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMediaAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMediaAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<GetMediaAssetQuery, GetMediaAssetQueryVariables>;
export const GetAllCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>;
export const IsUserRegisteredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"isUserRegistered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isUserRegistered"}}]}}]} as unknown as DocumentNode<IsUserRegisteredQuery, IsUserRegisteredQueryVariables>;
export const GetInquiryTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getInquiryTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInquiryTemplates"}}]}}]} as unknown as DocumentNode<GetInquiryTemplatesQuery, GetInquiryTemplatesQueryVariables>;
export const CheckIfUsersRespondedToInquiryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkIfUsersRespondedToInquiry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userEmails"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkIfUsersRespondedToInquiry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userEmails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userEmails"}}},{"kind":"Argument","name":{"kind":"Name","value":"inquiryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}}}]}]}}]} as unknown as DocumentNode<CheckIfUsersRespondedToInquiryQuery, CheckIfUsersRespondedToInquiryQueryVariables>;
export const GetAverageInquiryResponseTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAverageInquiryResponseTime"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAverageInquiryResponseTime"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minutes"}},{"kind":"Field","name":{"kind":"Name","value":"responseCount"}}]}}]}}]} as unknown as DocumentNode<GetAverageInquiryResponseTimeQuery, GetAverageInquiryResponseTimeQueryVariables>;
export const GetInquiryIntegrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getInquiryIntegrations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInquiryIntegrations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inquiryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inquiryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]}}]} as unknown as DocumentNode<GetInquiryIntegrationsQuery, GetInquiryIntegrationsQueryVariables>;
export const TestMcpIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"testMCPIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IntegrationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testMCPIntegration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"integration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<TestMcpIntegrationQuery, TestMcpIntegrationQueryVariables>;
export const GetMcpIntegrationToolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMCPIntegrationTools"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMCPIntegrationTools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"integrationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"tools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"inputSchema"}}]}}]}}]}}]} as unknown as DocumentNode<GetMcpIntegrationToolsQuery, GetMcpIntegrationToolsQueryVariables>;
export const PredictionAddedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"predictionAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"predictionAdded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"subscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tokenUsage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inputTokens"}},{"kind":"Field","name":{"kind":"Name","value":"outputTokens"}},{"kind":"Field","name":{"kind":"Name","value":"totalTokens"}}]}}]}}]}}]} as unknown as DocumentNode<PredictionAddedSubscription, PredictionAddedSubscriptionVariables>;