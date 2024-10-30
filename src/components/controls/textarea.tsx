import useAutoResizeTextareaRef from '@/hooks/auto-resize-textarea';
import clsx from 'clsx';
import React from 'react';

/**
 * Props for the Textarea component.
 * @typedef {Object} TextareaProps
 * @property {string} label - The label for the textarea field.
 * @property {string} [subLabel] - An optional sub-label for additional information.
 * @property {string} name - The name attribute for the textarea field.
 * @property {string} [error] - An optional error message to display.
 * @property {string} [className] - Additional CSS classes for the textarea element.
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  subLabel?: string;
  name: string;
  error?: string;
  className?: string;
}

/**
 * A flexible input component that can render as a textarea .
 *
 * @param {InputProps} props - The props for the Textarea component.
 * @returns {JSX.Element} The rendered Textarea component.
 */
export default function Textarea({
  label,
  subLabel,
  name,
  error,
  className,
  value,
  ...props
}: TextareaProps): JSX.Element {
  const textareaRef = useAutoResizeTextareaRef(value as string);

  const baseClassName = 'w-full p-2 border rounded-xl dark:bg-slate-600 bg-white focus:outline-none focus:ring-2';

  const textareaClassName = clsx(
    baseClassName,
    'focus:ring-indigo-500 resize-vertical min-h-[100px]',
    {
      'border-slate-300': !error,
      'border-red-700 focus:ring-red-500': error,
    },
    className,
  );

  const labelClassName = 'text-sm font-bold order-first mb-2';

  return (
    <div className="dark:text-white text-slate-800 w-full flex flex-col gap-2">
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
      <textarea id={name} name={name} className={textareaClassName} ref={textareaRef} value={value} {...props} />
      {error && <p className="text-red-700 text-sm mt-1">{error}</p>}
    </div>
  );
}
