import React from 'react';
import { Section } from '@/components/layout/Section';
import { Doodle } from '@/components/brand/Doodle';
import { useTestimonials } from '@/hooks/useTestimonials';

export const TestimonialStrip: React.FC = () => {
  const { testimonials, loading } = useTestimonials();

  if (loading && testimonials.length === 0) return null;

  return (
    <Section
      bg="ivory"
      eyebrow="COMMUNITY LOVE"
      title="Loved by Real Lips"
      subtitle="Pure organic softness, handcrafted and shared from our pocket tins to yours. ♥"
      headerCentered={true}
    >
      <div className="flex items-center justify-center gap-1.5 mb-8">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-honey text-lg">★</span>
        ))}
        <span className="text-xs font-sans font-medium text-ink ml-1.5">
          5.0 Average Rating
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-cream/60 rounded-card border-hairline flex flex-col justify-between relative hover:border-ink transition-colors"
          >
            <div>
              <div className="flex items-center gap-1 text-honey text-xs mb-3">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="font-serif italic text-sm text-ink leading-relaxed mb-4">
                "{item.quote}"
              </p>
            </div>

            <div className="pt-3 border-hairline-t flex items-center justify-between">
              <div>
                <p className="font-sans text-xs font-semibold text-ink">
                  {item.authorName}
                </p>
                {item.instagramHandle && (
                  <p className="text-[11px] font-sans text-ink-soft">
                    {item.instagramHandle}
                  </p>
                )}
              </div>
              <Doodle name="heart" size={12} className="text-heart" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
