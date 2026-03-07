import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts } from '../data/products';
import { deleteReviewsForProduct } from '../lib/reviews';

const ADMIN_EMAIL = 'admin@samcharmz.com';
const ADMIN_PASSWORD = 'admin@123';

const AdminContext = createContext(null);

// Default category images for seed data
const DEFAULT_CAT_IMAGES = {
    'Bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    'Hairbands': 'https://images.unsplash.com/photo-1582095133179-bfd08d2fc6a8?q=80&w=800&auto=format&fit=crop',
};

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function AdminProvider({ children }) {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
        return sessionStorage.getItem('adminLoggedIn') === 'true';
    });

    // --- Products ---
    // NOTE: base64 images stored in localStorage may hit browser size limits (~5-10MB).
    // For production, migrate to a backend upload endpoint (e.g. Cloudinary + POST /api/upload).
    const [products, setProducts] = useState(() => {
        const stored = localStorage.getItem('admin_products');
        const migrateImages = (p) => {
            if (p.images && Array.isArray(p.images)) return p;
            if (p.image) return { ...p, images: [p.image] };
            return { ...p, images: [] };
        };
        if (stored) {
            return JSON.parse(stored).map(migrateImages);
        }
        const seeded = defaultProducts.map(p => migrateImages({
            ...p,
            description: p.description || '',
            price: typeof p.price === 'string' ? parseFloat(p.price.replace(/[₹,]/g, '')) : p.price,
        }));
        localStorage.setItem('admin_products', JSON.stringify(seeded));
        return seeded;
    });

    // --- Categories (object array) ---
    const [categories, setCategories] = useState(() => {
        const stored = localStorage.getItem('admin_categories');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Migrate: if old format was string[], convert to objects
            if (parsed.length > 0 && typeof parsed[0] === 'string') {
                const migrated = parsed.map((name, i) => ({
                    id: Date.now() + i,
                    name,
                    slug: slugify(name),
                    image: DEFAULT_CAT_IMAGES[name] || '',
                    createdAt: new Date().toISOString(),
                }));
                localStorage.setItem('admin_categories', JSON.stringify(migrated));
                return migrated;
            }
            return parsed;
        }
        // Seed from default products
        const defaultCatNames = [...new Set(defaultProducts.map(p => p.category))];
        const seeded = defaultCatNames.map((name, i) => ({
            id: Date.now() + i,
            name,
            slug: slugify(name),
            image: DEFAULT_CAT_IMAGES[name] || '',
            createdAt: new Date().toISOString(),
        }));
        localStorage.setItem('admin_categories', JSON.stringify(seeded));
        return seeded;
    });

    // Backward compat helper — array of category name strings
    const categoryNames = categories.map(c => c.name);

    // --- Orders ---
    const [orders, setOrders] = useState(() => {
        const stored = localStorage.getItem('samcharmz_orders');
        return stored ? JSON.parse(stored) : [];
    });

    // Persist products
    useEffect(() => {
        localStorage.setItem('admin_products', JSON.stringify(products));
    }, [products]);

    // Persist categories
    useEffect(() => {
        localStorage.setItem('admin_categories', JSON.stringify(categories));
    }, [categories]);

    // --- Auth ---
    const adminLogin = (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            setIsAdminLoggedIn(true);
            return { success: true };
        }
        return { success: false, error: 'Invalid email or password.' };
    };

    const adminLogout = () => {
        sessionStorage.removeItem('adminLoggedIn');
        setIsAdminLoggedIn(false);
    };

    // --- Product CRUD ---
    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now(),
            price: parseFloat(product.price),
            description: product.description || '',
        };
        setProducts(prev => [...prev, newProduct]);
    };

    const editProduct = (id, updatedData) => {
        setProducts(prev =>
            prev.map(p => p.id === id ? { ...p, ...updatedData, price: parseFloat(updatedData.price) } : p)
        );
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        // Clean up reviews for the deleted product
        deleteReviewsForProduct(id);
        // Clean up cart/wishlist
        window.dispatchEvent(new CustomEvent('productDeleted', { detail: id }));
    };

    // --- Category CRUD (object-based) ---
    const addCategory = (name, image = '') => {
        const trimmed = name.trim();
        if (!trimmed || categories.some(c => c.name === trimmed)) {
            return { success: false, error: 'Category already exists or is empty.' };
        }
        const newCat = {
            id: Date.now(),
            name: trimmed,
            slug: slugify(trimmed),
            image: image.trim(),
            createdAt: new Date().toISOString(),
        };
        setCategories(prev => [...prev, newCat]);
        return { success: true };
    };

    const editCategory = (id, { name, image }) => {
        setCategories(prev => prev.map(c => {
            if (c.id !== id) return c;
            const newName = name?.trim() || c.name;
            // If name changed, update products too
            if (newName !== c.name) {
                setProducts(prevProducts =>
                    prevProducts.map(p => p.category === c.name ? { ...p, category: newName } : p)
                );
            }
            return {
                ...c,
                name: newName,
                slug: slugify(newName),
                image: image !== undefined ? image.trim() : c.image,
            };
        }));
        return { success: true };
    };

    const deleteCategory = (id) => {
        const cat = categories.find(c => c.id === id);
        if (!cat) return { success: false, error: 'Category not found.' };
        const inUse = products.some(p => p.category === cat.name);
        if (inUse) return { success: false, error: `Cannot delete "${cat.name}" — it has products assigned to it.` };
        setCategories(prev => prev.filter(c => c.id !== id));
        return { success: true };
    };

    // --- Orders ---
    const updateOrderStatus = (orderId, status) => {
        const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
        setOrders(updated);
        localStorage.setItem('samcharmz_orders', JSON.stringify(updated));
    };

    const refreshOrders = () => {
        const stored = localStorage.getItem('samcharmz_orders');
        setOrders(stored ? JSON.parse(stored) : []);
    };

    return (
        <AdminContext.Provider value={{
            isAdminLoggedIn,
            adminLogin,
            adminLogout,
            products,
            categories,
            categoryNames,
            orders,
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
