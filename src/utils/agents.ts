import { GET_ALL_AGENTS } from '@/clients/queries';
import { GetAllAgentsQuery } from '@/graphql/graphql';
import { ApolloClient } from '@apollo/client';

/**
 * Gets an agent id by name.
 * @param name {string} The name of the agent.
 * @param client {ApolloClient<object>} The Apollo client.
 * @returns {Promise<string>} The agent ID.
 */
export async function getAgentIdByName(name: string, client: ApolloClient) {
  const { data } = await client.query<GetAllAgentsQuery>({
    query: GET_ALL_AGENTS,
  });

  if (data === undefined || data.getAllAgents === undefined) {
    throw new Error('No agents found');
  }

  const agent = data.getAllAgents.find((agent: { id: string; name: string }) => agent.name === name);

  if (!agent) {
    throw new Error(`Agent with name "${name}" not found`);
  }

  return agent.id;
}
