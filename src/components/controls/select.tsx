import clsx from 'clsx';
import React from 'react';

/**
 * Props for the Select component.
 * @typedef {Object} SelectProps
 * @property {string} label - The label for the select field.
 * @property {string} [subLabel] - An optional sub-label for additional information.
 * @property {string} name - The name attribute for the select field.
 * @property {string} [error] - An optional error message to display.
 * @property {Array<{value: string, label: string}>} options - An array of options for the select field.
 * @property {string} [className] - Additional CSS classes for the select element.
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  subLabel?: string;
  name: string;
  error?: string;
  options: Array<{ value?: string; label: string }>;
  className?: string;
}

/**
 * A flexible select component that renders a dropdown with customizable options,
 * labels, and error handling.
 *
 * @param {SelectProps} props - The props for the Select component.
 * @returns {JSX.Element} The rendered Select component.
 */
const Select: React.FC<SelectProps> = ({ label, subLabel, name, error, options, className, ...props }) => {
  const baseClassName = 'w-full p-3 border rounded-2xl focus:outline-none focus:ring-2';

  const selectClassName = clsx(
    baseClassName,
    'focus:ring-indigo-500 appearance-none dark:bg-slate-600 bg-white',
    {
      'border-slate-300': !error,
      'border-red-700 focus:ring-red-500': error,
    },
    className,
  );

  return (
    <div className="flex flex-col gap-2 dark:text-white text-slate-800 ">
      <label className="text-sm font-bold" htmlFor={name}>
        {label}
        {subLabel && (
          <>
            <br />
            <span className="italic text-slate-500 text-sm font-normal">{subLabel}</span>
          </>
        )}
      </label>
      <div className="relative">
        <select id={name} name={name} className={selectClassName} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-800 bg-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-700 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
