import { faArrowDown, faArrowUp, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { AnimatePresence, Reorder, useDragControls } from 'motion/react';
import React, { useCallback, useRef, useState } from 'react';

/**
 * Base interface for list items
 * @interface BaseListItem
 * @property {string} id - Unique identifier for the item
 * @property {string} name - Display name of the item
 */
export interface BaseListItem {
  id: string;
  name: string;
}

/**
 * Props for the ReorderableList component
 * @typedef {Object} ReorderableListProps
 * @property {Array<T>} items - Array of items to be displayed in the list
 * @property {function} onItemsChange - Callback function when items order changes
 * @property {function} renderItem - Function to render each item
 * @property {string} [label] - Label for the list
 * @property {string} [subLabel] - Additional description for the list
 * @property {string} [error] - Error message to display
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [dragEnabled] - Enable drag and drop reordering
 * @property {boolean} [showMoveButtons] - Show up/down move buttons
 */
interface ReorderableListProps<T extends BaseListItem> {
  items: T[];
  onItemsChange: (items: T[]) => void;
  renderItem: (
    item: T,
    isEditing: boolean,
    onEdit: (item: T) => void,
    onCancel: (e: React.MouseEvent) => void,
  ) => React.ReactNode;
  label?: string;
  subLabel?: string;
  error?: string;
  className?: string;
  dragEnabled?: boolean;
  showMoveButtons?: boolean;
}

/**
 * A flexible reorderable list component with animation support, drag-and-drop,
 * and button-based reordering capabilities.
 *
 * @template T
 * @param {ReorderableListProps<T>} props - The props for the ReorderableList component
 * @returns {JSX.Element} The rendered ReorderableList component
 */
const ReorderableList = <T extends BaseListItem>({
  items,
  onItemsChange,
  renderItem,
  label,
  subLabel,
  error,
  className,
  dragEnabled = true,
  showMoveButtons = true,
}: ReorderableListProps<T>) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = useCallback(
    (event: PointerEvent) => {
      dragControls.start(event);
    },
    [dragControls],
  );

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
      className={clsx(
        'p-2 rounded-lg transition-colors',
        'text-slate-700 dark:text-slate-200',
        'hover:bg-slate-200 dark:hover:bg-slate-600',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500',
      )}
    >
      <FontAwesomeIcon icon={direction === 'up' ? faArrowUp : faArrowDown} className="size-4" />
    </button>
  );

  const baseClassName = clsx(
    'w-full rounded-2xl border',
    {
      'border-slate-300 dark:border-slate-600': !error,
      'border-red-700': error,
    },
    className,
  );

  return (
    <div className="flex flex-col gap-2 dark:text-white text-slate-800">
      {label && (
        <label className="text-sm font-bold">
          {label}
          {subLabel && (
            <>
              <br />
              <span className="italic text-slate-500 text-sm font-normal">{subLabel}</span>
            </>
          )}
        </label>
      )}

      <div className={baseClassName}>
        {items.length > 0 ? (
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={onItemsChange}
            className="p-2 relative"
            ref={constraintsRef}
          >
            <AnimatePresence mode="sync" initial={false}>
              {items.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  dragListener={false}
                  dragControls={dragControls}
                  dragConstraints={constraintsRef}
                  dragElastic={0}
                  className={clsx(
                    'first:mt-0 mt-2 p-3 rounded-xl',
                    'bg-slate-100 dark:bg-slate-600',
                    'border border-slate-300 dark:border-slate-600',
                    'flex items-center gap-2',
                    'transition-colors duration-200',
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {dragEnabled && (
                    <div
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onPointerDown={handleDragStart as any}
                      className="touch-none"
                    >
                      <FontAwesomeIcon
                        icon={faGripVertical}
                        className="size-4 text-slate-400 cursor-grab active:cursor-grabbing"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    {renderItem(item, editingItemId === item.id, (item) => handleEdit(item.id), handleCancelEdit)}
                  </div>
                  {showMoveButtons && (
                    <div className="flex gap-1">
                      <MoveButton
                        direction="up"
                        onClick={() => handleMove(items.indexOf(item), 'up')}
                        disabled={items.indexOf(item) === 0}
                      />
                      <MoveButton
                        direction="down"
                        onClick={() => handleMove(items.indexOf(item), 'down')}
                        disabled={items.indexOf(item) === items.length - 1}
                      />
                    </div>
                  )}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400">No items to display</div>
        )}
      </div>
      {error && <p className="text-red-700 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ReorderableList;
