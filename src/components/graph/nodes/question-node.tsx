import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Select from '@/components/controls/select';
import Textarea from '@/components/controls/textarea';
import { faPlus, faQuestionCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
    <NodeContainer title={t('nodes.question.title')} faIcon={faQuestionCircle} id={id}>
      <Input
        label={t('nodes.question.dynamicGenerationLabel')}
        name="dynamic-generation"
        type="checkbox"
        checked={data.dynamicGeneration}
        onChange={(e) => handleUpdate({ dynamicGeneration: (e.target as HTMLInputElement).checked })}
        className="nodrag"
      />

      <Select
        label={t('nodes.question.questionTypeLabel')}
        name="type"
        value={data.type}
        onChange={(e) => handleUpdate({ type: e.target.value as NodeType })}
        options={Object.values(NodeType).map((value) => ({
          value,
          label:
            value === NodeType.OpenEnded
              ? t('nodes.question.questionTypes.openEnded')
              : value === NodeType.RatingSingle
                ? t('nodes.question.questionTypes.singleSelect')
                : value === NodeType.RatingMulti
                  ? t('nodes.question.questionTypes.multiSelect')
                  : value,
        }))}
        className="nodrag"
      />

      <Textarea
        label={t('nodes.question.messageLabel')}
        subLabel={
          data.dynamicGeneration ? t('nodes.question.messageSubLabelDynamic') : t('nodes.question.messageSubLabelStatic')
        }
        name="text"
        value={data.text}
        onChange={(e) => handleUpdate({ text: e.target.value })}
        placeholder={t('nodes.question.messagePlaceholder')}
        className="resize-none overflow-hidden nodrag"
        rows={3}
      />

      {!data.dynamicGeneration && (data.type === NodeType.RatingSingle || data.type === NodeType.RatingMulti) && (
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('nodes.question.selectableOptionsLabel')}</label>
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
            {t('nodes.question.addSelectOption')}
          </Button>
        </div>
      )}
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-green-500!" />
      <CustomHandle connectionCount={1} type="source" position={Position.Right} className="w-4 h-4 bg-green-500!" />
    </NodeContainer>
  );
}
