import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { S3ImageNodeUploader } from '@/components/graph/utils/s3-image-node-upload';
import { ImageMetadata } from '@/types/conversation';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import React, { useCallback } from 'react';

import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

type InformationNodeProps = NodeProps & {
  data: {
    text: string;
    dynamicGeneration: boolean;
    images: ImageMetadata[];
  };
};

export default function InformationNode({ id, data }: InformationNodeProps) {
  const { handleInputChange } = useNodeData<InformationNodeProps>(id);

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
      <Input
        label="Dynamic Generation"
        name="dynamicGeneration"
        type="checkbox"
        checked={data.dynamicGeneration}
        onChange={(e) => handleUpdate({ dynamicGeneration: (e.target as HTMLInputElement).checked })}
        className="nodrag"
      />

      <Textarea
        label="Message"
        subLabel={
          data.dynamicGeneration
            ? 'Prompt for an AI to generate information'
            : 'Information displayed directly to the user'
        }
        name="text"
        value={data.text}
        onChange={(e) => handleUpdate({ text: e.target.value })}
        placeholder="Enter your text here..."
        className="resize-none overflow-hidden nodrag"
        rows={3}
      />

      <S3ImageNodeUploader nodeId={id} images={data.images} />
      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-green-500" />
      <CustomHandle connectionCount={1} type="source" position={Position.Right} className="w-4 h-4 !bg-green-500" />
    </NodeContainer>
  );
}
