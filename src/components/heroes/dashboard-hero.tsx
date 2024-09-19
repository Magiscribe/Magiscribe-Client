import { motion } from 'framer-motion';

export default function DashboardHero() {
  return (
    <div>
      <div className="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-3/5 justify-center items-start text-left">
          <motion.h1
            className="my-4 text-4xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to Magiscribe!
          </motion.h1>
          <motion.p
            className="leading-normal text-xl md:text-2xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            We're excited to have you here. We appreciate your patience and understanding as we actively develop this
            project to best meet your needs.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
