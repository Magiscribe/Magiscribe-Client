import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ADD_UPDATE_AGENT } from "../../../clients/mutations";
import {
  GET_AGENT,
  GET_ALL_CAPABILITIES,
  GET_ALL_MODELS,
} from "../../../clients/queries";
import ListBoxMultiple from "../../../components/list/ListBoxMultiple";
import { useAddAlert } from "../../../hooks/AlertHooks";
import { Capability } from "../../../types/agents";
import ListBox from "../../../components/list/ListBox";

export default function AgentEdit() {
  const addAlert = useAddAlert();
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    reasoningLLMModel: "",
    reasoningPrompt: "",
    capabilities: [""],
  });
  const [searchParams] = useSearchParams();
  const [addUpdateAgent] = useMutation(ADD_UPDATE_AGENT);
  const { data: models } = useQuery(GET_ALL_MODELS);
  const { data: capabilities } = useQuery(GET_ALL_CAPABILITIES);
  const { data: agent } = useQuery(GET_AGENT, {
    skip: !searchParams.has("id"),
    variables: {
      agentId: searchParams.get("id"),
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (agent) {
      setForm({
        id: agent.getAgent.id,
        name: agent.getAgent.name,
        description: agent.getAgent.description,
        reasoningLLMModel: agent.getAgent.reasoningLLMModel,
        reasoningPrompt: agent.getAgent.reasoningPrompt,
        capabilities: agent.getAgent.capabilities.map(
          (capability: Capability) => capability.id,
        ),
      });
    }
  }, [agent]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    });
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
            reasoningLLMModel: form.reasoningLLMModel,
            reasoningPrompt: form.reasoningPrompt,
            capabilities: form.capabilities,
          },
        },
      });

      if (result.errors) {
        addAlert("Error saving agent", "error");
        return;
      }

      addAlert("Agent saved successfully", "success");
      navigate("/dashboard/agents");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button className="border-2 border-white rounded-full px-6 py-2 text-white font-bold hover:bg-white hover:text-black transition duration-300 mb-4">
        <Link to="/dashboard/agents">Back</Link>
      </button>
      <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
        <h1 className="text-3xl font-bold">{form.id ? "Edit" : "Add"} Agent</h1>
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
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="description"
            >
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
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="capabilities"
            >
              Capabilities
            </label>
            <ListBoxMultiple
              setSelected={(value) =>
                setForm({
                  ...form,
                  capabilities: value.map((capability) => capability.id),
                })
              }
              selected={(capabilities?.getAllCapabilities ?? []).filter(
                (capability: Capability) =>
                  form.capabilities.includes(capability.id),
              )}
              values={(capabilities?.getAllCapabilities ?? []).map(
                (capability: Capability) => ({
                  name: capability.name ?? "",
                  id: capability.id,
                }),
              )}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="capabilities"
            >
              LLM Model
            </label>
            <ListBox
              setSelected={(value) => {
                setForm({
                  ...form,
                  reasoningLLMModel: value.id,
                });
              }}
              selected={
                models?.getAllModels.find(
                  (model: any) => model.id === form.reasoningLLMModel,
                ) ?? { name: "", id: "" }
              }
              values={
                models?.getAllModels.map((model: any) => ({
                  name: model.name,
                  id: model.id,
                })) ?? []
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="prompt">
              Reasoning Prompt
            </label>
            <textarea
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
              id="reasoningPrompt"
              rows={30}
              value={form.reasoningPrompt}
              onChange={handleChange}
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        </form>
      </div>
    </>
  );
}
