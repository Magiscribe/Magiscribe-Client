import useAutoResizeTextareaRef from '@/hooks/auto-resize-textarea';
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
  const textareaRef = useAutoResizeTextareaRef(data.text);
  const { handleInputChange } = useNodeData<QuestionNodeData>(id);

  return (
    <NodeContainer title="Condition" faIcon={faCodeBranch} id={id}>
      <div className="flex flex-col gap-2 mt-2">
        <textarea
          ref={textareaRef}
          defaultValue={data.text}
          name="text"
          onChange={handleInputChange}
          rows={1}
          placeholder="Enter your text here..."
          className={`w-full px-3 py-2 rounded-lg bg-inherit border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none overflow-hidden nodrag`}
        />
      </div>

      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-green-500" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 !bg-green-500" />
    </NodeContainer>
  );
}
