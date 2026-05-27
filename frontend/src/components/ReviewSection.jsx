import { useState } from 'react'
import { Star, Loader2, CheckCircle } from 'lucide-react'
import { reviewService } from '../services/reviewService.js'
import { useAuth } from '../context/AuthContext.jsx'

function StarRating({ value, interactive = false, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star className={`w-5 h-5 transition-colors ${
            star <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-white/20'
          }`} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({
  artworkId, averageRating, totalReviews, reviews, onReviewAdded
}) {
  const { isCustomer } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError('Please select a rating'); return }
    setLoading(true); setError('')
    try {
      await reviewService.addReview(artworkId, rating, comment)
      setSuccess(true); setRating(0); setComment('')
      onReviewAdded?.()
    } catch (err) {
      const msg = err?.response?.data?.detail
      setError(msg ?? 'Could not submit review. You may have already reviewed this artwork.')
    } finally { setLoading(false) }
  }

  return (
    <section className="mt-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-white/10">
        <h2 className="font-display font-bold text-2xl text-white">Reviews</h2>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(averageRating)} />
            <span className="font-bold text-white">{averageRating.toFixed(1)}</span>
            <span className="text-white/40 text-sm">({totalReviews} reviews)</span>
          </div>
        )}
      </div>

      {/* Write a Review (customer only) */}
      {isCustomer && !success && (
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="label">Your Rating *</p>
              <StarRating value={rating} interactive onChange={setRating} />
            </div>
            <div>
              <label className="label" htmlFor="review-comment">Comment (optional)</label>
              <textarea
                id="review-comment"
                rows={3}
                className="input resize-none"
                placeholder="Share your thoughts about this artwork…"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button id="review-submit-btn" type="submit" disabled={loading} className="btn-primary py-2.5">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {success && (
        <div className="card p-4 flex items-center gap-3 text-emerald-400 border-emerald-500/30">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">Review submitted! Thank you.</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-white/30 text-sm">No reviews yet. Be the first!</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="card p-5 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-canvas-600 flex items-center justify-center text-sm font-bold text-white/60">
                  {r.customerEmail.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{r.customerEmail}</p>
                  <p className="text-xs text-white/30">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto"><StarRating value={r.rating} /></div>
              </div>
              {r.comment && <p className="text-white/70 text-sm leading-relaxed">{r.comment}</p>}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
