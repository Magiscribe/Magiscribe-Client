import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handle, Position } from '@xyflow/react';
import CustomHandle from '../handles/limit-handle';

interface StartEndNodeProps {
  id: string;
  type: 'start' | 'end';
}

function StartEndNode({ type }: StartEndNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-3xl bg-white border-2 border-stone-400 w-96 shadow-xl">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">
          <FontAwesomeIcon icon={type === 'start' ? faPlay : faStop} className="mr-2 text-blue-600" />
          {type === 'start' ? 'Start' : 'End'}
        </p>
      </div>

      {type === 'end' && <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />}
      {type === 'start' && (
        <CustomHandle connectionCount={1} type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
      )}
    </div>
  );
}

export const StartNode = ({ id }: { id: string }) => <StartEndNode id={id} type="start" />;
export const EndNode = ({ id }: { id: string }) => <StartEndNode id={id} type="end" />;
