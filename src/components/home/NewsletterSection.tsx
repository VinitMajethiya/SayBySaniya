import React, { useState } from 'react';
import { Section } from '@/components/layout/Section';
import { Doodle } from '@/components/brand/Doodle';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSuccess(true);
    }
  };

  return (
    <Section bg="ivory" className="border-hairline-t">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <Doodle name="bow" size={32} className="text-ink mx-auto" />
        <p className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
          VIP CLUB
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          Be first to the next drop
        </h2>
        <p className="text-sm sm:text-base text-ink-soft font-sans leading-relaxed">
          New flavors, tints and limited drops, straight to your inbox. No
          spam, promise ♥
        </p>

        {isSuccess ? (
          <div className="p-4 bg-cream border border-hairline rounded flex items-center justify-center gap-2 text-sm text-ink font-sans">
            <Doodle name="heart" size={16} className="text-heart" />
            <span>You're on the list! Saniya will notify you first. ♥</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-grow bg-cream border-b-2 border-ink px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-heart transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-ink text-cream rounded-pill font-sans uppercase text-xs tracking-button font-medium hover:bg-heart active:scale-95 transition-all shrink-0"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </Section>
  );
};
