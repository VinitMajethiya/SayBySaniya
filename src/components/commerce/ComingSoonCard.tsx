import React, { useState } from 'react';
import { Sticker } from '@/components/brand/Sticker';
import { Doodle } from '@/components/brand/Doodle';

interface ComingSoonCardProps {
  title?: string;
  body?: string;
  className?: string;
  onNotify?: (email: string) => void;
}

export const ComingSoonCard: React.FC<ComingSoonCardProps> = ({
  title = 'Future Favorites',
  body = 'New lip tints & balms coming soon.',
  className = '',
  onNotify,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (onNotify) onNotify(email);
    setIsSubmitted(true);
  };

  return (
    <div
      className={`relative bg-ivory border-hairline rounded-card p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-subtle ${className}`}
      style={{
        background:
          'linear-gradient(135deg, var(--ivory) 0%, rgba(233, 183, 201, 0.15) 100%)',
      }}
    >
      {/* Decorative Stamp */}
      <div className="flex items-center justify-between mb-6">
        <Sticker rotation={-3} variant="heart">
          COMING SOON
        </Sticker>
        <Doodle name="sparkle" size={24} className="text-heart opacity-80" />
      </div>

      <div className="my-auto py-4">
        <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft block mb-1">
          THE NEXT CHAPTER
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-2">
          {title}
        </h3>
        <p className="text-sm text-ink-soft leading-relaxed max-w-sm mb-6">
          {body}
        </p>

        {isSubmitted ? (
          <div className="flex items-center gap-2 text-ink py-2 text-sm font-sans">
            <Doodle name="heart" size={18} className="text-heart" />
            <span>You're on the VIP list for the drop! ♥</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="bg-cream/70 border-b border-ink px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-heart transition-colors flex-grow"
            />
            <button
              type="submit"
              className="text-xs uppercase tracking-button font-medium px-4 py-2 bg-ink text-cream rounded-pill hover:bg-heart transition-colors shrink-0"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>

      <div className="pt-4 border-hairline-t flex items-center justify-between text-xs text-ink-soft">
        <span>Handmade with love in small batches</span>
        <Doodle name="bow" size={18} className="text-ink-soft" />
      </div>
    </div>
  );
};
