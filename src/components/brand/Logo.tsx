import React from 'react';
import { Link } from 'react-router-dom';
import { Doodle } from './Doodle';

interface LogoProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'compact', className = '' }) => {
  if (variant === 'full') {
    return (
      <Link
        to="/"
        className={`inline-flex flex-col items-center text-center group select-none ${className}`}
        aria-label="Say By Saniya"
      >
        <Doodle
          name="bow"
          size={36}
          className="text-ink mb-1 group-hover:scale-110 transition-transform duration-200"
        />
        <div className="flex items-baseline leading-none justify-center">
          <span className="font-script text-5xl md:text-6xl text-ink leading-none">
            S
          </span>
          <span className="font-display tracking-[0.2em] text-2xl md:text-3xl text-ink font-normal uppercase -ml-1">
            AY
          </span>
        </div>
        <span className="font-script text-2xl md:text-3xl text-ink -mt-1 tracking-wide">
          By Saniya
        </span>
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 group select-none ${className}`}
      aria-label="Say By Saniya"
    >
      <Doodle
        name="bow"
        size={22}
        className="text-ink group-hover:rotate-6 transition-transform duration-200"
      />
      <div className="flex items-baseline leading-none">
        <span className="font-script text-2xl md:text-3xl text-ink font-normal">
          Say By Saniya
        </span>
      </div>
    </Link>
  );
};
