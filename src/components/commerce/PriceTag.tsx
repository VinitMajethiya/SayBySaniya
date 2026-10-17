import React from 'react';

interface PriceTagProps {
  amount?: number; // In paise or 0 if TBD
  className?: string;
  isTBD?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amount = 0,
  className = '',
  isTBD = false,
}) => {
  if (isTBD || amount === 0) {
    return (
      <span className={`font-sans font-medium text-ink ${className}`}>
        ₹[TBD]
      </span>
    );
  }

  // If amount is in paise, convert to rupees
  const formatted = (amount / 100).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  return (
    <span className={`font-sans font-medium text-ink ${className}`}>
      ₹{formatted}
    </span>
  );
};
