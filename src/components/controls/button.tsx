import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React from 'react';

/**
 * Props for the Button component.
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - The content of the button.
 * @property {'primary' | 'secondary' | 'danger'} [variant='primary'] - The visual style variant of the button.
 * @property {'small' | 'medium' | 'large'} [size='medium'] - The size of the button.
 * @property {IconDefinition} [iconLeft] - Optional icon to display on the left side of the button text.
 * @property {IconDefinition} [iconRight] - Optional icon to display on the right side of the button text.
 * @property {string} [className] - Additional CSS classes for the button element.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'transparentPrimary'
    | 'transparentSecondary'
    | 'transparentDanger'
    | 'inversePrimary'
    | 'inverseSecondary'
    | 'inverseDanger';
  size?: 'small' | 'medium' | 'large';
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  className?: string;
}

/**
 * A flexible button component that supports different variants, sizes, and optional icons.
 *
 * @param {ButtonProps} props - The props for the Button component.
 * @returns {JSX.Element} The rendered Button component.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  iconLeft,
  iconRight,
  className,
  ...props
}) => {
  const baseClassName =
    'inline-flex items-center justify-center font-medium rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClassNames = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-400 text-white hover:bg-slate-500 focus:ring-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',

    transparentPrimary: 'text-blue-600 hover:text-blue-700 focus:ring-blue-500',
    transparentSecondary: 'text-slate-400 hover:text-slate-500 focus:ring-slate-300',
    transparentDanger: 'text-red-600 hover:text-red-700 focus:ring-red-500',

    inversePrimary: 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    inverseSecondary: 'bg-white text-slate-400 hover:bg-slate-50 focus:ring-slate-300',
    inverseDanger: 'bg-white text-red-600 hover:bg-red-50 focus:ring-red-500',
  };

  const sizeClassNames = {
    regular: {
      small: 'px-2 py-1.5 text-sm',
      medium: 'px-3 py-2 text-base',
      large: 'px-4 py-3 text-lg',
    },

    icon: {
      small: 'p-0 text-2xl',
      medium: 'p-0 text-3xl',
      large: 'p-0 text-4xl',
    },
  };

  const buttonClassName = clsx(
    baseClassName,
    variantClassNames[variant],
    sizeClassNames[children == null && (iconLeft || iconRight) ? 'icon' : 'regular'][size],
    className,
  );

  const iconClassName = 'inline-block';
  const iconLeftClassName = clsx(iconClassName, { 'mr-2': children });
  const iconRightClassName = clsx(iconClassName, { 'ml-2': children });

  return (
    <button className={buttonClassName} {...props}>
      {iconLeft && <FontAwesomeIcon icon={iconLeft} className={iconLeftClassName} />}
      {children}
      {iconRight && <FontAwesomeIcon icon={iconRight} className={iconRightClassName} />}
    </button>
  );
};

export default Button;
