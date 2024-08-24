import useAutoResizeTextareaRef from '@/hooks/AutoResizerTextarea';
import { ConversationNodeData } from '@/types/conversation';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
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
  const { handleInputChange } = useNodeData<ConversationNodeData>(id);

  return (
    <NodeContainer title="Condition" faIcon={faQuestionCircle} id={id}>
      <div className="flex flex-col gap-2 mt-2">
        <textarea
          ref={textareaRef}
          name="text"
          onChange={handleInputChange}
          rows={1}
          placeholder="Enter your text here..."
          className={`w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none overflow-hidden`}
        >
          {data.text}
        </textarea>
      </div>

      <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
    </NodeContainer>
  );
}
