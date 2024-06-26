import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotReadyHero() {
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
            Sorry...
            <br />
            We aren't quite ready for you yet.
          </motion.h1>
          <motion.p
            className="leading-normal text-xl md:text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Magiscribe is undergoing active development and we are making sure
            that everything is settled before we open the doors.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="/"
              className="border-2 border-white rounded-full my-6 py-4 px-8 text-white font-bold hover:bg-white hover:text-black transition duration-300"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
