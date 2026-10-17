import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';
import { SEO } from '@/components/common/SEO';
import { supabase } from '@/lib/supabase';
import type { StoryContentData } from '@/components/admin/AdminStory';

const DEFAULT_STORY: StoryContentData = {
  eyebrow: 'OUR STORY',
  title: 'From the Kitchen to Your Pocket',
  subtitle: 'Homemade, organic lip care for every day.',
  quote: '"It started in a kitchen, with a few ingredients and one very dry pair of lips."',
  story_paragraphs: [
    'Say By Saniya started right in my home kitchen in India. I had struggled for years with chronic dry, chapped lips and could never find a commercial balm that actually healed without leaving a waxy or chemical film.',
    'I started experimenting with pure unrefined beeswax, golden raw honey, cold-pressed sweet almond oil, and natural strawberry essences. After dozens of hand-poured batches and gifting them to family and close friends, everyone kept asking for refills.',
    'Today, every single pocket-sized slider tin, overnight mask jar, and velvety tint is still crafted in small batches with genuine care, clean ingredients, and zero shortcuts. Nourish. Tint. Love.',
  ],
  hero_image: '',
  hero_caption: 'Saniya in her kitchen studio hand-pouring organic balms',
  instagram_handle: 'saylipss.co',
  gallery: [],
};

export const OurStory: React.FC = () => {
  const [story, setStory] = useState<StoryContentData>(DEFAULT_STORY);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStorySettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'our_story')
          .maybeSingle();

        if (error) throw error;
        if (data && data.value) {
          const val = data.value as unknown as Partial<StoryContentData>;
          setStory((prev) => ({
            ...prev,
            ...val,
            story_paragraphs:
              val.story_paragraphs && val.story_paragraphs.length > 0
                ? val.story_paragraphs
                : prev.story_paragraphs,
            gallery: val.gallery || [],
          }));
        }
      } catch (err) {
        console.warn('Using default Our Story content:', err);
      }
    }

    fetchStorySettings();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title={`${story.title} | Say By Saniya`}
        description={story.subtitle || "Our story: Homemade, organic lip care for every day. Say By Saniya (@saylipss.co)."}
      />

      <Section
        bg="cream"
        eyebrow={story.eyebrow}
        title={story.title}
        subtitle={story.subtitle}
        headerCentered={true}
      >
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Visual Frame / Saniya Hero Portrait */}
          <div className="p-4 sm:p-6 bg-ivory rounded-card border-hairline shadow-subtle flex flex-col items-center text-center">
            <div className="w-full max-w-md aspect-[4/3] bg-cream rounded border border-hairline flex flex-col items-center justify-center relative overflow-hidden group">
              {story.hero_image ? (
                <img
                  src={story.hero_image}
                  alt="Saniya — Founder of Say By Saniya"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="p-6 flex flex-col items-center justify-center">
                  <Doodle name="bow" size={36} className="text-ink mb-2" />
                  <span className="font-script text-3xl sm:text-4xl text-ink">
                    Say By Saniya
                  </span>
                  <span className="text-xs text-ink-soft uppercase tracking-eyebrow mt-1">
                    @{story.instagram_handle}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center gap-2 text-xs text-ink-soft font-sans">
              <Doodle name="heart" size={12} className="text-heart" />
              <span>{story.hero_caption || 'Made with ♥ by hand in small batches'}</span>
            </div>
          </div>

          {/* Story Content */}
          <div className="space-y-6 text-sm sm:text-base font-sans text-ink-soft leading-relaxed bg-ivory p-6 sm:p-10 rounded-card border-hairline">
            {story.quote && (
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight">
                {story.quote}
              </h3>
            )}

            <div className="space-y-4 pt-2">
              {story.story_paragraphs.map((para, idx) => (
                <p key={idx} className="text-ink leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-ink-soft italic pt-3 border-hairline-t">
              Each slim slider tin, nourishing mask, and velvety tint is hand-poured in small batches, made with organic ingredients, and crafted to nourish, tint, and love.
            </p>

            <div className="pt-6 border-hairline-t flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href={`https://instagram.com/${story.instagram_handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-ink underline hover:text-heart transition-colors"
              >
                Follow on Instagram @{story.instagram_handle.replace('@', '')} →
              </a>
              <Link to="/shop">
                <Button variant="primary">Shop the Collection</Button>
              </Link>
            </div>
          </div>

          {/* SANIYA'S PHOTO GALLERY / FREE SPACE */}
          {story.gallery && story.gallery.length > 0 && (
            <div className="space-y-6 pt-6">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                  BEHIND THE SCENES
                </span>
                <h3 className="font-display text-2xl font-semibold text-ink">
                  Kitchen, Studio &amp; Small Batches
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {story.gallery.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo.url)}
                    className="group bg-ivory rounded-card border border-hairline overflow-hidden shadow-subtle hover:border-ink hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="aspect-[4/3] w-full bg-cream overflow-hidden relative">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {photo.tag && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-ivory/90 backdrop-blur-sm border border-hairline text-[9px] font-sans uppercase font-semibold text-ink">
                          {photo.tag}
                        </span>
                      )}
                    </div>
                    {photo.caption && (
                      <div className="p-3 bg-ivory text-xs font-sans text-ink-soft">
                        <p className="line-clamp-2">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-cream text-lg font-mono p-2 hover:text-heart"
            >
              ✕ Close
            </button>
            <img
              src={selectedPhoto}
              alt="Expanded view"
              className="max-h-[85vh] max-w-full object-contain rounded-card border border-hairline shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
