import { ADD_UPDATE_AGENT } from '@/clients/mutations';
import { GET_AGENT, GET_ALL_CAPABILITIES, GET_ALL_MODELS } from '@/clients/queries';
import Container from '@/components/container';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import ListBoxMultiple from '@/components/controls/list/ListBoxMultiple';
import Select from '@/components/controls/select';
import Textarea from '@/components/controls/textarea';
import { GetAgentQuery, GetAllCapabilitiesQuery, GetAllModelsQuery, UpsertAgentMutation } from '@/graphql/graphql';
import { useAddAlert } from '@/providers/alert-provider';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

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
  const { collection } = useParams<{ collection?: string }>();
  const [upsertAgent] = useMutation<UpsertAgentMutation>(ADD_UPDATE_AGENT);
  const { data: models } = useQuery<GetAllModelsQuery>(GET_ALL_MODELS);
  const { data: capabilities } = useQuery<GetAllCapabilitiesQuery>(GET_ALL_CAPABILITIES, {
    variables: {
      logicalCollection: collection,
    },
  });

  useQuery<GetAgentQuery>(GET_AGENT, {
    skip: !searchParams.has('id'),
    variables: {
      agentId: searchParams.get('id'),
    },
    onCompleted: (data) => {
      if (!data.getAgent) return;

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleReasoningChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      reasoning: prevForm.reasoning
        ? { ...prevForm.reasoning, [name]: value }
        : { llmModel: null, prompt: null, variablePassThrough: null, [name]: value },
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
            logicalCollection: collection,
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
      <Container>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Agent</h1>
        </div>
        <form className="mt-8" onSubmit={handleSave}>
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input name="name" label="Name" value={form.name} onChange={handleInputChange} />
            {form.reasoning && (
              <Select
                label="LLM Model"
                name="llmModel"
                value={form.reasoning.llmModel ?? ''}
                onChange={(e) => {
                  setForm({
                    ...form,
                    reasoning: {
                      ...form.reasoning!,
                      llmModel: e.target.value,
                    },
                  });
                }}
                options={
                  models?.getAllModels.map((model) => ({
                    value: model.id,
                    label: model.name,
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
            <Textarea name="description" label="Description" value={form.description} onChange={handleInputChange} />
          </div>

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Select
              label="Reasoning"
              name="reasoning"
              value={form.reasoning ? 'true' : 'false'}
              onChange={(e) => {
                setForm({
                  ...form,
                  reasoning:
                    e.target.value === 'true'
                      ? {
                          llmModel: '',
                          prompt: '',
                          variablePassThrough: false,
                        }
                      : null,
                });
              }}
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' },
              ]}
            />
            {form.reasoning && (
              <Select
                label="Variable Pass Through"
                name="variablePassThrough"
                value={form.reasoning.variablePassThrough ? 'true' : 'false'}
                onChange={(e) => {
                  setForm({
                    ...form,
                    reasoning: {
                      ...form.reasoning!,
                      variablePassThrough: e.target.value === 'true',
                    },
                  });
                }}
                options={[
                  { value: 'true', label: 'Enabled' },
                  { value: 'false', label: 'Disabled' },
                ]}
              />
            )}

            <Select
              label="Memory Enabled"
              name="memoryEnabled"
              value={form.memoryEnabled ? 'true' : 'false'}
              onChange={(e) => {
                setForm({
                  ...form,
                  memoryEnabled: e.target.value === 'true',
                });
              }}
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' },
              ]}
            />
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
              onChange={handleInputChange}
            />
            <Input
              name="outputFilter"
              label="Output Filter"
              value={form.outputFilter ?? ''}
              onChange={handleInputChange}
            />
          </div>

          <Button>Save</Button>
        </form>
      </Container>
    </>
  );
}
