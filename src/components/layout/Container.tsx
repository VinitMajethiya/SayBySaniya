import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'default',
  ...props
}) => {
  const maxSizes = {
    narrow: 'max-w-3xl',
    default: 'max-w-[1200px]',
    wide: 'max-w-[1400px]',
  };

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxSizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
