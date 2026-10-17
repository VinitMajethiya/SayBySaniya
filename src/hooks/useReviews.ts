import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Review } from '@/types/commerce';

export function useReviews(productSlug?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (productSlug) {
        query = query.eq('product_slug', productSlug);
      }

      const { data, error } = await query;

      if (!error && data) {
        setReviews(
          data.map((row) => ({
            id: row.id,
            productId: row.product_id,
            productSlug: row.product_slug,
            authorName: row.author_name,
            rating: row.rating,
            reviewText: row.review_text,
            photoUrl: row.photo_url,
            status: row.status,
            createdAt: row.created_at,
          }))
        );
      }
    } catch (err) {
      console.warn('[useReviews] Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (params: {
    authorName: string;
    rating: number;
    reviewText: string;
    photoUrl?: string | null;
    productSlug?: string;
    productId?: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Database connection is not configured.' };
    }

    try {
      const { error } = await supabase.from('reviews').insert({
        author_name: params.authorName.trim(),
        rating: params.rating,
        review_text: params.reviewText.trim(),
        photo_url: params.photoUrl || null,
        product_slug: params.productSlug || null,
        product_id: params.productId || null,
        status: 'pending', // Enforced by RLS
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: 'Thank you! Your review has been submitted and will appear after moderation. ♥',
      };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  };

  const averageRating =
    reviews.length > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
      : 5.0;

  return { reviews, averageRating, loading, refetch: fetchReviews, submitReview };
}
