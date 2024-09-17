import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';

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
   * The buttons to display in the context menu.
   */
  buttons: ReactElement[];
}

export default function ContextMenu({
  top,
  left,
  right,
  bottom,

  buttons,

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
        <p className="text-gray-800 border-b border-gray-200 pb-2 mb-2">Add Node</p>
        <div className="flex flex-col space-y-2">
          {buttons.map((button, index) => React.cloneElement(button, { key: index }))}
        </div>
      </div>
    </motion.div>
  );
}
