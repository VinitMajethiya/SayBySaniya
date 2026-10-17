import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';
import { supabase } from '@/lib/supabase';

interface TeaserData {
  eyebrow: string;
  heading: string;
  body: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  caption: string;
  heroImage: string;
}

const DEFAULT_TEASER: TeaserData = {
  eyebrow: 'BEHIND THE TIN',
  heading: '"It started in a kitchen, with a few ingredients and one very dry pair of lips."',
  body: 'Say by Saniya started with my own struggle with dry lips. For years, I tried everything, but nothing worked. Every pocket-sized slider tin, mask, and tint is hand-crafted in small batches with unrefined organic beeswax, raw honey, and cold-pressed plant oils.',
  ctaText: 'Read Our Story',
  ctaLink: '/our-story',
  badge: 'Small batch',
  caption: 'Made with ♥ by hand',
  heroImage: '',
};

export const StoryTeaser: React.FC = () => {
  const [teaser, setTeaser] = useState<TeaserData>(DEFAULT_TEASER);

  useEffect(() => {
    async function loadTeaserSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'our_story')
          .maybeSingle();

        if (error) throw error;
        if (data && data.value) {
          const val = data.value as any;

          // Intelligently fallback from full story content if teaser-specific keys aren't set
          const heading =
            val.teaser_heading ||
            val.quote ||
            DEFAULT_TEASER.heading;

          let body = val.teaser_body;
          if (!body && val.story_paragraphs && val.story_paragraphs.length > 0) {
            body = val.story_paragraphs[0].trim();
          }
          if (!body) {
            body = DEFAULT_TEASER.body;
          }

          setTeaser({
            eyebrow: val.teaser_eyebrow || DEFAULT_TEASER.eyebrow,
            heading,
            body,
            ctaText: val.teaser_cta_text || DEFAULT_TEASER.ctaText,
            ctaLink: val.teaser_cta_link || DEFAULT_TEASER.ctaLink,
            badge: val.teaser_badge || DEFAULT_TEASER.badge,
            caption: val.teaser_caption || DEFAULT_TEASER.caption,
            heroImage: val.hero_image || '',
          });
        }
      } catch (err) {
        console.warn('[StoryTeaser] Using default teaser content:', err);
      }
    }

    loadTeaserSettings();
  }, []);

  return (
    <Section bg="ivory" className="border-hairline-t border-hairline-b">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Visual Frame (Polaroid Card) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative p-3 pb-8 bg-cream border-hairline rounded-card shadow-subtle -rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm w-full group">
            <div className="w-full aspect-[4/5] bg-ivory border border-hairline rounded flex flex-col items-center justify-center relative overflow-hidden">
              {teaser.heroImage ? (
                <img
                  src={teaser.heroImage}
                  alt="Say By Saniya - Handmade Organic Lip Care"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="p-6 text-center flex flex-col items-center justify-center">
                  <Doodle name="bow" size={32} className="text-ink mb-3" />
                  <div className="font-script text-3xl text-ink mb-1">
                    Say By Saniya
                  </div>
                  <p className="text-xs text-ink-soft max-w-[200px]">
                    Homemade, organic lip care for every day.
                  </p>
                  <div className="absolute bottom-4 flex items-center gap-1 text-[11px] text-ink-soft font-sans">
                    <Doodle name="heart" size={12} className="text-heart" />
                    <span>{teaser.badge}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-3 text-center">
              <span className="font-script text-xl text-ink">
                {teaser.caption}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Story Teaser Copy */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <p className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
            {teaser.eyebrow}
          </p>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold text-ink leading-tight">
            {teaser.heading}
          </h2>

          <p className="text-xs sm:text-sm text-ink-soft font-sans max-w-[56ch] mx-auto lg:mx-0 p-4 bg-cream rounded border border-hairline leading-relaxed">
            {teaser.body}
          </p>

          <div className="pt-2">
            <Link to={teaser.ctaLink}>
              <Button variant="secondary" size="md">
                {teaser.ctaText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
};
