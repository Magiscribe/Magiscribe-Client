import { faCodeBranch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react';
import NodeContainer from '../elements/node-container';
import Button from '@/components/controls/button';
import Condition from '../elements/condition';

type ConditionNodeProps = NodeProps & {
  data: {
    conditions: {
      to: string;
      condition: string;
    }[];
  };
};

export default function ConditionNode({ id, data }: ConditionNodeProps) {
  const { updateNodeData } = useReactFlow();

  return (
    <NodeContainer title="Condition" faIcon={faCodeBranch} id={id}>
      <div className="flex flex-col gap-8 mt-2">
        {data.conditions.map((cond, index) => (
          <Condition
            {...cond}
            nodeId={id}
            onChange={({ to, condition }) => {
              let conditions = [...data.conditions];
              conditions[index] = { to, condition };
              updateNodeData(id, { conditions });
            }}
            onRemove={() => {
              let conditions = [...data.conditions];
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
          iconLeft={faPlus}
          onClick={() => {
            let conditions = [...data.conditions, { from: '', to: '', condition: '' }];
            updateNodeData(id, { conditions });
          }}
        >
          Add Condition
        </Button>
      </div>

      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-green-500" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 !bg-green-500" />
    </NodeContainer>
  );
}
