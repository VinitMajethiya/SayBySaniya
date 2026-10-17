import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';
import { SEO } from '@/components/common/SEO';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="About Us | Say By Saniya"
        description="Homemade, 100% organic lip care for every day. Hand-poured in small batches in slim pocket slider tins."
      />

      <Section
        bg="cream"
        eyebrow="OUR VALUES"
        title="Homemade, Organic Lip Care for Every Day"
        subtitle="Crafted by hand in small batches. Nourish. Tint. Love."
        headerCentered={true}
      >
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Values Grid - Strictly from CONTENT.md */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-ivory rounded-card border-hairline text-center space-y-3">
              <Doodle name="heart" size={28} className="text-heart mx-auto" />
              <h3 className="font-display text-lg font-semibold text-ink">
                100% Organic
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Ingredients you can actually pronounce.
              </p>
            </div>

            <div className="p-6 bg-ivory rounded-card border-hairline text-center space-y-3">
              <Doodle name="bow" size={28} className="text-ink mx-auto" />
              <h3 className="font-display text-lg font-semibold text-ink">
                Handmade in Small Batches
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Every tin is poured by hand.
              </p>
            </div>

            <div className="p-6 bg-ivory rounded-card border-hairline text-center space-y-3">
              <Doodle name="sparkle" size={28} className="text-strawberry mx-auto" />
              <h3 className="font-display text-lg font-semibold text-ink">
                Pocket-Sized
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                The slim slider tin fits anywhere.
              </p>
            </div>
          </div>

          {/* About Narrative with clear [TBD] placeholders */}
          <div className="p-8 sm:p-12 bg-ivory rounded-card border-hairline shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-hairline-b pb-4">
              <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                ABOUT THE BRAND
              </span>
              <Doodle name="heart" size={14} className="text-heart" />
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-snug">
              Lip care, made by hand. Made for you.
            </h3>

            <p className="text-sm sm:text-base text-ink-soft font-sans leading-relaxed">
              Nourish. Tint. Love. Slim little tins of balm that live in your pocket and steal your heart.
            </p>

            <div className="p-4 bg-cream/70 rounded border border-hairline space-y-2 text-xs sm:text-sm text-ink-soft">
              <p className="font-medium text-ink">
                [TBD: Saniya's brand philosophy and detailed about text — to be provided by owner]
              </p>
              <p className="italic text-[12px]">
                Owner to confirm brand values, certifications, and production details.
              </p>
            </div>

            <div className="pt-4 border-hairline-t flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-script text-2xl text-ink">
                Nourish. Tint. Love. ♥
              </span>
              <Link to="/shop">
                <Button variant="primary" size="md">
                  Shop the Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
