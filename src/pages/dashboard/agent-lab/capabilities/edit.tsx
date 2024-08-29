import { ADD_UPDATE_CAPABILITY, ADD_UPDATE_PROMPT } from '@/clients/mutations';
import { GET_ALL_MODELS, GET_ALL_PROMPTS, GET_CAPABILITY } from '@/clients/queries';
import ListBox from '@/components/list/ListBox';
import ReorderableList from '@/components/list/ReorderableList';
import CustomModal from '@/components/modal';
import { useAddAlert } from '@/hooks/AlertHooks';
import { Prompt } from '@/types/agents';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OutputReturnMode = [
  {
    name: 'Synchonous Passthrough Aggregate',
    id: 'SYNCHRONOUS_PASSTHROUGH_AGGREGATE',
  },
  {
    name: 'Synchonous Passthrough Individual',
    id: 'SYNCHRONOUS_PASSTHROUGH_INVIDUAL',
  },
  {
    name: 'Synchonous Execution Aggregate',
    id: 'SYNCHRONOUS_EXECUTION_AGGREGATE',
  },
  {
    name: 'Synchonous Execution Individual',
    id: 'SYNCHRONOUS_EXECUTION_INVIDUAL',
  },
  {
    name: 'Streaming Individual',
    id: 'STREAMING_INDIVIDUAL',
  },
];

export type CapabilityEditForm = {
  id?: string;
  name: string;
  alias: string;
  description: string;
  llmModel: string;
  prompts: Prompt[];
  outputMode: string;
  subscriptionFilter: string;
  outputFilter: string;
  newPromptTitle: string;
};

export default function CapabilityEdit() {
  // States
  const [form, setForm] = useState<CapabilityEditForm>({
    id: undefined,
    name: '',
    alias: '',
    description: '',
    llmModel: '',
    prompts: [] as Prompt[],
    outputMode: '',
    subscriptionFilter: '',
    outputFilter: '',
    newPromptTitle: '',
  });
  const [openPromptModal, setOpenPromptModal] = useState(false);

  // Hooks
  const addAlert = useAddAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Queries and Mutations
  const [upsertCapability] = useMutation(ADD_UPDATE_CAPABILITY);
  const [upsertPrompt] = useMutation(ADD_UPDATE_PROMPT);
  const { data: prompts } = useQuery(GET_ALL_PROMPTS);
  const { data: models } = useQuery(GET_ALL_MODELS);
  useQuery(GET_CAPABILITY, {
    skip: !searchParams.has('id'),
    variables: {
      capabilityId: searchParams.get('id'),
    },
    onCompleted: (data) => {
      setForm({
        id: data.getCapability.id,
        name: data.getCapability.name,
        alias: data.getCapability.alias,
        description: data.getCapability.description,
        llmModel: data.getCapability.llmModel,
        prompts: data.getCapability.prompts,
        outputMode: data.getCapability.outputMode,
        subscriptionFilter: data.getCapability.subscriptionFilter,
        outputFilter: data.getCapability.outputFilter,
        newPromptTitle: '',
      });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    });
  };

  const handleDeletePrompt = (promptId: string) => {
    setForm({
      ...form,
      prompts: form.prompts.filter((p) => p.id !== promptId),
    });
  };

  const handleNewPromptTitleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      newPromptTitle: event.target.value,
    });
  };

  const handleNewPromptAdd = async () => {
    try {
      const result = await upsertPrompt({
        variables: {
          prompt: {
            id: '',
            name: form.newPromptTitle,
            text: 'Placeholder prompt text',
          },
        },
      });

      if (result.errors) {
        addAlert('Error creating prompt', 'error');
        return;
      }

      addAlert('New prompt saved successfully', 'success');
      setForm({
        ...form,
        prompts: [...form.prompts, result.data.upsertPrompt],
      });
      setOpenPromptModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePromptAdd = ({ id }: { id: string }) => {
    const selectedItem = prompts?.getAllPrompts.find((prompt: Prompt) => prompt.id === id);
    if (selectedItem) {
      setForm({
        ...form,
        prompts: [...form.prompts, selectedItem],
      });
    }
  };

  const handlePromptChange = (promptId: string, field: string, value: string) => {
    const newPrompts = form.prompts.map((prompt) => (prompt.id === promptId ? { ...prompt, [field]: value } : prompt));
    setForm({ ...form, prompts: newPrompts });
  };

  const handlePromptSave = async (prompt: Prompt, callback: () => void) => {
    await upsertPrompt({
      variables: {
        prompt: {
          id: prompt.id,
          name: prompt.name,
          text: prompt.text,
        },
      },
    });
    addAlert('Prompt saved successfully', 'success');
    callback();
  };

  const handleFormSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await upsertCapability({
        variables: {
          capability: {
            id: form.id,
            alias: form.alias,
            name: form.name,
            description: form.description,
            llmModel: form.llmModel,
            prompts: form.prompts.map((prompt) => prompt.id),
            outputMode: form.outputMode,
            subscriptionFilter: form.subscriptionFilter?.trim() === '' ? null : form.subscriptionFilter,
            outputFilter: form.outputFilter?.trim() === '' ? null : form.outputFilter,
          },
        },
      });

      if (result.errors) {
        addAlert('Error saving capability', 'error');
        return;
      }

      addAlert('Capability saved successfully', 'success');
      navigate('../capabilities');
    } catch (error) {
      console.error(error);
      addAlert('Error saving capability', 'error');
    }
  };

  return (
    <>
      <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Capability</h1>
        </div>
        <form className="mt-8" onSubmit={handleFormSave}>
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Alias
              </label>
              <input
                className="border-2 border-gray-200 p-2 rounded-lg w-full"
                id="alias"
                type="text"
                value={form.alias}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="capabilities">
                LLM Model
              </label>
              <ListBox
                setSelected={(value) => {
                  setForm({
                    ...form,
                    llmModel: value.id,
                  });
                }}
                selected={
                  models?.getAllModels.find((model: { id: string }) => model.id === form.llmModel) ?? {
                    name: '',
                    id: '',
                  }
                }
                values={
                  models?.getAllModels.map((model: { name: string; id: string }) => ({
                    name: model.name,
                    id: model.id,
                  })) ?? []
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Output Mode
              </label>
              <ListBox
                setSelected={(value) => {
                  setForm({
                    ...form,
                    outputMode: value.id,
                  });
                }}
                selected={OutputReturnMode.find((mode) => mode.id === form.outputMode) ?? { name: '', id: '' }}
                values={OutputReturnMode.map((mode) => ({
                  name: mode.name,
                  id: mode.id,
                }))}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
              id="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Subscription Filter (Optional)
              </label>
              <input
                className="border-2 border-gray-200 p-2 rounded-lg w-full"
                id="subscriptionFilter"
                type="text"
                value={form.subscriptionFilter}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Output Filter (Optional)
              </label>
              <input
                className="border-2 border-gray-200 p-2 rounded-lg w-full"
                id="outputFilter"
                type="text"
                value={form.outputFilter}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="prompts">
              Prompts
            </label>
            <button
              type="button"
              onClick={() => setOpenPromptModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-lg mb-2"
            >
              Add Prompt
            </button>
            <CustomModal title={'Add Item'} size="7xl" open={openPromptModal} onClose={() => setOpenPromptModal(false)}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {prompts?.getAllPrompts
                  .filter((item: Prompt) => !form.prompts.find((i) => i.id === item.id))
                  .map((item: Prompt) => (
                    <div key={item.id} className="bg-gray-100 p-2 rounded-lg h-full w-full flex flex-col">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="flex-grow">
                        {item.text.substring(0, 50)}
                        {item.text.length > 50 ? '...' : ''}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          handlePromptAdd({ id: item.id });
                          setOpenPromptModal(false);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded-lg self-start mt-2"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                <div key={'newPrompt'} className="bg-gray-100 p-2 rounded-lg h-full w-full flex flex-col">
                  <h3 className="text-lg font-bold">{'New Prompt'}</h3>
                  <textarea
                    className="border-2 border-gray-200 p-2 rounded-lg w-full"
                    id="text"
                    rows={1}
                    placeholder="Enter title of new prompt"
                    onChange={handleNewPromptTitleChange}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleNewPromptAdd();
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg self-start mt-2"
                  >
                    Add
                  </button>
                </div>
              </div>
            </CustomModal>
            <ReorderableList
              items={form.prompts.map((prompt) => prompt)}
              onItemsChange={(newItems) => {
                setForm({
                  ...form,
                  prompts: newItems,
                });
              }}
              renderItem={(item, isEditing, edit, cancelEdit) => (
                <div key={item.id}>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.text.substring(0, 100)}
                    {item.text.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex justify-left space-x-2 mt-2">
                    {isEditing ? (
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handlePromptChange(item.id, 'name', e.target.value)}
                          className="w-full mb-2 p-1 border rounded-lg"
                        />
                        <textarea
                          value={item.text}
                          onChange={(e) => handlePromptChange(item.id, 'text', e.target.value)}
                          className="w-full mb-2 p-1 border rounded-lg"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={(e) => handlePromptSave(item, () => cancelEdit(e))}
                            className="bg-green-500 text-white px-2 py-1 rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-2 py-1 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-grow space-x-2">
                        <button
                          type="button"
                          onClick={() => edit(item)}
                          className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePrompt(item.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        </form>
      </div>
    </>
  );
}
