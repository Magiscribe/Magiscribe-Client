import useAutoResizeTextareaRef from '@/hooks/auto-resize-textarea';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
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
  const textareaRef = useAutoResizeTextareaRef(data.text ?? '');
  const { handleInputChange } = useNodeData<QuestionNodeProps>(id);

  const handleUpdate = useCallback(
    (updates: Partial<QuestionNodeProps['data']>) => {
      // If the user toggles dynamic generation, remove all ratings
      // since they are not needed anymore.
      if (updates.dynamicGeneration) {
        updates = {
          ...updates,
          ratings: undefined, // Remove all ratings
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
    <NodeContainer title="Question" faIcon={faQuestionCircle} id={id}
    handlers={{
      sourceLimit: 1,
      targetLimit: 1,
    }}>
      <div className="space-y-4 mt-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Dynamic Generation</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="dynamicGeneration"
              checked={data.dynamicGeneration}
              onChange={(e) => handleUpdate({ dynamicGeneration: e.target.checked })}
              className="w-4 h-4 bg-inherit text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Enable</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Question Type</label>
          <select
            name="type"
            value={data.type}
            onChange={(e) => handleUpdate({ type: e.target.value as NodeType })}
            className="w-full px-3 py-2 bg-inherit rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
          >
            {Object.values(NodeType).map((value) => (
              <option key={value} value={value} className="py-1">
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Message</label>
          <textarea
            ref={textareaRef}
            defaultValue={data.text}
            name="text"
            onChange={(e) => handleUpdate({ text: e.target.value })}
            rows={1}
            placeholder="Enter your text here..."
            className="w-full px-3 py-2 bg-inherit rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none overflow-hidden"
          />
        </div>
        {!data.dynamicGeneration && (data.type === NodeType.RatingSingle || data.type === NodeType.RatingMulti) && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Ratings</label>
            {data.ratings?.map((rating, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={rating}
                  onChange={(e) => handleRatingChange(index, e.target.value)}
                  className="flex-grow px-3 py-2 bg-inherit rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <button
                  onClick={() => removeRating(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addRating}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Add Rating
            </button>
          </div>
        )}
      </div>
    </NodeContainer>
  );
}
