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

export type ContactInput = {
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type ContactResponse = {
  __typename?: 'ContactResponse';
  messageId?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
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

export type Model = {
  __typename?: 'Model';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  region: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMediaAsset?: Maybe<AddMediaAssetResponse>;
  addPrediction?: Maybe<Scalars['String']['output']>;
  contact: ContactResponse;
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
  updateInquiryOwners: Inquiry;
  upsertAgent?: Maybe<Agent>;
  upsertCapability?: Maybe<Capability>;
  upsertCollection?: Maybe<Collection>;
  upsertInquiry: Inquiry;
  upsertInquiryResponse: InquiryResponse;
  upsertPrompt?: Maybe<Prompt>;
};


export type MutationAddPredictionArgs = {
  agentId: Scalars['ID']['input'];
  attachments?: InputMaybe<Array<Scalars['JSONObject']['input']>>;
  subscriptionId: Scalars['ID']['input'];
  variables?: InputMaybe<Scalars['JSONObject']['input']>;
};


export type MutationContactArgs = {
  input: ContactInput;
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
  id: Scalars['ID']['output'];
  result?: Maybe<Scalars['String']['output']>;
  subscriptionId: Scalars['ID']['output'];
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
  getInquiryResponse?: Maybe<InquiryResponse>;
  getInquiryResponseCount: Scalars['Int']['output'];
  getInquiryResponses?: Maybe<Array<InquiryResponse>>;
  getInquiryTemplates: Array<Scalars['JSONObject']['output']>;
  getMediaAsset?: Maybe<Scalars['String']['output']>;
  getPrompt?: Maybe<Prompt>;
  getUsersByEmail?: Maybe<Array<Maybe<UserData>>>;
  getUsersById?: Maybe<Array<UserData>>;
  isUserRegistered: Scalars['Boolean']['output'];
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

export type SendContactMutationVariables = Exact<{
  input: ContactInput;
}>;


export type SendContactMutation = { __typename?: 'Mutation', contact: { __typename?: 'ContactResponse', success: boolean, messageId?: string | null } };

export type EmailInquiryToUsersMutationVariables = Exact<{
  userData: Array<UserDataInput> | UserDataInput;
  inquiryId: Scalars['String']['input'];
}>;


export type EmailInquiryToUsersMutation = { __typename?: 'Mutation', emailInquiryToUsers?: string | null };

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

export type PredictionAddedSubscriptionVariables = Exact<{
  subscriptionId: Scalars['ID']['input'];
}>;


export type PredictionAddedSubscription = { __typename?: 'Subscription', predictionAdded?: { __typename?: 'Prediction', id: string, subscriptionId: string, result?: string | null, type: PredictionType } | null };
