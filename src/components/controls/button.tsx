import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React from 'react';

const variantClassNames = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-slate-500 text-white hover:bg-slate-600 focus:ring-slate-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',

  light: 'bg-white text-blue-700 font-bold hover:bg-slate-100 focus:ring-slate-300',
  dark: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-300',

  transparentPrimary: 'text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-0 select-none',
  transparentSecondary: 'text-slate-500 hover:text-slate-500 focus:outline-none focus:ring-0 select-none',
  transparentDanger: 'text-red-600 hover:text-red-700 focus:outline-none focus:ring-0 select-none',
  transparentSuccess: 'text-green-600 hover:text-green-700 focus:outline-none focus:ring-0 select-none',
  transparentLight:
    'text-white dark:text-slate-600 hover:text-slate-400 dark:hover:text-white focus:outline-none focus:ring-0 select-none',
  transparentDark:
    'text-slate-600 dark:text-white hover:text-slate-700 dark:hover:text-slate-400 border-0 focus:outline-none focus:ring-0 select-none',
  transparentWhite: 'text-white hover:text-white focus:outline-none focus:ring-0 select-none',
  transparentBlack: 'text-black hover:text-black focus:outline-none focus:ring-0 select-none',

  inversePrimary:
    'bg-transperant text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-red-500 border border-2 border-blue-600',
  inverseSecondary:
    'bg-transperant text-slate-600 hover:bg-red-600 hover:text-white focus:ring-slate-500 border border-2 border-slate-600',
  inverseDanger:
    'bg-transperant text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 border border-2 border-red-600',
  inverseSuccess:
    'bg-transperant text-red-600 hover:bg-green-600 hover:text-white focus:ring-green-500 border border-2 border-green-600',
};

/**
 * Type definition for the component's polymorphic "as" prop
 */
type AsProp<C extends React.ElementType> = {
  as?: C;
};

/**
 * Type definition for props that depend on the component type
 */
type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

/**
 * Polymorphic component props type
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

/**
 * Base Button props without the polymorphic behavior
 */
interface ButtonBaseProps {
  variant?: (typeof variantClassNames)[keyof typeof variantClassNames];
  size?: 'small' | 'medium' | 'large';
  icon?: IconDefinition;
  className?: string;
}

/**
 * Props for the Button component including polymorphic behavior
 */
type ButtonProps<C extends React.ElementType> = PolymorphicComponentProp<C, ButtonBaseProps>;

/**
 * A flexible, polymorphic button component that supports different variants, sizes, and optional icons.
 *
 * @example
 * // As a button (default)
 * <Button variant="primary">Click me</Button>
 *
 * // As a link
 * <Button as="a" href="/path" variant="primary">Navigate</Button>
 *
 * // As a custom component
 * <Button as={Link} to="/path" variant="primary">Router Link</Button>
 *
 * @param {ButtonProps<C>} props - The props for the Button component
 * @returns {JSX.Element} The rendered Button component
 */
const Button = <C extends React.ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  className,
  ...props
}: ButtonProps<C>) => {
  const Component = as || 'button';

  const baseClassName =
    'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

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
    variantClassNames[variant as keyof typeof variantClassNames],
    sizeClassNames[children == null && icon ? 'icon' : 'regular'][size],
    className,
  );

  const iconClassName = clsx({ 'inline-block mr-2': children });

  return (
    <Component className={buttonClassName} {...props}>
      {icon && <FontAwesomeIcon icon={icon} className={iconClassName} />}
      {children}
    </Component>
  );
};

export default Button;
