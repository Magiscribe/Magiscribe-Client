import clsx from 'clsx';
import React from 'react';

/**
 * Props for the Input component.
 * @typedef {Object} InputProps
 * @property {string} label - The label for the input field.
 * @property {string} [subLabel] - An optional sub-label for additional information.
 * @property {string} name - The name attribute for the input field.
 * @property {string} [error] - An optional error message to display.
 * @property {string} [className] - Additional CSS classes for the input element.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  subLabel?: string;
  name: string;
  error?: string;
  className?: string;
  autoSize?: boolean;
}

/**
 * A flexible input component that can render as a text input, textarea, or checkbox,
 * with dynamically positioned labels.
 *
 * @param {InputProps} props - The props for the Input component.
 * @returns {JSX.Element} The rendered Input component.
 */
export default function Input({ label, subLabel, name, error, className, ...props }: InputProps): JSX.Element {
  const isCheckbox = props.type === 'checkbox';

  const baseClassName = 'w-auto p-2 border rounded-2xl dark:bg-slate-600 bg-white focus:outline-none focus:ring-2';

  const inputStyles = {
    default: clsx(
      baseClassName,
      'focus:ring-indigo-500',
      {
        'border-slate-300': !error,
        'border-red-700 focus:ring-red-500': error,
      },
      className,
    ),
    checkbox: clsx(
      'h-5 w-5 text-blue-500 border-2 border-blue-500 rounded-md focus:ring-blue-500',
      {
        'border-red-700': error,
      },
      className,
    ),
  };

  const inputClassName = isCheckbox ? inputStyles.checkbox : inputStyles.default;

  const labelClassName = clsx('text-sm font-bold', {
    'order-first mb-2': !isCheckbox,
    'ml-2': isCheckbox,
  });

  const inputWrapperClassName = clsx('dark:text-white text-slate-800 w-full flex gap-2', {
    'flex-col': !isCheckbox,
    'flex-row items-center': isCheckbox,
  });

  return (
    <div className={inputWrapperClassName}>
      <input id={name} name={name} className={inputClassName} {...props} />
      {label && (
        <label className={labelClassName} htmlFor={name}>
          {label}
          {subLabel && (
            <>
              <br />
              <span className="italic text-slate-500 text-sm font-normal">{subLabel}</span>
            </>
          )}
        </label>
      )}
      {error && <p className="text-red-700 text-sm mt-1">{error}</p>}
    </div>
  );
}
