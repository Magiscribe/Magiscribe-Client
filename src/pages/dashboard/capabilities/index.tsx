import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ADD_UPDATE_CAPABILITY, DELETE_CAPABILITY } from '../../../clients/mutations';
import { GET_ALL_CAPABILITIES } from '../../../clients/queries';
import { Capability, Prompt } from '../../../types/agents';
import { useAddAlert } from '../../../hooks/AlertHooks';

function CapabilityCard({ capability, onUpdate, onCopy }: { capability: Capability; onCopy: (id: string) => void, onUpdate?: () => void}) {
  const [deleteCapability] = useMutation(DELETE_CAPABILITY);

  const handleDelete = async () => {
    try {
      await deleteCapability({
        variables: {
          capabilityId: capability.id,
        },
      });
    } catch (error) {
      console.error(error);
    }

    if (onUpdate) onUpdate();
  };

  return (
    <div className="relative bg-gray-100 p-4 rounded-lg shadow-md h-full w-full">
      <h2 className="text-xl font-bold">
        {capability.name} <span className="text-sm font-normal text-slate-700">({capability.alias})</span>
      </h2>
      <p className="text-sm">{capability.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {capability.prompts.map((prompt: Prompt) => (
          <Link
            to={`/dashboard/prompts/edit?id=${prompt.id}`}
            className="text-xs font-bold bg-blue-200 text-blue-800 py-1 px-2 rounded-full"
          >
            {prompt.name}
          </Link>
        ))}
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <Link
          to={`/dashboard/capabilities/edit?id=${capability.id}`}
          className="text-sm bg-blue-500 text-white px-2 py-1 rounded-lg"
        >
          Edit
        </Link>
        <button onClick={() => onCopy(capability.id)} className="text-sm bg-blue-500 text-white px-2 py-1 rounded-lg">
          Copy
        </button>
        <button onClick={handleDelete} className="text-red-700 text-sm">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function CapabilityDashboard() {
  const addAlert = useAddAlert();
  const { data, refetch } = useQuery(GET_ALL_CAPABILITIES);
  const [addUpdateCapability] = useMutation(ADD_UPDATE_CAPABILITY);
  const handleCopy = async (id: string) => {
    const selectedItem = data?.getAllCapabilities.find((capability: Capability) => capability.id === id) as Capability;

    try {
      const result = await addUpdateCapability({
        variables: {
          capability: {
            id: null,
            alias: selectedItem.alias + " Copy",
            name: selectedItem.name + " Copy",
            description: selectedItem.description,
            llmModel: selectedItem.llmModel,
            prompts: selectedItem.prompts.map(prompt => prompt.id),
            outputMode: selectedItem.outputMode,
            subscriptionFilter: selectedItem.subscriptionFilter,
            outputFilter: selectedItem.outputFilter,
          }
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
  }

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Capabilities</h1>
        <Link to="/dashboard/capabilities/edit" className="bg-blue-500 text-sm text-white px-2 py-1 rounded-lg ml-auto">
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
