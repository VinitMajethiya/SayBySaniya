import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Doodle } from '@/components/brand/Doodle';
import type { Database, DealType } from '@/types/supabase';

type DealRow = Database['public']['Tables']['deals']['Row'];

export const AdminDeals: React.FC = () => {
  const [deals, setDeals] = useState<DealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDeal, setEditingDeal] = useState<Partial<DealRow> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDeals(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleOpenNew = () => {
    setIsNew(true);
    setSaveStatus(null);
    setEditingDeal({
      title: '',
      code: '',
      description: '',
      deal_type: 'percent_off',
      discount_value: 15,
      is_active: true,
      show_in_banner: false,
      starts_at: new Date().toISOString().slice(0, 16),
      ends_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      applicable_product_ids: [],
    });
  };

  const handleEdit = (deal: DealRow) => {
    setIsNew(false);
    setSaveStatus(null);
    setEditingDeal({
      ...deal,
      starts_at: deal.starts_at ? deal.starts_at.slice(0, 16) : null,
      ends_at: deal.ends_at ? deal.ends_at.slice(0, 16) : null,
    });
  };

  const handleToggleActive = async (deal: DealRow) => {
    const updatedStatus = !deal.is_active;
    const { error } = await supabase
      .from('deals')
      .update({ is_active: updatedStatus })
      .eq('id', deal.id);

    if (!error) {
      setDeals(deals.map((d) => (d.id === deal.id ? { ...d, is_active: updatedStatus } : d)));
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete deal "${title}"?`)) return;

    const { error } = await supabase.from('deals').delete().eq('id', id);
    if (!error) {
      setDeals(deals.filter((d) => d.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal || !editingDeal.title) return;

    setSaveStatus('Saving deal...');

    const payload = {
      title: editingDeal.title.trim(),
      code: editingDeal.code ? editingDeal.code.trim().toUpperCase() : null,
      description: editingDeal.description || null,
      deal_type: editingDeal.deal_type || 'percent_off',
      discount_value: Number(editingDeal.discount_value) || 0,
      is_active: Boolean(editingDeal.is_active),
      show_in_banner: Boolean(editingDeal.show_in_banner),
      starts_at: editingDeal.starts_at ? new Date(editingDeal.starts_at).toISOString() : null,
      ends_at: editingDeal.ends_at ? new Date(editingDeal.ends_at).toISOString() : null,
      applicable_product_ids: editingDeal.applicable_product_ids || [],
    };

    if (isNew) {
      const { data, error } = await supabase.from('deals').insert(payload).select().single();
      if (error) {
        setSaveStatus(`Error: ${error.message}`);
      } else {
        setSaveStatus('Deal created! ✨');
        if (data) setDeals([data, ...deals]);
        setTimeout(() => setEditingDeal(null), 1000);
      }
    } else if (editingDeal.id) {
      const { data, error } = await supabase
        .from('deals')
        .update(payload)
        .eq('id', editingDeal.id)
        .select()
        .single();

      if (error) {
        setSaveStatus(`Error: ${error.message}`);
      } else {
        setSaveStatus('Deal updated! ✨');
        if (data) setDeals(deals.map((d) => (d.id === data.id ? data : d)));
        setTimeout(() => setEditingDeal(null), 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-hairline-b">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Special Deals &amp; Discounts
          </h2>
          <p className="text-xs text-ink-soft">
            Promotions appear on /deals, Home strip, and can be mentioned in chat orders
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="px-5 py-2.5 rounded-pill bg-ink text-cream font-sans text-xs uppercase tracking-button font-medium hover:bg-heart transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Create Deal</span>
          <Doodle name="sparkle" size={14} className="text-cream" />
        </button>
      </div>

      {/* Deals List */}
      {loading ? (
        <div className="p-12 text-center text-ink-soft font-display">
          Loading deals...
        </div>
      ) : deals.length === 0 ? (
        <div className="p-12 bg-ivory/50 rounded-card border border-dashed border-hairline text-center space-y-2">
          <p className="font-display text-lg text-ink">No deals created yet.</p>
          <p className="text-xs text-ink-soft">
            Click "+ Create Deal" to launch a limited-time holiday discount or Instagram promo code!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`p-5 rounded-card border ${
                deal.is_active ? 'border-hairline bg-ivory' : 'border-dashed border-hairline bg-cream/30 opacity-75'
              } flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {deal.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(deal)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider ${
                      deal.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-cream text-ink-soft'
                    }`}
                  >
                    {deal.is_active ? 'Active' : 'Paused'}
                  </button>
                </div>

                {deal.code && (
                  <div className="inline-block px-2.5 py-1 rounded bg-cream border border-hairline text-xs font-mono font-bold text-ink mb-2">
                    Code: {deal.code}
                  </div>
                )}

                <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                  {deal.description || 'No description provided.'}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-sans">
                  <span className="px-2 py-0.5 rounded bg-strawberry/20 text-ink">
                    {deal.deal_type === 'percent_off'
                      ? `${deal.discount_value}% Off`
                      : deal.deal_type === 'flat_off'
                      ? `₹${(deal.discount_value / 100).toLocaleString('en-IN')} Off`
                      : 'Special Price'}
                  </span>
                  {deal.show_in_banner && (
                    <span className="px-2 py-0.5 rounded bg-cream border border-hairline text-ink">
                      Top Banner
                    </span>
                  )}
                  {deal.ends_at && (
                    <span className="text-ink-soft">
                      Ends: {new Date(deal.ends_at).toLocaleDateString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-hairline-t flex items-center justify-between text-xs font-sans">
                <button
                  type="button"
                  onClick={() => handleEdit(deal)}
                  className="px-3 py-1.5 rounded-pill border border-hairline hover:border-ink font-medium text-ink transition-colors"
                >
                  Edit Deal
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deal.id, deal.title)}
                  className="text-xs text-ink-soft hover:text-heart underline transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deal Modal */}
      {editingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-ivory rounded-card border-hairline w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl my-auto animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-hairline-b flex items-center justify-between bg-cream/50">
              <h3 className="font-display text-xl font-semibold text-ink">
                {isNew ? 'Create New Promotion' : `Edit: ${editingDeal.title}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDeal(null)}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-ink hover:text-heart"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
              {saveStatus && (
                <div className="p-3 bg-cream border border-hairline rounded text-xs text-ink font-medium">
                  {saveStatus}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Deal Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingDeal.title || ''}
                  onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                  placeholder="e.g. Festive Glow Duo — 15% Off"
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Coupon Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingDeal.code || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, code: e.target.value.toUpperCase() })}
                    placeholder="FIRSTLIP"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Discount Type
                  </label>
                  <select
                    value={editingDeal.deal_type || 'percent_off'}
                    onChange={(e) =>
                      setEditingDeal({ ...editingDeal, deal_type: e.target.value as DealType })
                    }
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  >
                    <option value="percent_off">Percentage Off (%)</option>
                    <option value="flat_off">Flat Amount Off (Paise)</option>
                    <option value="fixed_sale_price">Fixed Sale Price (Paise)</option>
                    <option value="bundle">Bundle Promotion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Discount Value (e.g. 15 for 15% off, or 5000 for ₹50 off)
                </label>
                <input
                  type="number"
                  required
                  value={editingDeal.discount_value || ''}
                  onChange={(e) =>
                    setEditingDeal({ ...editingDeal, discount_value: Number(e.target.value) })
                  }
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Start Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editingDeal.starts_at || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, starts_at: e.target.value })}
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    End Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editingDeal.ends_at || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, ends_at: e.target.value })}
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingDeal.description || ''}
                  onChange={(e) => setEditingDeal({ ...editingDeal, description: e.target.value })}
                  placeholder="Offer details for the /deals page..."
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="space-y-2 pt-2 border-hairline-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDeal.is_active ?? true}
                    onChange={(e) => setEditingDeal({ ...editingDeal, is_active: e.target.checked })}
                    className="rounded text-ink focus:ring-0"
                  />
                  <span className="text-xs text-ink">Deal is Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDeal.show_in_banner ?? false}
                    onChange={(e) =>
                      setEditingDeal({ ...editingDeal, show_in_banner: e.target.checked })
                    }
                    className="rounded text-ink focus:ring-0"
                  />
                  <span className="text-xs text-ink">Show in Site Announcement Banner</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-hairline-t">
                <button
                  type="button"
                  onClick={() => setEditingDeal(null)}
                  className="px-4 py-2 rounded-pill border border-hairline text-xs font-medium text-ink hover:border-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
