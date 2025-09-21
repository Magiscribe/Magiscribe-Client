import { gql } from "@apollo/client";

export const GRAPHQL_SUBSCRIPTION = gql`
  subscription predictionAdded($subscriptionId: ID!) {
    predictionAdded(subscriptionId: $subscriptionId) {
      id
      subscriptionId
      result
      type
      tokenUsage {
        inputTokens
        outputTokens
        totalTokens
      }
    }
  }
`;
