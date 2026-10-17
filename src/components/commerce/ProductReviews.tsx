import React, { useState } from 'react';
import { Doodle } from '@/components/brand/Doodle';
import { useReviews } from '@/hooks/useReviews';

interface ProductReviewsProps {
  productSlug: string;
  productId?: string;
  productName: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productSlug,
  productId,
  productName,
}) => {
  const { reviews, averageRating, submitReview } = useReviews(productSlug);
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam honeypot
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Spam check: Honeypot field must be empty
    if (honeypot.trim()) {
      console.warn('Bot submission caught via honeypot');
      setStatusMessage('Review submitted.');
      setShowForm(false);
      return;
    }

    // 2. Client-side length limits
    if (!authorName.trim() || authorName.length > 50) {
      setStatusMessage('Please enter your name (up to 50 characters).');
      return;
    }

    if (reviewText.trim().length < 5 || reviewText.length > 600) {
      setStatusMessage('Review must be between 5 and 600 characters.');
      return;
    }

    // 3. Rate limiting check via localStorage
    const lastSubKey = `sbs_last_review_${productSlug}`;
    const lastSub = localStorage.getItem(lastSubKey);
    const now = Date.now();
    if (lastSub && now - Number(lastSub) < 30000) {
      setStatusMessage('Please wait a moment before submitting another review.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const result = await submitReview({
      authorName,
      rating,
      reviewText,
      productSlug,
      productId,
    });

    setIsSubmitting(false);

    if (result.success) {
      localStorage.setItem(lastSubKey, String(now));
      setStatusMessage(result.message);
      setAuthorName('');
      setReviewText('');
      setRating(5);
      setTimeout(() => setShowForm(false), 3000);
    } else {
      setStatusMessage(result.message || 'Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="py-10 border-hairline-t">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            Customer Reviews
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-honey text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(averageRating) ? 'text-honey' : 'text-hairline'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs font-sans text-ink-soft">
              {reviews.length > 0
                ? `${averageRating} out of 5 (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`
                : 'No reviews yet'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-pill border border-ink text-ink font-sans text-xs uppercase tracking-button font-medium hover:bg-cream transition-colors self-start sm:self-auto"
        >
          {showForm ? 'Close Form' : 'Write a Review'}
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-ivory rounded-card border border-hairline mb-8 space-y-4 max-w-xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-display text-base font-semibold text-ink">
              Reviewing: {productName}
            </h4>
            <Doodle name="heart" size={14} className="text-heart" />
          </div>

          {/* Honeypot field - invisible to humans, caught by bots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website-url">Leave this empty</label>
            <input
              id="website-url"
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="author-name" className="block text-xs font-medium text-ink-soft mb-1">
              Your Name *
            </label>
            <input
              id="author-name"
              type="text"
              required
              maxLength={50}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Saniya M."
              className="w-full bg-cream/50 border border-hairline rounded p-2 text-xs text-ink focus:outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1">
              Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-xl transition-transform hover:scale-110 ${
                    star <= rating ? 'text-honey' : 'text-hairline'
                  }`}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs text-ink-soft ml-2">{rating} of 5 stars</span>
            </div>
          </div>

          <div>
            <label htmlFor="review-text" className="block text-xs font-medium text-ink-soft mb-1">
              Your Experience *
            </label>
            <textarea
              id="review-text"
              required
              rows={3}
              maxLength={600}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="How does it feel on your lips? Scent, hydration, shine..."
              className="w-full bg-cream/50 border border-hairline rounded p-2 text-xs text-ink focus:outline-none focus:border-ink"
            />
            <span className="text-[10px] text-ink-soft/70 block text-right">
              {reviewText.length}/600
            </span>
          </div>

          {statusMessage && (
            <p className="text-xs p-2.5 rounded bg-cream border border-hairline text-ink">
              {statusMessage}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-ink-soft">
              * Reviews are reviewed by our team before publishing.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-pill bg-ink text-cream font-sans text-xs uppercase tracking-button font-medium hover:bg-heart transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Approved Reviews List */}
      {reviews.length === 0 ? (
        <div className="p-8 bg-ivory/50 rounded-card border border-dashed border-hairline text-center space-y-2">
          <p className="text-sm font-sans text-ink">
            No customer reviews yet.
          </p>
          <p className="text-xs text-ink-soft">
            Tried this handmade balm? Be the first to share your thoughts! ♥
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-ivory rounded-card border border-hairline space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-semibold text-ink">
                  {rev.authorName}
                </span>
                <div className="flex text-honey text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-ink-soft font-sans leading-relaxed">
                "{rev.reviewText}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
