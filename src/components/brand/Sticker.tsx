import React from 'react';

interface StickerProps {
  children: React.ReactNode;
  rotation?: number;
  variant?: 'ink' | 'heart' | 'strawberry' | 'honey' | 'vanilla' | 'blood' | 'cream';
  className?: string;
}

export const Sticker: React.FC<StickerProps> = ({
  children,
  rotation = -2,
  variant = 'ink',
  className = '',
}) => {
  const variantStyles = {
    ink: 'bg-ink text-cream border-ink',
    heart: 'bg-heart text-ink border-ink',
    strawberry: 'bg-strawberry text-ink border-ink',
    honey: 'bg-honey text-ink border-ink',
    vanilla: 'bg-vanilla text-ink border-ink',
    blood: 'bg-blood text-cream border-ink',
    cream: 'bg-ivory text-ink border-ink',
  };

  return (
    <span
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`inline-flex items-center justify-center px-2.5 py-1 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.16em] uppercase rounded-full border border-hairline shadow-sm transition-transform duration-200 select-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
