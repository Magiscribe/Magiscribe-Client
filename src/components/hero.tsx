import WizardShape from "./shapes/wizard";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="pt-24">
      <div className="container px-12 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-3/5 justify-center items-start text-left">
          <motion.h1
            className="my-4 text-4xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Write your ideas, <br />
            let magic take care of the rest.
          </motion.h1>
          <motion.p
            className="leading-normal text-xl md:text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            With Magiscribe, you can focus on your ideas and let the magic of
            technology take care of the rest through multi-modal automation.
          </motion.p>
          <motion.a
            href="#signup"
            className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
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
