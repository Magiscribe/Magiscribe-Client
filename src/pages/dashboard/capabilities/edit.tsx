import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ADD_UPDATE_CAPABILITIES } from "../../../clients/mutations";
import { GET_CAPABILITY } from "../../../clients/queries";
import { useAddAlert } from "../../../hooks/AlertHooks";

export default function CapabilityEdit() {
  const addAlert = useAddAlert();
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    prompt: "",
  });
  const [searchParams] = useSearchParams();
  const [addUpdateCapability] = useMutation(ADD_UPDATE_CAPABILITIES);
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
        description: capability.getCapability.description,
        prompt: capability.getCapability.prompt,
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
      await addUpdateCapability({
        variables: {
          capability: {
            id: form.id,
            name: form.name,
            description: form.description,
            prompt: form.prompt,
          },
        },
      });

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
            <label className="block text-sm font-bold mb-2" htmlFor="prompt">
              Prompt
            </label>
            <textarea
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
              id="prompt"
              rows={30}
              value={form.prompt}
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
