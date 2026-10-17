import React from 'react';
import { Section } from '@/components/layout/Section';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ComingSoonCard } from '@/components/commerce/ComingSoonCard';
import { Product } from '@/types/product';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface FeaturedFlavorsProps {
  products: Product[];
}

export const FeaturedFlavors: React.FC<FeaturedFlavorsProps> = ({ products }) => {
  const { settings } = useSiteSettings();

  // Show all 6 products (3 balms, mask, tint, gloss)
  const collection = products.slice(0, 6);

  return (
    <Section
      bg="ivory"
      eyebrow="THE COLLECTION"
      title="The Collection"
      subtitle="Four signature lines. Homemade, organic lip care for every day."
      headerCentered={true}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {collection.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Hide Future Favorites card unless site setting turns it on */}
        {settings.showFutureFavorites && (
          <ComingSoonCard
            title="Future Favorites"
            body="New lip drops coming soon. Fresh shades whipped with pure botanicals."
          />
        )}
      </div>
    </Section>
  );
};

export const TheCollection = FeaturedFlavors;
