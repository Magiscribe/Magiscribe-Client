import { gql } from '@apollo/client';

export const GENERATE_TRANSCRIPTION_CREDENTIALS = gql`
  query Mutation {
    generateTranscriptionStreamingCredentials {
      accessKeyId
      secretAccessKey
      sessionToken
    }
  }
`;

export const GET_ALL_MODELS = gql`
  query Query {
    getAllModels {
      id
      name
    }
  }
`;

export const GET_ALL_AGENTS = gql`
  query Query {
    getAllAgents {
      id
      name
      description
      reasoningLLMModel
      reasoningPrompt
      capabilities {
        name
        id
      }
    }
  }
`;

export const GET_AGENT = gql`
  query Query($agentId: String!) {
    getAgent(agentId: $agentId) {
      id
      name
      description
      reasoningLLMModel
      reasoningPrompt
      capabilities {
        name
        id
      }
    }
  }
`;

export const GET_ALL_CAPABILITIES = gql`
  query Query {
    getAllCapabilities {
      id
      llmModel
      prompts {
        name
        id
      }
      alias
      name
      description
    }
  }
`;

export const GET_CAPABILITY = gql`
  query Query($capabilityId: String!) {
    getCapability(capabilityId: $capabilityId) {
      id
      llmModel
      prompts {
        name
        id
      }
      alias
      name
      description
    }
  }
`;

export const GET_ALL_PROMPTS = gql`
  query Query {
    getAllPrompts {
      id
      name
      text
    }
  }
`;

export const GET_PROMPT = gql`
  query Query($promptId: String!) {
    getPrompt(promptId: $promptId) {
      id
      name
      text
    }
  }
`;
