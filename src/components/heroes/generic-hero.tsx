import { motion } from 'motion/react';

interface GenericHeroProps {
  title: string;
  subtitle: string;
}

export default function GenericHero({ title, subtitle }: GenericHeroProps) {
  return (
    <div className="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
      <div className="flex flex-col w-full md:w-3/5 justify-center items-start text-left">
        <motion.h1
          className="my-4 text-4xl md:text-5xl font-bold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="leading-normal text-xl md:text-2xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}
