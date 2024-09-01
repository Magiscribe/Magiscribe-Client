import { Link } from 'react-router-dom';

interface LinkCardProps {
  to: string;
  title: string;
  description: string;
  gradient?: string;
  isActive?: boolean;
}

export default function LinkCard({ to, title, description, gradient, isActive = false }: LinkCardProps) {
  const gradients = {
    red: 'from-red-700 to-red-500',
    green: 'from-green-700 to-green-500',
    purple: 'from-purple-700 to-purple-500',
    indigo: 'from-indigo-700 to indigo-500',
    blue: 'from-blue-700 to-blue-500',
    orange: 'from-orange-700 to-orange-500',
  };

  const bg = gradients[gradient as keyof typeof gradients] || gradients['purple'];

  return (
    <div className={`relative flex flex-col items-center justify-center bg-gradient-to-r ${bg} rounded-xl shadow-xl`}>
      <div className={`w-full h-full text-white rounded-t-xl p-4`}>
        <h2 className="text-5xl font-black mt-4">{title}</h2>
        <p className="mt-2">{description}</p>
      </div>
      {!isActive && (
        <div className="w-full h-full pb-4 pr-4 flex justify-end items-right">
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
