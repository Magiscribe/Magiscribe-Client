import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handle, Position } from '@xyflow/react';
import CustomHandle from './limit-handle';

interface StartEndNodeProps {
  id: string;
  type: 'Start' | 'End';
}

function StartEndNode({ type }: StartEndNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-3xl bg-white border-2 border-stone-400 w-96 shadow-xl">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">
          <FontAwesomeIcon icon={type === 'Start' ? faPlay : faStop} className="mr-2 text-blue-600" />
          {type}
        </p>
      </div>

      {type === 'End' && <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />}
      {type === 'Start' && (
        <CustomHandle connectionCount={1} type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
      )}
    </div>
  );
}

export const StartNode = ({ id }: { id: string }) => <StartEndNode id={id} type="Start" />;
export const EndNode = ({ id }: { id: string }) => <StartEndNode id={id} type="End" />;
