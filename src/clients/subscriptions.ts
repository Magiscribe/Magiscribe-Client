import { gql } from '@apollo/client';

export const STREAM_EVENT_SUBSCRIPTION = gql`
  subscription streamObject($subscriptionId: String!) {
    streamObject(subscriptionId: $subscriptionId) {
      data
    }
  }
`;

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
