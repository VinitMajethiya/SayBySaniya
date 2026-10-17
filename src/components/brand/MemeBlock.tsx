import React, { useState, useEffect } from 'react';
import { Doodle } from './Doodle';
import { supabase } from '@/lib/supabase';
import { DEFAULT_INSTAGRAM_MOOD, type InstagramMoodData } from '@/types/brand';

export const MemeBlock: React.FC = () => {
  const [mood, setMood] = useState<InstagramMoodData>(DEFAULT_INSTAGRAM_MOOD);

  useEffect(() => {
    async function loadMood() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'instagram_mood')
          .maybeSingle();

        if (error) throw error;
        if (data && data.value) {
          const val = data.value as unknown as Partial<InstagramMoodData>;
          setMood((prev) => ({
            ...prev,
            ...val,
            postUrl: val.postUrl || prev.postUrl,
          }));
        }
      } catch (err) {
        console.warn('[MemeBlock] Using default mood content:', err);
      }
    }

    loadMood();
  }, []);

  if (!mood.isActive) {
    return null;
  }

  // Helper to highlight specific text in headline if specified
  const renderHeadline = () => {
    const rawHeadline = mood.headline || DEFAULT_INSTAGRAM_MOOD.headline;
    const highlight = mood.highlightText?.trim();

    if (!highlight || !rawHeadline.includes(highlight)) {
      return <span>{rawHeadline}</span>;
    }

    const parts = rawHeadline.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="text-heart underline decoration-wavy underline-offset-4">
          {highlight}
        </span>
        {parts.slice(1).join(highlight)}
      </>
    );
  };

  const instagramTargetUrl =
    mood.postUrl && mood.postUrl.startsWith('http')
      ? mood.postUrl
      : `https://www.instagram.com/${(mood.postUrl || 'saylipss.co').replace('@', '').replace(/^\/+/, '')}`;

  return (
    <div className="py-12 bg-cream border-hairline-b overflow-hidden select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <a
          href={instagramTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open post on Instagram"
          className="group block p-6 sm:p-8 bg-ivory rounded-card border-hairline shadow-subtle hover:border-ink hover:shadow-md transition-all relative overflow-hidden"
        >
          {/* Playful Doodled Hearts */}
          <div className="absolute top-2 left-4 text-heart rotate-12 transition-transform group-hover:scale-110">
            <Doodle name="heart" size={20} />
          </div>
          <div className="absolute bottom-3 right-6 text-heart -rotate-12 transition-transform group-hover:scale-110">
            <Doodle name="heart" size={24} />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Left: Punchy Meme Text in Archivo Black */}
            <div className="space-y-3 text-center md:text-left max-w-md">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft bg-cream px-2.5 py-0.5 rounded-pill border border-hairline inline-flex items-center gap-1">
                  <span>{mood.eyebrow || 'INSTAGRAM MOOD'}</span>
                  <span className="text-heart">♥</span>
                </span>
                <span className="text-[10px] text-ink-soft/70 font-sans group-hover:text-heart transition-colors flex items-center gap-0.5">
                  <span>Tap to view post</span>
                  <span>↗</span>
                </span>
              </div>

              <h3 className="font-meme text-2xl sm:text-3xl text-ink leading-tight uppercase tracking-tight group-hover:text-ink transition-colors">
                {renderHeadline()}
              </h3>

              <p className="font-display italic text-base sm:text-lg text-ink-soft">
                {mood.subtitle || 'Me & my Say By Saniya lip balm against the world. ♥'}
              </p>
            </div>

            {/* Right: Thumbnail photo or speech bubble badge */}
            <div className="shrink-0 flex flex-col items-center">
              {mood.imageUrl ? (
                <div className="w-24 sm:w-28 aspect-square rounded-card border border-hairline overflow-hidden relative shadow-sm group-hover:rotate-0 rotate-2 transition-transform bg-cream">
                  <img
                    src={mood.imageUrl}
                    alt="Instagram Post Thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-2 py-1 rounded-full bg-cream text-ink text-[10px] font-sans font-semibold uppercase tracking-wider shadow">
                      View ↗
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 bg-cream border-hairline rounded-card rotate-2 group-hover:rotate-0 transition-transform text-center shadow-xs">
                  <span className="font-meme text-xl sm:text-2xl text-ink block leading-none mb-1">
                    {mood.badgeTitle || 'YES SIR.'}
                  </span>
                  <span className="text-[11px] font-sans uppercase tracking-button text-ink-soft block">
                    {mood.badgeSubtitle || '100% Organic & Homemade'}
                  </span>
                  <span className="text-[10px] font-sans font-medium text-heart block mt-1">
                    Open Reel ↗
                  </span>
                </div>
              )}
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
