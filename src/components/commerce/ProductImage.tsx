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
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Derive candidate image URLs to support both .webp and .jpg seamlessly
  const candidates = React.useMemo(() => {
    if (!src) return [];
    const list = [src];
    if (src.endsWith('.webp')) {
      list.push(src.replace(/\.webp$/, '.jpg'), src.replace(/\.webp$/, '.jpeg'), src.replace(/\.webp$/, '.png'));
    } else if (src.endsWith('.jpg') || src.endsWith('.jpeg')) {
      list.push(src.replace(/\.jpe?g$/, '.webp'), src.replace(/\.jpe?g$/, '.png'));
    }
    return Array.from(new Set(list));
  }, [src]);

  // Reset when src changes
  React.useEffect(() => {
    setCandidateIndex(0);
    setImageError(false);
  }, [src]);

  const currentSrc = candidates[candidateIndex];

  // If no source is specified or all image candidates failed, render packaging-specific illustration
  if (!src || imageError || !currentSrc) {
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
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => {
          if (candidateIndex < candidates.length - 1) {
            setCandidateIndex((prev) => prev + 1);
          } else {
            setImageError(true);
          }
        }}
        className="w-full h-full object-contain transition-transform duration-300"
      />
    </div>
  );
};
