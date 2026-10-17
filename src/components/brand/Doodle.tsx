import React from 'react';

export type DoodleName = 'heart' | 'bow' | 'star' | 'squiggle' | 'sparkle';

interface DoodleProps extends React.SVGProps<SVGSVGElement> {
  name: DoodleName;
  size?: number | string;
  className?: string;
  color?: string;
}

export const Doodle: React.FC<DoodleProps> = ({
  name,
  size = 24,
  className = '',
  color = 'currentColor',
  ...props
}) => {
  switch (name) {
    case 'heart':
      // Organic hand-drawn heart doodle
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 20.2c-2.4-1.8-8.2-6.5-8.8-11.2C2.7 4.8 6 2.5 9.2 3.8c1.5.6 2.4 1.8 2.8 2.5.4-.7 1.3-1.9 2.8-2.5 3.2-1.3 6.5 1 6 5.2-.6 4.7-6.4 9.4-8.8 11.2z" />
        </svg>
      );

    case 'bow':
      // Doodled ribbon bow (signature brand element)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 24"
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          {/* Center knot */}
          <circle cx="16" cy="11" r="2.5" fill={color} />
          {/* Left loop */}
          <path d="M14 10C9.5 5 3 6.5 4.5 12c1.5 5.5 8 1.5 9.5-.5" />
          {/* Right loop */}
          <path d="M18 10C22.5 5 29 6.5 27.5 12c-1.5 5.5-8 1.5-9.5-.5" />
          {/* Left ribbon tail */}
          <path d="M15 13c-2 3-5 7.5-8 8" />
          {/* Right ribbon tail */}
          <path d="M17 13c2 3 5 7.5 8 8" />
        </svg>
      );

    case 'star':
      // Four-point delicate doodle sparkle
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
        </svg>
      );

    case 'squiggle':
      // Hand-drawn wave/squiggle underline
      return (
        <svg
          width={size}
          height={typeof size === 'number' ? size / 2 : size}
          viewBox="0 0 48 12"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M2 6c3.5-5 7.5-5 11 0s7.5 5 11 0 7.5-5 11 0 7.5 5 11 0" />
        </svg>
      );

    case 'sparkle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 3c0 4.5-4.5 9-9 9 4.5 0 9 4.5 9 9 0-4.5 4.5-9 9-9-4.5 0-9-4.5-9-9z" fill={color} fillOpacity="0.15" />
        </svg>
      );

    default:
      return null;
  }
};
