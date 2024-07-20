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
  mutation addPrediction($subscriptionId: String!, $agentId: String!, $variables: JSONObject) {
    addPrediction(subscriptionId: $subscriptionId, agentId: $agentId, variables: $variables)
  }
`;

export const ADD_UPDATE_AGENT = gql`
  mutation Mutation($agent: AgentInput!) {
    addUpdateAgent(agent: $agent) {
      id
      name
      description
      reasoningLLMModel
      reasoningPrompt
      capabilities {
        id
      }
    }
  }
`;

export const DELETE_AGENT = gql`
  mutation Mutation($agentId: String!) {
    deleteAgent(agentId: $agentId) {
      id
    }
  }
`;

export const ADD_UPDATE_CAPABILITY = gql`
  mutation Mutation($capability: CapabilityInput!) {
    addUpdateCapability(capability: $capability) {
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
  mutation Mutation($capabilityId: String!) {
    deleteCapability(capabilityId: $capabilityId) {
      id
    }
  }
`;

export const ADD_UPDATE_PROMPT = gql`
  mutation Mutation($prompt: PromptInput!) {
    addUpdatePrompt(prompt: $prompt) {
      id
      name
      text
    }
  }
`;

export const DELETE_PROMPT = gql`
  mutation Mutation($promptId: String!) {
    deletePrompt(promptId: $promptId) {
      id
    }
  }
`;
