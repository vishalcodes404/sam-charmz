import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
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

        // Wishlist Actions
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
            return { ...state, user: null };

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

export const ShopProvider = ({ children }) => {
    const [state, dispatch] = useReducer(shopReducer, initialState);
    const [authLoading, setAuthLoading] = useState(true);

    // ─── Supabase Auth Listener ───
    useEffect(() => {
        // 1. Check existing session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            dispatch({ type: 'SET_USER', payload: extractUser(session?.user ?? null) });
            setAuthLoading(false);
        });

        // 2. Listen for auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                dispatch({ type: 'SET_USER', payload: extractUser(session?.user ?? null) });
                setAuthLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // ─── Cart/Wishlist Persistence (localStorage — device-level, not account-level) ───
    useEffect(() => {
        const localData = localStorage.getItem('samCharmzState');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                // Only restore cart & wishlist, NOT user (user comes from Supabase)
                dispatch({ type: 'INIT_STATE', payload: { cart: parsed.cart, wishlist: parsed.wishlist } });
            } catch (e) {
                console.error("Failed to parse local storage", e);
            }
        }
    }, []);

    useEffect(() => {
        const dataToSave = {
            cart: state.cart,
            wishlist: state.wishlist,
        };
        localStorage.setItem('samCharmzState', JSON.stringify(dataToSave));
    }, [state.cart, state.wishlist]);

    // Cleanup Listener
    useEffect(() => {
        const handleProductDeleted = (e) => {
            dispatch({ type: 'REMOVE_DELETED_PRODUCT', payload: e.detail });
        };
        window.addEventListener('productDeleted', handleProductDeleted);
        return () => window.removeEventListener('productDeleted', handleProductDeleted);
    }, []);

    // Actions
    const addToCart = (product, quantity = 1) => dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    const updateQuantity = (id, change) => dispatch({ type: 'UPDATE_CART_QTY', payload: { id, change } });

    // Toggle needs full product for adding, but checking existence only needs ID.
    // We will assume 'product' is passed.
    const toggleWishlist = (product) => dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    const moveToCart = (product) => dispatch({ type: 'MOVE_TO_CART', payload: product });

    // Auth is handled by Supabase — these are convenience wrappers
    const login = (userData) => dispatch({ type: 'SET_USER', payload: userData });
    const logout = async () => {
        await supabase.auth.signOut();
        dispatch({ type: 'LOGOUT' });
    };

    const openCart = () => dispatch({ type: 'SET_CART_OPEN', payload: true });
    const closeCart = () => dispatch({ type: 'SET_CART_OPEN', payload: false });

    const openWishlist = () => dispatch({ type: 'SET_WISHLIST_OPEN', payload: true });
    const closeWishlist = () => dispatch({ type: 'SET_WISHLIST_OPEN', payload: false });

    const openAuth = () => dispatch({ type: 'SET_AUTH_OPEN', payload: true });
    const closeAuth = () => dispatch({ type: 'SET_AUTH_OPEN', payload: false });

    const value = {
        ...state,
        authLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
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
