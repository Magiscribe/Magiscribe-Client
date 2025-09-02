import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Select from '@/components/controls/select';
import Textarea from '@/components/controls/textarea';
import { faPlus, faQuestionCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import React, { useCallback } from 'react';

import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

enum NodeType {
  OpenEnded = 'open-ended',
  RatingSingle = 'single-select',
  RatingMulti = 'multi-select',
}

type QuestionNodeProps = NodeProps & {
  data: {
    text: string;
    dynamicGeneration: boolean;
    type: NodeType;
    ratings?: string[];
  };
};

export default function QuestionNode({ id, data }: QuestionNodeProps) {
  const { handleInputChange } = useNodeData<QuestionNodeProps>(id);

  const handleUpdate = useCallback(
    (updates: Partial<QuestionNodeProps['data']>) => {
      if (updates.dynamicGeneration !== undefined) {
        if (updates.dynamicGeneration) {
          // Switching TO dynamic generation - clear ratings since they're not used in dynamic mode
          updates = {
            ...updates,
            ratings: undefined,
          };
        }
      }

      Object.entries(updates).forEach(([key, value]) => {
        handleInputChange({
          target: { name: key, value },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    },
    [handleInputChange, data.type],
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
      <Input
        label="Dynamic Generation"
        name="dynamic-generation"
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
        options={Object.values(NodeType).map((value) => ({ 
          value, 
          label: value === NodeType.OpenEnded ? 'Open Ended' :
                 value === NodeType.RatingSingle ? 'Single Select' :
                 value === NodeType.RatingMulti ? 'Multi Select' : value 
        }))}
        className="nodrag"
      />

      <Textarea
        label="Message"
        subLabel={
          data.dynamicGeneration ? 'Prompt for an AI to generate a question' : 'Question asked directly to the user'
        }
        name="text"
        value={data.text}
        onChange={(e) => handleUpdate({ text: e.target.value })}
        placeholder="Enter your text here..."
        className="resize-none overflow-hidden nodrag"
        rows={3}
      />

      {!data.dynamicGeneration && (data.type === NodeType.RatingSingle || data.type === NodeType.RatingMulti) && (
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Selectable Options</label>
          {data.ratings?.map((rating, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <Input
                name={`rating-${index}`}
                value={rating}
                onChange={(e) => handleRatingChange(index, e.target.value)}
                className="grow nodrag"
              />
              <Button
                onClick={() => removeRating(index)}
                variant="transparentSecondary"
                size="small"
                icon={faTimesCircle}
                className="nodrag shrink-0 text-slate-400"
              />
            </div>
          ))}
          <Button onClick={addRating} variant="primary" size="medium" icon={faPlus} className="nodrag mt-2">
            Add Select Option
          </Button>
        </div>
      )}
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-green-500!" />
      <CustomHandle connectionCount={1} type="source" position={Position.Right} className="w-4 h-4 bg-green-500!" />
    </NodeContainer>
  );
}
