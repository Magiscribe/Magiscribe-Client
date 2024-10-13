import React, { useCallback } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';
import { ImageUploader } from '@/components/imageUpload/image-uploader';
import { ImageMetadata } from '@/types/conversation';

type InformationNodeProps = NodeProps & {
  data: {
    text: string;
    dynamicGeneration: boolean;
    images: ImageMetadata[];
  };
};

export default function InformationNode({ id, data }: InformationNodeProps) {
  const { handleInputChange, updateNodeImages } = useNodeData<InformationNodeProps>(id);

  const handleUpdate = useCallback(
    (updates: Partial<InformationNodeProps['data']>) => {
      Object.entries(updates).forEach(([key, value]) => {
        handleInputChange({
          target: { name: key, value },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    },
    [handleInputChange],
  );

  return (
    <NodeContainer title="Information" faIcon={faExclamationCircle} id={id}>
      <ImageUploader nodeId={id} handleUpdateNodeImages={updateNodeImages} images={data.images}/>
      <div className="space-y-4 mt-2">
        <Input
          label="Dynamic Generation"
          name={`dynamicGeneration_${id}`}
          type="checkbox"
          checked={data.dynamicGeneration}
          onChange={(e) => handleUpdate({ dynamicGeneration: (e.target as HTMLInputElement).checked })}
          className="nodrag"
        />

        <Textarea
          label="Message"
          name="text"
          subLabel={
            data.dynamicGeneration
              ? 'Prompt for an AI to generate information'
              : 'Information displayed directly to the user'
          }
          value={data.text}
          onChange={(e) => handleUpdate({ text: e.target.value })}
          placeholder="Enter your text here..."
          className="resize-none overflow-hidden nodrag"
        />
      </div>
      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-green-500" />
      <CustomHandle connectionCount={1} type="source" position={Position.Right} className="w-4 h-4 !bg-green-500" />
    </NodeContainer>
  );
}
