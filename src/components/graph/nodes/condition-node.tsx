import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handle, Position } from '@xyflow/react';

interface ConditionNodeProps {
  id: string;
  data: {
    instruction: string;
  };
}

export default function ConditionNode({ id, data }: ConditionNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-3xl bg-white border-2 border-stone-400 w-96 shadow-xl">
      <div className="absolute top-2 right-2 text-xs text-gray-500">ID: {id}</div>
      <div className="flex flex-col gap-2 pb-2">
        <p className="text-lg font-bold">
          <FontAwesomeIcon icon={faQuestionCircle} className="mr-2 text-blue-600" />
          Condition
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p>{data.instruction}</p>
      </div>

      <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
    </div>
  );
}
