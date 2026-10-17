import React, { useState, useEffect } from 'react';
import { Section } from '@/components/layout/Section';
import { Doodle } from '@/components/brand/Doodle';
import { supabase } from '@/lib/supabase';
import { DEFAULT_ABOUT_BRAND, type AboutBrandData, type AboutValueCard } from '@/types/brand';

const doodleColorMap: Record<string, string> = {
  heart: 'text-heart',
  bow: 'text-ink',
  sparkle: 'text-strawberry',
  star: 'text-honey',
};

export const WhyChoose: React.FC = () => {
  const [data, setData] = useState<AboutBrandData>(DEFAULT_ABOUT_BRAND);

  useEffect(() => {
    async function loadWhyChooseSettings() {
      try {
        const { data: dbData, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'about_brand')
          .maybeSingle();

        if (error) throw error;
        if (dbData && dbData.value) {
          const val = dbData.value as unknown as Partial<AboutBrandData>;
          setData((prev) => ({
            ...prev,
            ...val,
            cards: val.cards && val.cards.length > 0 ? val.cards : prev.cards,
          }));
        }
      } catch (err) {
        console.warn('[WhyChoose] Using default brand value cards:', err);
      }
    }

    loadWhyChooseSettings();
  }, []);

  const cards: AboutValueCard[] =
    data.cards && data.cards.length > 0 ? data.cards : DEFAULT_ABOUT_BRAND.cards;

  const getGridCols = (count: number) => {
    if (count <= 1) return 'grid-cols-1 max-w-md mx-auto';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <Section
      bg="cream"
      eyebrow={data.whyChooseEyebrow || 'WHY CHOOSE US'}
      title={data.whyChooseTitle || 'Why Choose Say By Saniya'}
      subtitle={data.whyChooseSubtitle || 'Homemade, organic lip care for every day. Nourish. Tint. Love.'}
      headerCentered={true}
    >
      <div className={`grid ${getGridCols(cards.length)} gap-6`}>
        {cards.map((point, idx) => {
          const colorClass = doodleColorMap[point.doodle] || 'text-heart';
          return (
            <div
              key={point.id || idx}
              className="p-6 sm:p-7 bg-ivory rounded-card border-hairline relative flex flex-col justify-between hover:shadow-subtle transition-shadow"
            >
              <div>
                <div className="w-12 h-12 rounded-full border border-hairline bg-cream flex items-center justify-center mb-5">
                  <Doodle name={point.doodle} size={22} className={colorClass} />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed font-sans">
                  {point.description}
                </p>
              </div>

              <div className="pt-6 border-hairline-t flex items-center justify-between text-[10px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mt-6">
                <span>POINT #{idx + 1}</span>
                <Doodle name={point.doodle || 'heart'} size={10} className="text-heart" />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
