import { ADD_UPDATE_PROMPT } from '@/clients/mutations';
import { GET_PROMPT } from '@/clients/queries';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { useAddAlert } from '@/hooks/alert-hook';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface PromptForm {
  id: string;
  name: string;
  text: string;
}

export default function PromptEdit() {
  // States
  const [form, setForm] = useState<PromptForm>({
    id: '',
    name: '',
    text: '',
  });

  // Hooks
  const { collection } = useParams<{ collection?: string }>();
  const addAlert = useAddAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Queries and Mutations
  const [upsertPrompt] = useMutation(ADD_UPDATE_PROMPT);
  useQuery(GET_PROMPT, {
    skip: !searchParams.has('id'),
    variables: {
      promptId: searchParams.get('id'),
    },
    onCompleted: (data) => {
      if (!data.getPrompt) return;

      handleUpdate({
        id: data.getPrompt.id,
        name: data.getPrompt.name,
        text: data.getPrompt.text,
      });
    },
  });

  const handleUpdate = useCallback((updates: Partial<PromptForm>) => {
    setForm((prevForm) => ({
      ...prevForm,
      ...updates,
    }));
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await upsertPrompt({
        variables: {
          prompt: {
            id: form.id,
            name: form.name,
            text: form.text,
            logicalCollection: collection,
          },
        },
      });

      if (result.errors) {
        addAlert('Error saving prompt', 'error');
        return;
      }

      addAlert('Prompt saved successfully', 'success');
      navigate('../prompts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Prompt</h1>
        </div>
        <form className="mt-8" onSubmit={handleSave}>
          <div className="mb-4">
            <Input
              name="name"
              label="Name"
              value={form.name}
              onChange={(e) => handleUpdate({ name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <Textarea
              name="text"
              label="Text"
              value={form.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
            />
          </div>
          <Button>Save</Button>
        </form>
      </div>
    </>
  );
}
