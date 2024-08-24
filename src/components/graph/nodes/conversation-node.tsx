import useAutoResizeTextareaRef from '@/hooks/AutoResizerTextarea';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

enum NodeType {
  OpenEnded = 'open-ended',
  RatingSingle = 'rating-single',
  RatingMulti = 'rating-multi',
}

type ConversationNodeProps = NodeProps & {
  data: {
    text?: string;
    type: NodeType;
    ratings?: string[];
    dynamicGeneration?: boolean;
  };
};

export default function ConversationNode({ id, data }: ConversationNodeProps) {
  const textareaRef = useAutoResizeTextareaRef(data.text ?? '');
  const { handleInputChange } = useNodeData<ConversationNodeProps>(id);

  return (
    <NodeContainer title="Conversation" faIcon={faUserFriends} id={id}>
      <div className="space-y-4 mt-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Dynamic Generation</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="dynamicGeneration"
              checked={data.dynamicGeneration}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Enable</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Conversation Type</label>
          <select
            name="type"
            value={data.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
          >
            {Object.values(NodeType).map((value) => (
              <option key={value} value={value} className="py-1">
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Message</label>
          <textarea
            ref={textareaRef}
            name="text"
            onChange={handleInputChange}
            rows={1}
            placeholder="Enter your text here..."
            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none overflow-hidden"
          >
            {data.text}
          </textarea>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />
      <CustomHandle connectionCount={1} type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
    </NodeContainer>
  );
}
