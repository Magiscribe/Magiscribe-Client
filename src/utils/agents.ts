import { GET_ALL_AGENTS } from '@/clients/queries';
import { ApolloClient } from '@apollo/client';

/**
 * Gets an agent id by name.
 * @param name {string} The name of the agent.
 * @param client {ApolloClient<object>} The Apollo client.
 * @returns {Promise<string>} The agent ID.
 */
export async function getAgentIdByName(name: string, client: ApolloClient<object>) {
  const { data } = await client.query({
    query: GET_ALL_AGENTS,
  });

  const conditionAgent = data.getAllAgents.find((agent: { id: string; name: string }) => agent.name === name);
  return conditionAgent.id;
}
