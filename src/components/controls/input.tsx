import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, ...props }) => {
  const inputClassName = clsx(
    'w-full p-3 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500',
    {
      'border-slate-300': !error,
      'border-red-700 focus:ring-red-500': error,
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input id={name} name={name} className={inputClassName} {...props} />
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
