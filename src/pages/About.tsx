import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';
import { SEO } from '@/components/common/SEO';
import { supabase } from '@/lib/supabase';
import { DEFAULT_ABOUT_BRAND, type AboutBrandData } from '@/types/brand';

export const About: React.FC = () => {
  const [about, setAbout] = useState<AboutBrandData>(DEFAULT_ABOUT_BRAND);

  useEffect(() => {
    async function fetchAboutSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'about_brand')
          .maybeSingle();

        if (error) throw error;
        if (data && data.value) {
          const val = data.value as unknown as Partial<AboutBrandData>;
          setAbout((prev) => ({
            ...prev,
            ...val,
            cards: val.cards && val.cards.length > 0 ? val.cards : prev.cards,
            storyParagraphs:
              val.storyParagraphs && val.storyParagraphs.length > 0
                ? val.storyParagraphs
                : prev.storyParagraphs,
          }));
        }
      } catch (err) {
        console.warn('[About] Using default brand content:', err);
      }
    }

    fetchAboutSettings();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title={`${about.title} | Say By Saniya`}
        description={about.subtitle || 'Homemade, 100% organic lip care for every day. Hand-poured in small batches in slim pocket slider tins.'}
      />

      <Section
        bg="cream"
        eyebrow={about.eyebrow}
        title={about.title}
        subtitle={about.subtitle}
        headerCentered={true}
      >
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Values Grid - Dynamic cards editable from Admin */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {about.cards.map((card) => (
              <div
                key={card.id}
                className="p-6 bg-ivory rounded-card border-hairline text-center space-y-3 shadow-subtle hover:border-ink transition-colors"
              >
                <Doodle
                  name={card.doodle}
                  size={28}
                  className={
                    card.doodle === 'heart'
                      ? 'text-heart mx-auto'
                      : card.doodle === 'sparkle'
                      ? 'text-strawberry mx-auto'
                      : card.doodle === 'star'
                      ? 'text-honey mx-auto'
                      : 'text-ink mx-auto'
                  }
                />
                <h3 className="font-display text-lg font-semibold text-ink">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* About Narrative Section - Fully editable from Admin */}
          <div className="p-8 sm:p-12 bg-ivory rounded-card border-hairline shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-hairline-b pb-4">
              <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                {about.mainBadge || 'ABOUT THE BRAND'}
              </span>
              <Doodle name="heart" size={14} className="text-heart" />
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-snug">
              {about.mainHeading || 'Lip care, made by hand. Made for you.'}
            </h3>

            {about.mainSubheading && (
              <p className="text-sm sm:text-base text-ink-soft font-sans leading-relaxed">
                {about.mainSubheading}
              </p>
            )}

            {/* Brand Philosophy / Story Paragraphs */}
            <div className="p-6 sm:p-8 bg-cream/70 rounded-card border border-hairline space-y-4 text-xs sm:text-sm text-ink leading-relaxed">
              {about.storyParagraphs && about.storyParagraphs.length > 0 ? (
                about.storyParagraphs.map((para, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed">
                  Every batch begins with raw, unrefined organic beeswax, nourishing shea butter, golden cold-pressed plant oils, and natural flavor essences. Hand-poured into our signature pocket slider tins.
                </p>
              )}
            </div>

            <div className="pt-4 border-hairline-t flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-script text-2xl text-ink">
                {about.footerTagline || 'Nourish. Tint. Love. ♥'}
              </span>
              <Link to={about.ctaLink || '/shop'}>
                <Button variant="primary" size="md">
                  {about.ctaText || 'Shop the Collection'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
