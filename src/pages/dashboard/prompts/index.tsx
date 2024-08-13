import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DELETE_PROMPT } from '../../../clients/mutations';
import { GET_ALL_PROMPTS } from '../../../clients/queries';
import { Prompt } from '../../../types/agents';
import DeleteConfirmationModal from '../../../components/delete-modal'; // Adjust the import path as needed
import { useAddAlert } from '../../../hooks/AlertHooks';

function PromptCard({ prompt, onUpdate }: { prompt: Prompt; onUpdate?: () => void }) {
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
    } catch (error) {
      console.error(error);
      addAlert('Error deleting prompt', 'error');
    }

    if (onUpdate) onUpdate();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="relative bg-gray-100 p-4 rounded-lg shadow-md h-full w-full">
      <h2 className="text-xl font-bold">{prompt.name}</h2>
      <div className="absolute top-4 right-4 flex gap-2">
        <Link
          to={`/dashboard/prompts/edit?id=${prompt.id}`}
          className="text-sm bg-blue-500 text-white px-2 py-1 rounded-lg"
        >
          Edit
        </Link>
        <button onClick={() => setIsDeleteModalOpen(true)} className="text-red-700 text-sm">
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

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Prompts</h1>
        <Link to="/dashboard/prompts/edit" className="bg-blue-500 text-sm text-white px-2 py-1 rounded-lg ml-auto">
          Add Prompt
        </Link>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {data?.getAllPrompts.map((prompt: Prompt, i: number) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 * i }}
          >
            <PromptCard key={prompt.id} prompt={prompt} onUpdate={refetch} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
