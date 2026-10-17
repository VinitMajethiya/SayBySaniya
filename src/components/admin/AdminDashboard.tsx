import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Doodle } from '@/components/brand/Doodle';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [counts, setCounts] = useState({
    enquiries: 0,
    orders: 0,
    pendingReviews: 0,
    activeDeals: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [
          { count: enquiriesCount },
          { count: ordersCount },
          { count: reviewsCount },
          { count: dealsCount },
          { count: productsCount },
        ] = await Promise.all([
          supabase.from('enquiries').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('deals').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('products').select('*', { count: 'exact', head: true }),
        ]);

        setCounts({
          enquiries: enquiriesCount || 0,
          orders: ordersCount || 0,
          pendingReviews: reviewsCount || 0,
          activeDeals: dealsCount || 0,
          products: productsCount || 0,
        });
      } catch (err) {
        console.warn('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const metricCards = [
    {
      title: 'New Enquiries',
      count: counts.enquiries,
      action: 'View Enquiries',
      tab: 'enquiries',
      doodle: 'heart' as const,
      color: 'text-heart',
      bg: 'bg-cream',
    },
    {
      title: 'Active Orders',
      count: counts.orders,
      action: 'Manage Orders',
      tab: 'orders',
      doodle: 'sparkle' as const,
      color: 'text-honey',
      bg: 'bg-ivory',
    },
    {
      title: 'Pending Reviews',
      count: counts.pendingReviews,
      action: 'Moderate Reviews',
      tab: 'reviews',
      doodle: 'star' as const,
      color: 'text-strawberry',
      bg: 'bg-cream',
      badge: counts.pendingReviews > 0 ? 'Needs Attention' : null,
    },
    {
      title: 'Active Deals',
      count: counts.activeDeals,
      action: 'Manage Promotions',
      tab: 'deals',
      doodle: 'bow' as const,
      color: 'text-ink',
      bg: 'bg-ivory',
    },
    {
      title: 'Live Products',
      count: counts.products,
      action: 'Edit Products & Photos',
      tab: 'products',
      doodle: 'sparkle' as const,
      color: 'text-heart',
      bg: 'bg-cream',
    },
    {
      title: 'Our Story & Photos',
      count: 'Live',
      action: "Edit Saniya's Story & Gallery",
      tab: 'story',
      doodle: 'bow' as const,
      color: 'text-ink',
      bg: 'bg-ivory',
    },
    {
      title: 'About the Brand',
      count: 'Live',
      action: 'Edit Values & Brand Philosophy',
      tab: 'about',
      doodle: 'heart' as const,
      color: 'text-heart',
      bg: 'bg-cream',
    },
    {
      title: 'Instagram Mood & Reels',
      count: 'Active',
      action: 'Update Featured Post & Link',
      tab: 'story',
      doodle: 'sparkle' as const,
      color: 'text-strawberry',
      bg: 'bg-ivory',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-hairline-b">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Shop Overview
          </h2>
          <p className="text-xs text-ink-soft">
            Live metrics from your Say By Saniya store
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="px-4 py-2 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all"
          >
            + Add Product
          </button>
          <button
            type="button"
            onClick={() => onNavigate('deals')}
            className="px-4 py-2 rounded-pill border border-hairline bg-ivory text-ink text-xs uppercase tracking-button font-medium hover:border-ink transition-all"
          >
            + New Deal
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((m) => (
          <div
            key={m.title}
            className={`p-5 rounded-card border border-hairline ${m.bg} flex flex-col justify-between hover:border-ink transition-all cursor-pointer`}
            onClick={() => onNavigate(m.tab)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                {m.title}
              </span>
              <Doodle name={m.doodle} size={18} className={m.color} />
            </div>

            <div className="my-2 flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold text-ink">
                {loading ? '—' : m.count}
              </span>
              {m.badge && (
                <span className="px-2 py-0.5 rounded-full bg-strawberry text-ink text-[10px] font-sans font-semibold uppercase tracking-wider">
                  {m.badge}
                </span>
              )}
            </div>

            <div className="pt-3 border-hairline-t flex items-center justify-between text-xs text-ink-soft font-medium">
              <span>{m.action}</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
