import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { ADD_VISUAL_PREDICTION } from "../../clients/mutations";
import { GET_ALL_AGENTS } from "../../clients/queries";
import { GRAPHQL_SUBSCRIPTION } from "../../clients/subscriptions";
import ListBox from "../../components/list/ListBox";
import { useTranscribe } from "../../hooks/AudioHooks";
import { Agent } from "../../types/agents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";

export default function PlaygroundDashboard() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subscriptionId: Math.random().toString(36),
    agent: "",
    prompt: "",
  });
  const [responses, setResponses] = useState<
    {
      visualPredictionAdded: {
        context: string;
        prompt: string;
        result: string;
        type: string;
      };
    }[]
  >([]);
  const { data: agents } = useQuery(GET_ALL_AGENTS);
  const [addVisualPrediction] = useMutation(ADD_VISUAL_PREDICTION);

  const { isTranscribing, transcript, startTranscribing, stopTranscribing } = useTranscribe();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    addVisualPrediction({
      variables: {
        subscriptionId: form.subscriptionId,
        agentId: form.agent,
        prompt: form.prompt,
        context: "context",
      },
    });
  };

  const handleTranscribe = () => {
    if (isTranscribing) {
      stopTranscribing();
    } else {
      startTranscribing();
    }
  }

  useEffect(() => {
    if (isTranscribing) {
      setForm({ ...form, prompt: form.prompt + transcript});
    }
  }, [transcript]);

  const handleClear = () => {
    setResponses([]);
  };

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId: form.subscriptionId },
    onData: ({ data }) => {
      setResponses([...responses, data.data]);

      if (
        data.data.visualPredictionAdded.type === "ERROR" ||
        data.data.visualPredictionAdded.type === "SUCCESS"
      ) {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <h1 className="text-3xl font-bold">Playground</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="subscriptionId"
            >
              Subscription ID
            </label>
            <input
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
              id="subscriptionId"
              value={form.subscriptionId}
              onChange={(e) =>
                setForm({ ...form, subscriptionId: e.target.value })
              }
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
              selected={(agents?.getAllAgents ?? []).find(
                (agent: Agent) => agent.id === form.agent,
              )}
              values={(agents?.getAllAgents ?? []).map((agent: Agent) => ({
                name: agent.name ?? "",
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
            className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600 transition-colors"
            onClick={handleTranscribe}
          >
            {isTranscribing ? "Stop" : "Transcribe"} <FontAwesomeIcon icon={isTranscribing ? faMicrophoneSlash : faMicrophone} />
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-red-600 transition-colors"
            onClick={handleClear}
          >
            Clear
          </button>
        </form>
        <div className=" mt-6 h-full max-h-96 w-full bg-gray-100 rounded-lg">
          <code className="h-full w-full block p-4 overflow-y-auto">
            {[...responses].reverse().map((response) => {
              return (
                <div className="mb-4 border-2 border-gray-200 p-2 rounded-lg text-sm">
                  {response.visualPredictionAdded.context && (
                    <p>
                      <span className="font-bold">Context: </span>
                      {response.visualPredictionAdded.context}
                    </p>
                  )}
                  {response.visualPredictionAdded.prompt && (
                    <p>
                      <span className="font-bold">Prompt: </span>
                      {response.visualPredictionAdded.prompt}
                    </p>
                  )}
                  {response.visualPredictionAdded.result && (
                    <p>
                      <span className="font-bold">Result: </span>
                      {response.visualPredictionAdded.result}
                    </p>
                  )}
                  {response.visualPredictionAdded.type && (
                    <p>
                      <span className="font-bold">Type: </span>
                      {response.visualPredictionAdded.type}
                    </p>
                  )}
                </div>
              );
            })}
          </code>
        </div>
      </div>
    </div>
  );
}
