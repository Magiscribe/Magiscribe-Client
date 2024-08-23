import { gql } from '@apollo/client';

export const GET_ALL_MODELS = gql`
  query Query {
    getAllModels {
      id
      name
    }
  }
`;

export const GET_AGENT_WITH_PROMPTS = gql`
  query Query($agentId: String!) {
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
  query Query {
    getAllAgents {
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
  query Query($agentId: String!) {
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
  query Query {
    getAllCapabilities {
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
  query Query($capabilityId: String!) {
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

export const GET_DATA = gql`
  query Query($id: String!) {
    dataObject(id: $id) {
      data
    }
  }
`;

export const GET_USER_INQUIRIES = gql`
  query DataObjectsCreated {
    dataObjectsCreated {
      id
      data
    }
  }
`;
