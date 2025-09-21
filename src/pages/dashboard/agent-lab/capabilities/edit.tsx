import { ADD_UPDATE_CAPABILITY, ADD_UPDATE_PROMPT } from '@/clients/mutations';
import { GET_ALL_MODELS, GET_ALL_PROMPTS, GET_CAPABILITY } from '@/clients/queries';
import Container from '@/components/container';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import ReorderableList from '@/components/controls/list/ReorderableList';
import Select from '@/components/controls/select';
import Textarea from '@/components/controls/textarea';
import CustomModal from '@/components/modals/modal';
import { Prompt } from '@/graphql/types';
import { useAddAlert } from '@/providers/alert-provider';
import { useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

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
  const { collection } = useParams<{ collection?: string }>();
  const [upsertCapability] = useMutation(ADD_UPDATE_CAPABILITY);
  const [upsertPrompt] = useMutation(ADD_UPDATE_PROMPT);
  const { data: prompts } = useQuery(GET_ALL_PROMPTS, {
    variables: {
      logicalCollection: collection,
    },
  });
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
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
            logicalCollection: collection,
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
    try {
      const result = await upsertPrompt({
        variables: {
          prompt: {
            id: prompt.id,
            name: prompt.name,
            text: prompt.text,
            logicalCollection: collection,
          },
        },
      });

      if (result.errors) {
        addAlert('Error saving prompt', 'error');
        return;
      }
    } catch (error) {
      console.error(error);
      addAlert('Error saving prompt', 'error');
    }

    callback();
  };

  const handleFormSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // First, save all prompts
      await Promise.all(
        form.prompts.map((prompt) =>
          upsertPrompt({
            variables: {
              prompt: {
                id: prompt.id,
                name: prompt.name,
                text: prompt.text,
                logicalCollection: collection,
              },
            },
          }),
        ),
      );
      const result = await upsertCapability({
        variables: {
          capability: {
            id: form.id,
            alias: form.alias,
            logicalCollection: collection,
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

      addAlert('Capability and prompts saved successfully', 'success');
      navigate('../capabilities');
    } catch (error) {
      console.error(error);
      addAlert('Error saving capability', 'error');
    }
  };

  return (
    <>
      <Container>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{form.id ? 'Edit' : 'Add'} Capability</h1>
        </div>
        <form className="mt-8" onSubmit={handleFormSave}>
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="mb-4">
              <Input name="name" label="Name" value={form.name} onChange={handleInputChange} />
            </div>
            <div className="mb-4">
              <Input name="alias" label="Alias" value={form.alias} onChange={handleInputChange} />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="mb-4">
              <Select
                id="llmModel"
                name="llmModel"
                label="LLM Model"
                value={form.llmModel}
                options={
                  models?.getAllModels.map((model: { name: string; id: string }) => ({
                    value: model.id,
                    label: model.name,
                  })) ?? []
                }
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <Select
                id="outputMode"
                name="outputMode"
                label="Output Mode"
                value={form.outputMode}
                onChange={handleInputChange}
                options={OutputReturnMode.map((mode) => ({ value: mode.id, label: mode.name }))}
              >
                <option value="">Select an output mode</option>
                {OutputReturnMode.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="mb-4">
            <Textarea name="description" label="Description" value={form.description} onChange={handleInputChange} />
          </div>

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              name="subscriptionFilter"
              label="Subscription Filter (Optional)"
              value={form.subscriptionFilter}
              onChange={handleInputChange}
            />
            <Input
              name="outputFilter"
              label="Output Filter (Optional)"
              value={form.outputFilter}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="prompts">
                Prompts
              </label>
              <Button type="button" onClick={() => setOpenPromptModal(true)}>
                Add Prompt
              </Button>
            </div>
            <CustomModal title={'Add Item'} size="7xl" open={openPromptModal} onClose={() => setOpenPromptModal(false)}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {prompts?.getAllPrompts
                  .filter((item: Prompt) => !form.prompts.find((i) => i.id === item.id))
                  .map((item: Prompt) => (
                    <div
                      key={item.id}
                      className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg h-full w-full flex flex-col"
                    >
                      <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                      <p className="grow mb-2">
                        {item.text.substring(0, 50)}
                        {item.text.length > 50 ? '...' : ''}
                      </p>
                      <Button
                        type="button"
                        onClick={() => {
                          handlePromptAdd({ id: item.id });
                          setOpenPromptModal(false);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                <div
                  key={'newPrompt'}
                  className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg h-full w-full flex flex-col"
                >
                  <h3 className="text-lg font-bold mb-2">{'New Prompt'}</h3>
                  <Textarea
                    name="text"
                    className="mb-2"
                    id="text"
                    rows={1}
                    placeholder="Enter title of new prompt"
                    onChange={handleNewPromptTitleChange}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      handleNewPromptAdd();
                    }}
                  >
                    Add
                  </Button>
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
                  <p className="text-sm text-slate-600 dark:text-slate-200">
                    {item.text.substring(0, 100)}
                    {item.text.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex justify-left space-x-2 mt-2">
                    {isEditing ? (
                      <div className="grow">
                        <Input
                          name="name"
                          type="text"
                          value={item.name}
                          onChange={(e) => handlePromptChange(item.id, 'name', e.target.value)}
                          className="w-full mb-2 p-1 border rounded-lg"
                        />
                        <Textarea
                          name="prompt"
                          value={item.text}
                          onChange={(e) => handlePromptChange(item.id, 'text', e.target.value)}
                          className="w-full mb-2 p-1 border rounded-lg no-drag"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                              handlePromptSave(item, () => cancelEdit(e))
                            }
                          >
                            Save
                          </Button>
                          <Button type="button" onClick={cancelEdit} variant="inverseDanger">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grow space-x-2">
                        <Button type="button" onClick={() => edit(item)}>
                          Edit
                        </Button>
                        <Button type="button" onClick={() => handleDeletePrompt(item.id)} variant="inverseDanger">
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </Container>
    </>
  );
}
