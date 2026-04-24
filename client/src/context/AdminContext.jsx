import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext(null);

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function AdminProvider({ children }) {
    // ─── Admin Auth (Supabase-based) ───
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [adminChecking, setAdminChecking] = useState(true);

    // ─── Data State ───
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Backward-compat: array of category name strings
    const categoryNames = categories.map(c => c.name);

    // ─── Check admin status on mount ───
    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', session.user.id)
                    .single();
                setIsAdminLoggedIn(profile?.is_admin === true);
            }
            setAdminChecking(false);
        };
        checkAdmin();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('is_admin')
                        .eq('id', session.user.id)
                        .single();
                    setIsAdminLoggedIn(profile?.is_admin === true);
                } else {
                    setIsAdminLoggedIn(false);
                }
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    // ─── Fetch all data from Supabase ───
    const fetchProducts = useCallback(async () => {
        const { data, error: err } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (err) { setError(err.message); return; }
        setProducts(data || []);
    }, []);

    const fetchCategories = useCallback(async () => {
        const { data, error: err } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });
        if (err) { setError(err.message); return; }
        setCategories(data || []);
    }, []);

    const fetchOrders = useCallback(async () => {
        const { data, error: err } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        if (err) { console.error('Orders fetch error:', err.message); return; }
        setOrders(data || []);
    }, []);

    // Initial data load
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchCategories(), fetchOrders()]);
            setLoading(false);
        };
        loadAll();
    }, [fetchProducts, fetchCategories, fetchOrders]);

    // ─── Admin Auth ───
    const adminLogin = async (email, password) => {
        try {
            const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
            if (authErr) return { success: false, error: authErr.message };

            // Check if user has admin privilege
            const { data: profile, error: profileErr } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', data.user.id)
                .single();

            if (profileErr || !profile?.is_admin) {
                await supabase.auth.signOut();
                return { success: false, error: 'Access denied. This account does not have admin privileges.' };
            }

            setIsAdminLoggedIn(true);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || 'Login failed.' };
        }
    };

    const adminLogout = async () => {
        await supabase.auth.signOut();
        setIsAdminLoggedIn(false);
    };

    // ─── Product CRUD ───
    const addProduct = async (product) => {
        const newProduct = {
            name: product.name,
            price: parseFloat(product.price),
            category: product.category,
            description: product.description || '',
            images: product.images || [],
        };
        const { data, error: err } = await supabase
            .from('products')
            .insert([newProduct])
            .select()
            .single();
        if (err) { setError(err.message); return { success: false, error: err.message }; }
        setProducts(prev => [data, ...prev]);
        return { success: true, data };
    };

    const editProduct = async (id, updatedData) => {
        const updates = {
            name: updatedData.name,
            price: parseFloat(updatedData.price),
            category: updatedData.category,
            description: updatedData.description || '',
            images: updatedData.images || [],
        };
        const { data, error: err } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (err) { setError(err.message); return { success: false, error: err.message }; }
        setProducts(prev => prev.map(p => p.id === id ? data : p));
        return { success: true, data };
    };

    const deleteProduct = async (id) => {
        const { error: err } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (err) { setError(err.message); return { success: false, error: err.message }; }
        setProducts(prev => prev.filter(p => p.id !== id));
        // Notify shop context to clean up cart/wishlist
        window.dispatchEvent(new CustomEvent('productDeleted', { detail: id }));
        return { success: true };
    };

    // ─── Category CRUD ───
    const addCategory = async (name, image = '') => {
        const trimmed = name.trim();
        if (!trimmed || categories.some(c => c.name === trimmed)) {
            return { success: false, error: 'Category already exists or is empty.' };
        }
        const newCat = {
            name: trimmed,
            slug: slugify(trimmed),
            image: image.trim(),
        };
        const { data, error: err } = await supabase
            .from('categories')
            .insert([newCat])
            .select()
            .single();
        if (err) { setError(err.message); return { success: false, error: err.message }; }
        setCategories(prev => [...prev, data]);
        return { success: true };
    };

    const editCategory = async (id, { name, image }) => {
        const cat = categories.find(c => c.id === id);
        if (!cat) return { success: false, error: 'Category not found.' };

        const newName = name?.trim() || cat.name;
        const updates = {
            name: newName,
            slug: slugify(newName),
            image: image !== undefined ? image.trim() : cat.image,
        };

        const { data, error: err } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (err) { setError(err.message); return { success: false, error: err.message }; }

        // If category name changed, update products that use the old name
        if (newName !== cat.name) {
            await supabase
                .from('products')
                .update({ category: newName })
                .eq('category', cat.name);
            // Refresh products to reflect the name change
            await fetchProducts();
        }

        setCategories(prev => prev.map(c => c.id === id ? data : c));
        return { success: true };
    };

    const deleteCategory = async (id) => {
        const cat = categories.find(c => c.id === id);
        if (!cat) return { success: false, error: 'Category not found.' };
        const inUse = products.some(p => p.category === cat.name);
        if (inUse) return { success: false, error: `Cannot delete "${cat.name}" — it has products assigned to it.` };

        const { error: err } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);
        if (err) { setError(err.message); return { success: false, error: err.message }; }
        setCategories(prev => prev.filter(c => c.id !== id));
        return { success: true };
    };

    // ─── Orders ───
    const updateOrderStatus = async (orderId, status) => {
        const { error: err } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);
        if (err) { setError(err.message); return; }
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    const refreshOrders = async () => {
        await fetchOrders();
    };

    return (
        <AdminContext.Provider value={{
            isAdminLoggedIn,
            adminChecking,
            adminLogin,
            adminLogout,
            products,
            categories,
            categoryNames,
            orders,
            loading,
            error,
            addProduct,
            editProduct,
            deleteProduct,
            addCategory,
            editCategory,
            deleteCategory,
            updateOrderStatus,
            refreshOrders,
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
    return ctx;
}
