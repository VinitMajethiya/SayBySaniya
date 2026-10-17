import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '@/store/cart';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCount, toggleCart } = useCartStore();
  const { settings } = useSiteSettings();
  const cartCount = getTotalCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/shop', label: 'Shop All' },
    { to: '/deals', label: 'Special Deals' },
    { to: '/about', label: 'About Us' },
    { to: '/our-story', label: 'Our Story' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Announcement Banner from Live Settings */}
      {settings.announcementBanner && (
        <div className="bg-ink text-cream text-[11px] sm:text-xs py-1.5 px-4 text-center font-sans tracking-wide">
          <span>{settings.announcementBanner}</span>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 w-full bg-ivory/95 backdrop-blur-md border-hairline-b transition-all duration-300 ${
          isScrolled ? 'py-2.5 shadow-sm' : 'py-4'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile: Hamburger Button */}
          <div className="flex items-center lg:hidden w-1/4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-ink hover:text-heart focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-ink transition-transform duration-200 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-ink transition-opacity duration-200 ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-ink transition-transform duration-200 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Desktop: Navigation Left */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 w-1/3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-xs uppercase font-sans font-medium tracking-eyebrow transition-colors duration-200 ${
                    isActive
                      ? 'text-heart font-semibold underline underline-offset-4'
                      : 'text-ink hover:text-heart'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Center: Script Logo */}
          <div className="flex justify-center items-center flex-grow lg:flex-grow-0 lg:w-1/3">
            <Logo variant="compact" />
          </div>

          {/* Right: Actions (Instagram + Cart) */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 w-1/4 lg:w-1/3">
            <a
              href="https://instagram.com/saylipss.co"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram @saylipss.co"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans text-ink-soft hover:text-heart transition-colors px-2 py-1"
            >
              <span className="text-[11px] font-medium tracking-wider">@saylipss.co</span>
            </a>

            {/* Cart Button with Count Badge */}
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2 -mr-2 text-ink hover:text-heart transition-colors flex items-center"
              aria-label={`View cart with ${cartCount} items`}
            >
              {/* Cart Icon using outline styling */}
              <div className="relative">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-heart text-cream text-[10px] font-sans font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border border-ivory shadow-sm animate-scale">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Navigation */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
