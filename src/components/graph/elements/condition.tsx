import { getIncomers, getOutgoers, Node, useEdges, useNodes, useReactFlow } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { generateRandomColorHex, useNodeData } from '../utils';
import Input from '@/components/controls/input';
import Button from '@/components/controls/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

type ConditionProps = {
  from: string;
  to: string;
  condition: string;
  nodeId: string;
  onChange: (update: { from: string; to: string; condition: string }) => void;
  onRemove: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Condition = ({ from, to, condition, nodeId, onChange, onRemove }: ConditionProps) => {
  // Validate nodes
  const nodes = useNodes();
  const edges = useEdges();
  const reactFlow = useReactFlow();
  const incomers = getIncomers({ id: nodeId }, nodes, edges);
  const outgoers = getOutgoers({ id: nodeId }, nodes, edges);

  const [fromColor, setFromColor] = useState(generateRandomColorHex());
  const [toColor, setToColor] = useState(generateRandomColorHex());

  const fromNodeValid = incomers.some((src) => src.id === from);
  const toNodeValid = outgoers.some((dest) => dest.id === to);

  // Initial change to ensure values are selected when available
  useEffect(() => onChange({ from: from || incomers[0]?.id, to: to || outgoers[0]?.id, condition }), []);

  function handleMouseEnter(targetNodeId: string, direction: 'from' | 'to') {
    if (direction === 'from') {
      const edge = edges.find((edge) => edge.source === targetNodeId && edge.target === nodeId);
      if (edge) {
        reactFlow.updateEdgeData(edge.id, { color: fromColor });
      }
    } else {
      const edge = edges.find((edge) => edge.source === nodeId && edge.target === targetNodeId);
      if (edge) {
        reactFlow.updateEdgeData(edge.id, { color: toColor });
      }
    }
  }

  function handleMouseLeave(targetNodeId: string, direction: 'from' | 'to') {
    if (direction === 'from') {
      const edge = edges.find((edge) => edge.source === targetNodeId && edge.target === nodeId);
      if (edge) {
        reactFlow.updateEdgeData(edge.id, { color: undefined });
      }
    } else {
      const edge = edges.find((edge) => edge.source === nodeId && edge.target === targetNodeId);
      if (edge) {
        reactFlow.updateEdgeData(edge.id, { color: undefined });
      }
    }
  }

  return (
    <div className="relative">
      <Button className="absolute right-0 bg-red-600 hover:bg-red-800 rounded-full" onClick={onRemove}>
        <FontAwesomeIcon icon={faTrash} title="Remove condition"></FontAwesomeIcon>
      </Button>
      From:{' '}
      <select
        value={from}
        style={{ backgroundColor: fromNodeValid ? fromColor : undefined }}
        className={fromNodeValid ? '' : 'bg-red-600'}
        onChange={({ target }) => onChange({ from: target.value, to, condition })}
        onMouseEnter={() => handleMouseEnter(from, 'from')}
        onMouseLeave={() => handleMouseLeave(from, 'from')}
      >
        {fromNodeValid ? null : <option value={from}>{from}</option>}
        {incomers.map((src) => (
          <option
            value={src.id}
            onMouseEnter={() => handleMouseEnter(src.id, 'from')}
            onMouseLeave={() => handleMouseLeave(src.id, 'from')}
          >
            {src.id}
          </option>
        ))}
      </select>
      <br />
      To:{' '}
      <select
        value={to}
        style={{ backgroundColor: toNodeValid ? toColor : undefined }}
        className={toNodeValid ? '' : 'bg-red-600'}
        onChange={({ target }) => onChange({ from, to: target.value, condition })}
        onMouseEnter={() => handleMouseEnter(to, 'to')}
        onMouseLeave={() => handleMouseLeave(to, 'to')}
      >
        {toNodeValid ? null : <option value={to}>{to}</option>}
        {outgoers.map((dest) => (
          <option
            value={dest.id}
            onMouseEnter={() => handleMouseEnter(dest.id, 'to')}
            onMouseLeave={() => handleMouseLeave(dest.id, 'to')}
          >
            {dest.id}
          </option>
        ))}
      </select>
      <br />
      <Input
        name="condition"
        label="Condition"
        as="textarea"
        value={condition}
        onChange={({ target }) => onChange({ from, to, condition: target.value })}
        placeholder="Enter the condition here..."
        className="resize-none overflow-hidden nodrag"
      ></Input>
    </div>
  );
};

export default Condition;
