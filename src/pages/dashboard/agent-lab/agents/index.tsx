import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { DELETE_AGENT, ADD_UPDATE_AGENT } from '@/clients/mutations';
import { GET_ALL_AGENTS } from '@/clients/queries';
import { Agent, Capability } from '@/types/agents';
import { motion } from 'framer-motion';
import DeleteConfirmationModal from '@/components/delete-modal';
import { useAddAlert } from '@/hooks/AlertHooks';

function AgentCard({ agent, onUpdate, onCopy }: { agent: Agent; onUpdate?: () => void; onCopy: (id: string) => void }) {
  const [deleteAgent] = useMutation(DELETE_AGENT);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const addAlert = useAddAlert();

  const handleDelete = async () => {
    try {
      await deleteAgent({
        variables: {
          agentId: agent.id,
        },
      });
      addAlert('Agent successfully deleted', 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      addAlert('Failed to delete agent', 'error');
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-2xl shadow-md h-full w-full flex flex-col">
      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-2 break-words">{agent.name}</h2>
        <p className="text-sm mb-4 break-words">{agent.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.capabilities.map((capability: Capability) => (
            <Link
              key={capability.id}
              to={`edit?id=${capability.id}`}
              className="text-xs font-bold bg-green-200 text-green-700 hover:bg-green-700 hover:text-green-200 py-1 px-2 rounded-full break-all"
            >
              {capability.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <Link
          to={`edit?id=${agent.id}`}
          className="text-sm bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-lg whitespace-nowrap"
        >
          Edit
        </Link>
        <button
          onClick={() => onCopy(agent.id)}
          className="text-sm bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-lg whitespace-nowrap"
        >
          Copy
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="text-sm bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-lg whitespace-nowrap"
        >
          Delete
        </button>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName="agent"
      />
    </div>
  );
}

export default function AgentDashboard() {
  const { data, refetch } = useQuery(GET_ALL_AGENTS);
  const [addUpdateAgent] = useMutation(ADD_UPDATE_AGENT);
  const addAlert = useAddAlert();

  const handleCopy = async (id: string) => {
    const selectedItem = data?.getAllAgents.find((agent: Agent) => agent.id === id);
    if (!selectedItem) {
      addAlert('Agent not found', 'error');
      return;
    }

    const timeStamp = Date.now();
    try {
      const result = await addUpdateAgent({
        variables: {
          agent: {
            id: null, // Ensure a new agent is created
            name: `${selectedItem.name} Copy ${timeStamp}`,
            description: selectedItem.description,
            capabilities: selectedItem.capabilities.map((capability: Capability) => capability.id),
          },
        },
      });

      if (result.errors) {
        addAlert('Error copying agent', 'error');
        return;
      }

      addAlert('Agent copied successfully', 'success');
      refetch();
    } catch (error) {
      console.error(error);
      addAlert('Error copying agent', 'error');
    }
  };

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
        <Link to="edit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add Agent
        </Link>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
        {data?.getAllAgents.map((agent: Agent, i: number) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 * i }}
          >
            <AgentCard key={agent.id} agent={agent} onUpdate={refetch} onCopy={handleCopy} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
