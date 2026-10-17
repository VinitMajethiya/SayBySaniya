import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database, OrderStatus } from '@/types/supabase';
import { Doodle } from '@/components/brand/Doodle';

type OrderRow = Database['public']['Tables']['orders']['Row'];

const PIPELINE_STEPS: OrderStatus[] = [
  'new',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [trackingForm, setTrackingForm] = useState({
    courier_name: '',
    tracking_number: '',
    tracking_url: '',
    notes: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.warn('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      showToast(`Order status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      showToast('Could not update order status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          courier_name: trackingForm.courier_name || null,
          tracking_number: trackingForm.tracking_number || null,
          tracking_url: trackingForm.tracking_url || null,
          notes: trackingForm.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      const updated = {
        ...selectedOrder,
        courier_name: trackingForm.courier_name || null,
        tracking_number: trackingForm.tracking_number || null,
        tracking_url: trackingForm.tracking_url || null,
        notes: trackingForm.notes || null,
      };

      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updated : o)));
      setSelectedOrder(updated);
      showToast('Fulfillment & tracking details saved!');
    } catch (err) {
      console.error('Failed to save tracking details:', err);
      showToast('Error saving details.');
    } finally {
      setIsUpdating(false);
    }
  };

  const openOrderDetail = (order: OrderRow) => {
    setSelectedOrder(order);
    setTrackingForm({
      courier_name: order.courier_name || '',
      tracking_number: order.tracking_number || '',
      tracking_url: order.tracking_url || '',
      notes: order.notes || '',
    });
  };

  const formatPrice = (paise: number) => `₹${Math.round(paise / 100)}`;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'packed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-cream px-4 py-3 rounded-card shadow-lg text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Doodle name="heart" size={14} className="text-heart" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-hairline-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Orders Management
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cream border border-hairline text-ink-soft">
              {orders.length} orders
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-1">
            Fulfill and track customer orders, attach courier numbers, and manage delivery status
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-pill text-xs capitalize transition-colors ${
              statusFilter === 'all'
                ? 'bg-ink text-cream font-medium'
                : 'border border-hairline bg-ivory text-ink-soft hover:text-ink'
            }`}
          >
            All
          </button>
          {PIPELINE_STEPS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-pill text-xs capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-ink text-cream font-medium'
                  : 'border border-hairline bg-ivory text-ink-soft hover:text-ink'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Orders List */}
        <div className={selectedOrder ? 'lg:col-span-7 space-y-3' : 'lg:col-span-12 space-y-3'}>
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Doodle name="bow" size={24} className="text-ink animate-bounce mx-auto" />
              <p className="text-xs font-sans text-ink-soft">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-ivory rounded-card border border-hairline space-y-3">
              <Doodle name="bow" size={28} className="text-ink mx-auto opacity-70" />
              <h3 className="font-display text-lg font-medium text-ink">No Orders Found</h3>
              <p className="text-xs text-ink-soft max-w-sm mx-auto">
                {statusFilter !== 'all'
                  ? `No orders currently in '${statusFilter}' status.`
                  : 'Orders converted from customer enquiries or logged directly will appear here.'}
              </p>
            </div>
          ) : (
            orders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              let items: any[] = [];
              try {
                if (Array.isArray(ord.items)) items = ord.items;
                else if (typeof ord.items === 'object' && ord.items !== null) {
                  items = (ord.items as any).items || [];
                }
              } catch {
                items = [];
              }

              return (
                <div
                  key={ord.id}
                  onClick={() => openOrderDetail(ord)}
                  className={`p-4 sm:p-5 rounded-card border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-ink bg-ivory shadow-subtle ring-1 ring-ink'
                      : 'border-hairline bg-ivory hover:border-ink hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-hairline-b">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink">
                        {ord.order_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider border ${getStatusColor(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                      <span className="text-[11px] font-sans capitalize text-ink-soft">
                        via {ord.channel}
                      </span>
                    </div>
                    <span className="font-display text-lg font-semibold text-ink">
                      {formatPrice(ord.total_paise)}
                    </span>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans">
                    <div>
                      <p className="font-medium text-ink">{ord.customer_name}</p>
                      <p className="text-ink-soft text-[11px]">
                        {ord.customer_phone || ord.customer_handle || 'No contact provided'}
                      </p>
                    </div>

                    <div className="text-right sm:text-left text-ink-soft text-[11px]">
                      <span>{items.length} items</span>
                      {ord.courier_name && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-cream border border-hairline">
                          {ord.courier_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Order Detail / Fulfillment Panel */}
        {selectedOrder && (
          <div className="lg:col-span-5 bg-ivory rounded-card border border-hairline p-5 space-y-6 sticky top-20 shadow-subtle">
            <div className="flex items-start justify-between pb-3 border-hairline-b">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-eyebrow text-ink-soft">
                  Order Details
                </span>
                <h3 className="font-mono text-lg font-bold text-ink">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-ink-soft hover:text-ink text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Pipeline Step Advancer */}
            <div className="space-y-2">
              <span className="text-xs font-sans font-medium text-ink block">
                Update Order Status:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {PIPELINE_STEPS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`py-1.5 px-2 rounded text-[11px] font-sans uppercase font-medium border transition-colors ${
                      selectedOrder.status === st
                        ? 'bg-ink text-cream border-ink'
                        : 'bg-cream/60 hover:bg-cream border-hairline text-ink-soft hover:text-ink'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-sans font-medium text-ink block">
                Order Items:
              </span>
              <div className="bg-cream/70 rounded p-3 border border-hairline space-y-2 max-h-48 overflow-y-auto">
                {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs font-sans">
                      <span>
                        <strong className="mr-1">{it.quantity || 1}×</strong>
                        {it.name || it.product?.name || 'Item'}
                        {it.flavor ? ` (${it.flavor})` : ''}
                      </span>
                      <span className="font-mono text-ink-soft">
                        {it.price ? formatPrice(it.price > 1000 ? it.price : it.price * 100) : '—'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ink-soft italic">No items found.</p>
                )}
                <div className="pt-2 border-hairline-t flex justify-between font-semibold text-xs font-sans">
                  <span>Total Paid</span>
                  <span>{formatPrice(selectedOrder.total_paise)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Fulfillment Form */}
            <form onSubmit={handleSaveTracking} className="space-y-3 pt-2 border-hairline-t">
              <span className="text-xs font-sans font-medium text-ink block">
                Courier & Fulfillment:
              </span>

              <div>
                <label className="text-[11px] font-sans text-ink-soft block mb-1">
                  Courier / Shipping Partner
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delhivery, India Post, Shiprocket"
                  value={trackingForm.courier_name}
                  onChange={(e) => setTrackingForm({ ...trackingForm, courier_name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[11px] font-sans text-ink-soft block mb-1">
                  Tracking Number (AWB)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 128391823901"
                  value={trackingForm.tracking_number}
                  onChange={(e) => setTrackingForm({ ...trackingForm, tracking_number: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-mono text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[11px] font-sans text-ink-soft block mb-1">
                  Tracking Web Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://track.delhivery.com/..."
                  value={trackingForm.tracking_url}
                  onChange={(e) => setTrackingForm({ ...trackingForm, tracking_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[11px] font-sans text-ink-soft block mb-1">
                  Private Admin Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Packaging notes, special instructions, freebies included..."
                  value={trackingForm.notes}
                  onChange={(e) => setTrackingForm({ ...trackingForm, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2 rounded-pill bg-ink text-cream hover:bg-heart transition-all text-xs font-sans font-medium uppercase tracking-button disabled:opacity-50"
              >
                Save Tracking &amp; Notes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
