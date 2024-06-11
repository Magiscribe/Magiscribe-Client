import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ADD_UPDATE_AGENTS } from "../../../clients/mutations";
import { GET_AGENT, GET_CAPABILITIES } from "../../../clients/queries";
import { Capability } from "../../../types/agents";

export default function AgentEdit() {
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    aiModel: "",
    capabilities: [""],
  });
  const [searchParams] = useSearchParams();
  const [addUpdateAgent] = useMutation(ADD_UPDATE_AGENTS);
  const { data: capabilities } = useQuery(GET_CAPABILITIES);
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
        aiModel: agent.getAgent.aiModel,
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

    console.log(form);

    try {
      await addUpdateAgent({
        variables: {
          agent: {
            id: form.id,
            name: form.name,
            description: form.description,
            aiModel: form.aiModel,
            capabilities: form.capabilities,
          },
        },
      });

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
            <label className="block text-sm font-bold mb-2" htmlFor="aiModel">
              AI Model
            </label>
            <input
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
              id="aiModel"
              type="text"
              value={form.aiModel}
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
            <select
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
              id="capabilities"
              multiple
              value={form.capabilities}
              onChange={(e) => {
                setForm({
                  ...form,
                  capabilities: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  ),
                });
              }}
            >
              {capabilities?.getAllCapabilities.map(
                (capability: Capability) => (
                  <option key={capability.id} value={capability.id}>
                    {capability.name}
                  </option>
                ),
              )}
            </select>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        </form>
      </div>
    </>
  );
}
