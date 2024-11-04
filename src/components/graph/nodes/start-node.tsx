import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Position } from '@xyflow/react';
import React, { useCallback } from 'react';
import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

interface StartNodeProps {
  id: string;

  data: {
    text: string;
    nameCapture: boolean;
    emailCapture: boolean;
  };
}

export default function StartNode({ id, data }: StartNodeProps) {
  const { handleInputChange } = useNodeData<StartNodeProps>(id);

  const handleUpdate = useCallback(
    (updates: Partial<StartNodeProps['data']>) => {
      Object.entries(updates).forEach(([key, value]) => {
        handleInputChange({
          target: { name: key, value },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    },
    [handleInputChange],
  );

  return (
    <NodeContainer title={'Start'} faIcon={faPlay} id={id}>
      <div className="space-y-4 mt-2">
        <Textarea
          label="Message"
          subLabel="Text that will be shown to the user on the start screen"
          name="text"
          value={data.text}
          onChange={(e) => handleUpdate({ text: e.target.value })}
          placeholder="Enter your text here..."
          className="resize-none overflow-hidden nodrag"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Start by collecting:</label>
          <Input
            label="Name"
            name="enableNameCapture"
            type="checkbox"
            checked={data.nameCapture}
            onChange={(e) => handleUpdate({ nameCapture: (e.target as HTMLInputElement).checked })}
            className="nodrag"
          />
          <Input
            label="Email"
            name="enableEmailCapture"
            type="checkbox"
            checked={data.emailCapture}
            onChange={(e) => handleUpdate({ emailCapture: (e.target as HTMLInputElement).checked })}
            className="nodrag"
          />
        </div>
      </div>
      <CustomHandle connectionCount={1} type={'source'} position={Position.Right} className="w-4 h-4 !bg-green-500" />
    </NodeContainer>
  );
}
