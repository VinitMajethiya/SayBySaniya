import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { Doodle } from '@/components/brand/Doodle';
import { buildWhatsAppLink } from '@/lib/whatsapp';

type EnquiryRow = Database['public']['Tables']['enquiries']['Row'];

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'converted' | 'archived'>('all');
  const [filterChannel, setFilterChannel] = useState<'all' | 'whatsapp' | 'instagram'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      if (filterChannel !== 'all') {
        query = query.eq('channel', filterChannel);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEnquiries(data || []);
    } catch (err) {
      console.warn('Failed to fetch enquiries from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [filterStatus, filterChannel]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (id: string, status: 'new' | 'converted' | 'archived') => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      showToast(`Enquiry marked as ${status}`);
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
      showToast('Could not update status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConvertToOrder = async (enquiry: EnquiryRow) => {
    setActionLoading(enquiry.id);
    try {
      const { error: orderError } = await supabase.from('orders').insert({
        enquiry_id: enquiry.id,
        customer_name: enquiry.customer_name || 'Social Customer',
        customer_phone: enquiry.customer_phone,
        customer_handle: enquiry.customer_handle,
        channel: enquiry.channel,
        items: enquiry.cart_snapshot,
        total_paise: enquiry.total_paise,
        status: 'new',
        notes: `Converted from ${enquiry.channel.toUpperCase()} enquiry`,
      });

      if (orderError) throw orderError;

      // Mark enquiry as converted
      await handleUpdateStatus(enquiry.id, 'converted');
      showToast('Order created successfully in Orders tab! ♥');
    } catch (err) {
      console.error('Failed to convert enquiry to order:', err);
      showToast('Error converting to order.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (paise: number) => {
    return `₹${Math.round(paise / 100)}`;
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-cream px-4 py-3 rounded-card shadow-lg text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Doodle name="heart" size={14} className="text-heart" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-hairline-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Customer Enquiries
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cream border border-hairline text-ink-soft">
              {enquiries.length} total
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-1">
            Logged automatically when shoppers click "Order on WhatsApp" or "Order on Instagram"
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center rounded-pill border border-hairline bg-ivory p-0.5 text-xs">
            {(['all', 'new', 'converted', 'archived'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-pill capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-ink text-cream font-medium'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Channel Filter */}
          <div className="flex items-center rounded-pill border border-hairline bg-ivory p-0.5 text-xs">
            {(['all', 'whatsapp', 'instagram'] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setFilterChannel(ch)}
                className={`px-3 py-1 rounded-pill capitalize transition-colors ${
                  filterChannel === ch
                    ? 'bg-ink text-cream font-medium'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {ch === 'all' ? 'All Channels' : ch}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchEnquiries}
            className="p-2 rounded-full border border-hairline bg-ivory hover:border-ink text-ink-soft hover:text-ink transition-colors"
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Doodle name="bow" size={24} className="text-ink animate-bounce mx-auto" />
          <p className="text-xs font-sans text-ink-soft">Loading enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-ivory rounded-card border border-hairline space-y-3">
          <Doodle name="heart" size={28} className="text-heart mx-auto opacity-70" />
          <h3 className="font-display text-lg font-medium text-ink">No Enquiries Found</h3>
          <p className="text-xs text-ink-soft max-w-sm mx-auto">
            {filterStatus !== 'all' || filterChannel !== 'all'
              ? 'No enquiries match the current filter criteria.'
              : 'When customers click the WhatsApp or Instagram checkout buttons on product pages or cart, their cart snapshot will be logged here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {enquiries.map((enq) => {
            const isWhatsApp = enq.channel === 'whatsapp';
            let cartItems: any[] = [];
            try {
              if (Array.isArray(enq.cart_snapshot)) {
                cartItems = enq.cart_snapshot;
              } else if (typeof enq.cart_snapshot === 'object' && enq.cart_snapshot !== null) {
                cartItems = (enq.cart_snapshot as any).items || [];
              }
            } catch {
              cartItems = [];
            }

            return (
              <div
                key={enq.id}
                className="p-5 rounded-card border border-hairline bg-ivory hover:shadow-subtle transition-all space-y-4"
              >
                {/* Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-hairline-b">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider flex items-center gap-1 ${
                        isWhatsApp
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-pink-50 text-pink-700 border border-pink-200'
                      }`}
                    >
                      <span>{isWhatsApp ? 'WhatsApp' : 'Instagram'}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase font-medium ${
                        enq.status === 'new'
                          ? 'bg-heart/10 text-heart border border-heart/20'
                          : enq.status === 'converted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-cream text-ink-soft'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-[11px] font-mono text-ink-soft">
                      {formatDateTime(enq.created_at)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-display text-xl font-semibold text-ink">
                      {formatPrice(enq.total_paise)}
                    </span>
                  </div>
                </div>

                {/* Customer Details & Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Left: Customer Info */}
                  <div className="md:col-span-5 space-y-2 text-xs font-sans text-ink">
                    <div className="flex items-center gap-2">
                      <span className="text-ink-soft w-16">Customer:</span>
                      <span className="font-medium">{enq.customer_name || 'Anonymous Shopper'}</span>
                    </div>
                    {enq.customer_phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-ink-soft w-16">Phone:</span>
                        <a
                          href={`https://wa.me/${enq.customer_phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline font-mono"
                        >
                          +{enq.customer_phone} ↗
                        </a>
                      </div>
                    )}
                    {enq.customer_handle && (
                      <div className="flex items-center gap-2">
                        <span className="text-ink-soft w-16">Handle:</span>
                        <a
                          href={`https://instagram.com/${enq.customer_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-700 hover:underline font-mono"
                        >
                          @{enq.customer_handle.replace('@', '')} ↗
                        </a>
                      </div>
                    )}
                    {enq.deal_code && (
                      <div className="flex items-center gap-2">
                        <span className="text-ink-soft w-16">Promo:</span>
                        <span className="px-1.5 py-0.5 rounded bg-cream border border-hairline font-mono text-[10px]">
                          {enq.deal_code}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Cart Items List */}
                  <div className="md:col-span-7 bg-cream/70 rounded p-3 border border-hairline space-y-1.5">
                    <span className="text-[10px] font-sans uppercase tracking-eyebrow text-ink-soft block mb-1">
                      Cart Snapshot
                    </span>
                    {cartItems.length > 0 ? (
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {cartItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs font-sans text-ink"
                          >
                            <span className="truncate pr-2">
                              <span className="font-medium text-ink-soft mr-1">
                                {item.quantity || 1}×
                              </span>
                              {item.name || item.product?.name || 'Product'}
                              {item.flavor ? ` (${item.flavor})` : ''}
                            </span>
                            <span className="font-mono text-ink-soft shrink-0">
                              {item.price
                                ? formatPrice(
                                    typeof item.price === 'number'
                                      ? item.price > 1000
                                        ? item.price
                                        : item.price * 100
                                      : 29900
                                  )
                                : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-ink-soft italic">No items details recorded.</p>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-hairline-t flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {enq.status !== 'converted' && (
                      <button
                        type="button"
                        disabled={actionLoading === enq.id}
                        onClick={() => handleConvertToOrder(enq)}
                        className="px-3.5 py-1.5 rounded-pill bg-ink text-cream hover:bg-heart transition-all text-xs font-sans font-medium uppercase tracking-button disabled:opacity-50"
                      >
                        Convert to Order →
                      </button>
                    )}
                    {enq.status !== 'archived' && (
                      <button
                        type="button"
                        disabled={actionLoading === enq.id}
                        onClick={() => handleUpdateStatus(enq.id, 'archived')}
                        className="px-3 py-1.5 rounded-pill border border-hairline bg-ivory hover:border-ink text-xs font-sans text-ink-soft hover:text-ink transition-colors disabled:opacity-50"
                      >
                        Archive
                      </button>
                    )}
                    {enq.status === 'archived' && (
                      <button
                        type="button"
                        disabled={actionLoading === enq.id}
                        onClick={() => handleUpdateStatus(enq.id, 'new')}
                        className="px-3 py-1.5 rounded-pill border border-hairline bg-ivory hover:border-ink text-xs font-sans text-ink-soft hover:text-ink transition-colors disabled:opacity-50"
                      >
                        Restore to New
                      </button>
                    )}
                  </div>

                  {/* Direct Contact Button */}
                  {isWhatsApp ? (
                    <a
                      href={
                        enq.customer_phone
                          ? `https://wa.me/${enq.customer_phone.replace(/\D/g, '')}`
                          : buildWhatsAppLink()
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Open WhatsApp Chat</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <a
                      href={
                        enq.customer_handle
                          ? `https://instagram.com/${enq.customer_handle.replace('@', '')}`
                          : 'https://instagram.com/saylipss.co'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-pink-700 hover:text-pink-800"
                    >
                      <span>Open Instagram DM</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
