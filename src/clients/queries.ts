import { gql } from "@apollo/client";

export const GET_ALL_AGENTS = gql`
  query Query {
    getAllAgents {
      id
      name
      description
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
