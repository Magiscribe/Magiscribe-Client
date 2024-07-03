import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { faMicrophone, faMicrophoneSlash, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ADD_VISUAL_PREDICTION } from '../../clients/mutations';
import { GET_ALL_AGENTS } from '../../clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '../../clients/subscriptions';
import { useElevenLabsAudio } from '../../components/audio-player';
import ListBox from '../../components/list/ListBox';
import { useTranscribe } from '../../hooks/AudioHooks';
import { Agent } from '../../types/agents';
import { useWithLocalStorage } from '../../hooks/local-storage-hook';

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

export default function PlaygroundDashboard() {
  // States
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useWithLocalStorage(
    {
      subscriptionId: Math.random().toString(36),
      voice: 'PHOEBE',
      agent: '',
      prompt: '',
    },
    'playground-form',
  );
  const [responses, setResponses] = useState<Array<Data>>([]);

  // Queries and Mutations
  const { data: agents } = useQuery(GET_ALL_AGENTS);
  const [addPrediction] = useMutation(ADD_VISUAL_PREDICTION);

  // Transcribe
  const [enableAudio, setEnableAudio] = useState(false);
  const { isTranscribing, transcript, startTranscribing, stopTranscribing } = useTranscribe();
  const audio = useElevenLabsAudio(form.voice);

  /**
   * Handles the form submission event.
   * @param e {React.FormEvent<HTMLFormElement>} The form event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    addPrediction({
      variables: {
        subscriptionId: form.subscriptionId,
        agentId: form.agent,
        userMessage: form.prompt,
        context: 'context',
      },
    });
  };

  /**
   * Handles the starting/stopping of transcribing.
   */
  const handleTranscribe = () => {
    if (isTranscribing) {
      stopTranscribing();
    } else {
      startTranscribing();
    }
  };

  /**
   * Updates the prompt with the transcript.
   * @param transcript {string} The transcript.
   * @returns {void}
   * @sideeffect Updates the prompt with the transcript.
   */
  useEffect(() => {
    if (isTranscribing) {
      setForm({ ...form, prompt: `${form.prompt} ${transcript}` });
    }
  }, [transcript]);

  /**
   * Clears the responses.
   * @returns {void}
   * @sideeffect Clears the responses.
   */
  const handleClear = () => {
    setResponses([]);
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
        audio.addChunk(newPrediction.result);
      }

      // Update loading state for 'ERROR' or 'SUCCESS' types
      if (['ERROR', 'SUCCESS'].includes(newPrediction.type)) {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
        <h1 className="text-3xl font-bold">Playground</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="subscriptionId">
                Subscription ID
              </label>
              <input
                className="border-2 border-gray-200 p-2 rounded-lg w-full"
                id="subscriptionId"
                value={form.subscriptionId}
                onChange={(e) => setForm({ ...form, subscriptionId: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="voice">
                Voice
              </label>
              <input
                className="border-2 border-gray-200 p-2 rounded-lg w-full"
                id="voice"
                value={form.voice}
                onChange={(e) => setForm({ ...form, voice: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="agent">
                Agents
              </label>
              <ListBox
                setSelected={(value) =>
                  setForm({
                    ...form,
                    agent: value.id,
                  })
                }
                selected={(agents?.getAllAgents ?? []).find((agent: Agent) => agent.id === form.agent)}
                values={(agents?.getAllAgents ?? []).map((agent: Agent) => ({
                  name: agent.name ?? '',
                  id: agent.id,
                }))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="prompt">
                Prompt
              </label>
              <textarea
                className="border-2 border-gray-200 p-2 rounded-lg w-full"
                id="prompt"
                rows={8}
                value={form.prompt}
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Run
            </button>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-green-600 transition-colors"
              onClick={handleTranscribe}
            >
              Transcription {isTranscribing ? 'On' : 'Off'}{' '}
              <FontAwesomeIcon icon={isTranscribing ? faMicrophone : faMicrophoneSlash} />
            </button>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-green-600 transition-colors"
              onClick={() => setEnableAudio(!enableAudio)}
            >
              Audio {enableAudio ? 'On' : 'Off'} <FontAwesomeIcon icon={enableAudio ? faVolumeHigh : faVolumeMute} />
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-red-600 transition-colors"
              onClick={handleClear}
            >
              Clear
            </button>
          </form>
          <div className="mt-6 h-full max-h-96 w-full bg-gray-100 rounded-lg">
            <code className="h-full w-full block p-4 overflow-y-auto">
              {[...responses].reverse().map((response, i) => {
                const fields: Array<keyof predictionAdded> = ['id', 'context', 'prompt', 'result', 'type'];
                return (
                  <div key={i} className="mb-4 border-2 border-gray-200 p-2 rounded-lg text-sm">
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
      </div>
    </>
  );
}
