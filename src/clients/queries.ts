import { gql } from "@apollo/client";

export const GET_AGENT = gql`
  query Query($agentId: String!) {
    getAgent(agentId: $agentId) {
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

export const GET_CAPABILITY = gql`
  query Query($capabilityId: String!) {
    getCapability(capabilityId: $capabilityId) {
      id
      name
      description
      prompt
    }
  }
`;

export const GET_CAPABILITIES = gql`
  query Query {
    getAllCapabilities {
      id
      name
      description
      prompt
    }
  }
`;
