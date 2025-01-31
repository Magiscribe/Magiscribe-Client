import Button from '@/components/controls/button';
import { faCodeBranch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getOutgoers, Handle, NodeProps, Position, useEdges, useNodes, useReactFlow } from '@xyflow/react';
import colors from 'tailwindcss/colors';

import Condition from '../elements/condition';
import NodeContainer from '../elements/node-container';

type ConditionNodeProps = NodeProps & {
  data: {
    conditions: {
      to: string;
      condition: string;
    }[];
  };
};

const nodeColorNames = [
  'red',
  'orange',
  'lime',
  'green',
  'teal',
  'cyan',
  'blue',
  'violet',
  'fuchsia',
  'pink',
  'rose',
] as const;

const nodeColors = ([400, 500, 600] as const).flatMap((level) => nodeColorNames.map((name) => colors[name][level]));

export default function ConditionNode({ id, data }: ConditionNodeProps) {
  const { updateNodeData, updateEdgeData } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();
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

  return (
    <NodeContainer title="Condition" faIcon={faCodeBranch} id={id}>
      <div className="flex flex-col gap-8 mt-2">
        {data.conditions.map((cond, index) => (
          <Condition
            {...cond}
            nodeId={id}
            nodeColor={nodeColorMap[cond.to] || colors.slate[200]}
            onChange={({ to, condition }) => {
              const conditions = [...data.conditions];
              conditions[index] = { to, condition };
              updateNodeData(id, { conditions });
            }}
            onRemove={() => {
              const conditions = [...data.conditions];
              conditions.splice(index, 1);
              updateNodeData(id, { conditions });
            }}
          ></Condition>
        ))}
      </div>
      <div className="mt-4">
        <Button
          className="nodrag mt-2 w-full"
          title="Add new condition"
          variant="primary"
          size="medium"
          icon={faPlus}
          onClick={() => {
            const conditions = [...data.conditions, { to: '', condition: '' }];
            updateNodeData(id, { conditions });
          }}
        >
          Add Condition
        </Button>
      </div>

      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-green-500!" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-green-500!" />
    </NodeContainer>
  );
}
