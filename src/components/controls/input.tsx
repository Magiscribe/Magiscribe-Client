import clsx from 'clsx';
import React from 'react';

/**
 * Props for the Input component.
 * @typedef {Object} InputProps
 * @property {string} label - The label for the input field.
 * @property {string} [subLabel] - An optional sub-label for additional information.
 * @property {string} name - The name attribute for the input field.
 * @property {string} [error] - An optional error message to display.
 * @property {'input' | 'textarea'} [as='input'] - Determines whether to render an input or textarea.
 * @property {string} [className] - Additional CSS classes for the input element.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  subLabel?: string;
  name: string;
  error?: string;
  as?: 'input' | 'textarea';
  className?: string;
}

/**
 * A flexible input component that can render as a text input, textarea, or checkbox,
 * with dynamically positioned labels.
 *
 * @param {InputProps} props - The props for the Input component.
 * @returns {JSX.Element} The rendered Input component.
 */
const Input: React.FC<InputProps> = ({ label, subLabel, name, error, as = 'input', className, ...props }) => {
  const isCheckbox = props.type === 'checkbox';

  const baseClassName = 'w-full p-2 border rounded-xl focus:outline-none focus:ring-2';

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
    textarea: clsx(
      baseClassName,
      'focus:ring-indigo-500 resize-vertical min-h-[100px]',
      {
        'border-slate-300': !error,
        'border-red-700 focus:ring-red-500': error,
      },
      className,
    ),
  };

  const inputClassName = isCheckbox
    ? inputStyles.checkbox
    : as === 'textarea'
      ? inputStyles.textarea
      : inputStyles.default;

  const InputComponent = as === 'textarea' ? 'textarea' : 'input';

  const labelClassName = clsx('text-sm font-bold', {
    'order-first mb-2': !isCheckbox,
    'ml-2': isCheckbox,
  });

  const inputWrapperClassName = clsx('text-slate-800 w-full flex gap-2', {
    'flex-col': !isCheckbox,
    'flex-row items-center': isCheckbox,
  });

  return (
    <div className={inputWrapperClassName}>
      <InputComponent id={name} name={name} className={inputClassName} {...props} />
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
};

export default Input;
