import clsx from 'clsx';
import React, { useId } from 'react';

/**
 * Props for the Input component.
 * @typedef {Object} InputProps
 * @property {string} label - The label for the input field.
 * @property {string} [subLabel] - An optional sub-label for additional information.
 * @property {string} name - The name attribute for the input field.
 * @property {string} [error] - An optional error message to display.
 * @property {string} [className] - Additional CSS classes for the input element.
 */
interface DataWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  subLabel?: string;
  name: string;
  className?: string;
  autoSize?: boolean;
}

/**
 * A component for rendering static text data with dynamically positioned labels.
 *
 * @param {InputProps} props - The props for the Input component.
 * @returns {JSX.Element} The rendered Input component.
 */
export default function DataWithLabel({ label, subLabel, className, ...props }: DataWithLabelProps) {
  // A React hook that generates a unique ID for the input element to reference the label.
  const id = useId();

  const isCheckbox = props.type === 'checkbox';

  const baseClassName = 'w-auto p-2 dark:bg-slate-600 bg-white focus:outline-none focus:ring-2';

  const inputStyles = {
    default: clsx(baseClassName, 'focus:ring-indigo-500', className),
  };

  const inputClassName = inputStyles.default;

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
      <div style={{ whiteSpace: 'nowrap' }} id={id} className={inputClassName}>
        {props.value}
      </div>
      {label && (
        <label className={labelClassName} htmlFor={id}>
          {label}
          {subLabel && (
            <>
              <br />
              <span className="italic text-slate-500 text-sm font-normal">{subLabel}</span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
