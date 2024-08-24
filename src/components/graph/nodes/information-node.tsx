import useAutoResizeTextareaRef from '@/hooks/AutoResizerTextarea';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handle, NodeProps, Position } from '@xyflow/react';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

type InformationNodeProps = NodeProps & {
  data: {
    text: string;
    dynamicGeneration: boolean;
  };
};

export default function InformationNode({ id, data }: InformationNodeProps) {
  const textareaRef = useAutoResizeTextareaRef(data.text);
  const { handleInputChange } = useNodeData<InformationNodeProps>(id);

  return (
    <div className="px-6 py-4 shadow-lg rounded-xl bg-white border-2 border-gray-200 w-96">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Information</h3>
        <p className="ml-2 text-sm text-gray-500">#{id}</p>
      </div>
      <div className="space-y-4">
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
          <label className="text-sm font-medium text-gray-700">Message</label>
          <textarea
            ref={textareaRef}
            name="text"
            value={data.text}
            onChange={handleInputChange}
            rows={1}
            placeholder="Enter your text here..."
            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none overflow-hidden"
          />
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />
      <CustomHandle connectionCount={1} type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
    </div>
  );
}
