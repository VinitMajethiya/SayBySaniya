import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans uppercase font-medium tracking-button transition-colors duration-200 select-none min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 rounded-pill',
    md: 'text-[13px] sm:text-sm px-6 py-2.5 rounded-pill',
    lg: 'text-sm sm:text-base px-8 py-3.5 rounded-pill',
  };

  const variantStyles = {
    primary:
      'bg-ink text-cream hover:bg-heart active:bg-heart/90 shadow-sm',
    secondary:
      'bg-transparent text-ink border border-ink hover:bg-ink hover:text-cream',
    link:
      'bg-transparent text-ink underline underline-offset-4 hover:text-heart p-0 min-h-0 min-w-0 normal-case tracking-normal font-normal',
  };

  return (
    <button
      className={`${baseStyles} ${
        variant !== 'link' ? sizeStyles[size] : ''
      } ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
