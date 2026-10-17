import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Doodle } from '@/components/brand/Doodle';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop All' },
    { to: '/deals', label: 'Special Deals' },
    { to: '/about', label: 'About Us' },
    { to: '/our-story', label: 'Our Story' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-40 lg:hidden flex flex-col pt-16 bg-ivory/98 backdrop-blur-md border-b border-hairline animate-in fade-in slide-in-from-top-4 duration-200"
    >
      <div className="flex-grow flex flex-col justify-between p-6 overflow-y-auto">
        <nav className="flex flex-col space-y-4 pt-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `text-xl sm:text-2xl font-display font-medium transition-colors py-2 border-b border-hairline/40 flex items-center justify-between ${
                  isActive ? 'text-heart pl-2' : 'text-ink hover:text-heart'
                }`
              }
            >
              <span>{link.label}</span>
              <Doodle name="heart" size={14} className="text-heart opacity-50" />
            </NavLink>
          ))}
        </nav>

        <div className="pt-8 border-t border-hairline space-y-4">
          <div className="flex items-center justify-between text-xs font-sans text-ink-soft">
            <span className="uppercase tracking-eyebrow">Follow Along</span>
            <a
              href="https://instagram.com/saylipss.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink font-medium underline hover:text-heart"
            >
              @saylipss.co
            </a>
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] font-sans text-ink-soft">
              100% Organic & Homemade Lip Care ♥
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
