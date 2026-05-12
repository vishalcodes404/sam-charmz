// Reviews utility — Supabase-based with localStorage fallback
// Uses Supabase 'reviews' table. Falls back to localStorage if Supabase fails.
// Reviews table expected columns: id, product_id, user_id, name, rating, comment, created_at

import { supabase } from './supabaseClient';
import { safeLocalStorage } from './safeStorage';

const STORAGE_KEY = 'samcharmz_reviews';

// ─── localStorage fallback helpers ───
function getLocalReviews() {
    try {
        const stored = safeLocalStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveLocalReviews(reviews) {
    try {
        safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch { /* silently fail */ }
}

/**
 * Get reviews for a specific product, sorted newest first.
 */
export async function getReviewsByProduct(productId) {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', String(productId))
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(r => ({
            id: r.id,
            productId: r.product_id,
            user_id: r.user_id,
            name: r.name,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.created_at,
        }));
    } catch (err) {
        console.warn('Supabase reviews fetch failed, using localStorage:', err.message);
        // Fallback to localStorage
        const all = getLocalReviews();
        return all
            .filter(r => String(r.productId) === String(productId))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

/**
 * Add a review for a product.
 * @param {string|number} productId
 * @param {{ name: string, rating: number, comment: string }} review
 * @param {string|null} userId - optional user ID from auth
 */
export async function addReview(productId, { name, rating, comment }, userId = null) {
    const newReview = {
        product_id: String(productId),
        user_id: userId || null,
        name,
        rating,
        comment,
    };

    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([newReview])
            .select()
            .single();

        if (error) throw error;
        return {
            id: data.id,
            productId: data.product_id,
            user_id: data.user_id,
            name: data.name,
            rating: data.rating,
            comment: data.comment,
            createdAt: data.created_at,
        };
    } catch (err) {
        console.warn('Supabase review insert failed, using localStorage:', err.message);
        // Fallback to localStorage
        const all = getLocalReviews();
        const localReview = {
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            productId: String(productId),
            user_id: userId,
            name,
            rating,
            comment,
            createdAt: new Date().toISOString(),
        };
        all.push(localReview);
        saveLocalReviews(all);
        return localReview;
    }
}

/**
 * Delete a single review by ID.
 */
export async function deleteReview(reviewId) {
    try {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.warn('Supabase review delete failed, trying localStorage:', err.message);
        // Fallback: remove from localStorage
        const all = getLocalReviews();
        const filtered = all.filter(r => r.id !== reviewId);
        saveLocalReviews(filtered);
        return { success: true };
    }
}

/**
 * Get ALL reviews (for admin management).
 */
export async function getAllReviewsFromDB() {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(r => ({
            id: r.id,
            productId: r.product_id,
            user_id: r.user_id,
            name: r.name,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.created_at,
        }));
    } catch (err) {
        console.warn('Failed to fetch all reviews:', err.message);
        return getLocalReviews();
    }
}
