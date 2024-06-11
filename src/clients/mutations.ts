import { gql } from "@apollo/client";

export const ADD_UPDATE_AGENTS = gql`
  mutation Mutation($agent: AgentInput!) {
    addUpdateAgent(agent: $agent) {
      aiModel
      capabilities {
        id
        name
      }
      description
      id
      name
    }
  }
`;

export const ADD_UPDATE_CAPABILITIES = gql`
  mutation Mutation($capability: CapabilityInput!) {
    addUpdateCapability(capability: $capability) {
      id
      name
      description
      prompt
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
