import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { DELETE_AGENT } from "../../../clients/mutations";
import { GET_ALL_AGENTS } from "../../../clients/queries";
import { Agent, Capability } from "../../../types/agents";

function AgentCard({
  agent,
  onUpdate,
}: {
  agent: Agent;
  onUpdate?: () => void;
}) {
  const [deleteCapability] = useMutation(DELETE_AGENT);

  const handleDelete = async () => {
    try {
      await deleteCapability({
        variables: {
          agentId: agent.id,
        },
      });
    } catch (error) {
      console.error(error);
    }

    if (onUpdate) onUpdate();
  };

  return (
    <div className="relative bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">
        {agent.name}{" "}
        <span className="text-sm font-normal text-slate-700">
          ({agent.alias})
        </span>
      </h2>
      <p className="text-sm">{agent.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {agent.capabilities.map((capability: Capability) => (
          <span
            className="text-sm font-bold bg-blue-200 text-blue-800 p-2 rounded-full"
            key={capability.id}
          >
            {capability.name}
          </span>
        ))}
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <Link
          to={`/dashboard/agents/edit?id=${agent.id}`}
          className="text-sm bg-blue-500 text-white px-2 py-1 rounded-lg"
        >
          Edit
        </Link>
        <button onClick={handleDelete} className="text-red-700 text-sm">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function AgentDashboard() {
  const { data, refetch } = useQuery(GET_ALL_AGENTS);

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Agents</h1>
        <Link
          to="/dashboard/agents/edit"
          className="bg-blue-500 text-sm text-white px-2 py-1 rounded-lg ml-auto"
        >
          Add Agent
        </Link>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {data?.getAllAgents.map((agent: Agent) => (
          <AgentCard key={agent.id} agent={agent} onUpdate={refetch} />
        ))}
      </div>
    </div>
  );
}
