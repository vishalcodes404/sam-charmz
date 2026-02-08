import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, Search, Grid, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';

const MobileBottomNav = ({ currentView, onNavigate, onSearchClick }) => {
    const { cart, openCart, wishlist, openWishlist } = useShop();
    const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navItems = [
        { id: 'home', icon: Home, label: 'Home', action: () => onNavigate('home') },
        { id: 'shop', icon: Grid, label: 'Shop', action: () => onNavigate('shop') },
        { id: 'search', icon: Search, label: 'Search', action: onSearchClick },
        {
            id: 'wishlist',
            icon: Heart,
            label: 'Wishlist',
            action: openWishlist,
            badge: wishlist.length
        },
        {
            id: 'cart',
            icon: ShoppingBag,
            label: 'Cart',
            action: openCart,
            badge: cartCount
        },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-white/10 px-6 py-3 flex justify-between items-center z-40 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.5)] backdrop-blur-lg"
                >
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={item.action}
                                className={`flex flex-col items-center gap-1 relative transition-colors ${isActive ? 'text-brand-primary' : 'text-gray-400 hover:text-brand-light'}`}
                            >
                                <div className="relative">
                                    <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                                    {item.badge > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-brand-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-lg">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium tracking-wide font-sans">{item.label}</span>
                            </button>
                        );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileBottomNav;
