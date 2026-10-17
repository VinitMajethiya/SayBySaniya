import React from 'react';

interface FlavorBadgeProps {
  flavor: string;
  className?: string;
}

export const FlavorBadge: React.FC<FlavorBadgeProps> = ({
  flavor,
  className = '',
}) => {
  const getFlavorDotColor = (flavorName: string) => {
    switch (flavorName.toLowerCase()) {
      case 'strawberry':
        return 'bg-strawberry';
      case 'honey':
        return 'bg-honey';
      case 'vanilla':
        return 'bg-vanilla';
      case 'blood':
        return 'bg-blood';
      default:
        return 'bg-future';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-sans text-ink-soft capitalize ${className}`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full border border-hairline ${getFlavorDotColor(
          flavor
        )}`}
        aria-hidden="true"
      />
      <span>{flavor}</span>
    </span>
  );
};
