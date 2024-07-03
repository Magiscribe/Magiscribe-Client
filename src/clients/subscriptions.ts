import { gql } from '@apollo/client';

export const GRAPHQL_SUBSCRIPTION = gql`
  subscription predictionAdded($subscriptionId: String!) {
    predictionAdded(subscriptionId: $subscriptionId) {
      id
      subscriptionId
      context
      result
      type
    }
  }
`;
