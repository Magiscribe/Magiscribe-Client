import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ADD_UPDATE_AGENT } from '../../../clients/mutations';
import { GET_AGENT, GET_ALL_CAPABILITIES, GET_ALL_MODELS } from '../../../clients/queries';
import ListBox from '../../../components/list/ListBox';
import ListBoxMultiple from '../../../components/list/ListBoxMultiple';
import { useAddAlert } from '../../../hooks/AlertHooks';
import { Capability } from '../../../types/agents';

interface Form {
  id: string | null;
  name: string;
  description: string;
  reasoning: {
    llmModel: string | null;
    prompt: string | null;
    variablePassThrough: boolean | null;
  } | null;
  capabilities: string[];
  memoryEnabled: boolean;
  subscriptionFilter: string | null;
  outputFilter: string | null;
}

export default function AgentEdit() {
  // States
  const [form, setForm] = useState<Form>({
    id: null,
    name: '',
    description: '',
    reasoning: null,
    capabilities: [''],
    memoryEnabled: false,
    subscriptionFilter: '',
    outputFilter: '',
  });

  // Hooks
  const addAlert = useAddAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Queries and Mutations
  const [addUpdateAgent] = useMutation(ADD_UPDATE_AGENT);
  const { data: models } = useQuery(GET_ALL_MODELS);
  const { data: capabilities } = useQuery(GET_ALL_CAPABILITIES);
  useQuery(GET_AGENT, {
    skip: !searchParams.has('id'),
    variables: {
      agentId: searchParams.get('id'),
    },
    onCompleted: (data) => {
      setForm({
        id: data.getAgent.id,
        name: data.getAgent.name,
        description: data.getAgent.description,
        reasoning: data.getAgent.reasoning
          ? {
              llmModel: data.getAgent.reasoning.llmModel,
              prompt: data.getAgent.reasoning.prompt,
              variablePassThrough: data.getAgent.reasoning.variablePassThrough,
            }
          : null,
        capabilities: data.getAgent.capabilities.map((capability: Capability) => capability.id),
        memoryEnabled: data.getAgent.memoryEnabled,
        subscriptionFilter: data.getAgent.subscriptionFilter,
        outputFilter: data.getAgent.outputFilter,
      });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleReasoningChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      reasoning: prevForm.reasoning
        ? { ...prevForm.reasoning, [id]: value }
        : { llmModel: null, prompt: null, variablePassThrough: null, [id]: value },
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await addUpdateAgent({
        variables: {
          agent: {
            id: form.id,
            name: form.name,
            description: form.description,
            reasoning: form.reasoning,
            capabilities: form.capabilities,
            memoryEnabled: form.memoryEnabled,
            subscriptionFilter: form.subscriptionFilter?.trim() === '' ? null : form.subscriptionFilter,
            outputFilter: form.outputFilter?.trim() === '' ? null : form.outputFilter,
          },
        },
      });

      if (result.errors) {
        addAlert('Error saving agent', 'error');
        return;
      }

      addAlert('Agent saved successfully', 'success');
      navigate('/dashboard/agents');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Agent</h1>
          <Link
            to="/dashboard/agents"
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back
          </Link>
        </div>
        <form className="mt-8" onSubmit={handleSave}>
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
            {form.reasoning && (
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="capabilities">
                  LLM Model
                </label>
                <ListBox
                  setSelected={(value) => {
                    setForm({
                      ...form,
                      reasoning: {
                        ...form.reasoning!,
                        llmModel: value.id,
                      },
                    });
                  }}
                  selected={
                    models?.getAllModels.find((model: { id: string }) => model.id === form.reasoning!.llmModel) ?? {
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
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="capabilities">
              Capabilities
            </label>
            <ListBoxMultiple
              setSelected={(value) =>
                setForm({
                  ...form,
                  capabilities: value.map((capability) => capability.id),
                })
              }
              selected={(capabilities?.getAllCapabilities ?? []).filter((capability: Capability) =>
                form.capabilities.includes(capability.id),
              )}
              values={(capabilities?.getAllCapabilities ?? []).map((capability: Capability) => ({
                name: capability.name ?? '',
                id: capability.id,
              }))}
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

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Reasoning Prompt
              </label>
              <ListBox
                setSelected={(value) => {
                  setForm({
                    ...form,
                    reasoning:
                      value.id === 'true'
                        ? {
                            llmModel: '',
                            prompt: '',
                            variablePassThrough: false,
                          }
                        : null,
                  });
                }}
                selected={{
                  name: form.reasoning ? 'Enabled' : 'Disabled',
                  id: form.reasoning ? 'true' : 'false',
                }}
                values={[
                  { name: 'Enabled', id: 'true' },
                  { name: 'Disabled', id: 'false' },
                ]}
              />
            </div>
            {form.reasoning && (
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Variable Pass Through to Capabilities
                </label>
                <ListBox
                  setSelected={(value) => {
                    setForm({
                      ...form,
                      reasoning: {
                        ...form.reasoning!,
                        variablePassThrough: value.id === 'true',
                      },
                    });
                  }}
                  selected={{
                    name: form.reasoning.variablePassThrough ? 'Enabled' : 'Disabled',
                    id: form.reasoning.variablePassThrough ? 'true' : 'false',
                  }}
                  values={[
                    { name: 'Enabled', id: 'true' },
                    { name: 'Disabled', id: 'false' },
                  ]}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Conversation Memory
              </label>
              <ListBox
                setSelected={(value) => {
                  setForm({
                    ...form,
                    memoryEnabled: value.id === 'true',
                  });
                }}
                selected={{
                  name: form.memoryEnabled ? 'Enabled' : 'Disabled',
                  id: form.memoryEnabled ? 'true' : 'false',
                }}
                values={[
                  { name: 'Enabled', id: 'true' },
                  { name: 'Disabled', id: 'false' },
                ]}
              />
            </div>
          </div>
          {form.reasoning && (
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="prompt">
                Reasoning Prompt
              </label>
              <textarea
                className="border-2 border-gray-200 p-2 rounded-lg w-full"
                id="prompt"
                rows={30}
                value={form.reasoning.prompt ?? ''}
                onChange={handleReasoningChange}
              />
            </div>
          )}

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Subscription Filter
              </label>
              <input
                className="border-2 border-gray-200 p-2 rounded-lg w-full"
                id="subscriptionFilter"
                type="text"
                value={form.subscriptionFilter ?? ''}
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
                value={form.outputFilter ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">Save</button>
        </form>
      </div>
    </>
  );
}
