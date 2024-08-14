import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ADD_UPDATE_CAPABILITY, DELETE_CAPABILITY } from '@/clients/mutations';
import { GET_ALL_CAPABILITIES } from '@/clients/queries';
import { Capability, Prompt } from '@/types/agents';
import { useAddAlert } from '@/hooks/AlertHooks';
import DeleteConfirmationModal from '@/components/delete-modal'; // Adjust the import path as needed

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
    <div className="bg-gray-100 p-4 rounded-lg shadow-md h-full w-full flex flex-col">
      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-2 break-words">
          {capability.name} <span className="text-sm font-normal text-slate-700 break-all">({capability.alias})</span>
        </h2>
        <p className="text-sm mb-4 break-words">{capability.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {capability.prompts.map((prompt: Prompt) => (
            <Link
              key={prompt.id}
              to={`edit?id=${prompt.id}`}
              className="text-xs font-bold bg-blue-200 text-blue-700 hover:bg-blue-700 hover:text-blue-200 py-1 px-2 rounded-full break-all"
            >
              {prompt.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <Link
          to={`edit?id=${capability.id}`}
          className="text-sm bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-lg whitespace-nowrap"
        >
          Edit
        </Link>
        <button
          onClick={() => onCopy(capability.id)}
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
        itemName="capability"
      />
    </div>
  );
}

export default function CapabilityDashboard() {
  const addAlert = useAddAlert();
  const { data, refetch } = useQuery(GET_ALL_CAPABILITIES);
  const [addUpdateCapability] = useMutation(ADD_UPDATE_CAPABILITY);

  const handleCopy = async (id: string) => {
    const selectedItem = data?.getAllCapabilities.find((capability: Capability) => capability.id === id) as Capability;
    const timeStamp = Date.now();
    try {
      const result = await addUpdateCapability({
        variables: {
          capability: {
            id: null,
            alias: selectedItem.alias + 'Copy_' + timeStamp,
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
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Capabilities</h1>
        <Link to="edit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add Capability
        </Link>
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
