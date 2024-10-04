import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

import NodeContainer from '../elements/node-container';

interface StartEndNodeProps {
  id: string;
  type: 'start' | 'end';
}

function StartEndNode({ id, type }: StartEndNodeProps) {
  return (
    <NodeContainer
      title={type === 'start' ? 'Start' : 'End'}
      faIcon={type === 'start' ? faPlay : faStop}
      id={id}
      handlers={{
        source: type === 'start',
        target: type === 'end',
        sourceLimit: type === 'start' ? 0 : 1,
        targetLimit: type === 'end' ? 0 : 1,
      }}
    >
      <></>
    </NodeContainer>
  );
}

export const StartNode = ({ id }: { id: string }) => <StartEndNode id={id} type="start" />;
export const EndNode = ({ id }: { id: string }) => <StartEndNode id={id} type="end" />;
