import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import { faCodeBranch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getOutgoers, Handle, NodeProps, Position, useEdges, useNodes, useReactFlow } from '@xyflow/react';
import colors from 'tailwindcss/colors';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Condition from '../elements/condition';
import NodeContainer from '../elements/node-container';

type ConditionNodeProps = NodeProps & {
  data: {
    random?: boolean;
    conditions: {
      to: string;
      condition?: string;
      probability?: number;
    }[];
  };
};

const nodeColorNames = [
  'red',
  'cyan',
  'orange',
  'lime',
  'teal',
  'green',
  'blue',
  'pink',
  'violet',
  'fuchsia',
  'rose',
] as const;

const nodeColors = ([400, 500, 600] as const).flatMap((level) => nodeColorNames.map((name) => colors[name][level]));

export default function ConditionNode({ id, data }: ConditionNodeProps) {
  const { updateNodeData, updateEdgeData } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();
  const { t } = useTranslation();
  const nodeColorMap: Record<string, string> = {};
  let nodeColorIndex = 0;
  getOutgoers({ id }, nodes, edges).forEach((node) => {
    if (node.id in nodeColorMap) {
      return;
    }
    nodeColorMap[node.id] = nodeColors[nodeColorIndex++ % nodeColors.length];
    const edge = edges.find((edge) => edge.source === id && edge.target === node.id)!;
    updateEdgeData(edge.id, { color: nodeColorMap[node.id] });
  });

  const isRandom = data.random ?? false;

  const handleUpdate = useCallback(
    (updates: Partial<ConditionNodeProps['data']>) => {
      updateNodeData(id, { ...data, ...updates });
    },
    [id, data, updateNodeData],
  );

  return (
    <NodeContainer title={t('nodes.condition.title')} faIcon={faCodeBranch} id={id}>
      <Input
        label={t('nodes.condition.randomLabel')}
        name="random"
        type="checkbox"
        checked={isRandom}
        onChange={(e) => handleUpdate({ random: (e.target as HTMLInputElement).checked })}
        className="nodrag"
      />

      <div className={`flex flex-col mt-2 ${isRandom ? 'gap-8' : 'gap-4'}`}>
        {data.conditions.map((cond, index) => (
          <div key={index}>
            <Condition
              {...cond}
              nodeId={id}
              nodeColor={nodeColorMap[cond.to] || colors.slate[200]}
              isRandom={isRandom}
              onChange={({ to, condition, probability }) => {
                const conditions = [...data.conditions];
                conditions[index] = { to, condition, probability };
                updateNodeData(id, { conditions });
              }}
              onRemove={() => {
                const conditions = [...data.conditions];
                conditions.splice(index, 1);
                updateNodeData(id, { conditions });
              }}
            />
            {/* Add dividing line between conditions in non-random mode */}
            {!isRandom && index < data.conditions.length - 1 && (
              <div className="mt-4 border-b border-gray-300 dark:border-gray-600"></div>
            )}
          </div>
        ))}
      </div>

      {isRandom && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <strong>{t('common.labels.note')}:</strong> {t('nodes.condition.probabilityNote')}
        </div>
      )}

      <div className="mt-4">
        <Button
          className="nodrag mt-2 w-full"
          title={t('nodes.condition.addNewConditionTitle')}
          variant="primary"
          size="medium"
          icon={faPlus}
          onClick={() => {
            let newCondition;
            if (isRandom) {
              // Calculate remaining probability: 1 - sum of all existing probabilities
              const existingSum = data.conditions.reduce((sum, condition) => sum + (condition.probability || 0), 0);
              const remainingProbability = Math.max(0, 1 - existingSum);
              // Round to 2 decimal places to avoid floating point precision issues
              const roundedProbability = Math.round(remainingProbability * 100) / 100;
              newCondition = { to: '', probability: roundedProbability };
            } else {
              newCondition = { to: '', condition: '' };
            }
            const conditions = [...data.conditions, newCondition];
            updateNodeData(id, { conditions });
          }}
        >
          {t('nodes.condition.addCondition')}
        </Button>
      </div>

      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-green-500!" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-green-500!" />
    </NodeContainer>
  );
}
