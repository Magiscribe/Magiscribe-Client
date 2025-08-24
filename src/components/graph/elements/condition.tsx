import { getOutgoers, useEdges, useNodes } from '@xyflow/react';
import { useEffect } from 'react';
import Button from '@/components/controls/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Textarea from '@/components/controls/textarea';
import Select from '@/components/controls/select';
import Input from '@/components/controls/input';

type ConditionProps = {
  to: string;
  condition?: string;
  probability?: number;
  nodeId: string;
  nodeColor: string;
  isRandom: boolean;
  onChange: (update: { to: string; condition?: string; probability?: number }) => void;
  onRemove: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Condition = ({ to, condition, probability, nodeId, nodeColor, isRandom, onChange, onRemove }: ConditionProps) => {
  // Validate nodes
  const nodes = useNodes();
  const edges = useEdges();
  const outgoers = getOutgoers({ id: nodeId }, nodes, edges);

  const toNodeValid = outgoers.some((dest) => dest.id === to);

  // Initial change to ensure values are selected when available
  useEffect(() => {
    if (isRandom) {
      onChange({ to: to || outgoers[0]?.id, probability: probability ?? 0.5 });
    } else {
      onChange({ to: to || outgoers[0]?.id, condition: condition ?? '' });
    }
  }, [isRandom]);

  const options = [{ label: 'Select a node' }];
  options.push(
    ...outgoers.map((dest) => ({
      label: dest.id,
      value: dest.id,
    })),
  );
  
  // Calculate relative luminance of bg color and determine text color
  const hex = nodeColor.substring(1);
  const [r, g, b] = [hex.substring(0, 2), hex.substring(2, 4), hex.substring(4)].map((n) => parseInt(n, 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const darkText = luminance > 0.5 && toNodeValid;

  return (
    <div className="relative">
      {isRandom ? (
        // Simple horizontal layout for random mode: Node ID, Probability, Delete button
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Select
              value={to}
              label="To"
              name="toNode"
              style={{ backgroundColor: toNodeValid ? nodeColor : undefined }}
              className={[toNodeValid ? '' : 'bg-red-700!', darkText ? 'text-black' : 'text-white'].join(' ')}
              onChange={({ target }) => {
                onChange({ to: target.value, probability });
              }}
              options={options}
              error={toNodeValid ? undefined : 'Please select a node'}
            />
          </div>
          <div className="w-24">
            <Input
              label="Probability"
              name="probability"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={probability ?? 0.5}
              onChange={({ target }) => {
                const value = parseFloat(target.value) || 0;
                // Round to 2 decimal places to avoid floating point precision issues
                const roundedValue = Math.round(value * 100) / 100;
                onChange({ to, probability: roundedValue });
              }}
              className="nodrag text-center"
            />
          </div>
          <div className="pt-6">
            <Button className="bg-red-600 hover:bg-red-800 rounded-full" onClick={onRemove}>
              <FontAwesomeIcon icon={faTrash} title="Remove condition" />
            </Button>
          </div>
        </div>
      ) : (
        // Vertical layout for deterministic mode with To and trash on same row
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <Select
                value={to}
                label="To"
                name="toNode"
                style={{ backgroundColor: toNodeValid ? nodeColor : undefined }}
                className={[toNodeValid ? '' : 'bg-red-700!', darkText ? 'text-black' : 'text-white'].join(' ')}
                onChange={({ target }) => {
                  onChange({ to: target.value, condition });
                }}
                options={options}
                error={toNodeValid ? undefined : 'Please select a node'}
              />
            </div>
            <div className="pt-6">
              <Button className="bg-red-600 hover:bg-red-800 rounded-full" onClick={onRemove}>
                <FontAwesomeIcon icon={faTrash} title="Remove condition" />
              </Button>
            </div>
          </div>
          <Textarea
            label="Condition"
            subLabel="Route to this node under the following conditions"
            name="condition"
            value={condition ?? ''}
            onChange={({ target }) => onChange({ to, condition: target.value })}
            placeholder='e.g. "If the response is positive", "If the user likes ice cream", "Otherwise"...'
            className="resize-none overflow-hidden nodrag"
            rows={3}
          />
        </>
      )}
    </div>
  );
};

export default Condition;
