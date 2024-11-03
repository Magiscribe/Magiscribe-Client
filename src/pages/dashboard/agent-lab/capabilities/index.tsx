import { ADD_UPDATE_CAPABILITY, DELETE_CAPABILITY } from '@/clients/mutations';
import { GET_ALL_CAPABILITIES } from '@/clients/queries';
import Button from '@/components/controls/button';
import ConfirmationModal from '@/components/modals/confirm-modal';
import { Capability, Prompt } from '@/graphql/types';
import { useAddAlert } from '@/hooks/alert-hook';
import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function CapabilityCard({
  capability,
  onUpdate,
  onCopy,
}: {
  capability: Capability;
  onCopy: (id: string) => void;
  onUpdate?: () => void;
}) {
  const [deleteCapability] = useMutation(DELETE_CAPABILITY);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const addAlert = useAddAlert();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteCapability({
        variables: {
          capabilityId: capability.id,
        },
      });
      addAlert('Capability successfully deleted', 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      addAlert('Failed to delete capability', 'error');
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-white  p-4 rounded-2xl shadow-md h-full w-full flex flex-col">
      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-2 break-words">
          {capability.name} <span className="text-sm font-normal break-all">({capability.alias})</span>
        </h2>
        <p className="text-sm mb-4 break-words">{capability.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {capability.prompts.map((prompt: Prompt) => (
            <Link
              key={prompt.id}
              to={`../prompts/edit?id=${prompt.id}`}
              className="text-xs font-bold bg-purple-200 text-purple-700 hover:bg-purple-700 hover:text-purple-200 py-1 px-2 rounded-full break-all"
            >
              {prompt.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <Button onClick={() => navigate(`edit?id=${capability.id}`)} variant="primary" size="small">
          Edit
        </Button>
        <Button size="small" onClick={() => onCopy(capability.id)}>
          Copy
        </Button>
        <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger" size="small">
          Delete
        </Button>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        text="Are you sure you want to delete this capability?"
      />
    </div>
  );
}

export default function CapabilityDashboard() {
  // React Router
  const params = useParams();

  // Queries
  const { collection } = useParams<{ collection?: string }>();
  const { data, refetch } = useQuery(GET_ALL_CAPABILITIES, {
    variables: {
      logicalCollection: params.collection,
    },
  });
  const [upsertCapability] = useMutation(ADD_UPDATE_CAPABILITY);

  const addAlert = useAddAlert();
  const navigate = useNavigate();

  const handleCopy = async (id: string) => {
    const selectedItem = data?.getAllCapabilities.find((capability: Capability) => capability.id === id) as Capability;
    const timeStamp = Date.now();
    try {
      const result = await upsertCapability({
        variables: {
          capability: {
            id: null,
            alias: selectedItem.alias + 'Copy_' + timeStamp,
            logicalCollection: collection,
            name: selectedItem.name + ' Copy ' + timeStamp,
            description: selectedItem.description,
            llmModel: selectedItem.llmModel,
            prompts: selectedItem.prompts.map((prompt) => prompt.id),
            outputMode: selectedItem.outputMode,
            subscriptionFilter: selectedItem.subscriptionFilter,
            outputFilter: selectedItem.outputFilter,
          },
        },
      });

      if (result.errors) {
        addAlert('Error copying capability', 'error');
        return;
      }

      addAlert('Capability copied successfully', 'success');
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Capabilities</h1>
        <Button onClick={() => navigate('edit')}>Add Capability</Button>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
        {data?.getAllCapabilities.map((capability: Capability, i: number) => (
          <motion.div
            key={capability.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 * i }}
          >
            <CapabilityCard key={capability.id} capability={capability} onCopy={handleCopy} onUpdate={refetch} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
