import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ShopContext = createContext();

const initialState = {
    cart: [],
    wishlist: [],
    user: null, // { name, email, isLoggedIn }
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
        case 'LOGIN':
            return { ...state, user: { ...action.payload, isLoggedIn: true }, isAuthOpen: false };
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

export const ShopProvider = ({ children }) => {
    const [state, dispatch] = useReducer(shopReducer, initialState);

    // Persistence Init
    useEffect(() => {
        const localData = localStorage.getItem('samCharmzState');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                dispatch({ type: 'INIT_STATE', payload: parsed });
            } catch (e) {
                console.error("Failed to parse local storage", e);
            }
        }
    }, []);

    // Persistence Update
    useEffect(() => {
        // Only save data, not UI state (don't want to re-open drawers on refresh)
        const dataToSave = {
            cart: state.cart,
            wishlist: state.wishlist,
            user: state.user
        };
        localStorage.setItem('samCharmzState', JSON.stringify(dataToSave));
    }, [state.cart, state.wishlist, state.user]);

    // Actions
    const addToCart = (product, quantity = 1) => dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    const updateQuantity = (id, change) => dispatch({ type: 'UPDATE_CART_QTY', payload: { id, change } });

    // Toggle needs full product for adding, but checking existence only needs ID.
    // We will assume 'product' is passed.
    const toggleWishlist = (product) => dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    const moveToCart = (product) => dispatch({ type: 'MOVE_TO_CART', payload: product });

    const login = (userData) => dispatch({ type: 'LOGIN', payload: userData });
    const logout = () => dispatch({ type: 'LOGOUT' });

    const openCart = () => dispatch({ type: 'SET_CART_OPEN', payload: true });
    const closeCart = () => dispatch({ type: 'SET_CART_OPEN', payload: false });

    const openWishlist = () => dispatch({ type: 'SET_WISHLIST_OPEN', payload: true });
    const closeWishlist = () => dispatch({ type: 'SET_WISHLIST_OPEN', payload: false });

    const openAuth = () => dispatch({ type: 'SET_AUTH_OPEN', payload: true });
    const closeAuth = () => dispatch({ type: 'SET_AUTH_OPEN', payload: false });

    const value = {
        ...state,
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
