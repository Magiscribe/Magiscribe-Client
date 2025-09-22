import { faStop } from '@fortawesome/free-solid-svg-icons';
import { Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';

interface EndNodeProps {
  id: string;
}

export default function EndNode({ id }: EndNodeProps) {
  const { t } = useTranslation();
  
  return (
    <NodeContainer title={t('nodes.end.title')} faIcon={faStop} id={id}>
      <CustomHandle type={'target'} position={Position.Left} className="w-4 h-4 bg-green-500!" />
    </NodeContainer>
  );
}
