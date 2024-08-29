import { gql } from '@apollo/client';

export const GENERATE_TRANSCRIPTION_CREDENTIALS = gql`
  mutation Mutation {
    generateTranscriptionStreamingCredentials {
      accessKeyId
      secretAccessKey
      sessionToken
    }
  }
`;

export const GENERATE_AUDIO = gql`
  mutation Mutation($voice: String!, $text: String!) {
    generateAudio(voice: $voice, text: $text)
  }
`;

export const ADD_PREDICTION = gql`
  mutation addPrediction($subscriptionId: ID!, $agentId: ID!, $variables: JSONObject, $attachments: [JSONObject!]) {
    addPrediction(subscriptionId: $subscriptionId, agentId: $agentId, variables: $variables, attachments: $attachments)
  }
`;

export const ADD_UPDATE_AGENT = gql`
  mutation Mutation($agent: AgentInput!) {
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
  mutation Mutation($agentId: ID!) {
    deleteAgent(agentId: $agentId) {
      id
    }
  }
`;

export const ADD_UPDATE_CAPABILITY = gql`
  mutation Mutation($capability: CapabilityInput!) {
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
  mutation Mutation($capabilityId: ID!) {
    deleteCapability(capabilityId: $capabilityId) {
      id
    }
  }
`;

export const ADD_UPDATE_PROMPT = gql`
  mutation Mutation($prompt: PromptInput!) {
    upsertPrompt(prompt: $prompt) {
      id
      name
      text
    }
  }
`;

export const DELETE_PROMPT = gql`
  mutation Mutation($promptId: ID!) {
    deletePrompt(promptId: $promptId) {
      id
    }
  }
`;

export const CREATE_INQUIRY = gql`
  mutation Mutation($data: JSONObject!) {
    upsertInquiry(data: $data) {
      data
    }
  }
`;

export const UPDATE_INQUIRY = gql`
  mutation Mutation($id: ID!, $data: JSONObject!) {
    upsertInquiry(id: $id, data: $data) {
      id
      data
    }
  }
`;

export const DELETE_INQUIRY = gql`
  mutation Mutation($id: ID!) {
    deleteInquiry(id: $id) {
      id
    }
  }
`;

export const CREATE_INQUIRY_REPONSE = gql`
  mutation Mutation($inquiryId: ID, $data: [JSONObject!]!) {
    upsertInquiryResponse(inquiryId: $inquiryId, data: $data) {
      id
      data
    }
  }
`;

export const UPDATE_INQUIRY_RESPONSE = gql`
  mutation Mutation($id: ID, $inquiryId: ID, $data: [JSONObject!]!) {
    upsertInquiryResponse(id: $id, inquiryId: $inquiryId, data: $data) {
      id
      data
    }
  }
`;
