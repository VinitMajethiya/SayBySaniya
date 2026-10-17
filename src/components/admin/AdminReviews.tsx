import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database, ReviewStatus } from '@/types/supabase';
import { Doodle } from '@/components/brand/Doodle';

type ReviewRow = Database['public']['Tables']['reviews']['Row'];
type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];

export const AdminReviews: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'testimonials'>('reviews');
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // New Testimonial Form State
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    author_name: '',
    instagram_handle: '',
    quote: '',
    photo_url: '',
    rating: 5,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = async () => {
    try {
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (reviewStatusFilter !== 'all') {
        query = query.eq('status', reviewStatusFilter);
      }
      const { data, error } = await query;
      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.warn('Failed to fetch reviews:', err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.warn('Failed to fetch testimonials:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchReviews(), fetchTestimonials()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [reviewStatusFilter]);

  const handleUpdateReviewStatus = async (id: string, status: ReviewStatus) => {
    setActionLoading(id);
    try {
      const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
      if (error) throw error;

      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      showToast(`Review marked as ${status}!`);
    } catch (err) {
      console.error('Failed to update review status:', err);
      showToast('Could not update review status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    setActionLoading(id);
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('Review deleted.');
    } catch (err) {
      console.error('Failed to delete review:', err);
      showToast('Error deleting review.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.author_name || !newTestimonial.quote) {
      showToast('Please enter an author name and quote.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          author_name: newTestimonial.author_name,
          instagram_handle: newTestimonial.instagram_handle || null,
          quote: newTestimonial.quote,
          photo_url: newTestimonial.photo_url || null,
          rating: newTestimonial.rating,
          is_active: true,
          sort_order: testimonials.length + 1,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTestimonials((prev) => [...prev, data]);
      }
      setShowTestimonialModal(false);
      setNewTestimonial({
        author_name: '',
        instagram_handle: '',
        quote: '',
        photo_url: '',
        rating: 5,
      });
      showToast('Testimonial published to home strip! ♥');
    } catch (err) {
      console.error('Failed to create testimonial:', err);
      showToast('Error creating testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showToast('Testimonial removed.');
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
      showToast('Error deleting testimonial.');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-honey">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-amber-500' : 'text-stone-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-cream px-4 py-3 rounded-card shadow-lg text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Doodle name="heart" size={14} className="text-heart" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-hairline-b">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Customer Reviews &amp; Testimonials
          </h2>
          <p className="text-xs text-ink-soft mt-1">
            Moderate public customer product reviews and curate homepage testimonials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-pill border border-hairline bg-ivory p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveSubTab('reviews')}
              className={`px-3 py-1 rounded-pill transition-colors ${
                activeSubTab === 'reviews'
                  ? 'bg-ink text-cream font-medium'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              Product Reviews ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('testimonials')}
              className={`px-3 py-1 rounded-pill transition-colors ${
                activeSubTab === 'testimonials'
                  ? 'bg-ink text-cream font-medium'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              Curated Testimonials ({testimonials.length})
            </button>
          </div>

          {activeSubTab === 'testimonials' && (
            <button
              type="button"
              onClick={() => setShowTestimonialModal(true)}
              className="px-3.5 py-1.5 rounded-pill bg-ink text-cream hover:bg-heart transition-all text-xs font-sans font-medium uppercase tracking-button"
            >
              + Add Testimonial
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: PRODUCT REVIEWS MODERATION QUEUE */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          {/* Status Filters */}
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setReviewStatusFilter(st)}
                className={`px-3 py-1 rounded-pill text-xs capitalize transition-colors ${
                  reviewStatusFilter === st
                    ? 'bg-ink text-cream font-medium'
                    : 'border border-hairline bg-ivory text-ink-soft hover:text-ink'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Doodle name="star" size={24} className="text-honey animate-spin mx-auto" />
              <p className="text-xs font-sans text-ink-soft">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-ivory rounded-card border border-hairline space-y-3">
              <Doodle name="heart" size={28} className="text-heart mx-auto opacity-70" />
              <h3 className="font-display text-lg font-medium text-ink">No Reviews Found</h3>
              <p className="text-xs text-ink-soft max-w-sm mx-auto">
                {reviewStatusFilter !== 'all'
                  ? `No reviews in '${reviewStatusFilter}' status.`
                  : 'Reviews submitted by shoppers will appear here for your moderation.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-card border border-hairline bg-ivory flex flex-col justify-between space-y-4 hover:shadow-subtle transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-ink">{rev.author_name}</h4>
                        <span className="text-[11px] font-mono text-ink-soft">
                          Product: {rev.product_slug || 'General'}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase font-medium border ${
                          rev.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : rev.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>

                    {renderStars(rev.rating)}

                    <p className="text-xs font-sans text-ink leading-relaxed bg-cream/50 p-3 rounded border border-hairline italic">
                      "{rev.review_text}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-hairline-t flex items-center justify-between text-xs font-sans">
                    <button
                      type="button"
                      disabled={actionLoading === rev.id}
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-ink-soft hover:text-heart transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>

                    <div className="flex items-center gap-2">
                      {rev.status !== 'approved' && (
                        <button
                          type="button"
                          disabled={actionLoading === rev.id}
                          onClick={() => handleUpdateReviewStatus(rev.id, 'approved')}
                          className="px-3 py-1 rounded-pill bg-emerald-700 text-cream hover:bg-emerald-800 transition-colors disabled:opacity-50"
                        >
                          Approve ✓
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          type="button"
                          disabled={actionLoading === rev.id}
                          onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                          className="px-3 py-1 rounded-pill border border-hairline text-ink-soft hover:text-ink transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CURATED TESTIMONIALS (HOME STRIP) */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-4">
          <p className="text-xs text-ink-soft">
            These quotes appear in the social love and testimonial carousel on the home page.
          </p>

          {testimonials.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-ivory rounded-card border border-hairline space-y-3">
              <Doodle name="sparkle" size={28} className="text-honey mx-auto opacity-70" />
              <h3 className="font-display text-lg font-medium text-ink">No Testimonials Added Yet</h3>
              <p className="text-xs text-ink-soft max-w-sm mx-auto">
                Add quotes from Instagram DMs, stories, or happy WhatsApp buyers to show off on the homepage.
              </p>
              <button
                type="button"
                onClick={() => setShowTestimonialModal(true)}
                className="mt-2 px-4 py-2 rounded-pill bg-ink text-cream hover:bg-heart text-xs font-sans font-medium uppercase tracking-button"
              >
                + Add First Testimonial
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-card border border-hairline bg-ivory flex flex-col justify-between space-y-4 hover:shadow-subtle transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-ink">{t.author_name}</h4>
                      {t.instagram_handle && (
                        <span className="text-[11px] font-mono text-pink-700">
                          @{t.instagram_handle.replace('@', '')}
                        </span>
                      )}
                    </div>
                    {renderStars(t.rating)}
                    <p className="text-xs font-sans text-ink leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="pt-3 border-hairline-t flex items-center justify-end text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="text-ink-soft hover:text-heart transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Testimonial Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory border-hairline rounded-card max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-hairline-b">
              <h3 className="font-display text-lg font-semibold text-ink">
                Add Curated Testimonial
              </h3>
              <button
                type="button"
                onClick={() => setShowTestimonialModal(false)}
                className="text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTestimonial} className="space-y-3">
              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Customer / Author Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya M."
                  value={newTestimonial.author_name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, author_name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Instagram Handle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ananya.looks"
                  value={newTestimonial.instagram_handle}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, instagram_handle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-mono text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Customer Quote / Review Text *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Hands down the smoothest lip balm I've ever used. The Strawberry Jam shade is gorgeous!"
                  value={newTestimonial.quote}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Rating (Stars)
                </label>
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-4 py-2 rounded-pill border border-hairline text-xs font-sans text-ink-soft hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-pill bg-ink text-cream hover:bg-heart text-xs font-sans font-medium uppercase tracking-button"
                >
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
