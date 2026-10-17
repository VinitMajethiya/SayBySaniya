import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { SiteSettings } from '@/types/commerce';

import { DEFAULT_WHATSAPP_LINK } from '@/lib/whatsapp';

interface GeneralSettingsJson {
  whatsapp_number?: string;
  whatsapp_url?: string;
  instagram_handle?: string;
  announcement_banner?: string;
  shipping_note?: string;
  show_future_favorites?: boolean;
}

const defaultSettings: SiteSettings = {
  whatsappNumber:
    import.meta.env.VITE_WHATSAPP_URL ||
    import.meta.env.VITE_WHATSAPP_NUMBER ||
    DEFAULT_WHATSAPP_LINK,
  instagramHandle: import.meta.env.VITE_INSTAGRAM_HANDLE || 'saylipss.co',
  announcementBanner:
    '🌸 Handcrafted organic lip balms in pocket slider tins • Order directly on WhatsApp & Instagram',
  shippingNote:
    'Handmade in small batches in India. Orders typically dispatch within 24-48 hours via standard courier.',
  showFutureFavorites: false,
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'general')
          .single();

        if (!error && data?.value && isMounted) {
          const val = data.value as unknown as GeneralSettingsJson;
          const rawWa = val.whatsapp_url || val.whatsapp_number;
          const isStalePlaceholder = Boolean(
            rawWa && (rawWa.includes('999999') || rawWa.includes('6362044074'))
          );
          const whatsappNumber =
            rawWa && !isStalePlaceholder ? rawWa : defaultSettings.whatsappNumber;

          setSettings({
            whatsappNumber,
            instagramHandle: val.instagram_handle || defaultSettings.instagramHandle,
            announcementBanner: val.announcement_banner || defaultSettings.announcementBanner,
            shippingNote: val.shipping_note || defaultSettings.shippingNote,
            showFutureFavorites: Boolean(val.show_future_favorites),
          });
        }
      } catch (err) {
        console.warn('[useSiteSettings] Using default settings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading };
}
