import React, { useState, useEffect } from 'react';
import { getReviewsByProduct, addReview, deleteReview } from '../lib/reviews';
import { useShop } from '../context/ShopContext';
import { Trash2 } from 'lucide-react';

// Star display component
function Stars({ rating, size = 'w-4 h-4', interactive = false, onRate }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type={interactive ? 'button' : undefined}
                    onClick={() => interactive && onRate?.(star)}
                    className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    disabled={!interactive}
                >
                    <svg
                        className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-brand-light/15'} transition-colors`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

export default function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [form, setForm] = useState({ name: '', rating: 0, comment: '' });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useShop();

    // Load reviews (async)
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            const data = await getReviewsByProduct(productId);
            if (mounted) setReviews(data);
        };
        load();
        return () => { mounted = false; };
    }, [productId]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.rating || form.rating < 1) e.rating = 'Please select a rating';
        if (!form.comment.trim() || form.comment.trim().length < 5) e.comment = 'Comment must be at least 5 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            showToast('error', 'Please fix the errors above');
            return;
        }
        setSubmitting(true);
        try {
            const newReview = await addReview(productId, form, user?.id || null);
            setReviews(prev => [newReview, ...prev]);
            setForm({ name: '', rating: 0, comment: '' });
            setErrors({});
            showToast('success', 'Review submitted successfully!');
        } catch {
            showToast('error', 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        setDeletingId(reviewId);
        try {
            await deleteReview(reviewId);
            setReviews(prev => prev.filter(r => r.id !== reviewId));
            showToast('success', 'Review deleted.');
        } catch {
            showToast('error', 'Failed to delete review.');
        } finally {
            setDeletingId(null);
        }
    };

    // Check if current user can delete a review
    const canDelete = (review) => {
        if (!user) return false;
        return review.user_id === user.id;
    };

    // Compute average
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
        : 0;

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return '';
        }
    };

    return (
        <section className="mt-16 border-t border-brand-light/10 pt-12">
            <h2 className="font-serif text-2xl md:text-3xl italic text-brand-light mb-8">Ratings & Reviews</h2>

            {/* Summary */}
            <div className="flex items-center gap-6 mb-10 flex-wrap">
                <div className="text-center">
                    <p className="text-4xl font-bold text-brand-light">{avgRating.toFixed(1)}</p>
                    <Stars rating={Math.round(avgRating)} size="w-5 h-5" />
                    <p className="text-brand-gray text-xs mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </div>
                {/* Rating distribution */}
                <div className="flex-1 max-w-xs space-y-1">
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                                <span className="text-brand-gray w-3">{star}</span>
                                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <div className="flex-1 h-1.5 bg-brand-light/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-brand-gray w-4 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${toast.type === 'success' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                    {toast.message}
                </div>
            )}

            {/* Submit Form */}
            <form onSubmit={handleSubmit} className="bg-brand-surface border border-brand-light/10 rounded-2xl p-6 mb-10 space-y-4">
                <h3 className="text-sm font-semibold text-brand-gray uppercase tracking-wider">Write a Review</h3>
                <div>
                    <label className="block text-sm text-brand-gray mb-1">Your Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Priya"
                        className="w-full bg-brand-dark border border-brand-light/10 rounded-xl px-4 py-2.5 text-brand-light placeholder-brand-gray/40 focus:outline-none focus:border-brand-primary/50 text-sm transition-all"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm text-brand-gray mb-1">Rating</label>
                    <Stars rating={form.rating} size="w-7 h-7" interactive onRate={(r) => setForm(p => ({ ...p, rating: r }))} />
                    {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
                </div>
                <div>
                    <label className="block text-sm text-brand-gray mb-1">Comment</label>
                    <textarea
                        value={form.comment}
                        onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="w-full bg-brand-dark border border-brand-light/10 rounded-xl px-4 py-2.5 text-brand-light placeholder-brand-gray/40 focus:outline-none focus:border-brand-primary/50 text-sm transition-all resize-none"
                    />
                    {errors.comment && <p className="text-red-400 text-xs mt-1">{errors.comment}</p>}
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-brand-primary text-brand-dark font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm disabled:opacity-50"
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>

            {/* Review List */}
            {reviews.length === 0 ? (
                <p className="text-brand-gray text-sm italic">No reviews yet. Be the first to review this product!</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b border-brand-light/5 pb-6 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm">
                                        {(review.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-brand-light font-medium text-sm">{review.name}</p>
                                        <p className="text-brand-gray text-xs">{formatDate(review.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Stars rating={review.rating} size="w-3.5 h-3.5" />
                                    {canDelete(review) && (
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deletingId === review.id}
                                            className="p-1.5 rounded-lg text-brand-gray hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                                            title="Delete your review"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-brand-gray text-sm leading-relaxed ml-11">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
