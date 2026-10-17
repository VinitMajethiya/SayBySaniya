import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';
import { FloatingHearts } from '@/components/brand/FloatingHearts';
import { TinIllustration } from '@/components/commerce/TinIllustration';
import { Sticker } from '@/components/brand/Sticker';

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-cream border-hairline-b">
      {/* Drifting ambient hearts */}
      <FloatingHearts count={7} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-ivory border border-hairline shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-heart animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink">
                HOMEMADE · ORGANIC · SMALL-BATCH
              </span>
            </div>

            {/* Script & Display Headings */}
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                <span className="font-script text-3xl sm:text-4xl text-ink">
                  Say By Saniya
                </span>
                <Doodle name="bow" size={24} className="text-ink" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-semibold text-ink leading-[1.08] tracking-tight">
                Lip care, made by hand.{' '}
                <span className="italic font-normal block sm:inline">
                  Made for you.
                </span>
              </h1>
            </div>

            {/* Sub-copy from CONTENT.md */}
            <p className="text-base sm:text-lg text-ink-soft font-sans font-normal leading-relaxed max-w-[56ch] mx-auto lg:mx-0">
              <strong className="text-ink font-medium">Nourish. Tint. Love.</strong> Slim
              little tins of balm that live in your pocket and steal your heart.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/shop">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Shop the Collection
                </Button>
              </Link>
              <Link to="/our-story">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Trust bullet marks */}
            <div className="pt-6 border-hairline-t flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-ink-soft">
              <div className="flex items-center gap-1.5">
                <Doodle name="heart" size={12} className="text-heart" />
                <span>100% Organic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Doodle name="heart" size={12} className="text-heart" />
                <span>Hand-poured in Small Batches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Doodle name="heart" size={12} className="text-heart" />
                <span>Slim Pocket Slider Tin</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Tin Visual */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              {/* Decorative Double Hairline Frame per DESIGN.md §5 */}
              <div className="p-3 sm:p-4 rounded-card bg-ivory border-hairline shadow-subtle relative">
                <div className="absolute -inset-1.5 border border-hairline/60 rounded-[6px] pointer-events-none" />

                {/* Corner stickers */}
                <div className="absolute -top-3 -right-2 z-20">
                  <Sticker rotation={6} variant="strawberry">
                    BEST SELLER
                  </Sticker>
                </div>
                <div className="absolute -bottom-3 -left-2 z-20">
                  <Sticker rotation={-4} variant="heart">
                    NOURISH. TINT. LOVE.
                  </Sticker>
                </div>

                {/* Floating Tin Animation per DESIGN.md §8 */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [-6, 6, -6],
                        }
                  }
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-full"
                >
                  <TinIllustration
                    flavor="Strawberry"
                    accent="strawberry"
                    isOpen={true}
                  />
                </motion.div>
              </div>

              {/* Founder quote bubble under hero card */}
              <div className="mt-4 p-3 bg-ivory/80 border border-hairline rounded flex items-center justify-between text-xs text-ink-soft">
                <span className="italic">"Made by hand. Meant for you."</span>
                <span className="font-script text-base text-ink">~ Saniya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
