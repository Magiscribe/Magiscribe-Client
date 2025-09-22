import { gql } from '@apollo/client';

export const GENERATE_AUDIO = gql`
  mutation generateAudio($voice: String!, $text: String!) {
    generateAudio(voice: $voice, text: $text)
  }
`;

export const ADD_MEDIA_ASSET = gql`
  mutation addMediaAsset {
    addMediaAsset {
      signedUrl
      id
    }
  }
`;

export const DELETE_MEDIA_ASSET = gql`
  mutation deleteMediaAsset($id: String!) {
    deleteMediaAsset(id: $id)
  }
`;

export const ADD_PREDICTION = gql`
  mutation addPrediction(
    $subscriptionId: ID!
    $agentId: ID!
    $input: JSONObject
    $attachments: [JSONObject!]
    $inquiryId: ID
    $integrationId: ID
  ) {
    addPrediction(
      subscriptionId: $subscriptionId
      agentId: $agentId
      variables: $input
      attachments: $attachments
      inquiryId: $inquiryId
      integrationId: $integrationId
    ) {
      status
      correlationId
    }
  }
`;

export const ADD_UPDATE_AGENT = gql`
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

export const DELETE_AGENT = gql`
  mutation deleteAgent($agentId: ID!) {
    deleteAgent(agentId: $agentId) {
      id
    }
  }
`;

export const ADD_UPDATE_CAPABILITY = gql`
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

export const DELETE_CAPABILITY = gql`
  mutation deleteCapability($capabilityId: ID!) {
    deleteCapability(capabilityId: $capabilityId) {
      id
    }
  }
`;

export const ADD_UPDATE_PROMPT = gql`
  mutation upsertPrompt($prompt: PromptInput!) {
    upsertPrompt(prompt: $prompt) {
      id
      name
      text
      logicalCollection {
        id
        name
      }
    }
  }
`;

export const DELETE_PROMPT = gql`
  mutation deletePrompt($promptId: ID!) {
    deletePrompt(promptId: $promptId) {
      id
    }
  }
`;

export const CREATE_INQUIRY = gql`
  mutation createInquiry($data: JSONObject!) {
    upsertInquiry(data: $data) {
      id
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INQUIRY = gql`
  mutation updateInquiry($id: ID!, $data: JSONObject!, $fields: [String!]) {
    upsertInquiry(id: $id, data: $data, fields: $fields) {
      id
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INQUIRY_OWNERS = gql`
  mutation updateInquiryOwners($id: ID!, $owners: [String!]!) {
    updateInquiryOwners(id: $id, owners: $owners) {
      id
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_INQUIRY = gql`
  mutation deleteInquiry($id: ID!) {
    deleteInquiry(id: $id) {
      id
    }
  }
`;

export const CREATE_INQUIRY_RESPONSE = gql`
  mutation createInquiryResponse($inquiryId: ID!, $subscriptionId: ID!, $data: JSONObject!) {
    upsertInquiryResponse(inquiryId: $inquiryId, subscriptionId: $subscriptionId, data: $data) {
      id
    }
  }
`;

export const UPDATE_INQUIRY_RESPONSE = gql`
  mutation updateInquiryResponse(
    $id: ID
    $inquiryId: ID!
    $subscriptionId: ID!
    $data: JSONObject!
    $fields: [String!]
  ) {
    upsertInquiryResponse(
      id: $id
      inquiryId: $inquiryId
      subscriptionId: $subscriptionId
      data: $data
      fields: $fields
    ) {
      id
    }
  }
`;

export const DELETE_INQUIRY_RESPONSE = gql`
  mutation deleteInquiryResponse($id: ID!, $inquiryId: ID!) {
    deleteInquiryResponse(id: $id, inquiryId: $inquiryId) {
      id
    }
  }
`;

export const SET_INQUIRY_INTEGRATIONS = gql`
  mutation setInquiryIntegrations($inquiryId: ID!, $integrations: [IntegrationInput!]!) {
    setInquiryIntegrations(inquiryId: $inquiryId, integrations: $integrations) {
      name
      description
      type
      config
    }
  }
`;

export const UPSERT_COLLECTION = gql`
  mutation upsertCollection($input: CollectionInput!) {
    upsertCollection(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_COLLECTION = gql`
  mutation deleteCollection($collectionId: ID!) {
    deleteCollection(collectionId: $collectionId) {
      id
    }
  }
`;

export const REGISTER_USER = gql`
  mutation registerUser {
    registerUser
  }
`;

// TODO: Fix contact mutation - schema doesn't exist in backend
// export const SEND_CONTACT = gql`
//   mutation sendContact($input: ContactInput!) {
//     contact(input: $input) {
//       success
//       messageId
//     }
//   }
// `;

export const EMAIL_INQUIRY_TO_USERS = gql`
  mutation emailInquiryToUsers($userData: [UserDataInput!]!, $inquiryId: String!) {
    emailInquiryToUsers(userData: $userData, inquiryId: $inquiryId)
  }
`;
