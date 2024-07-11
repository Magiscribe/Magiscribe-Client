import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
export interface BaseListItem {
  id: string;
  name: string;
}

interface ReorderableListProps<T extends BaseListItem> {
  items: T[];
  onItemsChange: (items: T[]) => void;
  renderItem: (
    item: T,
    isEditing: boolean,
    onEdit: (item: T) => void,
    onCancel: (e: React.MouseEvent) => void,
  ) => React.ReactNode;
}

const ReorderableList = <T extends BaseListItem>({ items, onItemsChange, renderItem }: ReorderableListProps<T>) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleEdit = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingItemId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onItemsChange(newItems);
  };

  const MoveButton = ({
    direction,
    onClick,
    disabled,
  }: {
    direction: 'up' | 'down';
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="bg-gray-300 text-gray-700 px-2 py-1 rounded disabled:opacity-50 mb-1"
    >
      <FontAwesomeIcon icon={direction === 'up' ? faArrowUp : faArrowDown} />
    </button>
  );

  return (
    <div className="mb-4">
      {items.length > 0 && (
        <ul className="border-2 border-gray-200 rounded-lg p-2">
          <AnimatePresence mode="sync">
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                className="first:mt-0 mt-2 p-2 bg-gray-100 rounded flex"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="flex-grow">
                  {renderItem(item, editingItemId === item.id, (item) => handleEdit(item.id), handleCancelEdit)}
                </div>
                <div className="flex flex-col justify-center ml-2">
                  <MoveButton direction="up" onClick={() => handleMove(index, 'up')} disabled={index === 0} />
                  <MoveButton
                    direction="down"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === items.length - 1}
                  />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default ReorderableList;
