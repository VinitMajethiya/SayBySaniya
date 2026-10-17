import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';

export const StoryTeaser: React.FC = () => {
  return (
    <Section bg="ivory" className="border-hairline-t border-hairline-b">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Visual Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative p-3 pb-8 bg-cream border-hairline rounded-card shadow-subtle -rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm w-full">
            <div className="w-full aspect-[4/5] bg-ivory border border-hairline rounded flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <Doodle name="bow" size={32} className="text-ink mb-3" />
              <div className="font-script text-3xl text-ink mb-1">
                Say By Saniya
              </div>
              <p className="text-xs text-ink-soft max-w-[200px]">
                Homemade, organic lip care for every day.
              </p>
              <div className="absolute bottom-4 flex items-center gap-1 text-[11px] text-ink-soft font-sans">
                <Doodle name="heart" size={12} className="text-heart" />
                <span>Small batch</span>
              </div>
            </div>
            <div className="pt-3 text-center">
              <span className="font-script text-xl text-ink">
                Made with ♥ by hand
              </span>
            </div>
          </div>
        </div>

        {/* Right: Story Copy from CONTENT.md */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <p className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
            BEHIND THE TIN
          </p>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-semibold text-ink leading-tight">
            "It started in a kitchen, with a few ingredients and one very dry
            pair of lips."
          </h2>

          <p className="text-xs sm:text-sm text-ink-soft italic font-sans max-w-[54ch] mx-auto lg:mx-0 p-3 bg-cream rounded border border-hairline">
            [TBD: replace with Saniya's real story — awaiting details from owner]
          </p>

          <div className="pt-2">
            <Link to="/our-story">
              <Button variant="secondary" size="md">
                Read Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
};
