import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const FeatureCard = ({
  icon,
  title,
  description,
  color,
}: {
  icon: IconProp;
  title: string;
  description: string;
  color?: string;
}) => (
  <motion.div className={clsx('p-6 rounded-3xl shadow-md text-white', color)} transition={{ duration: 0.3 }}>
    <h3 className="text-xl font-bold mb-2">
      <FontAwesomeIcon icon={icon} className="mr-2" />
      {title}
    </h3>
    <p>{description}</p>
  </motion.div>
);
