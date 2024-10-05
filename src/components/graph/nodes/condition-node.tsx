import Input from '@/components/controls/input';
import { QuestionNodeData } from '@/types/conversation';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import NodeContainer from '../elements/node-container';
import { useNodeData } from '../utils';

type ConditionNodeProps = NodeProps & {
  data: {
    text: string;
  };
};

export default function ConditionNode({ id, data }: ConditionNodeProps) {
  const { handleInputChange } = useNodeData<QuestionNodeData>(id);

  return (
    <NodeContainer title="Condition" faIcon={faCodeBranch} id={id}>
      <div className="flex flex-col gap-2 mt-2">
        <Input
          label="Message"
          name="text"
          value={data.text}
          onChange={handleInputChange}
          as="textarea"
          placeholder="Enter your text here..."
          className="resize-none overflow-hidden nodrag"
        />
      </div>

      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-green-500" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 !bg-green-500" />
    </NodeContainer>
  );
}
