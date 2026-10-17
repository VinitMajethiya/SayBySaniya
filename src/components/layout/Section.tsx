import React from 'react';
import { Container } from './Container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  bg?: 'cream' | 'ivory' | 'blood';
  containerSize?: 'default' | 'narrow' | 'wide';
  headerCentered?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  eyebrow,
  title,
  subtitle,
  bg = 'cream',
  containerSize = 'default',
  headerCentered = true,
  children,
  className = '',
  ...props
}) => {
  const bgStyles = {
    cream: 'bg-cream text-ink',
    ivory: 'bg-ivory text-ink',
    blood: 'theme-drop-blood bg-cream text-ink',
  };

  return (
    <section
      className={`py-16 lg:py-28 relative ${bgStyles[bg]} ${className}`}
      {...props}
    >
      <Container size={containerSize}>
        {(eyebrow || title || subtitle) && (
          <div
            className={`mb-12 lg:mb-16 ${
              headerCentered ? 'text-center mx-auto' : 'text-left'
            } max-w-2xl`}
          >
            {eyebrow && (
              <p className="text-[11px] sm:text-xs font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-2">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-semibold tracking-tight text-ink leading-tight mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-ink-soft font-sans font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
};
