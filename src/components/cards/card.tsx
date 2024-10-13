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
  };

  const bg = gradients[gradient as keyof typeof gradients] || gradients['purple'];

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-cover bg-center shadow-xl rounded-3xl overflow-hidden`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${bg}`}></div>
      <div className={`relative w-full h-full text-white rounded-t-xl p-4 z-10`}>
        <h2 className="text-5xl font-black mt-4">{title}</h2>
        <p className="mt-2">{description}</p>
      </div>
      {!isActive && (
        <div className="relative w-full h-full pb-4 pr-4 flex justify-end items-end z-10">
          <Link
            to={to}
            className="border-2 border-white rounded-full px-4 py-2 text-white font-bold hover:bg-white hover:text-black transition duration-300"
          >
            Go to {title}
          </Link>
        </div>
      )}
    </div>
  );
}
