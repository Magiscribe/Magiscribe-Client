import { ADD_UPDATE_AGENT, DELETE_AGENT } from '@/clients/mutations';
import { GET_ALL_AGENTS } from '@/clients/queries';
import Container from '@/components/container';
import Button from '@/components/controls/button';
import ConfirmationModal from '@/components/modals/confirm-modal';
import { GetAllAgentsQuery, UpsertAgentMutation } from '@/graphql/graphql';
import { useAddAlert } from '@/providers/alert-provider';
import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function AgentCard({
  agent,
  onUpdate,
  onCopy,
}: {
  agent: GetAllAgentsQuery['getAllAgents'][0];
  onUpdate?: () => void;
  onCopy: (id: string) => void;
}) {
  // Queries
  const [deleteAgent] = useMutation(DELETE_AGENT);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const addAlert = useAddAlert();
  const navigate = useNavigate();

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
    <div className="bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-white  p-4 rounded-2xl shadow-md h-full w-full flex flex-col">
      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-2 break-words">{agent.name}</h2>
        <p className="text-sm mb-4 break-words">{agent.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.capabilities.map((capability) => (
            <Link
              key={capability.id}
              to={`../capabilities/edit?id=${capability.id}`}
              className="text-xs font-bold bg-green-200 text-green-700 hover:bg-green-700 hover:text-green-200 py-1 px-2 rounded-full break-all"
            >
              {capability.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <Button size="small" onClick={() => navigate(`edit?id=${agent.id}`)}>
          Edit
        </Button>
        <Button onClick={() => onCopy(agent.id)} size="small">
          Copy
        </Button>
        <Button onClick={() => setIsDeleteModalOpen(true)} size="small" variant="danger">
          Delete
        </Button>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        text="Are you sure you want to delete this agent?"
      />
    </div>
  );
}

export default function AgentDashboard() {
  // React Router
  const params = useParams();

  // Queries
  const { data, refetch } = useQuery<GetAllAgentsQuery>(GET_ALL_AGENTS, {
    variables: {
      logicalCollection: params.collection,
    },
  });
  const [upsertAgent] = useMutation<UpsertAgentMutation>(ADD_UPDATE_AGENT);

  const addAlert = useAddAlert();

  const handleCopy = async (id: string) => {
    const selectedItem = data?.getAllAgents.find((agent) => agent.id === id);
    if (!selectedItem) {
      addAlert('Agent not found', 'error');
      return;
    }

    const timeStamp = Date.now();
    try {
      const result = await upsertAgent({
        variables: {
          agent: {
            id: null, // Ensure a new agent is created
            name: `${selectedItem.name} Copy ${timeStamp}`,
            description: selectedItem.description,
            capabilities: selectedItem.capabilities.map((capability) => capability.id),
            logicalCollection: params.collection,
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
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
        <Button as={Link} to="edit">
          Add Agent
        </Button>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
        {data?.getAllAgents.map((agent, i) => (
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
    </Container>
  );
}
