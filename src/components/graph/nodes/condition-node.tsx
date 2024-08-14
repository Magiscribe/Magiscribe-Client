import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useCallback, useState } from 'react';

interface ConditionNodeProps {
  id: string;
  data: {
    text: string;
    edgeTexts: { [key: string]: string };
  };
}

export default function ConditionNode({ id, data }: ConditionNodeProps) {
  const [edgeTexts, setEdgeTexts] = useState(data.edgeTexts || {});
  const { getEdges, setNodes } = useReactFlow();

  const handleEdgeTextChange = useCallback(
    (edgeId: string, value: string) => {
      setEdgeTexts((prev) => {
        const newEdgeTexts = { ...prev, [edgeId]: value };
        setNodes((prevNodes) =>
          prevNodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, edgeTexts: newEdgeTexts } } : n)),
        );
        return newEdgeTexts;
      });
    },
    [id, setNodes],
  );

  const sourceEdges = getEdges().filter((edge) => edge.source === id);

  return (
    <div className="px-4 py-2 shadow-md rounded-3xl bg-white border-2 border-stone-400 w-96 shadow-xl">
      <div className="flex flex-col gap-2 pb-2">
        <p className="text-lg font-bold">
          <FontAwesomeIcon icon={faQuestionCircle} className="mr-2 text-blue-600" />
          Condition
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {sourceEdges.map((edge) => (
          <>
            <label key={edge.id} className="flex items-center gap-2">
              Condition for edge {edge.id}
            </label>
            <input
              key={edge.id}
              value={edgeTexts[edge.id] || ''}
              onChange={(e) => handleEdgeTextChange(edge.id, e.target.value)}
              className="w-full px-2 py-2 bg-slate-100 rounded-xl border-2 border-slate-200"
              placeholder={`Condition for edge ${edge.id}`}
            />
          </>
        ))}
      </div>

      <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
    </div>
  );
}
