import WizardShape from '../shapes/wizard';
import { motion } from 'framer-motion';

export default function HomeHero() {
  return (
    <div>
      <div className="container px-12 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-3/5 justify-center items-start text-left">
          <motion.h1
            className="my-4 text-4xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ask the right questions,
            <br />
            let magic take care of the rest.
          </motion.h1>
          <motion.p
            className="leading-normal text-xl md:text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            With Magiscribe, you can focus on gathering insights from your users while we create inquiries tailored to
            their needs.
          </motion.p>
          <motion.a
            href="#signup"
            className="border-2 border-white rounded-full my-6 py-4 px-8 text-white font-bold hover:bg-white hover:text-black transition duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Get Pre-Alpha Access
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
    </div>
  );
}
