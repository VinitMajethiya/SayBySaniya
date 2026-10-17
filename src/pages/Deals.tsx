import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { Doodle } from '@/components/brand/Doodle';
import { SEO } from '@/components/common/SEO';
import { useDeals } from '@/hooks/useDeals';
import { executeSocialOrder } from '@/lib/socialOrder';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Deals: React.FC = () => {
  const { deals, loading } = useDeals();
  const { settings } = useSiteSettings();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleOrderWithDeal = (code: string | null) => {
    executeSocialOrder({
      channel: 'whatsapp',
      items: [],
      totalPaise: 0,
      dealCode: code,
      whatsappNumberOverride: settings.whatsappNumber,
      instagramHandleOverride: settings.instagramHandle,
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Special Deals & Promotions | Say By Saniya"
        description="Exclusive seasonal discounts and pocket balm bundles from Say By Saniya. Homemade, organic lip care."
      />

      {/* Hero Header */}
      <section className="pt-12 pb-8 border-hairline-b bg-ivory/60 text-center">
        <Container>
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
              LIMITED TIME OFFERS
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">
              Special Deals &amp; Drops
            </h1>
            <p className="text-sm text-ink-soft leading-relaxed font-sans">
              Handcrafted in small batches. Mention your promo code when ordering directly with Saniya on WhatsApp or Instagram!
            </p>
          </div>
        </Container>
      </section>

      {/* Deals List */}
      <section className="py-12 sm:py-16">
        <Container>
          {loading ? (
            <div className="p-12 text-center text-ink-soft font-display">
              Finding active offers...
            </div>
          ) : deals.length === 0 ? (
            <div className="max-w-md mx-auto p-8 sm:p-12 bg-ivory rounded-card border border-hairline text-center space-y-4 shadow-sm">
              <Doodle name="bow" size={32} className="text-ink mx-auto" />
              <h2 className="font-display text-2xl font-semibold text-ink">
                No Active Sales Right Now
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Our fresh batches sell out quickly! Check back for seasonal holiday drops or message Saniya on Instagram for custom orders. ♥
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to="/shop"
                  className="px-5 py-2.5 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all"
                >
                  Browse Shop
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-6 bg-ivory rounded-card border-hairline flex flex-col justify-between space-y-6 hover:shadow-subtle hover:border-ink transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-pill bg-strawberry text-ink text-[11px] font-sans font-semibold uppercase tracking-wider">
                        {deal.dealType === 'percent_off'
                          ? `${deal.discountValue}% OFF`
                          : deal.dealType === 'flat_off'
                          ? `₹${(deal.discountValue / 100).toLocaleString('en-IN')} OFF`
                          : 'EXCLUSIVE DEAL'}
                      </span>
                      {deal.endsAt && (
                        <span className="text-[11px] font-sans text-ink-soft">
                          Ends: {new Date(deal.endsAt).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-2xl font-semibold text-ink mb-2">
                      {deal.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-ink-soft font-sans leading-relaxed mb-4">
                      {deal.description || 'Special limited-run discount on our handcrafted organic lip care.'}
                    </p>

                    {deal.code && (
                      <div className="p-3 bg-cream/70 border border-hairline rounded flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-sans text-ink-soft block">
                            Promo Code
                          </span>
                          <span className="font-mono text-sm font-bold text-ink tracking-wider">
                            {deal.code}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(deal.code!)}
                          className="px-3 py-1 rounded-pill bg-ivory border border-hairline text-xs font-sans font-medium text-ink hover:border-ink active:scale-95 transition-all"
                        >
                          {copiedCode === deal.code ? 'Copied! ✓' : 'Copy Code'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-hairline-t space-y-2">
                    <button
                      type="button"
                      onClick={() => handleOrderWithDeal(deal.code)}
                      className="w-full py-3 px-4 rounded-pill bg-ink text-cream font-sans uppercase text-xs tracking-button font-medium hover:bg-heart active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Claim on WhatsApp</span>
                      <Doodle name="heart" size={13} className="text-cream" />
                    </button>

                    <Link
                      to="/shop"
                      className="block text-center text-xs text-ink-soft hover:text-ink underline py-1"
                    >
                      Browse Eligible Flavors
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};
