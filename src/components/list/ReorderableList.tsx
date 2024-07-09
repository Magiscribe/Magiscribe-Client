import React, { useState } from 'react';

export interface ListItem {
  id: string;
  name: string;
  [key: string]: any;
}

interface ReorderableListProps {
  items: ListItem[];
  availableItems: ListItem[];
  onItemsChange: (items: ListItem[]) => void;
  onItemSave?: (item: ListItem) => Promise<void>;
  renderItem: (item: ListItem, isEditing: boolean, onEdit: (field: string, value: any) => void) => React.ReactNode;
}

const ReorderableList: React.FC<ReorderableListProps> = ({
  items,
  availableItems,
  onItemsChange,
  onItemSave,
  renderItem,
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleEdit = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    setEditingItemId(itemId);
  };

  const handleDelete = (itemId: string) => {
    
    onItemsChange(items.filter((item) => item.id !== itemId));
  };

  const handleItemChange = (itemId: string, field: string, value: any) => {
    const newItems = items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    onItemsChange(newItems);
  };

  const handleSave = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    if (onItemSave) {
      try {
        const itemToSave = items.find(item => item.id === itemId);
        if (!itemToSave) return;
        await onItemSave(itemToSave);
        setEditingItemId(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      setEditingItemId(null);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingItemId(null);
  };

  const handleAdd = ({ id }: { id: string }) => {
    const selectedItem = availableItems.find(item => item.id === id);
    if (selectedItem) {
      onItemsChange([...items, selectedItem]);
      onItemsChange(availableItems.filter(item => item.id !== id));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    onItemsChange(newItems);
  };

  return (
    <div className="mb-4">
      <div className="mb-4">
        <select
          onChange={(e) => handleAdd({ id: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select an item to add</option>
          {availableItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <ul className="border-2 border-gray-200 rounded-lg p-2">
        {items.map((item, index) => (
          <li key={item.id} className="mb-2 p-2 bg-gray-100 rounded flex">
            <div className="flex-grow">
              {editingItemId === item.id ? (
                <div>
                  {renderItem(item, true, (field, value) => handleItemChange(item.id, field, value))}
                  <div className="flex justify-left space-x-2 mt-2">
                    <button
                      onClick={(e) => handleSave(e, item.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {renderItem(item, false, () => {})}
                  <div className="flex justify-left space-x-2 mt-2">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center ml-2">
              <button
                type="button"
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded disabled:opacity-50 mb-1"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 'down')}
                disabled={index === items.length - 1}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded disabled:opacity-50"
              >
                ▼
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReorderableList;