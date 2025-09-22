import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Position } from '@xyflow/react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

interface StartNodeProps {
  id: string;

  data: {
    text: string;
    requireName: boolean;
    requireEmail: boolean;
  };
}

export default function StartNode({ id, data }: StartNodeProps) {
  const { handleInputChange } = useNodeData<StartNodeProps>(id);
  const { t } = useTranslation();

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
    <NodeContainer title={t('nodes.start.title')} faIcon={faPlay} id={id}>
      <div className="space-y-4 my-4">
        <Textarea
          label={t('nodes.start.messageLabel')}
          subLabel={t('nodes.start.messageSubLabel')}
          name="text"
          value={data.text}
          onChange={(e) => handleUpdate({ text: e.target.value })}
          placeholder={t('nodes.start.messagePlaceholder')}
          className="resize-none overflow-hidden nodrag"
        />
        <Input
          label={t('nodes.start.requireName')}
          subLabel={t('nodes.start.requireNameSubLabel')}
          name="enableNameCapture"
          type="checkbox"
          checked={data.requireName}
          onChange={(e) => handleUpdate({ requireName: (e.target as HTMLInputElement).checked })}
          className="nodrag"
        />
        <Input
          label={t('nodes.start.requireEmail')}
          subLabel={t('nodes.start.requireEmailSubLabel')}
          name="enableEmailCapture"
          type="checkbox"
          checked={data.requireEmail}
          onChange={(e) => handleUpdate({ requireEmail: (e.target as HTMLInputElement).checked })}
          className="nodrag"
        />
      </div>
      <CustomHandle connectionCount={1} type={'source'} position={Position.Right} className="w-4 h-4 bg-green-500!" />
    </NodeContainer>
  );
}
