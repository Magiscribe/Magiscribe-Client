import { ADD_PREDICTION } from '@/clients/mutations';
import { GET_ALL_AGENTS } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import Container from '@/components/container';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Select from '@/components/controls/select';
import { CustomInput, CustomInputSection } from '@/components/custom-variables';
import { AddPredictionMutation } from '@/graphql/types';
import { Agent } from '@/graphql/types';
import useElevenLabsAudio from '@/hooks/audio-player';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface predictionAdded {
  id: string;
  context: string;
  prompt: string;
  result: string;
  type: string;
}

interface Data {
  predictionAdded: predictionAdded;
}

interface Form {
  subscriptionId: string;
  voice: string;
  agent: string;
  customInput: CustomInput[];
  prompt: string;
}

const initialForm: Form = {
  subscriptionId: Math.random().toString(36),
  voice: 'PHOEBE',
  agent: '',
  customInput: [{ key: 'userMessage', value: 'Placeholder' }],
  prompt: '',
};

export default function PlaygroundDashboard() {
  // React Router
  const params = useParams();

  // States
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useWithLocalStorage(initialForm, 'playground-form');
  const [responses, setResponses] = useState<Array<Data>>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]);

  // Queries and Mutations
  const { data: agents } = useQuery(GET_ALL_AGENTS, {
    variables: {
      logicalCollection: params.collection,
    },
  });
  const [addPrediction] = useMutation<AddPredictionMutation>(ADD_PREDICTION);

  // Text to speech
  const [enableAudio, setEnableAudio] = useState(false);
  const audio = useElevenLabsAudio(form.voice);

  useEffect(() => {
    if (!form.customInput || form.customInput.length === 0) {
      setForm(() => ({
        ...initialForm,
      }));
    }
  }, []);

  const setCustomInput = useCallback(
    (agentVariables: CustomInput[]) => {
      if (!agentVariables.length) return;
      const customInput = agentVariables.map((variable) => {
        const value = (form as Form).customInput.filter((formVariable) => formVariable.key === variable.key).shift();
        const variableWithFormValue: CustomInput = {
          key: variable.key,
          value: value?.value ?? '',
        };
        return variableWithFormValue;
      });
      setForm((prevForm: Form) => ({
        ...prevForm,
        customInput,
      }));
    },
    [form],
  );

  const updateCustomVariable = (index: number, updatedVariable: { key: string; value: string }) => {
    setForm((prevForm: Form) => ({
      ...prevForm,
      customInput: (prevForm.customInput || []).map((variable, i) => (i === index ? updatedVariable : variable)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const customInput = form.customInput as CustomInput[];
    const input = Object.fromEntries(customInput.map(({ key, value }) => [key, value]));

    try {
      const result = await addPrediction({
        variables: {
          subscriptionId: form.subscriptionId,
          agentId: form.agent,
          input: input,
          attachments: base64Images.map((image) => ({
            type: 'image_url',
            image_url: {
              url: image,
            },
          })),
        },
      });

      console.log('Prediction added successfully:', result);
      // Handle successful submission (e.g., show a success message)
    } catch (error) {
      console.error('Error submitting prediction:', error);
      // Handle other types of errors
    }
  };

  /**
   * Clears the responses.
   * @returns {void}
   * @sideeffect Clears the responses.
   */
  const handleClear = () => {
    setResponses([]);
  };

  /**
   * Handles the image upload and conversion to base64.
   * @param event {React.ChangeEvent<HTMLInputElement>} The change event.
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Images((prevImages) => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  /**
   * Subscribes to the GraphQL subscription.
   * Updates responses and loading state based on received data.
   */
  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId: form.subscriptionId },
    shouldResubscribe: true,
    onData: ({ data }) => {
      const newPrediction = data.data.predictionAdded;

      // Find existing response with matching ID and type 'DATA'
      const existingResponse = responses.find(
        (r) => r.predictionAdded.id === newPrediction.id && r.predictionAdded.type === 'DATA',
      );

      if (existingResponse && newPrediction.type === 'DATA') {
        // Update existing response
        existingResponse.predictionAdded.result += newPrediction.result;
        setResponses([...responses]);
      } else {
        // Add new response
        setResponses([...responses, data.data]);
      }

      // Add audio chunk if enabled
      if (enableAudio && newPrediction.type === 'DATA') {
        audio.addSentence(newPrediction.result);
      }

      // Update loading state for 'ERROR' or 'SUCCESS' types
      if (['ERROR', 'SUCCESS'].includes(newPrediction.type)) {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Container>
        <h1 className="text-3xl font-bold">Playground</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                name="subscriptionId"
                label="Subscription ID"
                value={form.subscriptionId}
                onChange={(e) => setForm({ ...form, subscriptionId: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Input
                name="voice"
                label="Voice"
                value={form.voice}
                onChange={(e) => setForm({ ...form, voice: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Select
                name="agent"
                label="Agents"
                onChange={(e) => setForm({ ...form, agent: e.target.value })}
                value={form.agent}
                options={
                  agents?.getAllAgents.map((agent: Agent) => ({
                    value: agent.id,
                    label: agent.name,
                  })) ?? []
                }
              />
            </div>
            <div className="mb-4">
              <CustomInputSection
                agentId={form.agent}
                variables={form.customInput || []}
                onUpdateVariable={updateCustomVariable}
                setCustomInput={setCustomInput}
              />
            </div>
            <div className="mb-4">
              <Input name="image-upload" type="file" label="Upload Images" onChange={handleImageUpload} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Uploaded Images</label>
              <div className="flex flex-wrap gap-2">
                {base64Images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Uploaded ${index + 1}`} className="w-24 h-24 object-cover rounded-sm" />
                    <Button
                      type="button"
                      variant="transparentDanger"
                      onClick={() => setBase64Images(base64Images.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-x-2">
              <Button disabled={loading}>Run</Button>
              <Button type="button" variant="success" onClick={() => setEnableAudio(!enableAudio)}>
                Audio {enableAudio ? 'On' : 'Off'} <FontAwesomeIcon icon={enableAudio ? faVolumeHigh : faVolumeMute} />
              </Button>
              <Button type="button" variant="danger" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
          <div className="mt-6 h-full max-h-96 w-full bg-slate-100 dark:bg-slate-800 rounded-lg">
            <code className="h-full w-full block p-4 overflow-y-auto">
              {[...responses].reverse().map((response, i) => {
                const fields: Array<keyof predictionAdded> = ['id', 'context', 'prompt', 'result', 'type'];
                return (
                  <div key={i} className="mb-4 border-2 border-slate-200 p-2 rounded-lg text-sm">
                    {fields.map((field, i) => {
                      const value = response.predictionAdded[field];
                      return value ? (
                        <p key={i}>
                          <span className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}: </span>
                          {value}
                        </p>
                      ) : null;
                    })}
                  </div>
                );
              })}
            </code>
          </div>
        </div>
      </Container>
    </>
  );
}
