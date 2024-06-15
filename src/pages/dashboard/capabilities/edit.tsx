import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ADD_UPDATE_CAPABILITY } from "../../../clients/mutations";
import { GET_ALL_PROMPTS, GET_CAPABILITY } from "../../../clients/queries";
import ListBoxMultiple from "../../../components/list/ListBoxMultiple";
import { useAddAlert } from "../../../hooks/AlertHooks";
import { Prompt } from "../../../types/agents";

export default function CapabilityEdit() {
  const addAlert = useAddAlert();
  const [form, setForm] = useState({
    id: null,
    name: "",
    alias: "",
    description: "",
    prompts: [""],
  });
  const [searchParams] = useSearchParams();
  const [addUpdateCapability] = useMutation(ADD_UPDATE_CAPABILITY);
  const { data: prompts } = useQuery(GET_ALL_PROMPTS);
  const { data: capability } = useQuery(GET_CAPABILITY, {
    skip: !searchParams.has("id"),
    variables: {
      capabilityId: searchParams.get("id"),
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
        prompts: capability.getCapability.prompts.map(
          (prompt: Prompt) => prompt.id,
        ),
      });
    }
  }, [capability]);

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
      const result = await addUpdateCapability({
        variables: {
          capability: {
            id: form.id,
            alias: form.alias,
            name: form.name,
            description: form.description,
            prompts: form.prompts,
          },
        },
      });

      if (result.errors) {
        addAlert("Error saving capability", "error");
        return;
      }

      addAlert("Capability saved successfully", "success");
      navigate("/dashboard/capabilities");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button className="border-2 border-white rounded-full px-6 py-2 text-white font-bold hover:bg-white hover:text-black transition duration-300 mb-4">
        <Link to="/dashboard/capabilities">Back</Link>
      </button>
      <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
        <h1 className="text-3xl font-bold">
          {form.id ? "Edit" : "Add"} Capability
        </h1>
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
            <label className="block text-sm font-bold mb-2" htmlFor="prompts">
              Prompts
            </label>
            <ListBoxMultiple
              setSelected={(value) =>
                setForm({
                  ...form,
                  prompts: value.map((capability) => capability.id),
                })
              }
              selected={(prompts?.getAllPrompts ?? []).filter(
                (capability: Prompt) => form.prompts.includes(capability.id),
              )}
              values={(prompts?.getAllPrompts ?? []).map(
                (capability: Prompt) => ({
                  name: capability.name ?? "",
                  id: capability.id,
                }),
              )}
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
