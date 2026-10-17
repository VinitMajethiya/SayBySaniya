import React, { useState } from 'react';
import type { ProductCategory, ProductPackaging } from '@/types/product';
import { TinIllustration } from './TinIllustration';
import { JarIllustration } from './JarIllustration';
import { BottleIllustration } from './BottleIllustration';

interface ProductImageProps {
  src?: string;
  alt: string;
  flavor?: string;
  accent?: string;
  packaging?: ProductPackaging;
  category?: ProductCategory;
  isOpen?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  flavor = '',
  accent = 'strawberry',
  packaging = 'tin',
  category,
  isOpen = true,
  width = 320,
  height = 320,
  className = '',
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // If no source is specified or image failed to load, render packaging-specific illustration
  if (!src || imageError) {
    if (packaging === 'jar' || category === 'lip-mask') {
      return (
        <JarIllustration
          isOpen={isOpen}
          accent={accent}
          className={className}
        />
      );
    }

    if (packaging === 'bottle' || category === 'lip-tint' || category === 'lip-gloss') {
      const bottleType = category === 'lip-gloss' ? 'lip-gloss' : 'lip-tint';
      return (
        <BottleIllustration
          productType={bottleType}
          flavor={flavor}
          accent={accent}
          isOpen={isOpen}
          className={className}
        />
      );
    }

    return (
      <TinIllustration
        flavor={flavor}
        accent={accent}
        isOpen={isOpen}
        className={className}
      />
    );
  }

  return (
    <div
      className={`relative w-full aspect-square flex items-center justify-center overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setImageError(true)}
        className="w-full h-full object-contain transition-transform duration-300"
      />
    </div>
  );
};
