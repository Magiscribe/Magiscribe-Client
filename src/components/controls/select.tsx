import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  subLabel?: string;
  name: string;
  error?: string;
  options: Array<{ value?: string; label: string }>;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ label, subLabel, name, error, options, className, ...props }) => {
  const baseSelectClassName = clsx(
    'w-full p-3 border rounded-2xl focus:outline-none focus:ring-2',
    'relative overflow-hidden appearance-none dark:bg-slate-600 bg-white',
    {
      'border-slate-300': !error,
      'border-red-700 focus:ring-red-500': error,
    },
    className,
  );

  return (
    <div className="flex flex-col gap-2 dark:text-white text-slate-800">
      {label && (
        <label className="text-sm font-bold" htmlFor={name}>
          {label}
          {subLabel && (
            <>
              <br />
              <span className="italic text-slate-500 text-sm font-normal">{subLabel}</span>
            </>
          )}
        </label>
      )}
      <div className="relative">
        <select id={name} name={name} className={baseSelectClassName} {...props}>
          {/* Default */}
          <option value="" disabled hidden>
            Select an option...
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-slate-800 dark:text-white bg-white dark:bg-slate-600 py-1.5 px-3"
            >
              {option.label}
            </option>
          ))}
        </select>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-slate-800 dark:text-white"
        />
      </div>
      {error && <p className="text-red-700 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
