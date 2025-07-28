import { gql } from '@apollo/client';

export const GET_USER_QUOTA = gql`
  query GetUserQuota {
    getUserQuota {
      userId
      allowedTokens
      usedTotalTokens
      usedInputTokens
      usedOutputTokens
      updatedAt
      createdAt
    }
  }
`;

export const GET_ALL_MODELS = gql`
  query getAllModels {
    getAllModels {
      id
      name
    }
  }
`;

export const GET_AGENT_WITH_PROMPTS = gql`
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

export const GET_ALL_AGENTS = gql`
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

export const GET_AGENT = gql`
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

export const GET_ALL_CAPABILITIES = gql`
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

export const GET_CAPABILITY = gql`
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

export const GET_ALL_PROMPTS = gql`
  query getAllPrompts($logicalCollection: String) {
    getAllPrompts(logicalCollection: $logicalCollection) {
      id
      name
      text
    }
  }
`;

export const GET_PROMPT = gql`
  query getPrompt($promptId: ID!) {
    getPrompt(promptId: $promptId) {
      id
      name
      text
    }
  }
`;

export const GET_INQUIRY = gql`
  query getInquiry($id: ID!) {
    getInquiry(id: $id) {
      id
      userId
      data {
        settings {
          title
          goals
          voice
          context
          notifications {
            recieveEmailOnResponse
          }
        }
        metadata
        graph
        draftGraph
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS_BY_ID = gql`
  query getUsersById($userIds: [String!]!) {
    getUsersById(userIds: $userIds) {
      primaryEmailAddress
      username
      firstName
      lastName
      id
    }
  }
`;

export const GET_USERS_BY_EMAIL = gql`
  query getUsersByEmail($userEmails: [String!]!) {
    getUsersByEmail(userEmails: $userEmails) {
      primaryEmailAddress
      username
      firstName
      lastName
      id
    }
  }
`;

export const GET_INQUIRIES = gql`
  query getInquiries {
    getInquiries {
      id
      userId
      data {
        settings {
          title
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INQUIRIES_RESPONSES = gql`
  query getInquiryResponses($id: ID!, $filters: InquiryResponseFilters) {
    getInquiryResponses(id: $id, filters: $filters) {
      id
      userId
      data {
        userDetails {
          name
          email
          recieveEmails
        }
        history
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INQUIRY_RESPONSE = gql`
  query getInquiryResponse($id: ID!) {
    getInquiryResponse(id: $id) {
      id
      userId
      data {
        userDetails {
          name
          email
          recieveEmails
        }
        history
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INQUIRY_RESPONSE_COUNT = gql`
  query getInquiryResponseCount($id: ID!) {
    getInquiryResponseCount(id: $id)
  }
`;

export const GET_ALL_AUDIO_VOICES = gql`
  query getAllAudioVoices {
    getAllAudioVoices {
      id
      name
      tags
    }
  }
`;

export const GET_MEDIA_ASSET = gql`
  query getMediaAsset($id: String!) {
    getMediaAsset(id: $id)
  }
`;

export const GET_ALL_COLLECTIONS = gql`
  query getAllCollections {
    getAllCollections {
      id
      name
    }
  }
`;

export const IS_USER_REGISTERED = gql`
  query isUserRegistered {
    isUserRegistered
  }
`;

export const GET_TEMPLATES = gql`
  query getInquiryTemplates {
    getInquiryTemplates
  }
`;

export const CHECK_IF_USERS_RESPONDED_TO_INQUIRY = gql`
  query checkIfUsersRespondedToInquiry($userEmails: [String!]!, $inquiryId: ID!) {
    checkIfUsersRespondedToInquiry(userEmails: $userEmails, inquiryId: $inquiryId)
  }
`;

export const GET_INQUIRY_RESPONSE_TIME = gql`
  query getAverageInquiryResponseTime($id: ID!) {
    getAverageInquiryResponseTime(id: $id) {  
      minutes
      responseCount
    }
  }
`;

export const GET_INQUIRY_INTEGRATIONS = gql`
  query getInquiryIntegrations($inquiryId: ID!) {
    getInquiryIntegrations(inquiryId: $inquiryId) {
      name
      description
      type
      config
    }
  }
`;