import type { DefaultOptions } from "@apollo/client";
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "graphql-ws";

import { getMainDefinition } from "@apollo/client/utilities";
import React, { useMemo } from "react";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  mutate: {
    fetchPolicy: "no-cache", // Since all requests are currently used to update the board state, we shouldn't cache any responses.
    errorPolicy: "all",
  },
};

export const ApolloProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri: import.meta.env.VITE_APP_HTTP_SERVER_URL as string,
    });

    const wsLink = new GraphQLWsLink(
      createClient({
        url: import.meta.env.VITE_APP_WS_SERVER_URL as string,
        connectionParams: async () => {
          const token = await getToken();
          return {
            authorization: token,
          };
        },
      }),
    );

    const httpAuthMiddleware = setContext(async (_, { headers }) => {
      const token = await getToken();

      return {
        headers: {
          ...headers,
          Authorization: token,
        },
      };
    });

    // Here, we use a split functiont to "route" a request to a specific
    // network link. In this case, if the request is a Subscription, it will
    // be sent to the wsLink, otherwise it will be sent to the httpLink.
    // This is to keep network connections optimized and avoid unnecessary
    // overhead. This is especially useful for mobile devices.
    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      from([httpAuthMiddleware, httpLink]),
    );

    const apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: splitLink,
      defaultOptions,
    });

    return apolloClient;
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
