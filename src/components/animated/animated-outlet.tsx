import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

export default function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={true}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        {element && React.cloneElement(element, { key: location.pathname })}
      </motion.div>
    </AnimatePresence>
  );
}
