import { Link } from 'react-router-dom';

export default function BackLinks({ pathSegments }: { pathSegments: string[] }) {
  return (
    <div className="flex items-center text-x;">
      <Link to="/dashboard" className="hover:text-pink-600 capitalize transition-colors duration-300">
        Dashboard
      </Link>
      {pathSegments.slice(1, -1).map((segment, index) => (
        <span key={index}>
          <span className="mx-2">/</span>
          <Link
            to={`/${pathSegments.slice(0, index + 2).join('/')}`}
            className="hover:text-pink-600 capitalize transition-colors duration-300"
          >
            {segment.replace(/-/g, ' ')}
          </Link>
        </span>
      ))}
      <span className="mx-2">/</span>
      <span className="font-thin capitalize">{pathSegments[pathSegments.length - 1].replace(/-/g, ' ')}</span>
    </div>
  );
}
