import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';

export const NotFound: React.FC = () => {
  return (
    <Section bg="cream" className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto space-y-4">
        <Doodle name="heart" size={40} className="text-heart mx-auto" />
        <span className="text-xs font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
          404 ERROR
        </span>
        <h1 className="font-display text-3xl font-semibold text-ink">
          This page ran away with someone's lip balm.
        </h1>
        <p className="text-sm text-ink-soft font-sans">
          Don't worry, our slider tins are safe. Let's get you back home! ♥
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    </Section>
  );
};
