import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useCallback, useEffect, useRef } from 'react';

interface ConditionNodeProps {
  id: string;
  data: {
    instruction: string;
  };
}

export default function ConditionNode({ id, data }: ConditionNodeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.instruction]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      setNodes((prevNodes) => prevNodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, [name]: value } } : n)));
    },
    [id, setNodes],
  );

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
          value={data.instruction}
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
