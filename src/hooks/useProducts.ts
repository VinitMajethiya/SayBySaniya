import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product, ProductStatus, FlavorAccent } from '@/types/product';
import type { Database } from '@/types/supabase';
import localFallbackProducts from '@/data/products.json';

type ProductRow = Database['public']['Tables']['products']['Row'];

function determineAccent(slug: string): FlavorAccent {
  if (slug.includes('strawberry')) return 'strawberry';
  if (slug.includes('honey')) return 'honey';
  if (slug.includes('vanilla')) return 'vanilla';
  if (slug.includes('mask')) return 'jar-mask';
  if (slug.includes('blood') || slug.includes('tint')) return 'blood';
  return 'future';
}

function mapStatus(dbStatus: string): ProductStatus {
  switch (dbStatus) {
    case 'sold_out':
      return 'sold-out';
    case 'coming_soon':
      return 'coming-soon';
    case 'limited_drop':
      return 'limited-drop';
    default:
      return 'available';
  }
}

function mapRowToProduct(
  row: ProductRow,
  extras?: Record<string, { how_to_use?: string; return_policy?: string; allergy_advice?: string }>
): Product {
  const accent = determineAccent(row.slug);
  const category = (row.category as any) || (
    row.slug.includes('mask')
      ? 'lip-mask'
      : row.slug.includes('tint')
      ? 'lip-tint'
      : row.slug.includes('gloss')
      ? 'lip-gloss'
      : 'lip-balm'
  );
  const packaging = (row.packaging as any) || (
    category === 'lip-mask'
      ? 'jar'
      : category === 'lip-tint' || category === 'lip-gloss'
      ? 'bottle'
      : 'tin'
  );

  const extra = extras?.[row.slug] || (row.id ? extras?.[row.id] : undefined);
  const howToUse = extra?.how_to_use || row.how_to_use || 'Swipe on lips whenever they need love.';
  const returnPolicy = extra?.return_policy || row.return_policy || undefined;
  const allergyAdvice = extra?.allergy_advice || row.allergy_advice || undefined;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category,
    packaging,
    type: category,
    flavor: row.slug.split('-')[0] || row.name,
    accent,
    price: row.price,
    currency: 'INR',
    size: row.size || '15g',
    shortDescription: row.subtitle || row.description,
    description: row.description,
    flavorNotes: row.flavor_notes || [],
    ingredients: row.ingredients || [],
    howToUse,
    returnPolicy,
    allergyAdvice,
    images:
      row.images && row.images.length > 0
        ? row.images
        : [`/products/${row.slug}/hero.webp`],
    badges: row.badge ? [row.badge] : [],
    status: mapStatus(row.status),
    stock: row.stock,
    featured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    // Initial state from fallback so zero layout shift on initial render
    return localFallbackProducts as unknown as Product[];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setProducts(localFallbackProducts as unknown as Product[]);
      setLoading(false);
      return;
    }

    try {
      const [productsRes, extrasRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .order('sort_order', { ascending: true }),
        supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'product_extras')
          .maybeSingle(),
      ]);

      const extras = (extrasRes.data?.value || {}) as Record<string, any>;

      if (productsRes.error) {
        console.warn('[useProducts] Supabase fetch error, using fallback:', productsRes.error.message);
        setError(productsRes.error.message);
        // Apply extras to fallback
        const fallbackWithExtras = (localFallbackProducts as unknown as Product[]).map((p) => {
          const extra = extras[p.slug] || extras[p.id];
          return {
            ...p,
            howToUse: extra?.how_to_use || p.howToUse,
            returnPolicy: extra?.return_policy || p.returnPolicy,
            allergyAdvice: extra?.allergy_advice || p.allergyAdvice,
          };
        });
        setProducts(fallbackWithExtras);
      } else if (productsRes.data && productsRes.data.length > 0) {
        setProducts(productsRes.data.map((row) => mapRowToProduct(row, extras)));
      } else {
        // Empty DB, use fallback
        const fallbackWithExtras = (localFallbackProducts as unknown as Product[]).map((p) => {
          const extra = extras[p.slug] || extras[p.id];
          return {
            ...p,
            howToUse: extra?.how_to_use || p.howToUse,
            returnPolicy: extra?.return_policy || p.returnPolicy,
            allergyAdvice: extra?.allergy_advice || p.allergyAdvice,
          };
        });
        setProducts(fallbackWithExtras);
      }
    } catch (err) {
      console.warn('[useProducts] Network error, using fallback:', err);
      setError((err as Error).message);
      setProducts(localFallbackProducts as unknown as Product[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductBySlug = useCallback(
    (slug?: string): Product | undefined => {
      if (!slug) return undefined;
      return products.find((p) => p.slug === slug);
    },
    [products]
  );

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    getProductBySlug,
  };
}
