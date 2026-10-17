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

function mapRowToProduct(row: ProductRow): Product {
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
    howToUse: row.how_to_use || 'Swipe on lips whenever they need love.',
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
      const { data, error: queryError } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (queryError) {
        console.warn('[useProducts] Supabase fetch error, using fallback:', queryError.message);
        setError(queryError.message);
        setProducts(localFallbackProducts as unknown as Product[]);
      } else if (data && data.length > 0) {
        setProducts(data.map(mapRowToProduct));
      } else {
        // Empty DB, use fallback
        setProducts(localFallbackProducts as unknown as Product[]);
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
