import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Testimonial } from '@/types/commerce';

const fallbackTestimonials: Testimonial[] = [
  {
    id: 't-1',
    authorName: 'Ananya M.',
    instagramHandle: '@ananyaloves',
    quote: 'The slider tin is so chic in my pocket and Strawberry Jam smells like actual fresh strawberries. Never buying chemical balms again!',
    photoUrl: null,
    rating: 5,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 't-2',
    authorName: 'Riya S.',
    instagramHandle: '@riyabeauty',
    quote: 'Honey Butter saved my chapped lips overnight. Knowing it is 100% homemade and organic makes it a permanent favorite.',
    photoUrl: null,
    rating: 5,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 't-3',
    authorName: 'Meera K.',
    instagramHandle: '@meerapov',
    quote: 'The texture is like velvet silk. Ordering on WhatsApp was so fast and personal. Saniya packaged it with so much love.',
    photoUrl: null,
    rating: 5,
    isActive: true,
    sortOrder: 3,
  },
];

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTestimonials() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0 && isMounted) {
          setTestimonials(
            data.map((row) => ({
              id: row.id,
              authorName: row.author_name,
              instagramHandle: row.instagram_handle,
              quote: row.quote,
              photoUrl: row.photo_url,
              rating: row.rating,
              isActive: row.is_active,
              sortOrder: row.sort_order,
            }))
          );
        }
      } catch (err) {
        console.warn('[useTestimonials] Using fallback testimonials:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  return { testimonials, loading };
}
