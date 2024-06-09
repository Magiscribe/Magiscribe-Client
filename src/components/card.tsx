import { Link } from "react-router-dom";

export default function LinkCard({
  to,
  title,
  description,
  gradient,
}: {
  to: string;
  title: string;
  description: string;
  gradient?: string;
}) {
  const gradients = {
    purple: "from-purple-600 to-red-400",
    blue: "from-blue-600 to-blue-400",
  };

  const bg =
    gradients[gradient as keyof typeof gradients] || gradients["purple"];

  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-r ${bg} rounded-xl shadow-xl`}
    >
      <div className={`w-full h-full text-white  rounded-t-xl p-4`}>
        <h2 className="text-5xl font-black mt-4">{title}</h2>
        <p className="mt-2">{description}</p>
      </div>
      <div className="w-full h-full p-4 flex justify-end items-right">
        <Link
          to={to}
          className="border-2 border-white rounded-full px-4 py-2 text-white font-bold hover:bg-white hover:text-black transition duration-300"
        >
          Go to {title}
        </Link>
      </div>
    </div>
  );
}
