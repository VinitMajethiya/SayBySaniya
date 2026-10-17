import React from 'react';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/layout/Marquee';
import { FeaturedFlavors } from '@/components/home/FeaturedFlavors';
import { WhyChoose } from '@/components/home/WhyChoose';
import { StoryTeaser } from '@/components/home/StoryTeaser';
import { MemeBlock } from '@/components/brand/MemeBlock';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { TestimonialStrip } from '@/components/home/TestimonialStrip';
import { DealsStrip } from '@/components/home/DealsStrip';
import { useProducts } from '@/hooks/useProducts';
import { SEO } from '@/components/common/SEO';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { TinIntroAnimation } from '@/components/home/TinIntroAnimation';

export const Home: React.FC = () => {
  const { products } = useProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Opening Slider Tin Intro Animation (first visit per session on Home only) */}
      <TinIntroAnimation />

      <SEO
        title="Say By Saniya | Homemade Organic Lip Balm"
        description="Handmade, 100% organic lip balms and tints in pocket-sized tins. Strawberry Jam, Honey Butter, Vanilla Silk. Nourish. Tint. Love."
      />
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Marquee Strip */}
      <Marquee />

      {/* 3. Special Deals Strip (renders if active deals exist) */}
      <DealsStrip />

      {/* 4. Featured Flavors (dynamically loaded from Supabase) */}
      <ScrollReveal>
        <FeaturedFlavors products={products} />
      </ScrollReveal>

      {/* 4. Why Choose Say By Saniya */}
      <ScrollReveal>
        <WhyChoose />
      </ScrollReveal>

      {/* 5. Loved by Real Lips (Community Testimonials from DB) */}
      <ScrollReveal>
        <TestimonialStrip />
      </ScrollReveal>

      {/* 6. Founder Story Teaser */}
      <ScrollReveal>
        <StoryTeaser />
      </ScrollReveal>

      {/* 7. Playful Instagram Meme Block */}
      <ScrollReveal>
        <MemeBlock />
      </ScrollReveal>

      {/* 8. Newsletter & Drop Notification */}
      <ScrollReveal>
        <NewsletterSection />
      </ScrollReveal>
    </div>
  );
};
