import { ADD_UPDATE_AGENT, DELETE_AGENT } from '@/clients/mutations';
import { GET_ALL_AGENTS } from '@/clients/queries';
import Container from '@/components/container';
import Button from '@/components/controls/button';
import ConfirmationModal from '@/components/modals/confirm-modal';
import { GetAllAgentsQuery, UpsertAgentMutation } from '@/graphql/graphql';
import { useAddAlert } from '@/providers/alert-provider';
import { useMutation, useQuery } from "@apollo/client/react";
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      await deleteAgent({
        variables: {
          agentId: agent.id,
        },
      });
      addAlert(t('pages.agentLab.alerts.agentDeleted'), 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      addAlert(t('pages.agentLab.alerts.agentDeleteFailed'), 'error');
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-white  p-4 rounded-2xl shadow-md h-full w-full flex flex-col">
      <div className="grow">
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
          {t('common.buttons.edit')}
        </Button>
        <Button onClick={() => onCopy(agent.id)} size="small">
          {t('common.buttons.copy')}
        </Button>
        <Button onClick={() => setIsDeleteModalOpen(true)} size="small" variant="danger">
          {t('common.buttons.delete')}
        </Button>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        text={t('pages.agentLab.agents.deleteConfirmation')}
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
  const { t } = useTranslation();

  const handleCopy = async (id: string) => {
    const selectedItem = data?.getAllAgents.find((agent: any) => agent.id === id);
    if (!selectedItem) {
      addAlert(t('pages.agentLab.alerts.agentNotFound'), 'error');
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
            capabilities: selectedItem.capabilities.map((capability: any) => capability.id),
            logicalCollection: params.collection,
          },
        },
      });

      if (result.error) {
        addAlert(t('pages.agentLab.alerts.agentCopyFailed'), 'error');
        return;
      }

      addAlert(t('pages.agentLab.alerts.agentCopied'), 'success');
      refetch();
    } catch (error) {
      console.error(error);
      addAlert(t('pages.agentLab.alerts.agentCopyFailed'), 'error');
    }
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('pages.agentLab.agents.title')}</h1>
        <Button as={Link} to="edit">
          {t('pages.agentLab.agents.addAgent')}
        </Button>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
        {data?.getAllAgents.map((agent: any, i: number) => (
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
