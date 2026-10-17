// Lightweight Analytics Tracker conforming to SEO_AND_ANALYTICS.md
// No-op when VITE_PLAUSIBLE_DOMAIN or VITE_GA_ID or VITE_META_PIXEL_ID are empty

export type AnalyticsEvent =
  | 'pageview'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'whatsapp_order_click'
  | 'instagram_order_click'
  | 'notify_me_submit'
  | 'contact_submit';

export const trackEvent = (
  eventName: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | undefined>
): void => {
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const gaId = import.meta.env.VITE_GA_ID;
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;

  // Log in development for testing visibility
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[Analytics Event] ${eventName}:`, properties || {});
  }

  // If no provider is configured, safely return without errors (no-op)
  if (!plausibleDomain && !gaId && !metaPixelId) {
    return;
  }

  try {
    // Plausible
    if (plausibleDomain && typeof window !== 'undefined' && (window as unknown as { plausible?: (event: string, opts?: object) => void }).plausible) {
      (window as unknown as { plausible: (event: string, opts?: object) => void }).plausible(eventName, { props: properties });
    }

    // Google Analytics (GA4)
    if (gaId && typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, properties);
    }

    // Meta Pixel
    if (metaPixelId && typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('trackCustom', eventName, properties);
    }
  } catch {
    // Never let analytics throw or disrupt user actions
  }
};
