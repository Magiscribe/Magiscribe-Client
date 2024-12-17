import { getOutgoers, useEdges, useNodes, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';
import Input from '@/components/controls/input';
import Button from '@/components/controls/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Textarea from '@/components/controls/textarea';
import Select from '@/components/controls/select';

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

  const options = [];
  if (!toNodeValid) {
    options.push({ label: to, value: to });
  }
  options.push(
    ...outgoers.map((dest) => ({
      label: dest.id,
      value: dest.id,
    })),
  );
  // Calculate relative luminance of bg color and determine text color
  let darkText = true;
  if (toColor) {
    const hex = toColor.substring(1);
    const [r, g, b] = [hex.substring(0, 2), hex.substring(2, 4), hex.substring(4)].map((n) => parseInt(n, 16) / 255);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    darkText = luminance > 0.5;
  }

  return (
    <div className="relative">
      <Button className="absolute right-0 bg-red-600 hover:bg-red-800 rounded-full" onClick={onRemove}>
        <FontAwesomeIcon icon={faTrash} title="Remove condition"></FontAwesomeIcon>
      </Button>
      <div className="mb-4">
        <Select
          value={to}
          label="To"
          subLabel="The ID of the node this condition should route to"
          name="toNode"
          style={{ backgroundColor: toNodeValid ? toColor : undefined }}
          className={[toNodeValid ? '' : 'bg-red-600', darkText ? 'text-black' : 'text-white'].join(' ')}
          onChange={({ target }) => onChange({ to: target.value, condition })}
          onMouseEnter={() => handleMouseEnter(to)}
          onMouseLeave={() => handleMouseLeave(to)}
          options={options}
        ></Select>
      </div>
      <Textarea
        label="Condition"
        subLabel="Condition to tell the AI when to go to this node"
        name="condition"
        value={condition}
        onChange={({ target }) => onChange({ to, condition: target.value })}
        placeholder="Enter the condition here..."
        className="resize-none overflow-hidden nodrag"
        rows={3}
      />
    </div>
  );
};

export default Condition;
