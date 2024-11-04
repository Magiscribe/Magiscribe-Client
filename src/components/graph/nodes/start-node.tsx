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
    description: string;
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
          label="Description"
          subLabel="A description that will be presented to the user before they start the conversation."
          name="text"
          value={data.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Enter your text here..."
          className="resize-none overflow-hidden nodrag"
        />
        <Input
          label="Capture Name"
          subLabel="The user will be asked to provide their name."
          name="enableNameCapture"
          type="checkbox"
          checked={data.nameCapture}
          onChange={(e) => handleUpdate({ nameCapture: (e.target as HTMLInputElement).checked })}
          className="nodrag"
        />
        <Input
          label="Capture Email"
          subLabel="The user will be asked to provide their email address."
          name="enableEmailCapture"
          type="checkbox"
          checked={data.emailCapture}
          onChange={(e) => handleUpdate({ emailCapture: (e.target as HTMLInputElement).checked })}
          className="nodrag"
        />
      </div>
      <CustomHandle connectionCount={1} type={'source'} position={Position.Right} className="w-4 h-4 !bg-green-500" />
    </NodeContainer>
  );
}
