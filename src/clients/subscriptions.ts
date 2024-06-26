import { gql } from '@apollo/client';

export const GRAPHQL_SUBSCRIPTION = gql`
  subscription visualPredictionAdded($subscriptionId: String!) {
    visualPredictionAdded(subscriptionId: $subscriptionId) {
      context
      prompt
      result
      type
    }
  }
`;
