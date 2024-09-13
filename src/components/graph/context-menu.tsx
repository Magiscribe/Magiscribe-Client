import { motion } from 'framer-motion';

interface ContextMenuProps {
  /**
   * The top position of the context menu.
   */
  top?: number;

  /**
   * The left position of the context menu.
   */
  left?: number;

  /**
   * The right position of the context menu.
   */
  right?: number;

  /**
   * The bottom position of the context menu.
   */
  bottom?: number;

  /**
   * The callback triggered when the user clicks the "Add Node" button.
   */
  onAddNode: (e: React.MouseEvent) => void;
}

export default function ContextMenu({
  top,
  left,
  right,
  bottom,

  onAddNode,

  ...props
}: ContextMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2, type: 'spring', stiffness: 250 }}
      style={{ top, left, right, bottom }}
      className="fixed bg-white border border-gray-200 rounded-xl p-2 z-10 shadow-xl"
      {...props}
    >
      <div className="text-sm ">
        <p className="text-gray-800 border-b border-gray-200 pb-2 mb-2">Context Menu</p>
        <button
          onClick={onAddNode}
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
        >
          Add Node
        </button>
      </div>
    </motion.div>
  );
}
