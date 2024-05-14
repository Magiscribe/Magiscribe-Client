import { ADD_UPDATE_PROMPT, DELETE_PROMPT } from '@/clients/mutations';
import { GET_ALL_PROMPTS } from '@/clients/queries';
import Container from '@/components/container';
import Button from '@/components/controls/button';
import ConfirmationModal from '@/components/modals/confirm-modal';
import { Prompt } from '@/graphql/types';
import { useAddAlert } from '@/providers/alert-provider';
import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();

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
    <div className="bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-white  p-4 rounded-2xl shadow-md h-full w-full flex flex-col">
      <div className="grow">
        <h2 className="text-xl font-bold mb-4 break-words">{prompt.name}</h2>
      </div>
      <div className="grow">
        <p className="text-sm mb-4 break-words">
          {prompt.text.substring(0, 100).trim()}
          {prompt.text.length > 100 ? '...' : ''}
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button onClick={() => navigate(`edit?id=${prompt.id}`)} size="small">
          Edit
        </Button>
        <Button onClick={() => onCopy(prompt.id)} size="small">
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
        text="Are you sure you want to delete this prompt?"
      />
    </div>
  );
}

export default function PromptDashboard() {
  // React Router
  const params = useParams();

  // Queries
  const { data, refetch } = useQuery(GET_ALL_PROMPTS, {
    variables: {
      logicalCollection: params.collection,
    },
  });
  const [upsertPrompt] = useMutation(ADD_UPDATE_PROMPT);

  const addAlert = useAddAlert();
  const navigate = useNavigate();

  const handleCopy = async (id: string) => {
    const selectedItem = data?.getAllPrompts.find((prompt: Prompt) => prompt.id === id) as Prompt;
    const timeStamp = Date.now();
    try {
      const result = await upsertPrompt({
        variables: {
          prompt: {
            id: null,
            name: selectedItem.name + '_Copy_' + timeStamp,
            text: selectedItem.text,
            logicalCollection: params.collection,
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
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prompts</h1>
        <Button onClick={() => navigate('edit')}>Add Prompt</Button>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
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
    </Container>
  );
}
