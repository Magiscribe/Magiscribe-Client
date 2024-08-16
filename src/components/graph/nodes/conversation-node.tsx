import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faInfoCircle, faQuestionCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import CustomHandle from './limit-handle';

interface ConversationNodeProps {
  id: string;
  data: NodeData;
}

interface NodeData {
  text?: string;
  instruction?: string;
  type: 'rating-single' | 'rating-multi' | 'open-ended' | 'information';
  ratings?: string[];
  dynamicGeneration?: boolean;
}

const typeOptions = [
  { value: 'information', icon: faInfoCircle, color: 'text-blue-500' },
  { value: 'open-ended', icon: faQuestionCircle, color: 'text-yellow-500' },
  { value: 'rating', icon: faCheckCircle, color: 'text-green-500' },
];

export default function ConversationNode({ id, data }: ConversationNodeProps) {
  const [nodeData, setNodeData] = useState<NodeData>({
    text: data.text || '',
    instruction: data.instruction || '',
    type: data.type || 'information',
    ratings: data.ratings || [],
    dynamicGeneration: data.instruction ? true : false,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setNodes } = useReactFlow();

  const updateNodeData = useCallback(
    (updates: Partial<NodeData>) => {
      setNodeData((prev) => {
        const newData = { ...prev, ...updates };
        setNodes((prevNodes) => prevNodes.map((n) => (n.id === id ? { ...n, data: newData } : n)));
        return newData;
      });
    },
    [id, setNodes],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = event.target;
      if (type === 'checkbox') {
        const checked = (event.target as HTMLInputElement).checked;
        updateNodeData({
          instruction: checked ? 'New instruction' : undefined,
        });
      } else {
        updateNodeData({ [name]: value });
      }
    },
    [updateNodeData],
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [nodeData.text]);

  const renderInput = (label: string, name: keyof NodeData, type: string, options?: typeof typeOptions) => {
    const commonProps = {
      name,
      value: nodeData[name] as string,
      onChange: handleInputChange,
      className:
        'w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200',
    };

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {type === 'select' ? (
          <select {...commonProps} className={`${commonProps.className} appearance-none`}>
            {options?.map(({ value }) => (
              <option key={value} value={value} className="py-1">
                {value}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            ref={textareaRef}
            {...commonProps}
            rows={1}
            placeholder="Enter your text here..."
            className={`${commonProps.className} resize-none overflow-hidden`}
          />
        ) : (
          <div className="flex items-center">
            <input
              type={type}
              checked={!!nodeData.instruction}
              {...commonProps}
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Enable</span>
          </div>
        )}
      </div>
    );
  };

  const selectedType = typeOptions.find((option) => option.value === nodeData.type);

  return (
    <div className="px-6 py-4 shadow-lg rounded-xl bg-white border-2 border-gray-200 w-96">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faUserFriends} className="mr-2 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Conversation</h3>
        </div>
        {selectedType && (
          <div className={`flex items-center ${selectedType.color}`}>
            <FontAwesomeIcon icon={selectedType.icon} className="mr-1" />
            <span className="text-sm font-medium">{selectedType.value}</span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {renderInput('Dynamic Generation', 'dynamicGeneration', 'checkbox')}
        {renderInput('Conversation Type', 'type', 'select', typeOptions)}
        {renderInput('Message', 'text', 'textarea')}
      </div>
      <Handle type="target" position={Position.Top} className="w-4 h-4 !bg-teal-500" />
      <CustomHandle connectionCount={1} type="source" position={Position.Bottom} className="w-4 h-4 !bg-teal-500" />
    </div>
  );
}
