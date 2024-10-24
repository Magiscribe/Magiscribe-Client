import { ADD_UPDATE_AGENT } from '@/clients/mutations';
import { GET_AGENT, GET_ALL_CAPABILITIES, GET_ALL_MODELS } from '@/clients/queries';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import ListBox from '@/components/controls/list/ListBox';
import ListBoxMultiple from '@/components/controls/list/ListBoxMultiple';
import Textarea from '@/components/controls/textarea';
import { GetAgentQuery, GetAllCapabilitiesQuery, GetAllModelsQuery, UpsertAgentMutation } from '@/graphql/graphql';
import { useAddAlert } from '@/hooks/alert-hook';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  subscriptionFilter: string | null | undefined;
  outputFilter: string | null | undefined;
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
  const [upsertAgent] = useMutation<UpsertAgentMutation>(ADD_UPDATE_AGENT);
  const { data: models } = useQuery<GetAllModelsQuery>(GET_ALL_MODELS);
  const { data: capabilities } = useQuery<GetAllCapabilitiesQuery>(GET_ALL_CAPABILITIES);

  useQuery<GetAgentQuery>(GET_AGENT, {
    skip: !searchParams.has('id'),
    variables: {
      agentId: searchParams.get('id'),
    },
    onCompleted: (data) => {
      if (!data.getAgent) {
        return;
      }

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
        capabilities: data.getAgent.capabilities.map((capability) => capability.id),
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
      const result = await upsertAgent({
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
      navigate('../agents');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Agent</h1>
        </div>
        <form className="mt-8" onSubmit={handleSave}>
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input name="name" label="Name" value={form.name} onChange={handleChange} />
            {form.reasoning && (
              <ListBox
                label="LLM Model"
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
            )}
          </div>
          <div className="mb-4">
            <ListBoxMultiple
              label="Capabilities"
              setSelected={(value) =>
                setForm({
                  ...form,
                  capabilities: value.map((capability) => capability.id),
                })
              }
              selected={(capabilities?.getAllCapabilities ?? []).filter((capability) =>
                form.capabilities.includes(capability.id),
              )}
              values={(capabilities?.getAllCapabilities ?? []).map((capability) => ({
                name: capability.name ?? '',
                id: capability.id,
              }))}
            />
          </div>

          <div className="mb-4">
            <Textarea name="description" label="Description" value={form.description} onChange={handleChange} />
          </div>

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ListBox
              label="Reasoning"
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
            {form.reasoning && (
              <div className="mb-4">
                <ListBox
                  label="Variable Pass Through"
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
              <ListBox
                label="Memory Enabled"
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
            <Textarea
              name="prompt"
              label="Reasoning Prompt"
              value={form.reasoning.prompt ?? ''}
              onChange={handleReasoningChange}
            />
          )}

          <div className="my-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              name="subscriptionFilter"
              label="Subscription Filter"
              value={form.subscriptionFilter ?? ''}
              onChange={handleChange}
            />
            <Input name="outputFilter" label="Output Filter" value={form.outputFilter ?? ''} onChange={handleChange} />
          </div>

          <Button>Save</Button>
        </form>
      </div>
    </>
  );
}
