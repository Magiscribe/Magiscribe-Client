import { gql } from '@apollo/client';

export const GRAPHQL_SUBSCRIPTION = gql`
  subscription visualPredictionAdded($subscriptionId: String!) {
    visualPredictionAdded(subscriptionId: $subscriptionId) {
      id
      context
      prompt
      result
      type
    }
  }
`;
