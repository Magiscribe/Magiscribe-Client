import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DELETE_PROMPT, ADD_UPDATE_PROMPT } from '@/clients/mutations';
import { GET_ALL_PROMPTS } from '@/clients/queries';
import { Prompt } from '@/types/agents';
import DeleteConfirmationModal from '@/components/delete-modal';
import { useAddAlert } from '@/hooks/AlertHooks';

function PromptCard({
  prompt,
  onUpdate,
  onCopy,
}: {
  prompt: Prompt;
  onUpdate?: () => void;
  onCopy: (id: string) => void;
}) {
  const [deletePrompt] = useMutation(DELETE_PROMPT);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const addAlert = useAddAlert();

  const handleDelete = async () => {
    try {
      await deletePrompt({
        variables: {
          promptId: prompt.id,
        },
      });
      addAlert('Prompt successfully deleted', 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      addAlert('Error deleting prompt', 'error');
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md h-full w-full flex flex-col">
      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-4 break-words">{prompt.name}</h2>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Link
          to={`edit?id=${prompt.id}`}
          className="text-sm bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-lg whitespace-nowrap"
        >
          Edit
        </Link>
        <button
          onClick={() => onCopy(prompt.id)}
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
        itemName="prompt"
      />
    </div>
  );
}

export default function PromptDashboard() {
  const { data, refetch } = useQuery(GET_ALL_PROMPTS);
  const [addUpdatePrompt] = useMutation(ADD_UPDATE_PROMPT);
  const addAlert = useAddAlert();

  const handleCopy = async (id: string) => {
    const selectedItem = data?.getAllPrompts.find((prompt: Prompt) => prompt.id === id) as Prompt;
    const timeStamp = Date.now();
    try {
      const result = await addUpdatePrompt({
        variables: {
          prompt: {
            id: null,
            name: selectedItem.name + '_Copy_' + timeStamp,
            text: selectedItem.text,
          },
        },
      });

      if (result.errors) {
        addAlert('Error copying prompt', 'error');
        return;
      }

      addAlert('Prompt copied successfully', 'success');
      refetch();
    } catch (error) {
      console.error(error);
      addAlert('Error copying prompt', 'error');
    }
  };

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prompts</h1>
        <Link to="edit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add Prompt
        </Link>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 my-8">
        {data?.getAllPrompts.map((prompt: Prompt, i: number) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 * i }}
          >
            <PromptCard key={prompt.id} prompt={prompt} onUpdate={refetch} onCopy={handleCopy} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
