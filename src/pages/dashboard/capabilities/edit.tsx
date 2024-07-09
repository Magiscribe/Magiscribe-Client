import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ADD_UPDATE_CAPABILITY } from '../../../clients/mutations';
import { GET_ALL_MODELS, GET_ALL_PROMPTS, GET_CAPABILITY } from '../../../clients/queries';
import ListBox from '../../../components/list/ListBox';
import { useAddAlert } from '../../../hooks/AlertHooks';
import { Prompt } from '../../../types/agents';
import ReorderableList from '../../../components/list/ReorderableList';
import React from 'react';

interface ListItem {
  id: string;
  name: string;

}


const PromptItem = (
  item: ListItem,
  isEditing: boolean,
  onEdit: (field: string, value: any) => void
) => {
  const prompt = item as Prompt; // Type assertion, assuming Prompt extends ListItem

  return (
    <div className="flex-grow">
      {isEditing ? (
        // Edit mode UI
        <div>
          <input
            type="text"
            value={prompt.name}
            onChange={(e) => onEdit('name', e.target.value)}
            className="w-full mb-2 p-1 border rounded"
          />
          <textarea
            value={prompt.text}
            onChange={(e) => onEdit('text', e.target.value)}
            className="w-full mb-2 p-1 border rounded"
            rows={3}
          />
        </div>
      ) : (
        // View mode UI
        <div>
          <h3 className="text-lg font-semibold">{prompt.name}</h3>
          <p className="text-sm text-gray-600">{prompt.text.substring(0, 100)}...</p>
        </div>
      )}
    </div>
  );
};



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

export default function CapabilityEdit() {
  const addAlert = useAddAlert();
  const [form, setForm] = useState({
    id: null,
    name: '',
    alias: '',
    description: '',
    llmModel: '',
    prompts: [] as Prompt[],
    outputMode: '',
    subscriptionFilter: '',
    outputFilter: '',
  });
  const [searchParams] = useSearchParams();
  const [addUpdateCapability] = useMutation(ADD_UPDATE_CAPABILITY);
  const { data: prompts } = useQuery(GET_ALL_PROMPTS);
  // const [availablePrompts, setAvailablePrompts] = useState<Prompt[]>([]);
  const { data: models } = useQuery(GET_ALL_MODELS);
  const { data: capability } = useQuery(GET_CAPABILITY, {
    skip: !searchParams.has('id'),
    variables: {
      capabilityId: searchParams.get('id'),
    },
  });
  const navigate = useNavigate();


  useEffect(() => {
    if (capability) {
      setForm({
        id: capability.getCapability.id,
        name: capability.getCapability.name,
        alias: capability.getCapability.alias,
        description: capability.getCapability.description,
        llmModel: capability.getCapability.llmModel,
        prompts: capability.getCapability.prompts.map((prompt: Prompt) => ({
          id: prompt.id,
          name: prompt.name,
          text: prompt.text,
        })),
        outputMode: capability.getCapability.outputMode,
        subscriptionFilter: capability.getCapability.subscriptionFilter,
        outputFilter: capability.getCapability.outputFilter,
      });
    }
  }, [capability]);

  // useEffect(() => {
  //   if (prompts && form.prompts) {
  //     const usedPromptIds = new Set(form.prompts.map(p => p.id));
  //     setAvailablePrompts(prompts.getAllPrompts.filter((p: Prompt) => !usedPromptIds.has(p.id)));
  //   }
  // }, [prompts, form.prompts]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await addUpdateCapability({
        variables: {
          capability: {
            id: form.id,
            alias: form.alias,
            name: form.name,
            description: form.description,
            llmModel: form.llmModel,
            prompts: form.prompts.map(prompt => prompt.id),
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
      navigate('/dashboard/capabilities');
    } catch (error) {
      console.error(error);
      addAlert('Error saving capability', 'error');
    }
  };

  return (
    <>
      <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
        <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Capability</h1>
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
                models?.getAllModels.find((model: { id: string }) => model.id === form.llmModel) ?? { name: '', id: '' }
              }
              values={
                models?.getAllModels.map((model: { name: string; id: string }) => ({
                  name: model.name,
                  id: model.id,
                })) ?? []
              }
            />
          </div>
          
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Subscription Filter
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
                Output Filter
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
          <ReorderableList
          availableItems={prompts}
          items={form.prompts} 
          onItemsChange={() => setForm((form) => ({ ...form, prompts }))}
          renderItem={PromptItem}
          onItemSave={async () => {}}
          />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save Capability</button>
        </form>
      </div>
    </>
  );
}
