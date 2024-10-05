import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Select from '@/components/controls/select';
import { faPlus, faQuestionCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import React, { useCallback } from 'react';

import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

enum NodeType {
  OpenEnded = 'open-ended',
  RatingSingle = 'rating-single',
  RatingMulti = 'rating-multi',
}

type QuestionNodeProps = NodeProps & {
  data: {
    text?: string;
    type: NodeType;
    ratings?: string[];
    dynamicGeneration?: boolean;
  };
};

export default function QuestionNode({ id, data }: QuestionNodeProps) {
  const { handleInputChange } = useNodeData<QuestionNodeProps>(id);

  const handleUpdate = useCallback(
    (updates: Partial<QuestionNodeProps['data']>) => {
      if (updates.dynamicGeneration) {
        updates = {
          ...updates,
          ratings: undefined,
        };
      }

      Object.entries(updates).forEach(([key, value]) => {
        handleInputChange({
          target: { name: key, value },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    },
    [handleInputChange],
  );

  const handleRatingChange = (index: number, value: string) => {
    const newRatings = [...(data.ratings || [])];
    newRatings[index] = value;
    handleUpdate({ ratings: newRatings });
  };

  const addRating = () => {
    const newRatings = [...(data.ratings || []), ''];
    handleUpdate({ ratings: newRatings });
  };

  const removeRating = (index: number) => {
    const newRatings = (data.ratings || []).filter((_, i) => i !== index);
    handleUpdate({ ratings: newRatings });
  };

  return (
    <NodeContainer title="Question" faIcon={faQuestionCircle} id={id}>
      <div className="space-y-4 mt-2">
        <Input
          label="Dynamic Generation"
          name="dynamicGeneration"
          type="checkbox"
          checked={data.dynamicGeneration}
          onChange={(e) => handleUpdate({ dynamicGeneration: (e.target as HTMLInputElement).checked })}
          className="nodrag"
        />

        <Select
          label="Question Type"
          name="type"
          value={data.type}
          onChange={(e) => handleUpdate({ type: e.target.value as NodeType })}
          options={Object.values(NodeType).map((value) => ({ value, label: value }))}
          className="nodrag"
        />

        <Input
          label="Message"
          name="text"
          value={data.text}
          onChange={(e) => handleUpdate({ text: e.target.value })}
          as="textarea"
          placeholder="Enter your text here..."
          className="resize-none overflow-hidden nodrag"
        />

        {!data.dynamicGeneration && (data.type === NodeType.RatingSingle || data.type === NodeType.RatingMulti) && (
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">Ratings</label>
            {data.ratings?.map((rating, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <Input
                  name={`rating-${index}`}
                  value={rating}
                  onChange={(e) => handleRatingChange(index, e.target.value)}
                  className="flex-grow nodrag"
                />
                <Button
                  onClick={() => removeRating(index)}
                  variant="transparentSecondary"
                  size="small"
                  iconLeft={faTimesCircle}
                  className="nodrag flex-shrink-0 text-slate-400"
                />
              </div>
            ))}
            <Button onClick={addRating} variant="primary" size="medium" iconLeft={faPlus} className="nodrag mt-2">
              Add Rating
            </Button>
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-green-500" />
      <CustomHandle connectionCount={1} type="source" position={Position.Right} className="w-4 h-4 !bg-green-500" />
    </NodeContainer>
  );
}
