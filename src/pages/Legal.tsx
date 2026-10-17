import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Doodle } from '@/components/brand/Doodle';
import { SEO } from '@/components/common/SEO';

export const Legal: React.FC = () => {
  const { pathname } = useLocation();

  const getPageInfo = () => {
    switch (pathname) {
      case '/shipping':
        return {
          title: 'Shipping Policy',
          eyebrow: 'DELIVERY & DISPATCH',
          content: (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  1. Hand-Crafted Dispatch Times
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  [TBD by owner: Processing days, batch pouring schedule]. All Say By Saniya balms are hand-poured in small batches to preserve botanical freshness. Orders are typically prepared and dispatched within 2–3 business days.
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  2. Shipping Rates &amp; Couriers
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  [TBD by owner: Standard courier partners, flat rate charges across India, free shipping threshold]. We deliver all across India using tracked courier partners. Tracking numbers are shared directly on WhatsApp once your package is handed to the courier.
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  3. Cash on Delivery (COD) &amp; UPI
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  [TBD by owner: COD availability, verification process]. UPI payment is preferred for quick contactless dispatch.
                </p>
              </div>
            </div>
          ),
        };

      case '/returns':
        return {
          title: 'Returns & Replacement Policy',
          eyebrow: 'OUR GUARANTEE',
          content: (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  1. Hygiene &amp; Cosmetic Safety Policy
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  [TBD by owner: Exact return window, hygiene terms]. Due to the handmade, personal nature of lip care cosmetics, we cannot accept returns or exchanges for opened or used slider tins.
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  2. Damaged or Faulty Items on Arrival
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  If your order arrives damaged, leaking, or crushed during courier transit, we will immediately make it right! Please contact Saniya on WhatsApp within 48 hours of delivery with a photo of the parcel and defective tin. We will send a complimentary replacement tin without hassle. ♥
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  3. Order Cancellations
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  [TBD by owner: Timeframe before parcel dispatch]. You can cancel an order free of charge before it has been marked dispatched.
                </p>
              </div>
            </div>
          ),
        };

      case '/privacy':
        return {
          title: 'Privacy Policy',
          eyebrow: 'YOUR DATA',
          content: (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  1. Information We Collect
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  [TBD by owner]. When placing an order via our website or WhatsApp, we collect your name, phone number, shipping address, and optional email solely to fulfill your order and provide delivery tracking updates.
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  2. No Third-Party Data Selling
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  We will never sell, rent, or trade your personal details with third-party advertisers. Your contact information is only shared with shipping courier services to ensure prompt package delivery.
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  3. Drop Alert Newsletter
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  If you opt into drop notifications, we only send occasional announcements regarding new flavor batches or seasonal drops. You can unsubscribe anytime by clicking the link or messaging us directly.
                </p>
              </div>
            </div>
          ),
        };

      case '/terms':
      default:
        return {
          title: 'Terms of Service',
          eyebrow: 'LEGAL TERMS',
          content: (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  1. Handmade Product Variations
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  [TBD by owner]. Every slider tin is hand-poured in small batches using 100% natural, unrefined organic ingredients. Minor variations in surface texture, natural color tint, or scent strength may naturally occur between batches and are a hallmark of authentic handmade goods.
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  2. Pricing &amp; Currency
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  All prices are quoted in Indian Rupees (INR) and are subject to change based on raw organic ingredient harvest costs.
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-ink mb-1">
                  3. Order Confirmation
                </h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Orders submitted through the website storefront are confirmed via direct WhatsApp coordination with Saniya.
                </p>
              </div>
            </div>
          ),
        };
    }
  };

  const page = getPageInfo();

  const links = [
    { to: '/shipping', label: 'Shipping' },
    { to: '/returns', label: 'Returns' },
    { to: '/privacy', label: 'Privacy' },
    { to: '/terms', label: 'Terms' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title={`${page.title} | Say By Saniya`}
        description={`Read our ${page.title}. Homemade 100% organic lip care by Say By Saniya.`}
      />

      <Section
        bg="cream"
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle="Transparent policies for our handmade organic lip care customers."
        headerCentered={true}
      >
        <Container size="narrow">
          {/* Navigation tabs */}
          <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-xs font-sans uppercase font-medium tracking-button rounded-pill border transition-all ${
                  pathname === link.to
                    ? 'bg-ink text-cream border-ink'
                    : 'bg-ivory text-ink border-hairline hover:border-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mandatory Skin Patch Test Disclaimer Box */}
          <div className="mb-8 p-5 bg-ivory rounded-card border-hairline shadow-subtle border-l-4 border-l-heart">
            <div className="flex items-start gap-3">
              <Doodle name="heart" size={20} className="text-heart shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-display text-base font-semibold text-ink">
                  Important: Skin Patch Test Disclaimer
                </h4>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                  Our products are homemade with 100% organic ingredients. <strong>Do a patch test before first use. Discontinue if irritation occurs.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Policy Body */}
          <div className="bg-ivory rounded-card border-hairline p-6 sm:p-10 shadow-subtle">
            {page.content}

            <div className="mt-10 pt-6 border-hairline-t flex items-center justify-between text-xs text-ink-soft">
              <span>Have a specific question?</span>
              <Link to="/contact" className="underline hover:text-heart font-medium">
                Contact Saniya directly →
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
