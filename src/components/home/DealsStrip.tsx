import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Doodle } from '@/components/brand/Doodle';
import { useDeals } from '@/hooks/useDeals';

export const DealsStrip: React.FC = () => {
  const { deals } = useDeals();

  if (!deals || deals.length === 0) return null;

  const featuredDeal = deals[0];

  return (
    <Section bg="ivory" className="py-8 sm:py-10 border-hairline-y">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-cream/70 rounded-card border-hairline flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-strawberry text-ink text-[10px] font-sans font-semibold uppercase tracking-wider">
              {featuredDeal.dealType === 'percent_off'
                ? `${featuredDeal.discountValue}% OFF SALE`
                : 'SPECIAL PROMO'}
            </span>
            {featuredDeal.code && (
              <span className="font-mono text-xs font-bold text-ink">
                Use code: {featuredDeal.code}
              </span>
            )}
          </div>

          <h3 className="font-display text-2xl font-semibold text-ink">
            {featuredDeal.title}
          </h3>

          <p className="text-xs sm:text-sm text-ink-soft max-w-lg leading-relaxed">
            {featuredDeal.description || 'Limited-batch seasonal discount on our pocket slider tins.'}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link
            to="/deals"
            className="px-6 py-3 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all flex items-center gap-2 shadow-sm"
          >
            <span>View All Deals</span>
            <Doodle name="heart" size={12} className="text-cream" />
          </Link>
        </div>
      </div>
    </Section>
  );
};
