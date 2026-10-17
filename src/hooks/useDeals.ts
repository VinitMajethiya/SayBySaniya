import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Deal } from '@/types/commerce';
import type { Database } from '@/types/supabase';

type DealRow = Database['public']['Tables']['deals']['Row'];

function mapRowToDeal(row: DealRow): Deal {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    dealType: row.deal_type,
    discountValue: row.discount_value,
    applicableProductIds: row.applicable_product_ids || [],
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
    showInBanner: row.show_in_banner,
  };
}

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDeals() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && isMounted) {
          setDeals(data.map(mapRowToDeal));
        }
      } catch (err) {
        console.warn('[useDeals] Failed to load deals:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDeals();
    return () => {
      isMounted = false;
    };
  }, []);

  const bannerDeal = deals.find((d) => d.showInBanner);

  return { deals, bannerDeal, loading };
}
