import { ADD_UPDATE_PROMPT } from '@/clients/mutations';
import { GET_PROMPT } from '@/clients/queries';
import Container from '@/components/container';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { GetPromptQuery, UpsertPromptMutation } from '@/graphql/graphql';
import { useAddAlert } from '@/providers/alert-provider';
import { useMutation, useQuery } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function PromptEdit() {
  // States
  const [form, setForm] = useState({
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
  const [upsertPrompt] = useMutation<UpsertPromptMutation>(ADD_UPDATE_PROMPT);
  const { data: promptData } = useQuery<GetPromptQuery>(GET_PROMPT, {
    skip: !searchParams.has('id'),
    variables: {
      promptId: searchParams.get('id'),
    },
  });

  // Handle prompt data loading
  useEffect(() => {
    if (promptData?.getPrompt) {
      const prompt = promptData.getPrompt;
      setForm({
        id: prompt.id,
        name: prompt.name,
        text: prompt.text,
      });
    }
  }, [promptData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

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

      if (result.error) {
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
      <Container>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Prompt</h1>
        </div>
        <form className="mt-8" onSubmit={handleSave}>
          <div className="mb-4">
            <Input name="name" label="Name" value={form.name} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <Textarea name="text" label="Text" value={form.text} onChange={handleInputChange} />
          </div>
          <Button>Save</Button>
        </form>
      </Container>
    </>
  );
}
