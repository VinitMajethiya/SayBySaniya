import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle = 'This page is being lovingly handcrafted for Phase 2.',
  badge = 'COMING SOON',
}) => {
  return (
    <Section bg="cream" className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto space-y-4">
        <Doodle name="bow" size={32} className="text-ink mx-auto" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft bg-ivory border border-hairline px-3 py-1 rounded-pill inline-block">
          {badge}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-ink-soft font-sans">
          {subtitle}
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button variant="primary" size="md">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
};
