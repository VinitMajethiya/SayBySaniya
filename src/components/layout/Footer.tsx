import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { Doodle } from '@/components/brand/Doodle';
import { Container } from './Container';

import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getCleanInstagramHandle, getCleanWhatsAppNumber } from '@/lib/socialOrder';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const cleanHandle = getCleanInstagramHandle(settings.instagramHandle);
  const cleanPhone = getCleanWhatsAppNumber(settings.whatsappNumber);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-cream border-hairline-t pt-16 pb-12 text-ink select-none">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-hairline-b">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="full" />
            <p className="font-display italic text-lg text-ink-soft text-center sm:text-left mt-2">
              Nourish. Tint. Love.
            </p>
            <p className="text-xs sm:text-sm text-ink-soft font-sans leading-relaxed max-w-sm text-center sm:text-left">
              Homemade, 100% organic lip care crafted in slim slider tins for your
              daily routine. Made by hand. Meant for you.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <a
                href={`https://instagram.com/${cleanHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-button font-medium py-1.5 px-3 rounded-pill border border-hairline bg-ivory hover:text-heart hover:border-heart transition-all"
              >
                <span>Instagram @{cleanHandle}</span>
                <Doodle name="heart" size={12} className="text-heart" />
              </a>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-button font-medium py-1.5 px-3 rounded-pill border border-hairline bg-ivory hover:text-heart hover:border-heart transition-all"
              >
                <span>WhatsApp Order</span>
                <Doodle name="sparkle" size={12} className="text-heart" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 sm:pl-4">
            <h2 className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-4">
              Explore
            </h2>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <Link to="/shop" className="text-ink hover:text-heart transition-colors">
                  Shop All Lip Balms
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ink hover:text-heart transition-colors">
                  About the Brand
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-ink hover:text-heart transition-colors">
                  Our Story (Meet Saniya)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ink hover:text-heart transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h2 className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-2">
              Stay in the Loop
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed mb-4">
              Be first to hear about seasonal drops, limited tints, and kitchen
              restocks. No spam, promise ♥
            </p>
            {subscribed ? (
              <div className="p-3 bg-ivory border border-hairline rounded flex items-center gap-2 text-xs font-sans text-ink">
                <Doodle name="heart" size={14} className="text-heart" />
                <span>You're subscribed! Saniya will keep you posted.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex border-b border-ink pb-1 focus-within:border-heart transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full bg-transparent text-xs text-ink placeholder:text-ink-soft/60 focus:outline-none py-1"
                  />
                  <button
                    type="submit"
                    className="text-[11px] uppercase tracking-button font-medium text-ink hover:text-heart shrink-0 px-2 py-1"
                  >
                    Join ♥
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-soft gap-4">
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Doodle name="heart" size={12} className="text-heart" />
            <span>by hand · © {new Date().getFullYear()} Say By Saniya</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/shipping" className="hover:underline">
              Shipping & Returns
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <span>·</span>
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
