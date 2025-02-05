import { motion, useAnimation } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface LinkCardProps {
  to: string;
  title: string;
  description: string;
  gradient?: string;
  isActive?: boolean;
  backgroundImage?: string;
}

export default function LinkCard({
  to,
  title,
  description,
  gradient,
  isActive = false,
  backgroundImage = '/api/placeholder/400/300',
}: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = {
    amber: 'from-amber-700/80 to-amber-500/80',
    red: 'from-red-700/80 to-red-500/80',
    emerald: 'from-emerald-700/80 to-emerald-500/80',
    purple: 'from-purple-700/80 to-purple-500/80',
    indigo: 'from-indigo-700/80 to-indigo-500/80',
    blue: 'from-blue-700/80 to-blue-500/80',
    sky: 'from-sky-700/80 to-sky-500/80',
    orange: 'from-orange-700/80 to-orange-500/80',
    teal: 'from-teal-700/80 to-teal-500/80',
    green: 'from-green-700/80 to-green-500/80',
  };

  const bg = gradients[gradient as keyof typeof gradients] || gradients['purple'];

  const backgroundControl = useAnimation();
  const contentControl = useAnimation();

  const onHover = () => {
    setIsHovered(true);
    backgroundControl.start({
      x: 8,
      y: -8,
      transition: { duration: 0.3 },
    });
    contentControl.start({
      x: -4,
      y: 4,
      transition: { duration: 0.3 },
    });
  };

  const onLeave = () => {
    setIsHovered(false);
    backgroundControl.start({
      x: 0,
      y: 0,
      transition: { duration: 0.3 },
    });
    contentControl.start({
      x: 0,
      y: 0,
      transition: { duration: 0.3 },
    });
  };

  return (
    <Link to={to} className="block relative w-full h-full" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <motion.div
        className={`absolute inset-0 bg-cover bg-center shadow-xl rounded-3xl overflow-hidden opacity-40 pointer-events-none`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        animate={backgroundControl}
      >
        <div className={`absolute inset-0 bg-linear-to-r ${bg}`}></div>
      </motion.div>
      <motion.div
        className={`relative flex flex-col items-center justify-between bg-cover bg-center shadow-xl rounded-3xl overflow-hidden min-h-[200px]`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        animate={contentControl}
      >
        <div className={`absolute inset-0 bg-linear-to-r ${bg}`}></div>
        <div className={`relative w-full h-full text-white p-4 z-10`}>
          <h2 className="text-5xl font-black mt-4">{title}</h2>
          <p className="mt-2">{description}</p>
        </div>
        {!isActive && (
          <div className="relative w-full pb-4 pr-4 flex justify-end z-10">
            <motion.div
              className="border-2 border-white rounded-full px-4 py-2 text-white font-bold"
              animate={{
                backgroundColor: isHovered ? '#ffffff' : 'transparent',
                color: isHovered ? '#000000' : '#ffffff',
              }}
              transition={{ duration: 0.3 }}
            >
              Go to {title}
            </motion.div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
