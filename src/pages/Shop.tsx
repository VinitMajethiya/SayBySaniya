import React, { useState, useMemo } from 'react';
import { Section } from '@/components/layout/Section';
import { ProductCard } from '@/components/commerce/ProductCard';
import { Doodle } from '@/components/brand/Doodle';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import { useProducts } from '@/hooks/useProducts';

export const Shop: React.FC = () => {
  const { products: allProducts } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (selectedCategory !== 'all') {
          return p.category === selectedCategory;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          return a.sortOrder - b.sortOrder;
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'price-low') {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === 'price-high') {
          return (b.price || 0) - (a.price || 0);
        }
        return 0;
      });
  }, [allProducts, selectedCategory, sortBy]);

  const hasActiveFilters = selectedCategory !== 'all';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const categories: { label: string; value: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'Lip Balm', value: 'lip-balm' },
    { label: 'Lip Mask', value: 'lip-mask' },
    { label: 'Lip Tint', value: 'lip-tint' },
    { label: 'Lip Gloss', value: 'lip-gloss' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Shop Lip Care Collection | Say By Saniya"
        description="Explore our complete line of homemade lip care: slider tin lip balms, overnight lip mask, liquid lip tint, and crystal lip gloss."
      />

      <Section
        bg="cream"
        eyebrow="THE COMPLETE COLLECTION"
        title="Shop Lip Care"
        subtitle="Homemade lip care for every day. Nourish. Tint. Love."
        headerCentered={true}
      >
        {/* Controls Bar: Category Filters & Sorting */}
        <div className="mb-10 p-5 bg-ivory rounded-card border-hairline shadow-subtle space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft shrink-0 mr-1">
                Category:
              </span>
              {categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedCategory(c.value)}
                  className={`text-xs font-sans uppercase font-medium tracking-button px-3.5 py-1.5 rounded-pill transition-all shrink-0 border ${
                    selectedCategory === c.value
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-cream/60 text-ink border-hairline hover:border-ink'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sort Selection Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <label
                htmlFor="sort-by"
                className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft"
              >
                Sort:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream border border-hairline rounded-pill px-3 py-1.5 text-xs font-sans text-ink focus:outline-none focus:border-ink transition-colors cursor-pointer"
              >
                <option value="featured">Featured / Recommended</option>
                <option value="name-asc">Name (A – Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="pt-2 border-hairline-t flex items-center justify-between text-xs text-ink-soft">
              <span>
                Showing {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="hover:text-heart underline transition-colors"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto bg-ivory rounded-card border-hairline p-8 shadow-subtle">
            <Doodle name="heart" size={36} className="text-heart/70 mx-auto" />
            <h3 className="font-display text-2xl font-semibold text-ink">
              No products matched your filter
            </h3>
            <p className="text-sm text-ink-soft font-sans">
              Try clearing your filter to explore our full homemade lip care collection.
            </p>
            <div className="pt-2">
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Reset Filter
              </Button>
            </div>
          </div>
        )}

        {/* Brand Promise Footer Note */}
        <div className="mt-16 p-6 bg-ivory rounded-card border border-hairline flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div className="flex items-center gap-3">
            <Doodle name="bow" size={24} className="text-ink shrink-0" />
            <div>
              <h4 className="font-display text-base font-semibold text-ink">
                Need a Custom Gift or Party Favors?
              </h4>
              <p className="text-xs text-ink-soft">
                Saniya hand-pours custom batch orders with customized ribbon tags for events.
              </p>
            </div>
          </div>
          <a
            href="https://instagram.com/saylipss.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="sm">
              DM on Instagram
            </Button>
          </a>
        </div>
      </Section>
    </div>
  );
};
