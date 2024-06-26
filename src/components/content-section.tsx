import { motion } from 'framer-motion';

export default function ContentSection({
  content,
  title,
  description,
  reversed,
}: {
  content?: React.ReactNode;
  title: string;
  description: string;
  reversed: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: reversed ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      viewport={{ once: true }}
      className={`flex flex-wrap ${content && reversed ? 'flex-col-reverse sm:flex-row' : ''}`}
    >
      <div
        className={`w-full sm:w-3/5 p-6 mt-6 ${content && reversed ? 'order-2 sm:order-1' : ''}`}
      >
        <div className="object-cover object-center w-full h-full">
          {content}
        </div>
      </div>
      <div
        className={`w-${content ? 'full sm:w-2/5' : '5/6 sm:w-1/2'} p-6 ${content ? 'mt-6' : ''}`}
      >
        <div className="align-middle">
          <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
            {title}
          </h3>
          <p className="text-gray-600 mb-8">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
