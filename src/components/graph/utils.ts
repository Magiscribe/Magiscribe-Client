import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

export function useNodeData<T>(id: string) {
  const { updateNodeData } = useReactFlow();

  const update = useCallback(
    (updates: Partial<T>) => {
      updateNodeData(id, updates);
    },
    [id],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = event.target;
      if (type === 'checkbox') {
        const checked = (event.target as HTMLInputElement).checked;
        update({ [name]: checked } as Partial<T>);
      } else {
        update({ [name]: value } as Partial<T>);
      }
    },
    [updateNodeData],
  );

  return { handleInputChange };
}
