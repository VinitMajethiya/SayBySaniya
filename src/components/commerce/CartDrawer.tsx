import React, { useState, useEffect } from 'react';
import { Doodle } from '@/components/brand/Doodle';
import { PriceTag } from './PriceTag';
import { useCartStore } from '@/store/cart';
import { ProductImage } from './ProductImage';
import { executeSocialOrder } from '@/lib/socialOrder';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { trackEvent } from '@/lib/analytics';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const { settings } = useSiteSettings();
  const [giftNote, setGiftNote] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Escape key to close cart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  const totalPaise = items.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  const cartSnapshotItems = items.map((i) => ({
    id: i.product.id,
    slug: i.product.slug,
    name: i.product.name,
    size: i.product.size || '15g',
    price: i.product.price,
    quantity: i.quantity,
  }));

  const handleOrder = async (channel: 'whatsapp' | 'instagram') => {
    setIsSubmitting(true);
    trackEvent('begin_checkout', { subtotal_paise: totalPaise });
    trackEvent(`${channel}_order_click`, { items_count: items.length });

    try {
      await executeSocialOrder({
        channel,
        items: cartSnapshotItems,
        totalPaise,
        giftNote,
        customerName: customerName.trim(),
        whatsappNumberOverride: settings.whatsappNumber,
        instagramHandleOverride: settings.instagramHandle,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-ivory h-full shadow-2xl border-l border-hairline flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-hairline-b flex items-center justify-between bg-cream/50">
          <div className="flex items-center gap-2">
            <h2 id="cart-title" className="font-display text-xl font-semibold text-ink">
              Your Lip Care Cart
            </h2>
            <Doodle name="heart" size={16} className="text-heart" />
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-ink hover:text-heart hover:scale-105 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Doodle name="heart" size={36} className="text-heart/60" />
              <p className="font-display text-lg text-ink">
                Your cart is feeling dry.
              </p>
              <p className="text-sm text-ink-soft">
                Add some organic balms to give your lips some love! ♥
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-4 px-5 py-2.5 bg-ink text-cream rounded-pill text-xs uppercase tracking-button font-medium hover:bg-heart transition-colors"
              >
                Browse Flavors
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 rounded-card bg-cream/40 border border-hairline"
              >
                <div className="w-16 h-16 shrink-0 rounded bg-ivory border border-hairline overflow-hidden flex items-center justify-center">
                  <ProductImage
                    src={product.images && product.images[0]}
                    alt={product.name}
                    flavor={product.flavor}
                    accent={product.accent}
                    packaging={product.packaging}
                    category={product.category}
                    isOpen={false}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-display text-base font-semibold text-ink truncate">
                    {product.name}
                  </h4>
                  <div className="text-xs text-ink-soft mb-2">
                    <PriceTag amount={product.price} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-hairline rounded-pill px-2 py-0.5 bg-ivory">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="text-sm px-1.5 hover:text-heart"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-medium px-2">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="text-sm px-1.5 hover:text-heart"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-xs text-ink-soft underline hover:text-error"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-hairline-t bg-cream/50 space-y-4">
            {/* Optional Customer Name */}
            <div>
              <label
                htmlFor="customer-name"
                className="block text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-1"
              >
                Your Name (Optional):
              </label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ananya"
                className="w-full bg-ivory border border-hairline rounded p-2 text-xs text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-ink"
              />
            </div>

            {/* Gift Note */}
            <div>
              <label
                htmlFor="gift-note"
                className="block text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-1"
              >
                Gift Note / Special Request:
              </label>
              <textarea
                id="gift-note"
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="E.g. Please pack with ribbon for my friend's birthday!"
                rows={2}
                className="w-full bg-ivory border border-hairline rounded p-2 text-xs text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-ink"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-hairline-t">
              <span className="font-display text-lg font-medium text-ink">
                Subtotal:
              </span>
              <span className="font-sans text-lg font-semibold text-ink">
                {totalPaise > 0 ? (
                  <PriceTag amount={totalPaise} />
                ) : (
                  '₹[TBD]'
                )}
              </span>
            </div>

            {/* Ordering Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* WhatsApp Checkout */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleOrder('whatsapp')}
                className="w-full py-3 px-6 rounded-pill bg-ink text-cream font-sans uppercase text-xs tracking-button font-medium hover:bg-heart active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Order on WhatsApp</span>
                <Doodle name="heart" size={14} className="text-cream" />
              </button>

              {/* Instagram DM Checkout */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleOrder('instagram')}
                className="w-full py-2.5 px-6 rounded-pill border border-ink bg-ivory hover:bg-cream text-ink font-sans uppercase text-xs tracking-button font-medium active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Order on Instagram DM</span>
                <Doodle name="sparkle" size={13} className="text-heart" />
              </button>
            </div>

            <p className="text-[11px] text-center text-ink-soft">
              Direct handoff to Saniya · Enquiry logged &amp; opens chat instantly · No online payment needed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
