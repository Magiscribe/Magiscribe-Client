import useAutoResizeTextareaRef from '@/hooks/AutoResizerTextarea';
import { ConversationNodeData } from '@/types/conversation';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handle, NodeProps, Position } from '@xyflow/react';
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
    <div className="px-4 py-2 shadow-md rounded-3xl bg-white border-2 border-stone-400 w-96 shadow-xl">
      <div className="flex flex-col gap-2 pb-2">
        <p className="text-lg font-bold">
          <FontAwesomeIcon icon={faQuestionCircle} className="mr-2 text-blue-600" />
          Condition
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          name="instruction"
          value={data.text}
          onChange={handleInputChange}
          rows={1}
          placeholder="Enter your text here..."
          className={`w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none overflow-hidden`}
        />
      </div>

      <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
    </div>
  );
}
