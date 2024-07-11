import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ADD_UPDATE_PROMPT } from '../../../clients/mutations';
import { GET_PROMPT } from '../../../clients/queries';
import { useAddAlert } from '../../../hooks/AlertHooks';

export default function PromptEdit() {
  // States
  const [form, setForm] = useState({
    id: '',
    name: '',
    text: '',
  });

  // Hooks
  const addAlert = useAddAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Queries and Mutations
  const [addUpdatePrompt] = useMutation(ADD_UPDATE_PROMPT);
  useQuery(GET_PROMPT, {
    skip: !searchParams.has('id'),
    variables: {
      promptId: searchParams.get('id'),
    },
    onCompleted: (data) => {
      setForm({
        id: data.getPrompt.id,
        name: data.getPrompt.name,
        text: data.getPrompt.text,
      });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await addUpdatePrompt({
        variables: {
          prompt: {
            id: form.id,
            name: form.name,
            text: form.text,
          },
        },
      });

      if (result.errors) {
        addAlert('Error saving prompt', 'error');
        return;
      }

      addAlert('Prompt saved successfully', 'success');
      navigate('/dashboard/prompts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
        <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Prompt</h1>
        <form className="mt-8" onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="prompt">
              Text
            </label>
            <textarea
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
              id="text"
              rows={30}
              value={form.text}
              onChange={handleChange}
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
        </form>
      </div>
    </>
  );
}
