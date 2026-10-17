import React from 'react';
import { Doodle } from '@/components/brand/Doodle';

interface MarqueeProps {
  items?: string[];
  speed?: number;
  className?: string;
  bgColor?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items = [
    'NOURISH',
    'TINT',
    'LOVE',
    '100% ORGANIC',
    'HOMEMADE',
    'SMALL BATCH',
    'NOURISH',
    'TINT',
    'LOVE',
  ],
  className = '',
  bgColor = 'bg-ivory',
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden border-hairline-t border-hairline-b py-3 select-none ${bgColor} ${className}`}
      aria-label="Brand marquee"
    >
      <div className="flex w-max items-center marquee-track hover:[animation-play-state:paused]">
        {/* Render twice for continuous seamless infinite loop */}
        {[...Array(2)].map((_, loopIdx) => (
          <div
            key={loopIdx}
            className="flex items-center shrink-0"
            aria-hidden={loopIdx === 1 ? 'true' : undefined}
          >
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center px-6 sm:px-8">
                <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[0.24em] text-ink whitespace-nowrap">
                  {item}
                </span>
                <Doodle
                  name="heart"
                  size={12}
                  className="text-heart ml-6 sm:ml-8"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: 200%;
          animation: marquee 25s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};
