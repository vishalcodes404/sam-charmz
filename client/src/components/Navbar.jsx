import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onSearch, searchTerm, onLogoClick, onShopClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        cart, wishlist, user,
        openCart, openWishlist, openAuth
    } = useShop();

    const handleOurStoryClick = (e) => {
        if (e) e.preventDefault();

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const wishlistCount = wishlist.length;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        onSearch(query);
    };

    const toggleSearch = () => {
        setIsSearchExpanded(!isSearchExpanded);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
                    ? 'bg-brand-dark/90 backdrop-blur-md border-brand-light/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
                    : 'bg-transparent border-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative">
                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 -ml-2 text-brand-light hover:bg-brand-light/10 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <div
                        onClick={onLogoClick}
                        className="flex items-center gap-2 cursor-pointer absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mr-8"
                    >
                        <span className="font-serif text-2xl md:text-3xl italic font-bold tracking-tighter text-brand-light">
                            Sam <span className="text-brand-primary">Charmz</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8 mx-auto">
                        <NavLink onClick={onLogoClick} text="Home" />
                        <NavLink onClick={onShopClick} text="Collections" />
                        <NavLink onClick={() => { onLogoClick(); navigate('/orders'); }} text="Order Details" />
                    </div>

                    {/* Right Icons & Actions */}
                    <div className="flex items-center gap-3">
                        {/* Inline Search (Desktop) */}
                        <div className="hidden lg:flex items-center relative group">
                            <AnimatePresence>
                                {isSearchExpanded && (
                                    <motion.input
                                        ref={searchInputRef}
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 200, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="bg-brand-light/5 border border-brand-light/20 rounded-full py-1.5 px-4 text-sm text-brand-light placeholder:text-brand-gray focus:outline-none focus:border-brand-primary mr-2"
                                    />
                                )}
                            </AnimatePresence>
                            <button onClick={toggleSearch} className="p-2 hover:bg-brand-light/10 rounded-full transition-colors text-brand-light hover:text-brand-primary">
                                {isSearchExpanded ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="hidden lg:flex items-center gap-2 border-l border-brand-light/10 pl-3">
                            <button onClick={openWishlist} className="relative p-2 hover:bg-brand-light/10 rounded-full transition-colors text-brand-light hover:text-brand-primary">
                                <Heart className="w-5 h-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-brand-secondary text-brand-dark text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>
                            <button onClick={openAuth} className="p-2 hover:bg-brand-light/10 rounded-full transition-colors text-brand-light hover:text-brand-primary flex items-center gap-2">
                                <User className="w-5 h-5" />
                                {user && <span className="text-xs font-medium hidden xl:block">{user.firstName}</span>}
                            </button>
                        </div>

                        {/* Cart Button */}
                        <button onClick={openCart} className="relative p-2 hover:bg-brand-light/10 rounded-full transition-colors text-brand-light hover:text-brand-primary group">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute top-0 right-0 bg-brand-primary text-brand-dark text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Full Screen Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-brand-dark flex flex-col"
                    >
                        <div className="p-5 flex justify-between items-center border-b border-brand-light/10">
                            <span className="font-serif text-2xl italic font-bold text-brand-light">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 -mr-2 hover:bg-brand-light/10 rounded-full text-brand-light"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center gap-8 p-8">
                            <MobileNavLink onClick={() => { setIsMobileMenuOpen(false); onLogoClick(); }} text="Home" delay={0.1} />
                            <MobileNavLink onClick={() => { setIsMobileMenuOpen(false); onShopClick(); }} text="Collections" delay={0.2} />
                            <MobileNavLink onClick={() => { setIsMobileMenuOpen(false); openWishlist(); }} text="Wishlist" delay={0.25} />
                            <MobileNavLink onClick={() => { setIsMobileMenuOpen(false); navigate('/orders'); }} text="Order Details" delay={0.3} />

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => { setIsMobileMenuOpen(false); openAuth(); }}
                                className="mt-8 text-sm font-medium text-brand-primary hover:text-brand-light transition-colors"
                            >
                                {user ? `Signed in as ${user.firstName}` : 'Sign In / Register'}
                            </motion.button>
                        </div>

                        <div className="p-8 text-center border-t border-brand-light/10">
                            <p className="text-brand-gray text-xs uppercase tracking-widest">Designed for elegance</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const NavLink = ({ text, onClick, href }) => (
    href ? (
        <a href={href} className="text-sm font-medium tracking-wide text-brand-light/80 hover:text-brand-primary transition-colors relative group">
            {text}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-primary transition-all group-hover:w-full" />
        </a>
    ) : (
        <button onClick={onClick} className="text-sm font-medium tracking-wide text-brand-light/80 hover:text-brand-primary transition-colors relative group">
            {text}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-primary transition-all group-hover:w-full" />
        </button>
    )
);

const MobileNavLink = ({ text, onClick, href, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
    >
        {href ? (
            <a href={href} onClick={onClick} className="font-serif text-3xl text-brand-light hover:text-brand-primary transition-colors block">
                {text}
            </a>
        ) : (
            <button onClick={onClick} className="font-serif text-3xl text-brand-light hover:text-brand-primary transition-colors">
                {text}
            </button>
        )}
    </motion.div>
);

export default Navbar;
