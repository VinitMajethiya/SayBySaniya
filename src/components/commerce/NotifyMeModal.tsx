import React, { useState, useEffect } from 'react';
import { Doodle } from '@/components/brand/Doodle';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

interface NotifyMeModalProps {
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({
  productName,
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      trackEvent('notify_me_submit', {
        product_name: productName,
      });
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setEmail('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-ivory rounded-card border-hairline p-6 sm:p-8 shadow-2xl space-y-4">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-ink hover:text-heart hover:scale-105 transition-all"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <Doodle name="bow" size={32} className="text-ink mx-auto" />
          <span className="text-[10px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
            EXCLUSIVE DROP ALERT
          </span>
          <h3 className="font-display text-2xl font-semibold text-ink">
            Get Notified for {productName}
          </h3>
          <p className="text-xs sm:text-sm text-ink-soft font-sans leading-relaxed">
            Be the very first to know when this handcrafted shade is poured and
            available for order.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-cream border border-hairline rounded text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-ink text-sm font-medium">
              <Doodle name="heart" size={16} className="text-heart" />
              <span>You're on the list! ♥</span>
            </div>
            <p className="text-xs text-ink-soft">
              We'll send you an email the second Saniya drops this tin.
            </p>
            <Button variant="secondary" size="sm" onClick={handleClose} className="mt-3">
              Got it
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full bg-cream border-b border-ink px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-heart transition-colors"
            />
            <Button variant="primary" size="md" fullWidth type="submit">
              Notify Me When Available
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
