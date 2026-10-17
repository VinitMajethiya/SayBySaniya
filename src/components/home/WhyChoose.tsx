import React from 'react';
import { Section } from '@/components/layout/Section';
import { Doodle } from '@/components/brand/Doodle';

export const WhyChoose: React.FC = () => {
  const points = [
    {
      title: '100% Organic',
      description: 'Ingredients you can actually pronounce.',
      doodle: 'heart' as const,
      color: 'text-heart',
    },
    {
      title: 'Handmade in Small Batches',
      description: 'Every tin is poured by hand.',
      doodle: 'bow' as const,
      color: 'text-ink',
    },
    {
      title: 'Nourish + Tint',
      description: 'Care that also has a little color.',
      doodle: 'sparkle' as const,
      color: 'text-strawberry',
    },
    {
      title: 'Pocket-Sized',
      description: 'The slim slider tin fits anywhere.',
      doodle: 'star' as const,
      color: 'text-honey',
    },
  ];

  return (
    <Section
      bg="cream"
      eyebrow="WHY CHOOSE US"
      title="Why Choose Say By Saniya"
      subtitle="Homemade, organic lip care for every day. [TBD: owner to confirm claims]"
      headerCentered={true}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map((point, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-7 bg-ivory rounded-card border-hairline relative flex flex-col justify-between hover:shadow-subtle transition-shadow"
          >
            <div>
              <div className="w-12 h-12 rounded-full border border-hairline bg-cream flex items-center justify-center mb-5">
                <Doodle name={point.doodle} size={22} className={point.color} />
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
              <Doodle name="heart" size={10} className="text-heart" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
