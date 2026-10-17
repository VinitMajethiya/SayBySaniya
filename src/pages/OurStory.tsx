import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';
import { SEO } from '@/components/common/SEO';

export const OurStory: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Our Story | Say By Saniya"
        description="Our story: It started in a kitchen, with a few ingredients and one very dry pair of lips. Say By Saniya (@saylipss.co)."
      />

      <Section
        bg="cream"
        eyebrow="OUR STORY"
        title="From the Kitchen to Your Pocket"
        subtitle="Homemade, organic lip care for every day."
        headerCentered={true}
      >
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Visual Frame */}
          <div className="p-4 sm:p-6 bg-ivory rounded-card border-hairline shadow-subtle flex flex-col items-center text-center">
            <div className="w-full max-w-sm aspect-[4/3] bg-cream rounded border border-hairline flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <Doodle name="bow" size={36} className="text-ink mb-2" />
              <span className="font-script text-3xl sm:text-4xl text-ink">
                Say By Saniya
              </span>
              <span className="text-xs text-ink-soft uppercase tracking-eyebrow mt-1">
                @saylipss.co
              </span>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs text-ink-soft font-sans">
              <Doodle name="heart" size={12} className="text-heart" />
              <span>Made with ♥ by hand</span>
            </div>
          </div>

          {/* Story Content strictly from CONTENT.md */}
          <div className="space-y-6 text-sm sm:text-base font-sans text-ink-soft leading-relaxed bg-ivory p-6 sm:p-10 rounded-card border-hairline">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight">
              "It started in a kitchen, with a few ingredients and one very dry pair of lips."
            </h3>

            <div className="p-5 bg-cream/70 rounded border border-hairline space-y-3 text-xs sm:text-sm text-ink-soft">
              <p className="font-medium text-ink">
                [TBD: Saniya's real founder story — awaiting owner's text]
              </p>
              <p>
                [TBD: Details on how Saniya started, what inspired the flavors, and the story behind @saylipss.co.]
              </p>
              <p className="italic text-[12px]">
                Owner to confirm founder story, launch timeline, and background notes.
              </p>
            </div>

            <p className="text-sm text-ink-soft">
              Until then, each slim slider tin is hand-poured in small batches, made with 100% organic ingredients, and crafted to nourish, tint, and love.
            </p>

            <div className="pt-6 border-hairline-t flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href="https://instagram.com/saylipss.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-ink underline hover:text-heart transition-colors"
              >
                Follow on Instagram @saylipss.co →
              </a>
              <Link to="/shop">
                <Button variant="primary">Shop the Collection</Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
