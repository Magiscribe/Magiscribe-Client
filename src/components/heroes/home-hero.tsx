import { motion } from 'framer-motion';

import WizardShape from '../shapes/wizard';

export default function HomeHero() {
  return (
    <div className="container px-12 mx-auto flex flex-wrap flex-col md:flex-row items-center">
      <div className="flex flex-col w-full md:w-3/5 justify-center items-start text-left">
        <motion.h1
          className="my-4 text-4xl md:text-5xl 2xl:text-6xl font-bold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Turn Dialogue into Discovery
        </motion.h1>
        <motion.p
          className="leading-normal text-xl md:text-xl 2xl:text-3xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Magiscribe balances the efficency of surveys with the depth of user interviews using the power of AI.
        </motion.p>
        <motion.a
          href="#signup"
          className="border-2 border-white rounded-full my-6 py-4 px-8 text-white font-bold hover:bg-white hover:text-black transition duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Get Started for Free
        </motion.a>
      </div>
      <motion.div
        className="w-full md:w-2/5 max-w-lg py-6 mb-12 text-center ml-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.75 }}
      >
        <WizardShape />
      </motion.div>
    </div>
  );
}
