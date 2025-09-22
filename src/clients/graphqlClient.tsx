import { ApolloClient, from, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { useAuth } from '@clerk/clerk-react';
import { createClient } from 'graphql-ws';

import { getMainDefinition } from '@apollo/client/utilities';
import React, { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client/react';

export const ApolloProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri: import.meta.env.VITE_APP_HTTP_SERVER_URL as string,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let activeSocket: any, timedOut: NodeJS.Timeout;

    const wsLink = new GraphQLWsLink(
      createClient({
        url: import.meta.env.VITE_APP_WS_SERVER_URL as string,

        // Ref: https://the-guild.dev/graphql/ws/docs/interfaces/client.ClientOptions#lazyclosetimeout
        lazy: true,

        // Ref: https://the-guild.dev/graphql/ws/docs/interfaces/client.ClientOptions#lazyclosetimeout
        lazyCloseTimeout: 30 * 1000, // 30 seconds

        // Ref: https://the-guild.dev/graphql/ws/docs/interfaces/client.ClientOptions#keepalive
        keepAlive: 10 * 1000, // 30,
        on: {
          connected: (socket) => (activeSocket = socket),
          ping: (received) => {
            if (!received)
              // sent
              timedOut = setTimeout(() => {
                if (activeSocket.readyState === WebSocket.OPEN) activeSocket.close(4408, 'Request Timeout');
              }, 5_000); // wait 5 seconds for the pong and then close the connection
          },
          pong: (received) => {
            if (received) clearTimeout(timedOut); // pong is received, clear connection close timeout
          },
        },
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
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      from([httpAuthMiddleware, httpLink]),
    );

    const apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: splitLink,
    });

    return apolloClient;
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
