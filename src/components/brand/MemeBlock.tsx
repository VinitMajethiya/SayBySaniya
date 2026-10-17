import React from 'react';
import { Doodle } from './Doodle';

export const MemeBlock: React.FC = () => {
  return (
    <div className="py-12 bg-cream border-hairline-b overflow-hidden select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 bg-ivory rounded-card border-hairline shadow-subtle relative flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Playful Doodled Hearts */}
          <div className="absolute top-2 left-4 text-heart rotate-12">
            <Doodle name="heart" size={20} />
          </div>
          <div className="absolute bottom-3 right-6 text-heart -rotate-12">
            <Doodle name="heart" size={24} />
          </div>

          {/* Left: Punchy Meme Text in Archivo Black */}
          <div className="space-y-3 text-center md:text-left max-w-md">
            <span className="text-[10px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft bg-cream px-2 py-0.5 rounded-pill border border-hairline inline-block">
              INSTAGRAM MOOD
            </span>
            <h3 className="font-meme text-2xl sm:text-3xl text-ink leading-tight uppercase tracking-tight">
              "Reapply every 10 min?{' '}
              <span className="text-heart underline decoration-wavy">
                Nahi karenge.
              </span>
              "
            </h3>
            <p className="font-display italic text-base sm:text-lg text-ink-soft">
              Me &amp; my Say By Saniya lip balm against the world. ♥
            </p>
          </div>

          {/* Right: Speech bubble badge */}
          <div className="shrink-0 p-4 bg-cream border-hairline rounded-card rotate-2 hover:rotate-0 transition-transform text-center shadow-xs">
            <span className="font-meme text-xl text-ink block">YES SIR.</span>
            <span className="text-[11px] font-sans uppercase tracking-button text-ink-soft">
              100% Organic &amp; Homemade
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
