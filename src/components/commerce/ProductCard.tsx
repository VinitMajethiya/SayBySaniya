import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { PriceTag } from './PriceTag';
import { ProductImage } from './ProductImage';
import { Sticker } from '@/components/brand/Sticker';
import { Doodle } from '@/components/brand/Doodle';
import { NotifyMeModal } from './NotifyMeModal';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);

  const handleNotifyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifyModalOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const getWashColor = () => {
    if (product.packaging === 'jar' || product.accent === 'jar-mask') {
      return 'rgba(191, 211, 208, 0.18)';
    }
    if (product.category === 'lip-gloss') {
      return 'rgba(235, 238, 242, 0.18)';
    }
    switch (product.accent) {
      case 'strawberry':
        return 'rgba(240, 168, 190, 0.12)';
      case 'honey':
        return 'rgba(232, 197, 138, 0.14)';
      case 'vanilla':
        return 'rgba(243, 231, 201, 0.22)';
      case 'blood':
        return 'rgba(139, 26, 26, 0.1)';
      default:
        return 'rgba(233, 183, 201, 0.12)';
    }
  };

  const getCategoryLabel = () => {
    switch (product.category) {
      case 'lip-mask':
        return 'LIP MASK';
      case 'lip-tint':
        return 'LIP TINT';
      case 'lip-gloss':
        return 'LIP GLOSS';
      default:
        return 'LIP BALM';
    }
  };

  return (
    <>
      <div
        className={`group relative bg-ivory border-hairline rounded-card flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-subtle ${className}`}
      >
        {/* Visual Area with subtle flavor wash */}
        <div
          className="relative aspect-square w-full overflow-hidden border-hairline-b flex items-center justify-center transition-colors duration-200"
          style={{ backgroundColor: getWashColor() }}
        >
          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
              {product.badges.map((badge, idx) => (
                <Sticker
                  key={idx}
                  rotation={idx % 2 === 0 ? -3 : 2}
                  variant={badge.toLowerCase().includes('soon') ? 'heart' : 'ink'}
                >
                  {badge}
                </Sticker>
              ))}
            </div>
          )}

          {/* Wishlist toggle ♥ */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-ivory/80 backdrop-blur-sm border border-hairline flex items-center justify-center text-ink hover:text-heart hover:scale-105 transition-all duration-200"
          >
            <Doodle
              name="heart"
              size={16}
              color={isWishlisted ? 'var(--heart)' : 'currentColor'}
              className={isWishlisted ? 'fill-heart text-heart scale-110' : ''}
            />
          </button>

          {/* Image / Illustration */}
          <Link
            to={`/product/${product.slug}`}
            className="w-full h-full flex items-center justify-center p-2 group-hover:scale-[1.03] transition-transform duration-300"
            tabIndex={-1}
          >
            <ProductImage
              src={product.images && product.images[0]}
              alt={`${product.name} packaging on cream background`}
              flavor={product.flavor}
              accent={product.accent}
              packaging={product.packaging}
              category={product.category}
              isOpen={true}
              width={320}
              height={320}
            />
          </Link>
        </div>

        {/* Info Area */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                {getCategoryLabel()}
              </span>
              <span className="text-xs text-ink-soft font-sans">
                {product.size}
              </span>
            </div>

            <Link to={`/product/${product.slug}`} className="block group-hover:text-ink">
              <h3 className="font-display text-lg sm:text-[22px] font-semibold text-ink leading-snug mb-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-ink-soft line-clamp-2 mb-3">
              {product.shortDescription}
            </p>
          </div>

          <div className="pt-3 border-hairline-t flex items-center justify-between gap-3 mt-auto">
            <div>
              <PriceTag amount={product.price} />
            </div>

            {product.status === 'coming-soon' ? (
              <button
                type="button"
                onClick={handleNotifyClick}
                className="text-[11px] sm:text-xs font-sans uppercase font-medium tracking-button px-3.5 py-2 rounded-pill border border-heart text-heart bg-transparent hover:bg-heart hover:text-cream active:scale-95 transition-all duration-200"
              >
                Notify Me
              </button>
            ) : (
              <AddToCartButton product={product} variant="secondary" />
            )}
          </div>
        </div>
      </div>

      <NotifyMeModal
        productName={product.name}
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
      />
    </>
  );
};
