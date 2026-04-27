import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const ShopContext = createContext();

const initialState = {
    cart: [],
    wishlist: [],
    user: null, // Supabase user object with added firstName/lastName
    isCartOpen: false,
    isWishlistOpen: false,
    isAuthOpen: false,
};

const shopReducer = (state, action) => {
    switch (action.type) {
        // Cart Actions
        case 'ADD_TO_CART': {
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            let newCart;
            if (existingItem) {
                newCart = state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: (item.quantity || 1) + (action.payload.quantity || 1) }
                        : item
                );
            } else {
                newCart = [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }];
            }
            return { ...state, cart: newCart, isCartOpen: true }; // Auto-open cart
        }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload)
            };
        case 'REMOVE_DELETED_PRODUCT':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload),
                wishlist: state.wishlist.filter(item => item.id !== action.payload)
            };
        case 'UPDATE_CART_QTY':
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + action.payload.change) }
                        : item
                )
            };
        case 'CLEAR_CART':
            return { ...state, cart: [] };
        case 'SET_CART':
            return { ...state, cart: Array.isArray(action.payload) ? action.payload : [] };

        // Wishlist Actions
        case 'SET_WISHLIST':
            return { ...state, wishlist: Array.isArray(action.payload) ? action.payload : [] };
        case 'TOGGLE_WISHLIST': {
            const product = action.payload;
            const exists = state.wishlist.some(item => item.id === product.id);
            let newWishlist;
            if (exists) {
                newWishlist = state.wishlist.filter(item => item.id !== product.id);
            } else {
                newWishlist = [...state.wishlist, product];
            }
            return { ...state, wishlist: newWishlist };
        }
        case 'MOVE_TO_CART': {
            // Payload is product object
            // 1. Add to cart
            // 2. Remove from wishlist
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            let newCartFromMove;
            if (existingItem) {
                newCartFromMove = state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            } else {
                newCartFromMove = [...state.cart, { ...action.payload, quantity: 1 }];
            }

            return {
                ...state,
                cart: newCartFromMove,
                wishlist: state.wishlist.filter(item => item.id !== action.payload.id),
                isCartOpen: true
            };
        }

        // Auth Actions
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthOpen: action.payload ? false : state.isAuthOpen };
        case 'LOGOUT':
            return { ...state, user: null, wishlist: [], cart: [] };

        // UI Actions
        case 'SET_CART_OPEN': return { ...state, isCartOpen: action.payload };
        case 'SET_WISHLIST_OPEN': return { ...state, isWishlistOpen: action.payload };
        case 'SET_AUTH_OPEN': return { ...state, isAuthOpen: action.payload };

        // Init
        case 'INIT_STATE': {
            const { cart, wishlist, user, ...rest } = action.payload || {};
            return {
                ...state,
                ...rest,
                cart: Array.isArray(cart) ? cart : [],
                wishlist: Array.isArray(wishlist) ? wishlist : [],
                user: user || null
            };
        }

        default:
            return state;
    }
};

// Helper: extract a friendly user object from Supabase session user
function extractUser(supabaseUser) {
    if (!supabaseUser) return null;
    const meta = supabaseUser.user_metadata || {};
    return {
        id: supabaseUser.id,
        email: supabaseUser.email,
        firstName: meta.first_name || meta.full_name?.split(' ')[0] || meta.name?.split(' ')[0] || '',
        lastName: meta.last_name || meta.full_name?.split(' ').slice(1).join(' ') || '',
        avatarUrl: meta.avatar_url || meta.picture || '',
        isLoggedIn: true,
    };
}

// ─── Cart localStorage helpers (user-specific keys) ───
function getCartKey(userId) {
    return userId ? `cart_${userId}` : 'guest_cart';
}

function loadCartFromStorage(userId) {
    try {
        const key = getCartKey(userId);
        const raw = localStorage.getItem(key);
        if (raw) {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) {
        console.error('Failed to load cart from localStorage', e);
    }
    return [];
}

function saveCartToStorage(userId, cart) {
    try {
        const key = getCartKey(userId);
        localStorage.setItem(key, JSON.stringify(cart));
    } catch (e) {
        console.error('Failed to save cart to localStorage', e);
    }
}

export const ShopProvider = ({ children }) => {
    const [state, dispatch] = useReducer(shopReducer, initialState);
    const [authLoading, setAuthLoading] = useState(true);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const initializedRef = useRef(false);
    const currentUserIdRef = useRef(null);

    // ─── Wishlist: Supabase helpers ───
    const fetchWishlistFromSupabase = useCallback(async (userId) => {
        if (!userId) {
            dispatch({ type: 'SET_WISHLIST', payload: [] });
            return;
        }
        setWishlistLoading(true);
        try {
            const { data, error } = await supabase
                .from('wishlists')
                .select('*, products(*)')
                .eq('user_id', userId);

            if (error) {
                console.error('Wishlist fetch error:', error.message);
                dispatch({ type: 'SET_WISHLIST', payload: [] });
                return;
            }

            // Map to product objects that match the existing wishlist shape
            const wishlistProducts = (data || [])
                .filter(row => row.products) // skip if product was deleted
                .map(row => ({
                    ...row.products,
                    image: row.products.images?.[0] || row.products.image || '',
                    _wishlistRowId: row.id, // keep Supabase row id for deletion
                }));

            dispatch({ type: 'SET_WISHLIST', payload: wishlistProducts });
        } catch (err) {
            console.error('Wishlist fetch exception:', err);
        } finally {
            setWishlistLoading(false);
        }
    }, []);

    // ─── Handle user change: load user-specific cart + wishlist ───
    const handleUserChange = useCallback(async (user) => {
        const userId = user?.id || null;

        // Avoid reprocessing the same user
        if (currentUserIdRef.current === userId && initializedRef.current) return;
        currentUserIdRef.current = userId;

        // Set user in state
        dispatch({ type: 'SET_USER', payload: user });

        // Load cart for this user (or guest)
        const cart = loadCartFromStorage(userId);
        dispatch({ type: 'SET_CART', payload: cart });

        // Load wishlist from Supabase (only for logged-in users)
        if (userId) {
            await fetchWishlistFromSupabase(userId);
        } else {
            dispatch({ type: 'SET_WISHLIST', payload: [] });
        }
    }, [fetchWishlistFromSupabase]);

    // ─── Supabase Auth Listener ───
    useEffect(() => {
        // 1. Check existing session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            const user = extractUser(session?.user ?? null);
            handleUserChange(user).then(() => {
                initializedRef.current = true;
                setAuthLoading(false);
            });
        });

        // 2. Listen for auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const user = extractUser(session?.user ?? null);
                handleUserChange(user).then(() => {
                    setAuthLoading(false);
                });
            }
        );

        return () => subscription.unsubscribe();
    }, [handleUserChange]);

    // ─── Cart Persistence (user-specific localStorage) ───
    useEffect(() => {
        // Don't save until initial load is done
        if (!initializedRef.current) return;
        saveCartToStorage(currentUserIdRef.current, state.cart);
    }, [state.cart]);

    // Cleanup Listener
    useEffect(() => {
        const handleProductDeleted = (e) => {
            dispatch({ type: 'REMOVE_DELETED_PRODUCT', payload: e.detail });
        };
        window.addEventListener('productDeleted', handleProductDeleted);
        return () => window.removeEventListener('productDeleted', handleProductDeleted);
    }, []);

    // ─── Actions ───
    const addToCart = (product, quantity = 1) => dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    const updateQuantity = (id, change) => dispatch({ type: 'UPDATE_CART_QTY', payload: { id, change } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    // Toggle wishlist — backed by Supabase for logged-in users
    const toggleWishlist = async (product) => {
        if (!state.user) {
            // Not logged in — prompt login
            dispatch({ type: 'SET_AUTH_OPEN', payload: true });
            return;
        }

        const exists = state.wishlist.some(item => item.id === product.id);

        if (exists) {
            // Remove from Supabase
            const { error } = await supabase
                .from('wishlists')
                .delete()
                .eq('user_id', state.user.id)
                .eq('product_id', product.id);

            if (error) {
                console.error('Wishlist remove error:', error.message);
                return;
            }
            dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
        } else {
            // Add to Supabase
            const { error } = await supabase
                .from('wishlists')
                .insert([{ user_id: state.user.id, product_id: product.id }]);

            if (error) {
                console.error('Wishlist add error:', error.message);
                return;
            }
            dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
        }
    };

    const moveToCart = async (product) => {
        if (!state.user) {
            dispatch({ type: 'SET_AUTH_OPEN', payload: true });
            return;
        }

        // Remove from Supabase wishlist
        await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', state.user.id)
            .eq('product_id', product.id);

        dispatch({ type: 'MOVE_TO_CART', payload: product });
    };

    // Auth is handled by Supabase — these are convenience wrappers
    const login = (userData) => dispatch({ type: 'SET_USER', payload: userData });
    const logout = async () => {
        const userId = currentUserIdRef.current;
        // Save current cart before clearing
        if (userId) {
            saveCartToStorage(userId, state.cart);
        }
        await supabase.auth.signOut();
        currentUserIdRef.current = null;
        dispatch({ type: 'LOGOUT' });
        // Load guest cart
        const guestCart = loadCartFromStorage(null);
        dispatch({ type: 'SET_CART', payload: guestCart });
    };

    const openCart = () => dispatch({ type: 'SET_CART_OPEN', payload: true });
    const closeCart = () => dispatch({ type: 'SET_CART_OPEN', payload: false });

    const openWishlist = () => {
        if (!state.user) {
            dispatch({ type: 'SET_AUTH_OPEN', payload: true });
            return;
        }
        dispatch({ type: 'SET_WISHLIST_OPEN', payload: true });
    };
    const closeWishlist = () => dispatch({ type: 'SET_WISHLIST_OPEN', payload: false });

    const openAuth = () => dispatch({ type: 'SET_AUTH_OPEN', payload: true });
    const closeAuth = () => dispatch({ type: 'SET_AUTH_OPEN', payload: false });

    const value = {
        ...state,
        authLoading,
        wishlistLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        moveToCart,
        login,
        logout,
        openCart,
        closeCart,
        openWishlist,
        closeWishlist,
        openAuth,
        closeAuth
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error("useShop must be used within a ShopProvider");
    }
    return context;
};
