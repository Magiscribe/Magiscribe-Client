// useNodeData.ts

import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useNodeData<T>(id: string) {
  const { setNodes } = useReactFlow();

  const updateNodeData = useCallback(
    (updates: Partial<T>) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...updates } } : node)),
      );
    },
    [id, setNodes],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = event.target;
      if (type === 'checkbox') {
        const checked = (event.target as HTMLInputElement).checked;
        updateNodeData({ [name]: checked } as Partial<T>);
      } else {
        updateNodeData({ [name]: value } as Partial<T>);
      }
    },
    [updateNodeData],
  );

  return { updateNodeData, handleInputChange };
}
