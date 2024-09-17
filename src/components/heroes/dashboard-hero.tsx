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
            <br />
            We're excited to have you here.
          </motion.h1>
          <motion.p
            className="leading-normal text-xl md:text-2xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Magiscribe is undergoing active development and sometimes things may not work as expected. We appreciate
            your patience and understanding.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
