import React, { useState, useEffect } from 'react';
import { getAllReviewsFromDB, deleteReview } from '../../lib/reviews';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState(null);

    const fetchReviews = async () => {
        setLoading(true);
        const data = await getAllReviewsFromDB();
        setReviews(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
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

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return 'N/A';
        }
    };

    const Stars = ({ rating }) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400' : 'text-brand-light/15'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-4">
                <h1 className="text-xl font-semibold text-brand-light">Reviews</h1>
                <div className="py-20 text-center text-brand-gray">Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-brand-light">Reviews</h1>
                    <p className="text-brand-gray text-sm">{reviews.length} total reviews</p>
                </div>
                <button onClick={fetchReviews} className="flex items-center gap-2 text-brand-gray hover:text-brand-light text-sm border border-white/10 rounded-xl px-4 py-2 hover:border-white/20 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                </button>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium ${toast.type === 'success' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                    {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="bg-brand-surface border border-white/10 rounded-2xl p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-dark border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-brand-gray text-sm">No reviews yet.</p>
                </div>
            ) : (
                <div className="bg-brand-surface border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-brand-gray text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left">Reviewer</th>
                                    <th className="px-4 py-3 text-left">Rating</th>
                                    <th className="px-4 py-3 text-left">Comment</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reviews.map(review => (
                                    <tr key={review.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs">
                                                    {(review.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-brand-light font-medium">{review.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Stars rating={review.rating} />
                                        </td>
                                        <td className="px-4 py-3 text-brand-gray max-w-xs truncate">
                                            {review.comment}
                                        </td>
                                        <td className="px-4 py-3 text-brand-gray text-xs whitespace-nowrap">
                                            {formatDate(review.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                disabled={deletingId === review.id}
                                                className="p-2 rounded-lg text-brand-gray hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                                                title="Delete review"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
