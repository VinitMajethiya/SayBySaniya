import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { SiteSettings } from '@/types/commerce';

interface GeneralSettingsJson {
  whatsapp_number?: string;
  instagram_handle?: string;
  announcement_banner?: string;
  shipping_note?: string;
  show_future_favorites?: boolean;
}

const defaultSettings: SiteSettings = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '916362044074',
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
          setSettings({
            whatsappNumber: val.whatsapp_number || defaultSettings.whatsappNumber,
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
