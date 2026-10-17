import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Doodle } from '@/components/brand/Doodle';
import { trackEvent } from '@/lib/analytics';
import { useCartStore } from '@/store/cart';
import { Product } from '@/types/product';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  variant = 'secondary',
  fullWidth = false,
  className = '',
}) => {
  const [popping, setPopping] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const shouldReduceMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, quantity);
    trackEvent('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      quantity,
      price: product.price,
    });

    setPopping(true);
    setTimeout(() => setPopping(false), 900);
  };

  const isPrimary = variant === 'primary';

  return (
    <div className={`relative inline-block ${fullWidth ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={handleClick}
        className={`relative z-10 font-sans uppercase font-medium tracking-button transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 select-none min-h-[44px] ${
          isPrimary
            ? 'w-full px-6 py-3 bg-ink text-cream rounded-pill hover:bg-heart shadow-sm text-xs sm:text-sm'
            : 'px-3.5 py-2 rounded-pill border border-ink text-ink bg-transparent hover:bg-ink hover:text-cream text-[11px] sm:text-xs'
        } ${className}`}
      >
        <span>{popping ? 'Added ♥' : 'Add to Cart'}</span>
        {isPrimary && <Doodle name="heart" size={14} className="text-cream" />}
      </button>

      {/* Floating Heart Pop Animation */}
      <AnimatePresence>
        {popping && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -50,
              scale: [0.5, 1.4, 1.1, 0.8],
              x: [0, 8, -6, 4],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute -top-3 right-6 pointer-events-none z-30 text-heart drop-shadow-sm"
          >
            <Doodle name="heart" size={24} color="var(--heart)" className="fill-heart" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
