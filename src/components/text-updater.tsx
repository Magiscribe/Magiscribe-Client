import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

enum NodeType {
  UserText = 'User Text',
  FollowUp = 'Follow Up',
  Information = 'Information',
  Start = 'Start',
  End = 'End',
  Condition = 'Condition',
}

interface TextUpdaterNodeProps {
  data: {
    type: NodeType;
    text: string;
    handles: {
      source: boolean;
      target: boolean;
    };
  };
}

function TextUpdaterNode({ data }: TextUpdaterNodeProps) {
  const [type, setType] = useState(data.type);
  const [text, setText] = useState(data.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="px-4 py-2 shadow-md rounded-3xl bg-white border-2 border-stone-400 w-96 shadow-xl">
      <div className="flex flex-col gap-2">
        <select
          className="w-full px-2 py-1 bg-slate-100 rounded-xl border-2 border-slate-200"
          value={type}
          onChange={(event) => setType(event.target.value as NodeType)}
        >
          <option value="Start">Start</option>
          <option value="End">End</option>
          <option value="User Text">User Text</option>
          <option value="Follow Up">Follow Up</option>
          <option value="Information">Information</option>
          <option value="Condition">Condition</option>
        </select>
        {(type === NodeType.Information || type === NodeType.Condition) && (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            className="w-full px-2 py-2 bg-slate-100 rounded-xl border-2 border-slate-200 resize-none overflow-hidden"
            placeholder="Enter your text here..."
            rows={1}
          />
        )}
      </div>

      {data?.handles?.source && <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-teal-500" />}
      {data?.handles?.target && <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-teal-500" />}
    </div>
  );
}

export default TextUpdaterNode;
