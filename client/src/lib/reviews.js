// Reviews utility — localStorage-based storage for product reviews
// Key: samcharmz_reviews (array of review objects)
// Uses safe storage wrapper to prevent crashes in browsers that block storage.

import { safeLocalStorage } from './safeStorage';

const STORAGE_KEY = 'samcharmz_reviews';

function getAllReviews() {
    try {
        const stored = safeLocalStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveAllReviews(reviews) {
    try {
        safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
        // Silently fail — reviews won't persist if storage unavailable
    }
}

/**
 * Get reviews for a specific product, sorted newest first.
 */
export function getReviewsByProduct(productId) {
    const all = getAllReviews();
    return all
        .filter(r => String(r.productId) === String(productId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Add a review for a product.
 * @param {string|number} productId
 * @param {{ name: string, rating: number, comment: string }} review
 */
export function addReview(productId, { name, rating, comment }) {
    const all = getAllReviews();
    const newReview = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        productId: String(productId),
        name,
        rating,
        comment,
        createdAt: new Date().toISOString(),
    };
    all.push(newReview);
    saveAllReviews(all);
    return newReview;
}

/**
 * Delete all reviews for a given product (cleanup on product delete).
 */
export function deleteReviewsForProduct(productId) {
    const all = getAllReviews();
    const filtered = all.filter(r => String(r.productId) !== String(productId));
    saveAllReviews(filtered);
}
