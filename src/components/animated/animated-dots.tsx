import { motion } from 'framer-motion';

const bounceTransition = {
  duration: 0.4,
  repeat: Infinity,
  ease: 'easeOut',
};

export default function AnimatedDots() {
  return (
    <div className="flex justify-center items-center space-x-2 my-2">
      <motion.div
        className="w-3 h-3 bg-indigo-600 rounded-full"
        animate={{ y: ['0%', '-100%'] }}
        transition={{ ...bounceTransition, repeatType: 'reverse' }}
      />
      <motion.div
        className="w-3 h-3 bg-indigo-600 rounded-full"
        animate={{ y: ['0%', '-100%'] }}
        transition={{ ...bounceTransition, delay: 0.2, repeatType: 'reverse' }}
      />
      <motion.div
        className="w-3 h-3 bg-indigo-600 rounded-full"
        animate={{ y: ['0%', '-100%'] }}
        transition={{ ...bounceTransition, delay: 0.4, repeatType: 'reverse' }}
      />
    </div>
  );
}
