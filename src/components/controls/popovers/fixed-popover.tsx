import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

interface FixedPopoverProps {
  label: string;
  children: React.ReactNode;
}

export default function FixedPopover({ label, children }: FixedPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopover = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-4 left-4">
      <button
        onClick={togglePopover}
        className={`
          ${isOpen ? 'text-white' : 'text-gray-500'}
          group inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors duration-200`}
      >
        <FontAwesomeIcon icon="comment-alt" className="mr-2" />
        {label}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 left-0 z-10 w-80 h-96 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div className="h-full p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};