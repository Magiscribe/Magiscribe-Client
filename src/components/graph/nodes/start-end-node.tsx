import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { Handle, Position } from '@xyflow/react';
import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';

interface StartEndNodeProps {
  id: string;
  type: 'start' | 'end';
}

function StartEndNode({ id, type }: StartEndNodeProps) {
  return (
    <NodeContainer title={type === 'start' ? 'Start' : 'End'} faIcon={type === 'start' ? faPlay : faStop} id={id}>
      {type === 'end' && <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />}
      {type === 'start' && (
        <CustomHandle connectionCount={1} type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
      )}
    </NodeContainer>
  );
}

export const StartNode = ({ id }: { id: string }) => <StartEndNode id={id} type="start" />;
export const EndNode = ({ id }: { id: string }) => <StartEndNode id={id} type="end" />;
