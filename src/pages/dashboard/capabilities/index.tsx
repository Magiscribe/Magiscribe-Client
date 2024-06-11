import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { DELETE_CAPABILITY } from "../../../clients/mutations";
import { GET_CAPABILITIES } from "../../../clients/queries";
import { Capability } from "../../../types/agents";

function CapabilityCard({
  capability,
  onUpdate,
}: {
  capability: Capability;
  onUpdate?: () => void;
}) {
  const [deleteCapability] = useMutation(DELETE_CAPABILITY);

  const handleDelete = async () => {
    try {
      await deleteCapability({
        variables: {
          capabilityId: capability.id,
        },
      });
    } catch (error) {
      console.error(error);
    }

    if (onUpdate) onUpdate();
  };

  return (
    <div className="relative bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{capability.name}</h2>
      <p className="text-sm">{capability.description}</p>
      <div className="absolute top-4 right-4 flex gap-2">
        <Link
          to={`/dashboard/capabilities/edit?id=${capability.id}`}
          className="text-sm bg-blue-500 text-white px-2 py-1 rounded-lg"
        >
          Edit
        </Link>
        <button onClick={handleDelete} className="text-red-700 text-sm">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function CapabilityDashboard() {
  const { data, refetch } = useQuery(GET_CAPABILITIES);

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Capabilities</h1>
        <Link
          to="/dashboard/capabilities/edit"
          className="bg-blue-500 text-sm text-white px-2 py-1 rounded-lg ml-auto"
        >
          Add Capability
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {data?.getAllCapabilities.map((capability: Capability) => (
          <CapabilityCard
            key={capability.id}
            capability={capability}
            onUpdate={refetch}
          />
        ))}
      </div>
    </div>
  );
}
