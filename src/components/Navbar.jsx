import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ cartCount, wishlistCount, user, onSearch, onWishlistClick, onCartClick, onLogoClick, onShopClick, onUserClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 dark:bg-brand-dark/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-white/10 py-4'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center relative">
                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-brand-light"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 lg:opacity-100' : 'opacity-100'}`}>
                        <img src="/logo.jpg" alt="Sam Charmz" className="h-12 w-auto object-contain cursor-pointer" onClick={onLogoClick} />
                        <button onClick={onLogoClick} className="text-xl md:text-2xl font-serif italic font-bold tracking-tighter block text-brand-light">
                            Sam Charmz
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className={`hidden lg:flex items-center gap-12 font-sans font-medium text-sm tracking-wide transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <button
                            onClick={(e) => { e.preventDefault(); onLogoClick(); }}
                            className="relative group py-1 bg-transparent border-none cursor-pointer"
                        >
                            HOME
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
                        </button>

                        <button
                            onClick={(e) => { e.preventDefault(); onLogoClick(); setTimeout(() => { const el = document.getElementById('products'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 100); }}
                            className="relative group py-1 bg-transparent border-none cursor-pointer"
                        >
                            NEW ARRIVALS
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
                        </button>

                        <button
                            onClick={onShopClick}
                            className="relative group py-1 bg-transparent border-none cursor-pointer"
                        >
                            SHOP
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
                        </button>

                        <a
                            href="#brand-story"
                            onClick={(e) => {
                                if (!document.getElementById('brand-story')) {
                                    e.preventDefault();
                                    onLogoClick();
                                    setTimeout(() => {
                                        const el = document.getElementById('brand-story');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                }
                            }}
                            className="relative group py-1"
                        >
                            STORY
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
                        </a>

                        <a
                            href="#footer"
                            className="relative group py-1"
                        >
                            CONTACT
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </div>

                    {/* Search Bar Overlay */}
                    <div className={`absolute left-0 right-0 mx-auto w-full max-w-xl flex items-center justify-center transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                        <div className="relative w-full px-4 md:px-0">
                            <input
                                type="text"
                                placeholder="Search for jewelry..."
                                className="w-full border-b border-brand-dark py-2 pl-2 pr-10 bg-transparent outline-none font-sans text-sm placeholder-gray-500"
                                onChange={(e) => onSearch(e.target.value)}
                                autoFocus={isSearchOpen}
                            />
                            <button
                                onClick={() => { setIsSearchOpen(false); onSearch(''); }}
                                className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-6 z-10 text-brand-light">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="hover:opacity-70 transition-opacity"
                        >
                            <Search className="w-5 h-5 stroke-[1.5]" />
                        </button>

                        <button
                            onClick={onUserClick}
                            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                        >
                            <User className="w-5 h-5 stroke-[1.5]" />
                            {user && (
                                <span className="text-sm font-medium hidden lg:block">Hi, {user.firstName}</span>
                            )}
                        </button>

                        <button
                            onClick={onWishlistClick}
                            className="block hover:opacity-70 transition-opacity relative"
                        >
                            <Heart className="w-5 h-5 stroke-[1.5]" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={onCartClick}
                            className="relative hover:opacity-70 transition-opacity"
                        >
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                            <span className="absolute -top-2 -right-2 bg-brand-dark text-brand-gold text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                </div>
            </motion.nav>
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="fixed inset-0 z-50 bg-white p-6 lg:hidden"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-serif text-2xl italic">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 font-sans text-lg">
                            <button onClick={() => { setIsMobileMenuOpen(false); onLogoClick(); }} className="text-left border-b pb-2">Home</button>
                            <button onClick={() => { setIsMobileMenuOpen(false); onLogoClick(); }} className="text-left border-b pb-2">New Arrivals</button>
                            <button onClick={onShopClick} className="text-left border-b pb-2">Shop</button>
                            <a href="#brand-story" className="border-b pb-2" onClick={() => setIsMobileMenuOpen(false)}>Story</a>
                            <a href="#footer" className="border-b pb-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
                            <button onClick={() => { setIsMobileMenuOpen(false); onUserClick(); }} className="text-left border-b pb-2 font-bold">
                                {user ? `Hi, ${user.firstName}` : 'Sign In / Register'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
