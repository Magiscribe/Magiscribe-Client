import { getIncomers, getOutgoers, Node, useEdges, useNodes, useReactFlow } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { generateRandomColorHex, useNodeData } from '../utils';
import Input from '@/components/controls/input';
import Button from '@/components/controls/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

type ConditionProps = {
  to: string;
  condition: string;
  nodeId: string;
  onChange: (update: { to: string; condition: string }) => void;
  onRemove: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Condition = ({ to, condition, nodeId, onChange, onRemove }: ConditionProps) => {
  // Validate nodes
  const nodes = useNodes();
  const edges = useEdges();
  const reactFlow = useReactFlow();
  const outgoers = getOutgoers({ id: nodeId }, nodes, edges);

  const toNodeValid = outgoers.some((dest) => dest.id === to);
  const toColor = outgoers.find((dest) => dest.id === to)?.data.nodeColor as string | undefined;

  // Initial change to ensure values are selected when available
  useEffect(() => onChange({ to: to || outgoers[0]?.id, condition }), []);

  function handleMouseEnter(targetNodeId: string) {
    const edge = edges.find((edge) => edge.source === nodeId && edge.target === targetNodeId);
    if (edge) {
      reactFlow.updateEdgeData(edge.id, { color: toColor });
    }
  }

  function handleMouseLeave(targetNodeId: string) {
    const edge = edges.find((edge) => edge.source === nodeId && edge.target === targetNodeId);
    if (edge) {
      reactFlow.updateEdgeData(edge.id, { color: undefined });
    }
  }

  return (
    <div className="relative">
      <Button className="absolute right-0 bg-red-600 hover:bg-red-800 rounded-full" onClick={onRemove}>
        <FontAwesomeIcon icon={faTrash} title="Remove condition"></FontAwesomeIcon>
      </Button>
      To:{' '}
      <select
        value={to}
        style={{ backgroundColor: toNodeValid ? toColor : undefined }}
        className={toNodeValid ? '' : 'bg-red-600'}
        onChange={({ target }) => onChange({ to: target.value, condition })}
        onMouseEnter={() => handleMouseEnter(to)}
        onMouseLeave={() => handleMouseLeave(to)}
      >
        {toNodeValid ? null : <option value={to}>{to}</option>}
        {outgoers.map((dest) => (
          <option
            value={dest.id}
            onMouseEnter={() => handleMouseEnter(dest.id)}
            onMouseLeave={() => handleMouseLeave(dest.id)}
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
        onChange={({ target }) => onChange({ to, condition: target.value })}
        placeholder="Enter the condition here..."
        className="resize-none overflow-hidden nodrag"
      ></Input>
    </div>
  );
};

export default Condition;
