import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { PriceTag } from '@/components/commerce/PriceTag';
import { ProductImage } from '@/components/commerce/ProductImage';
import { Sticker } from '@/components/brand/Sticker';
import { Doodle } from '@/components/brand/Doodle';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/commerce/ProductCard';
import { SEO } from '@/components/common/SEO';
import { NotifyMeModal } from '@/components/commerce/NotifyMeModal';
import { AddToCartButton } from '@/components/commerce/AddToCartButton';
import { ProductReviews } from '@/components/commerce/ProductReviews';
import { executeSocialOrder } from '@/lib/socialOrder';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { trackEvent } from '@/lib/analytics';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, getProductBySlug, loading } = useProducts();
  const { settings } = useSiteSettings();

  const product = getProductBySlug(slug);

  const [quantity, setQuantity] = useState(1);
  const [isOpenView, setIsOpenView] = useState(true);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('ingredients');
  const [isOrdering, setIsOrdering] = useState(false);

  if (loading && !product) {
    return (
      <Section bg="cream" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Doodle name="sparkle" size={32} className="text-heart animate-spin mx-auto" />
          <p className="font-display text-xl text-ink">Loading Lip Care...</p>
        </div>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section bg="cream" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <Doodle name="heart" size={36} className="text-heart mx-auto" />
          <h2 className="font-display text-2xl font-semibold text-ink">
            Product Not Found
          </h2>
          <p className="text-sm text-ink-soft">
            This flavor might have slid away! Explore our active collection.
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={() => navigate('/shop')}>
              Back to Shop
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  const handleSocialOrder = async (channel: 'whatsapp' | 'instagram') => {
    setIsOrdering(true);
    trackEvent(`${channel}_order_click`, {
      product_name: product.name,
      quantity,
    });

    try {
      await executeSocialOrder({
        channel,
        items: [
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            size: product.size || '15g',
            price: product.price,
            quantity,
          },
        ],
        totalPaise: (product.price || 0) * quantity,
        whatsappNumberOverride: settings.whatsappNumber,
        instagramHandleOverride: settings.instagramHandle,
      });
    } finally {
      setIsOrdering(false);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const getGalleryToggleLabels = () => {
    switch (product.packaging) {
      case 'jar':
        return { openLabel: 'Lid off', closedLabel: 'Lid on' };
      case 'bottle':
        return { openLabel: 'Cap off', closedLabel: 'Capped' };
      default:
        return { openLabel: 'Open', closedLabel: 'Closed' };
    }
  };

  const getCategoryEyebrow = () => {
    switch (product.category) {
      case 'lip-mask':
        return 'OVER NIGHT LIP MASK';
      case 'lip-tint':
        return 'LIP TINT';
      case 'lip-gloss':
        return 'LIP GLOSS';
      default:
        return '100% ORGANIC & HOMEMADE LIP BALM';
    }
  };

  const accordions = [
    {
      id: 'ingredients',
      title: 'Full Ingredients',
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-ink-soft">
          {product.category === 'lip-balm' && (
            <p className="italic font-medium text-ink">100% Organic &amp; Homemade ingredients:</p>
          )}
          {product.ingredients.length > 0 && product.ingredients[0] !== '[TBD]' ? (
            <ul className="list-disc list-inside space-y-1">
              {product.ingredients.map((ing, idx) => (
                <li key={idx} className="capitalize">
                  {ing}
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-ink-soft">Ingredients: [TBD — To be confirmed with owner]</p>
          )}
        </div>
      ),
    },
    {
      id: 'howToUse',
      title: 'How to Use',
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-ink-soft">
          <p>{product.howToUse}</p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-ink-soft">
          <p>
            <strong>Handmade Items Policy:</strong> {settings.shippingNote}
          </p>
          <p>
            Due to the hygienic nature of homemade lip care, we cannot accept returns once opened. If your product arrives damaged in transit, please message us on WhatsApp with photos for an immediate replacement. ♥
          </p>
        </div>
      ),
    },
    {
      id: 'patchTest',
      title: 'Skin Patch Test & Allergy Advice',
      content: (
        <div className="p-3 bg-cream/70 border border-hairline rounded space-y-1.5 text-xs text-ink-soft">
          <p className="font-medium text-ink flex items-center gap-1.5">
            <Doodle name="heart" size={12} className="text-heart" />
            <span>Patch Test Recommended</span>
          </p>
          <p>
            Even 100% natural and organic botanicals can cause sensitivity in rare cases. We recommend swatching a tiny amount on your inner wrist or jawline before first use. Discontinue if irritation occurs.
          </p>
        </div>
      ),
    },
  ];

  const { openLabel, closedLabel } = getGalleryToggleLabels();

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title={`${product.name} | Say By Saniya`}
        description={`${product.shortDescription} Nourish. Tint. Love.`}
        product={product}
        ogType="product"
      />

      {/* Breadcrumb Bar */}
      <div className="border-hairline-b bg-ivory/50 py-3">
        <Container>
          <nav className="flex items-center gap-2 text-xs font-sans text-ink-soft" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-ink">
              Shop
            </Link>
            <span>/</span>
            <span className="text-ink font-medium truncate">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* Main Product Hero */}
      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Gallery & Packaging Interactive View */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-card border-hairline bg-ivory p-6 sm:p-10 flex items-center justify-center overflow-hidden">
                <ProductImage
                  src={product.images && (isOpenView && product.images[1] ? product.images[1] : product.images[0])}
                  alt={`${product.name} packaging`}
                  flavor={product.flavor}
                  accent={product.accent}
                  packaging={product.packaging}
                  category={product.category}
                  isOpen={isOpenView}
                  className="w-full max-w-xs sm:max-w-sm transition-all duration-300"
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {product.badges.map((b, i) => (
                    <Sticker key={i} variant="ink">
                      {b}
                    </Sticker>
                  ))}
                  {product.status === 'limited-drop' && (
                    <Sticker variant="heart">
                      Limited Drop
                    </Sticker>
                  )}
                </div>
              </div>

              {/* Packaging State View Toggle */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOpenView(true)}
                  className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-button rounded-pill border transition-all ${
                    isOpenView
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-ivory text-ink border-hairline hover:border-ink'
                  }`}
                >
                  {openLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpenView(false)}
                  className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-button rounded-pill border transition-all ${
                    !isOpenView
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-ivory text-ink border-hairline hover:border-ink'
                  }`}
                >
                  {closedLabel}
                </button>
              </div>
            </div>

            {/* Right: Product Info & Commerce Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                    {getCategoryEyebrow()}
                  </span>
                  <span className="text-xs text-ink-soft">
                    Size: {product.size}
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-tight mb-2">
                  {product.name}
                </h1>

                <div className="text-xl sm:text-2xl font-sans font-semibold text-ink mb-4">
                  <PriceTag amount={product.price} />
                </div>

                <p className="text-sm sm:text-base text-ink-soft font-sans leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Flavor Notes */}
              <div className="pt-2 border-hairline-t">
                <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft block mb-2">
                  Flavor &amp; Scent Profile:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.flavorNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-pill bg-ivory border border-hairline text-xs font-sans text-ink capitalize"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Cart / Order Actions */}
              <div className="pt-4 border-hairline-t space-y-3">
                {product.status === 'coming-soon' ? (
                  <div className="p-4 bg-ivory border border-hairline rounded-card space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-ink">
                      <Doodle name="sparkle" size={18} className="text-heart" />
                      <span>This shade is dropping soon!</span>
                    </div>
                    <p className="text-xs text-ink-soft">
                      Reserve your notification spot to get a private WhatsApp ping when batches are ready.
                    </p>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => setNotifyModalOpen(true)}
                    >
                      Notify Me Upon Drop
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      {/* Quantity Selector */}
                      <div className="inline-flex items-center border border-ink rounded-pill px-3 py-2 bg-ivory">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-2 text-base font-medium text-ink hover:text-heart"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm font-sans font-semibold text-ink min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-2 text-base font-medium text-ink hover:text-heart"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="flex-grow">
                        <AddToCartButton
                          product={product}
                          quantity={quantity}
                          variant="primary"
                          fullWidth
                        />
                      </div>
                    </div>

                    {/* Direct Social Ordering Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {/* WhatsApp Direct Buy */}
                      <button
                        type="button"
                        disabled={isOrdering}
                        onClick={() => handleSocialOrder('whatsapp')}
                        className="w-full py-3 px-4 rounded-pill border border-ink bg-ivory hover:bg-cream text-ink font-sans uppercase text-xs tracking-button font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <span>Order on WhatsApp</span>
                        <Doodle name="heart" size={13} className="text-heart" />
                      </button>

                      {/* Instagram Direct Buy */}
                      <button
                        type="button"
                        disabled={isOrdering}
                        onClick={() => handleSocialOrder('instagram')}
                        className="w-full py-3 px-4 rounded-pill border border-hairline bg-ivory hover:border-ink text-ink font-sans uppercase text-xs tracking-button font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <span>Order on Instagram</span>
                        <Doodle name="sparkle" size={13} className="text-heart" />
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-ink-soft">
                      Orders save an enquiry &amp; open directly with Saniya · No online payment needed
                    </p>
                  </div>
                )}
              </div>

              {/* Accordions */}
              <div className="pt-4 border-hairline-t divide-y divide-hairline">
                {accordions.map((acc) => {
                  const isOpen = openAccordion === acc.id;
                  return (
                    <div key={acc.id} className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(acc.id)}
                        className="w-full flex items-center justify-between text-left py-1 text-sm font-display font-medium text-ink hover:text-heart transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span>{acc.title}</span>
                        <span className="text-base font-sans font-normal ml-2">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="pt-2 pb-1 text-xs sm:text-sm font-sans">
                          {acc.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Product Customer Reviews */}
              <ProductReviews
                productSlug={product.slug}
                productId={product.id}
                productName={product.name}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* "You May Also Like" Row */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-hairline-t bg-ivory">
          <Container>
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft block mb-1">
                DISCOVER MORE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Coming Soon Drop Notification Modal */}
      <NotifyMeModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        productName={product.name}
      />
    </div>
  );
};
