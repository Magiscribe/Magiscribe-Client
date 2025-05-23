/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation generateAudio($voice: String!, $text: String!) {\n    generateAudio(voice: $voice, text: $text)\n  }\n": typeof types.GenerateAudioDocument,
    "\n  mutation addMediaAsset {\n    addMediaAsset {\n      signedUrl\n      id\n    }\n  }\n": typeof types.AddMediaAssetDocument,
    "\n  mutation deleteMediaAsset($id: String!) {\n    deleteMediaAsset(id: $id)\n  }\n": typeof types.DeleteMediaAssetDocument,
    "\n  mutation addPrediction($subscriptionId: ID!, $agentId: ID!, $input: JSONObject, $attachments: [JSONObject!]) {\n    addPrediction(subscriptionId: $subscriptionId, agentId: $agentId, variables: $input, attachments: $attachments)\n  }\n": typeof types.AddPredictionDocument,
    "\n  mutation upsertAgent($agent: AgentInput!) {\n    upsertAgent(agent: $agent) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        id\n      }\n    }\n  }\n": typeof types.UpsertAgentDocument,
    "\n  mutation deleteAgent($agentId: ID!) {\n    deleteAgent(agentId: $agentId) {\n      id\n    }\n  }\n": typeof types.DeleteAgentDocument,
    "\n  mutation upsertCapability($capability: CapabilityInput!) {\n    upsertCapability(capability: $capability) {\n      id\n      name\n      alias\n      description\n      llmModel\n      outputMode\n      subscriptionFilter\n      outputFilter\n      prompts {\n        id\n        name\n        text\n      }\n    }\n  }\n": typeof types.UpsertCapabilityDocument,
    "\n  mutation deleteCapability($capabilityId: ID!) {\n    deleteCapability(capabilityId: $capabilityId) {\n      id\n    }\n  }\n": typeof types.DeleteCapabilityDocument,
    "\n  mutation upsertPrompt($prompt: PromptInput!) {\n    upsertPrompt(prompt: $prompt) {\n      id\n      name\n      text\n    }\n  }\n": typeof types.UpsertPromptDocument,
    "\n  mutation deletePrompt($promptId: ID!) {\n    deletePrompt(promptId: $promptId) {\n      id\n    }\n  }\n": typeof types.DeletePromptDocument,
    "\n  mutation createInquiry($data: JSONObject!) {\n    upsertInquiry(data: $data) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateInquiryDocument,
    "\n  mutation updateInquiry($id: ID!, $data: JSONObject!, $fields: [String!]) {\n    upsertInquiry(id: $id, data: $data, fields: $fields) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateInquiryDocument,
    "\n  mutation updateInquiryOwners($id: ID!, $owners: [String!]!) {\n    updateInquiryOwners(id: $id, owners: $owners) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateInquiryOwnersDocument,
    "\n  mutation deleteInquiry($id: ID!) {\n    deleteInquiry(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteInquiryDocument,
    "\n  mutation createInquiryResponse($inquiryId: ID!, $subscriptionId: ID!, $data: JSONObject!) {\n    upsertInquiryResponse(inquiryId: $inquiryId, subscriptionId: $subscriptionId, data: $data) {\n      id\n    }\n  }\n": typeof types.CreateInquiryResponseDocument,
    "\n  mutation updateInquiryResponse(\n    $id: ID\n    $inquiryId: ID!\n    $subscriptionId: ID!\n    $data: JSONObject!\n    $fields: [String!]\n  ) {\n    upsertInquiryResponse(\n      id: $id\n      inquiryId: $inquiryId\n      subscriptionId: $subscriptionId\n      data: $data\n      fields: $fields\n    ) {\n      id\n    }\n  }\n": typeof types.UpdateInquiryResponseDocument,
    "\n  mutation deleteInquiryResponse($id: ID!, $inquiryId: ID!) {\n    deleteInquiryResponse(id: $id, inquiryId: $inquiryId) {\n      id\n    }\n  }\n": typeof types.DeleteInquiryResponseDocument,
    "\n  mutation upsertCollection($input: CollectionInput!) {\n    upsertCollection(input: $input) {\n      id\n      name\n    }\n  }\n": typeof types.UpsertCollectionDocument,
    "\n  mutation deleteCollection($collectionId: ID!) {\n    deleteCollection(collectionId: $collectionId) {\n      id\n    }\n  }\n": typeof types.DeleteCollectionDocument,
    "\n  mutation registerUser {\n    registerUser\n  }\n": typeof types.RegisterUserDocument,
    "\n  mutation sendContact($input: ContactInput!) {\n    contact(input: $input) {\n      success\n      messageId\n    }\n  }\n": typeof types.SendContactDocument,
    "\n  mutation emailInquiryToUsers($userData: [UserDataInput!]!, $inquiryId: String!) {\n    emailInquiryToUsers(userData: $userData, inquiryId: $inquiryId)\n  }\n": typeof types.EmailInquiryToUsersDocument,
    "\n  query getAllModels {\n    getAllModels {\n      id\n      name\n    }\n  }\n": typeof types.GetAllModelsDocument,
    "\n  query getAgentWithPrompts($agentId: ID!) {\n    getAgentWithPrompts(agentId: $agentId) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        name\n        id\n        prompts {\n          name\n          id\n          text\n        }\n      }\n      memoryEnabled\n      subscriptionFilter\n      outputFilter\n    }\n  }\n": typeof types.GetAgentWithPromptsDocument,
    "\n  query getAllAgents($logicalCollection: String) {\n    getAllAgents(logicalCollection: $logicalCollection) {\n      id\n      name\n      description\n      capabilities {\n        name\n        id\n      }\n    }\n  }\n": typeof types.GetAllAgentsDocument,
    "\n  query getAgent($agentId: ID!) {\n    getAgent(agentId: $agentId) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        name\n        id\n      }\n      memoryEnabled\n      subscriptionFilter\n      outputFilter\n    }\n  }\n": typeof types.GetAgentDocument,
    "\n  query getAllCapabilities($logicalCollection: String) {\n    getAllCapabilities(logicalCollection: $logicalCollection) {\n      id\n      prompts {\n        name\n        id\n        text\n      }\n      alias\n      name\n      llmModel\n      description\n      outputMode\n      subscriptionFilter\n      outputFilter\n    }\n  }\n": typeof types.GetAllCapabilitiesDocument,
    "\n  query getCapability($capabilityId: ID!) {\n    getCapability(capabilityId: $capabilityId) {\n      id\n      llmModel\n      prompts {\n        name\n        id\n        text\n      }\n      alias\n      name\n      description\n      outputMode\n      subscriptionFilter\n      outputFilter\n    }\n  }\n": typeof types.GetCapabilityDocument,
    "\n  query getAllPrompts($logicalCollection: String) {\n    getAllPrompts(logicalCollection: $logicalCollection) {\n      id\n      name\n      text\n    }\n  }\n": typeof types.GetAllPromptsDocument,
    "\n  query getPrompt($promptId: ID!) {\n    getPrompt(promptId: $promptId) {\n      id\n      name\n      text\n    }\n  }\n": typeof types.GetPromptDocument,
    "\n  query getInquiry($id: ID!) {\n    getInquiry(id: $id) {\n      id\n      userId\n      data {\n        settings {\n          title\n          goals\n          voice\n          context\n          notifications {\n            recieveEmailOnResponse\n          }\n        }\n        metadata\n        graph\n        draftGraph\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetInquiryDocument,
    "\n  query getUsersById($userIds: [String!]!) {\n    getUsersById(userIds: $userIds) {\n      primaryEmailAddress\n      username\n      firstName\n      lastName\n      id\n    }\n  }\n": typeof types.GetUsersByIdDocument,
    "\n  query getUsersByEmail($userEmails: [String!]!) {\n    getUsersByEmail(userEmails: $userEmails) {\n      primaryEmailAddress\n      username\n      firstName\n      lastName\n      id\n    }\n  }\n": typeof types.GetUsersByEmailDocument,
    "\n  query getInquiries {\n    getInquiries {\n      id\n      userId\n      data {\n        settings {\n          title\n        }\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetInquiriesDocument,
    "\n  query getInquiryResponses($id: ID!, $filters: InquiryResponseFilters) {\n    getInquiryResponses(id: $id, filters: $filters) {\n      id\n      userId\n      data {\n        userDetails {\n          name\n          email\n          recieveEmails\n        }\n        history\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetInquiryResponsesDocument,
    "\n  query getInquiryResponse($id: ID!) {\n    getInquiryResponse(id: $id) {\n      id\n      userId\n      data {\n        userDetails {\n          name\n          email\n          recieveEmails\n        }\n        history\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetInquiryResponseDocument,
    "\n  query getInquiryResponseCount($id: ID!) {\n    getInquiryResponseCount(id: $id)\n  }\n": typeof types.GetInquiryResponseCountDocument,
    "\n  query getAllAudioVoices {\n    getAllAudioVoices {\n      id\n      name\n      tags\n    }\n  }\n": typeof types.GetAllAudioVoicesDocument,
    "\n  query getMediaAsset($id: String!) {\n    getMediaAsset(id: $id)\n  }\n": typeof types.GetMediaAssetDocument,
    "\n  query getAllCollections {\n    getAllCollections {\n      id\n      name\n    }\n  }\n": typeof types.GetAllCollectionsDocument,
    "\n  query isUserRegistered {\n    isUserRegistered\n  }\n": typeof types.IsUserRegisteredDocument,
    "\n  query getInquiryTemplates {\n    getInquiryTemplates\n  }\n": typeof types.GetInquiryTemplatesDocument,
    "\n  query checkIfUsersRespondedToInquiry($userEmails: [String!]!, $inquiryId: ID!) {\n    checkIfUsersRespondedToInquiry(userEmails: $userEmails, inquiryId: $inquiryId)\n  }\n": typeof types.CheckIfUsersRespondedToInquiryDocument,
    "\n  query getAverageInquiryResponseTime($id: ID!) {\n    getAverageInquiryResponseTime(id: $id) {  \n      minutes\n      responseCount\n    }\n  }\n": typeof types.GetAverageInquiryResponseTimeDocument,
    "\n  subscription predictionAdded($subscriptionId: ID!) {\n    predictionAdded(subscriptionId: $subscriptionId) {\n      id\n      subscriptionId\n      result\n      type\n    }\n  }\n": typeof types.PredictionAddedDocument,
};
const documents: Documents = {
    "\n  mutation generateAudio($voice: String!, $text: String!) {\n    generateAudio(voice: $voice, text: $text)\n  }\n": types.GenerateAudioDocument,
    "\n  mutation addMediaAsset {\n    addMediaAsset {\n      signedUrl\n      id\n    }\n  }\n": types.AddMediaAssetDocument,
    "\n  mutation deleteMediaAsset($id: String!) {\n    deleteMediaAsset(id: $id)\n  }\n": types.DeleteMediaAssetDocument,
    "\n  mutation addPrediction($subscriptionId: ID!, $agentId: ID!, $input: JSONObject, $attachments: [JSONObject!]) {\n    addPrediction(subscriptionId: $subscriptionId, agentId: $agentId, variables: $input, attachments: $attachments)\n  }\n": types.AddPredictionDocument,
    "\n  mutation upsertAgent($agent: AgentInput!) {\n    upsertAgent(agent: $agent) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        id\n      }\n    }\n  }\n": types.UpsertAgentDocument,
    "\n  mutation deleteAgent($agentId: ID!) {\n    deleteAgent(agentId: $agentId) {\n      id\n    }\n  }\n": types.DeleteAgentDocument,
    "\n  mutation upsertCapability($capability: CapabilityInput!) {\n    upsertCapability(capability: $capability) {\n      id\n      name\n      alias\n      description\n      llmModel\n      outputMode\n      subscriptionFilter\n      outputFilter\n      prompts {\n        id\n        name\n        text\n      }\n    }\n  }\n": types.UpsertCapabilityDocument,
    "\n  mutation deleteCapability($capabilityId: ID!) {\n    deleteCapability(capabilityId: $capabilityId) {\n      id\n    }\n  }\n": types.DeleteCapabilityDocument,
    "\n  mutation upsertPrompt($prompt: PromptInput!) {\n    upsertPrompt(prompt: $prompt) {\n      id\n      name\n      text\n    }\n  }\n": types.UpsertPromptDocument,
    "\n  mutation deletePrompt($promptId: ID!) {\n    deletePrompt(promptId: $promptId) {\n      id\n    }\n  }\n": types.DeletePromptDocument,
    "\n  mutation createInquiry($data: JSONObject!) {\n    upsertInquiry(data: $data) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateInquiryDocument,
    "\n  mutation updateInquiry($id: ID!, $data: JSONObject!, $fields: [String!]) {\n    upsertInquiry(id: $id, data: $data, fields: $fields) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateInquiryDocument,
    "\n  mutation updateInquiryOwners($id: ID!, $owners: [String!]!) {\n    updateInquiryOwners(id: $id, owners: $owners) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateInquiryOwnersDocument,
    "\n  mutation deleteInquiry($id: ID!) {\n    deleteInquiry(id: $id) {\n      id\n    }\n  }\n": types.DeleteInquiryDocument,
    "\n  mutation createInquiryResponse($inquiryId: ID!, $subscriptionId: ID!, $data: JSONObject!) {\n    upsertInquiryResponse(inquiryId: $inquiryId, subscriptionId: $subscriptionId, data: $data) {\n      id\n    }\n  }\n": types.CreateInquiryResponseDocument,
    "\n  mutation updateInquiryResponse(\n    $id: ID\n    $inquiryId: ID!\n    $subscriptionId: ID!\n    $data: JSONObject!\n    $fields: [String!]\n  ) {\n    upsertInquiryResponse(\n      id: $id\n      inquiryId: $inquiryId\n      subscriptionId: $subscriptionId\n      data: $data\n      fields: $fields\n    ) {\n      id\n    }\n  }\n": types.UpdateInquiryResponseDocument,
    "\n  mutation deleteInquiryResponse($id: ID!, $inquiryId: ID!) {\n    deleteInquiryResponse(id: $id, inquiryId: $inquiryId) {\n      id\n    }\n  }\n": types.DeleteInquiryResponseDocument,
    "\n  mutation upsertCollection($input: CollectionInput!) {\n    upsertCollection(input: $input) {\n      id\n      name\n    }\n  }\n": types.UpsertCollectionDocument,
    "\n  mutation deleteCollection($collectionId: ID!) {\n    deleteCollection(collectionId: $collectionId) {\n      id\n    }\n  }\n": types.DeleteCollectionDocument,
    "\n  mutation registerUser {\n    registerUser\n  }\n": types.RegisterUserDocument,
    "\n  mutation sendContact($input: ContactInput!) {\n    contact(input: $input) {\n      success\n      messageId\n    }\n  }\n": types.SendContactDocument,
    "\n  mutation emailInquiryToUsers($userData: [UserDataInput!]!, $inquiryId: String!) {\n    emailInquiryToUsers(userData: $userData, inquiryId: $inquiryId)\n  }\n": types.EmailInquiryToUsersDocument,
    "\n  query getAllModels {\n    getAllModels {\n      id\n      name\n    }\n  }\n": types.GetAllModelsDocument,
    "\n  query getAgentWithPrompts($agentId: ID!) {\n    getAgentWithPrompts(agentId: $agentId) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        name\n        id\n        prompts {\n          name\n          id\n          text\n        }\n      }\n      memoryEnabled\n      subscriptionFilter\n      outputFilter\n    }\n  }\n": types.GetAgentWithPromptsDocument,
    "\n  query getAllAgents($logicalCollection: String) {\n    getAllAgents(logicalCollection: $logicalCollection) {\n      id\n      name\n      description\n      capabilities {\n        name\n        id\n      }\n    }\n  }\n": types.GetAllAgentsDocument,
    "\n  query getAgent($agentId: ID!) {\n    getAgent(agentId: $agentId) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        name\n        id\n      }\n      memoryEnabled\n      subscriptionFilter\n      outputFilter\n    }\n  }\n": types.GetAgentDocument,
    "\n  query getAllCapabilities($logicalCollection: String) {\n    getAllCapabilities(logicalCollection: $logicalCollection) {\n      id\n      prompts {\n        name\n        id\n        text\n      }\n      alias\n      name\n      llmModel\n      description\n      outputMode\n      subscriptionFilter\n      outputFilter\n    }\n  }\n": types.GetAllCapabilitiesDocument,
    "\n  query getCapability($capabilityId: ID!) {\n    getCapability(capabilityId: $capabilityId) {\n      id\n      llmModel\n      prompts {\n        name\n        id\n        text\n      }\n      alias\n      name\n      description\n      outputMode\n      subscriptionFilter\n      outputFilter\n    }\n  }\n": types.GetCapabilityDocument,
    "\n  query getAllPrompts($logicalCollection: String) {\n    getAllPrompts(logicalCollection: $logicalCollection) {\n      id\n      name\n      text\n    }\n  }\n": types.GetAllPromptsDocument,
    "\n  query getPrompt($promptId: ID!) {\n    getPrompt(promptId: $promptId) {\n      id\n      name\n      text\n    }\n  }\n": types.GetPromptDocument,
    "\n  query getInquiry($id: ID!) {\n    getInquiry(id: $id) {\n      id\n      userId\n      data {\n        settings {\n          title\n          goals\n          voice\n          context\n          notifications {\n            recieveEmailOnResponse\n          }\n        }\n        metadata\n        graph\n        draftGraph\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetInquiryDocument,
    "\n  query getUsersById($userIds: [String!]!) {\n    getUsersById(userIds: $userIds) {\n      primaryEmailAddress\n      username\n      firstName\n      lastName\n      id\n    }\n  }\n": types.GetUsersByIdDocument,
    "\n  query getUsersByEmail($userEmails: [String!]!) {\n    getUsersByEmail(userEmails: $userEmails) {\n      primaryEmailAddress\n      username\n      firstName\n      lastName\n      id\n    }\n  }\n": types.GetUsersByEmailDocument,
    "\n  query getInquiries {\n    getInquiries {\n      id\n      userId\n      data {\n        settings {\n          title\n        }\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetInquiriesDocument,
    "\n  query getInquiryResponses($id: ID!, $filters: InquiryResponseFilters) {\n    getInquiryResponses(id: $id, filters: $filters) {\n      id\n      userId\n      data {\n        userDetails {\n          name\n          email\n          recieveEmails\n        }\n        history\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetInquiryResponsesDocument,
    "\n  query getInquiryResponse($id: ID!) {\n    getInquiryResponse(id: $id) {\n      id\n      userId\n      data {\n        userDetails {\n          name\n          email\n          recieveEmails\n        }\n        history\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetInquiryResponseDocument,
    "\n  query getInquiryResponseCount($id: ID!) {\n    getInquiryResponseCount(id: $id)\n  }\n": types.GetInquiryResponseCountDocument,
    "\n  query getAllAudioVoices {\n    getAllAudioVoices {\n      id\n      name\n      tags\n    }\n  }\n": types.GetAllAudioVoicesDocument,
    "\n  query getMediaAsset($id: String!) {\n    getMediaAsset(id: $id)\n  }\n": types.GetMediaAssetDocument,
    "\n  query getAllCollections {\n    getAllCollections {\n      id\n      name\n    }\n  }\n": types.GetAllCollectionsDocument,
    "\n  query isUserRegistered {\n    isUserRegistered\n  }\n": types.IsUserRegisteredDocument,
    "\n  query getInquiryTemplates {\n    getInquiryTemplates\n  }\n": types.GetInquiryTemplatesDocument,
    "\n  query checkIfUsersRespondedToInquiry($userEmails: [String!]!, $inquiryId: ID!) {\n    checkIfUsersRespondedToInquiry(userEmails: $userEmails, inquiryId: $inquiryId)\n  }\n": types.CheckIfUsersRespondedToInquiryDocument,
    "\n  query getAverageInquiryResponseTime($id: ID!) {\n    getAverageInquiryResponseTime(id: $id) {  \n      minutes\n      responseCount\n    }\n  }\n": types.GetAverageInquiryResponseTimeDocument,
    "\n  subscription predictionAdded($subscriptionId: ID!) {\n    predictionAdded(subscriptionId: $subscriptionId) {\n      id\n      subscriptionId\n      result\n      type\n    }\n  }\n": types.PredictionAddedDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation generateAudio($voice: String!, $text: String!) {\n    generateAudio(voice: $voice, text: $text)\n  }\n"): (typeof documents)["\n  mutation generateAudio($voice: String!, $text: String!) {\n    generateAudio(voice: $voice, text: $text)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation addMediaAsset {\n    addMediaAsset {\n      signedUrl\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation addMediaAsset {\n    addMediaAsset {\n      signedUrl\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteMediaAsset($id: String!) {\n    deleteMediaAsset(id: $id)\n  }\n"): (typeof documents)["\n  mutation deleteMediaAsset($id: String!) {\n    deleteMediaAsset(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation addPrediction($subscriptionId: ID!, $agentId: ID!, $input: JSONObject, $attachments: [JSONObject!]) {\n    addPrediction(subscriptionId: $subscriptionId, agentId: $agentId, variables: $input, attachments: $attachments)\n  }\n"): (typeof documents)["\n  mutation addPrediction($subscriptionId: ID!, $agentId: ID!, $input: JSONObject, $attachments: [JSONObject!]) {\n    addPrediction(subscriptionId: $subscriptionId, agentId: $agentId, variables: $input, attachments: $attachments)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation upsertAgent($agent: AgentInput!) {\n    upsertAgent(agent: $agent) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation upsertAgent($agent: AgentInput!) {\n    upsertAgent(agent: $agent) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteAgent($agentId: ID!) {\n    deleteAgent(agentId: $agentId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteAgent($agentId: ID!) {\n    deleteAgent(agentId: $agentId) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation upsertCapability($capability: CapabilityInput!) {\n    upsertCapability(capability: $capability) {\n      id\n      name\n      alias\n      description\n      llmModel\n      outputMode\n      subscriptionFilter\n      outputFilter\n      prompts {\n        id\n        name\n        text\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation upsertCapability($capability: CapabilityInput!) {\n    upsertCapability(capability: $capability) {\n      id\n      name\n      alias\n      description\n      llmModel\n      outputMode\n      subscriptionFilter\n      outputFilter\n      prompts {\n        id\n        name\n        text\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteCapability($capabilityId: ID!) {\n    deleteCapability(capabilityId: $capabilityId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteCapability($capabilityId: ID!) {\n    deleteCapability(capabilityId: $capabilityId) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation upsertPrompt($prompt: PromptInput!) {\n    upsertPrompt(prompt: $prompt) {\n      id\n      name\n      text\n    }\n  }\n"): (typeof documents)["\n  mutation upsertPrompt($prompt: PromptInput!) {\n    upsertPrompt(prompt: $prompt) {\n      id\n      name\n      text\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deletePrompt($promptId: ID!) {\n    deletePrompt(promptId: $promptId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deletePrompt($promptId: ID!) {\n    deletePrompt(promptId: $promptId) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createInquiry($data: JSONObject!) {\n    upsertInquiry(data: $data) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation createInquiry($data: JSONObject!) {\n    upsertInquiry(data: $data) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updateInquiry($id: ID!, $data: JSONObject!, $fields: [String!]) {\n    upsertInquiry(id: $id, data: $data, fields: $fields) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation updateInquiry($id: ID!, $data: JSONObject!, $fields: [String!]) {\n    upsertInquiry(id: $id, data: $data, fields: $fields) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updateInquiryOwners($id: ID!, $owners: [String!]!) {\n    updateInquiryOwners(id: $id, owners: $owners) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation updateInquiryOwners($id: ID!, $owners: [String!]!) {\n    updateInquiryOwners(id: $id, owners: $owners) {\n      id\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteInquiry($id: ID!) {\n    deleteInquiry(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteInquiry($id: ID!) {\n    deleteInquiry(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createInquiryResponse($inquiryId: ID!, $subscriptionId: ID!, $data: JSONObject!) {\n    upsertInquiryResponse(inquiryId: $inquiryId, subscriptionId: $subscriptionId, data: $data) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation createInquiryResponse($inquiryId: ID!, $subscriptionId: ID!, $data: JSONObject!) {\n    upsertInquiryResponse(inquiryId: $inquiryId, subscriptionId: $subscriptionId, data: $data) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updateInquiryResponse(\n    $id: ID\n    $inquiryId: ID!\n    $subscriptionId: ID!\n    $data: JSONObject!\n    $fields: [String!]\n  ) {\n    upsertInquiryResponse(\n      id: $id\n      inquiryId: $inquiryId\n      subscriptionId: $subscriptionId\n      data: $data\n      fields: $fields\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation updateInquiryResponse(\n    $id: ID\n    $inquiryId: ID!\n    $subscriptionId: ID!\n    $data: JSONObject!\n    $fields: [String!]\n  ) {\n    upsertInquiryResponse(\n      id: $id\n      inquiryId: $inquiryId\n      subscriptionId: $subscriptionId\n      data: $data\n      fields: $fields\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteInquiryResponse($id: ID!, $inquiryId: ID!) {\n    deleteInquiryResponse(id: $id, inquiryId: $inquiryId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteInquiryResponse($id: ID!, $inquiryId: ID!) {\n    deleteInquiryResponse(id: $id, inquiryId: $inquiryId) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation upsertCollection($input: CollectionInput!) {\n    upsertCollection(input: $input) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation upsertCollection($input: CollectionInput!) {\n    upsertCollection(input: $input) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteCollection($collectionId: ID!) {\n    deleteCollection(collectionId: $collectionId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteCollection($collectionId: ID!) {\n    deleteCollection(collectionId: $collectionId) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation registerUser {\n    registerUser\n  }\n"): (typeof documents)["\n  mutation registerUser {\n    registerUser\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation sendContact($input: ContactInput!) {\n    contact(input: $input) {\n      success\n      messageId\n    }\n  }\n"): (typeof documents)["\n  mutation sendContact($input: ContactInput!) {\n    contact(input: $input) {\n      success\n      messageId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation emailInquiryToUsers($userData: [UserDataInput!]!, $inquiryId: String!) {\n    emailInquiryToUsers(userData: $userData, inquiryId: $inquiryId)\n  }\n"): (typeof documents)["\n  mutation emailInquiryToUsers($userData: [UserDataInput!]!, $inquiryId: String!) {\n    emailInquiryToUsers(userData: $userData, inquiryId: $inquiryId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAllModels {\n    getAllModels {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getAllModels {\n    getAllModels {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAgentWithPrompts($agentId: ID!) {\n    getAgentWithPrompts(agentId: $agentId) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        name\n        id\n        prompts {\n          name\n          id\n          text\n        }\n      }\n      memoryEnabled\n      subscriptionFilter\n      outputFilter\n    }\n  }\n"): (typeof documents)["\n  query getAgentWithPrompts($agentId: ID!) {\n    getAgentWithPrompts(agentId: $agentId) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        name\n        id\n        prompts {\n          name\n          id\n          text\n        }\n      }\n      memoryEnabled\n      subscriptionFilter\n      outputFilter\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAllAgents($logicalCollection: String) {\n    getAllAgents(logicalCollection: $logicalCollection) {\n      id\n      name\n      description\n      capabilities {\n        name\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query getAllAgents($logicalCollection: String) {\n    getAllAgents(logicalCollection: $logicalCollection) {\n      id\n      name\n      description\n      capabilities {\n        name\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAgent($agentId: ID!) {\n    getAgent(agentId: $agentId) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        name\n        id\n      }\n      memoryEnabled\n      subscriptionFilter\n      outputFilter\n    }\n  }\n"): (typeof documents)["\n  query getAgent($agentId: ID!) {\n    getAgent(agentId: $agentId) {\n      id\n      name\n      description\n      reasoning {\n        llmModel\n        prompt\n        variablePassThrough\n      }\n      capabilities {\n        name\n        id\n      }\n      memoryEnabled\n      subscriptionFilter\n      outputFilter\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAllCapabilities($logicalCollection: String) {\n    getAllCapabilities(logicalCollection: $logicalCollection) {\n      id\n      prompts {\n        name\n        id\n        text\n      }\n      alias\n      name\n      llmModel\n      description\n      outputMode\n      subscriptionFilter\n      outputFilter\n    }\n  }\n"): (typeof documents)["\n  query getAllCapabilities($logicalCollection: String) {\n    getAllCapabilities(logicalCollection: $logicalCollection) {\n      id\n      prompts {\n        name\n        id\n        text\n      }\n      alias\n      name\n      llmModel\n      description\n      outputMode\n      subscriptionFilter\n      outputFilter\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getCapability($capabilityId: ID!) {\n    getCapability(capabilityId: $capabilityId) {\n      id\n      llmModel\n      prompts {\n        name\n        id\n        text\n      }\n      alias\n      name\n      description\n      outputMode\n      subscriptionFilter\n      outputFilter\n    }\n  }\n"): (typeof documents)["\n  query getCapability($capabilityId: ID!) {\n    getCapability(capabilityId: $capabilityId) {\n      id\n      llmModel\n      prompts {\n        name\n        id\n        text\n      }\n      alias\n      name\n      description\n      outputMode\n      subscriptionFilter\n      outputFilter\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAllPrompts($logicalCollection: String) {\n    getAllPrompts(logicalCollection: $logicalCollection) {\n      id\n      name\n      text\n    }\n  }\n"): (typeof documents)["\n  query getAllPrompts($logicalCollection: String) {\n    getAllPrompts(logicalCollection: $logicalCollection) {\n      id\n      name\n      text\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getPrompt($promptId: ID!) {\n    getPrompt(promptId: $promptId) {\n      id\n      name\n      text\n    }\n  }\n"): (typeof documents)["\n  query getPrompt($promptId: ID!) {\n    getPrompt(promptId: $promptId) {\n      id\n      name\n      text\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getInquiry($id: ID!) {\n    getInquiry(id: $id) {\n      id\n      userId\n      data {\n        settings {\n          title\n          goals\n          voice\n          context\n          notifications {\n            recieveEmailOnResponse\n          }\n        }\n        metadata\n        graph\n        draftGraph\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query getInquiry($id: ID!) {\n    getInquiry(id: $id) {\n      id\n      userId\n      data {\n        settings {\n          title\n          goals\n          voice\n          context\n          notifications {\n            recieveEmailOnResponse\n          }\n        }\n        metadata\n        graph\n        draftGraph\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUsersById($userIds: [String!]!) {\n    getUsersById(userIds: $userIds) {\n      primaryEmailAddress\n      username\n      firstName\n      lastName\n      id\n    }\n  }\n"): (typeof documents)["\n  query getUsersById($userIds: [String!]!) {\n    getUsersById(userIds: $userIds) {\n      primaryEmailAddress\n      username\n      firstName\n      lastName\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUsersByEmail($userEmails: [String!]!) {\n    getUsersByEmail(userEmails: $userEmails) {\n      primaryEmailAddress\n      username\n      firstName\n      lastName\n      id\n    }\n  }\n"): (typeof documents)["\n  query getUsersByEmail($userEmails: [String!]!) {\n    getUsersByEmail(userEmails: $userEmails) {\n      primaryEmailAddress\n      username\n      firstName\n      lastName\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getInquiries {\n    getInquiries {\n      id\n      userId\n      data {\n        settings {\n          title\n        }\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query getInquiries {\n    getInquiries {\n      id\n      userId\n      data {\n        settings {\n          title\n        }\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getInquiryResponses($id: ID!, $filters: InquiryResponseFilters) {\n    getInquiryResponses(id: $id, filters: $filters) {\n      id\n      userId\n      data {\n        userDetails {\n          name\n          email\n          recieveEmails\n        }\n        history\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query getInquiryResponses($id: ID!, $filters: InquiryResponseFilters) {\n    getInquiryResponses(id: $id, filters: $filters) {\n      id\n      userId\n      data {\n        userDetails {\n          name\n          email\n          recieveEmails\n        }\n        history\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getInquiryResponse($id: ID!) {\n    getInquiryResponse(id: $id) {\n      id\n      userId\n      data {\n        userDetails {\n          name\n          email\n          recieveEmails\n        }\n        history\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query getInquiryResponse($id: ID!) {\n    getInquiryResponse(id: $id) {\n      id\n      userId\n      data {\n        userDetails {\n          name\n          email\n          recieveEmails\n        }\n        history\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getInquiryResponseCount($id: ID!) {\n    getInquiryResponseCount(id: $id)\n  }\n"): (typeof documents)["\n  query getInquiryResponseCount($id: ID!) {\n    getInquiryResponseCount(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAllAudioVoices {\n    getAllAudioVoices {\n      id\n      name\n      tags\n    }\n  }\n"): (typeof documents)["\n  query getAllAudioVoices {\n    getAllAudioVoices {\n      id\n      name\n      tags\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getMediaAsset($id: String!) {\n    getMediaAsset(id: $id)\n  }\n"): (typeof documents)["\n  query getMediaAsset($id: String!) {\n    getMediaAsset(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAllCollections {\n    getAllCollections {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getAllCollections {\n    getAllCollections {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query isUserRegistered {\n    isUserRegistered\n  }\n"): (typeof documents)["\n  query isUserRegistered {\n    isUserRegistered\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getInquiryTemplates {\n    getInquiryTemplates\n  }\n"): (typeof documents)["\n  query getInquiryTemplates {\n    getInquiryTemplates\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query checkIfUsersRespondedToInquiry($userEmails: [String!]!, $inquiryId: ID!) {\n    checkIfUsersRespondedToInquiry(userEmails: $userEmails, inquiryId: $inquiryId)\n  }\n"): (typeof documents)["\n  query checkIfUsersRespondedToInquiry($userEmails: [String!]!, $inquiryId: ID!) {\n    checkIfUsersRespondedToInquiry(userEmails: $userEmails, inquiryId: $inquiryId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAverageInquiryResponseTime($id: ID!) {\n    getAverageInquiryResponseTime(id: $id) {  \n      minutes\n      responseCount\n    }\n  }\n"): (typeof documents)["\n  query getAverageInquiryResponseTime($id: ID!) {\n    getAverageInquiryResponseTime(id: $id) {  \n      minutes\n      responseCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription predictionAdded($subscriptionId: ID!) {\n    predictionAdded(subscriptionId: $subscriptionId) {\n      id\n      subscriptionId\n      result\n      type\n    }\n  }\n"): (typeof documents)["\n  subscription predictionAdded($subscriptionId: ID!) {\n    predictionAdded(subscriptionId: $subscriptionId) {\n      id\n      subscriptionId\n      result\n      type\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;