import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collections from './components/Collections';
import ProductGrid from './components/ProductGrid';
import BrandStory from './components/BrandStory';
import Footer from './components/Footer';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import ProductDetail from './components/ProductDetail';
import Shop from './components/Shop';
import TrustSection from './components/TrustSection';
import Testimonials from './components/Testimonials';
import CheckoutModal from './components/CheckoutModal';
import PolicyModal from './components/PolicyModal';
import AuthModal from './components/AuthModal';
import { products } from './data/products';

import MobileBottomNav from './components/MobileBottomNav';
import MobileSearchBar from './components/ui/MobileSearchBar'; // New component
import RevealOnScroll from './components/ui/RevealOnScroll';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState(null); // { firstName, lastName, ... }

    // Modal States
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isPolicyOpen, setIsPolicyOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    // Search State
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [policyTab, setPolicyTab] = useState('about');

    // View State: 'home', 'shop', 'product'
    const [currentView, setCurrentView] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const handleLogin = (userData) => {
        // If logging in via normal login (no name provided), Mock a name
        const finalUser = {
            ...userData,
            firstName: userData.firstName || "Sam", // Default mock name for demo
            lastName: userData.lastName || "Charmz"
        };
        setUser(finalUser);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setCurrentView('product');
        window.scrollTo(0, 0);
    };

    const handleNavigation = (view) => {
        setCurrentView(view);
        setSelectedProduct(null);
        window.scrollTo(0, 0);
        // If navigating away from search context, maybe clear search? 
        // User requested "search must work inside same shop/product listing UI".
        // If they navigate via bottom nav properties, we should probably keep search term if it's 'shop' or 'home'?
        // Actually typically navigation clears search, but let's keep it simple.
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentView('shop');
        window.scrollTo(0, 0);
    };

    const handlePolicyClick = (tab = 'about') => {
        setPolicyTab(tab);
        setIsPolicyOpen(true);
    };

    const addToCart = (product) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
                        : item
                );
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateCartQuantity = (id, change) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, (item.quantity || 1) + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const toggleWishlist = (id) => {
        setWishlist(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
        // Instant search updates state.
        // If we are on 'product' detail view, we should probably switch to 'home' or 'shop' to show results?
        // Let's switch to 'home' where the main grid is, OR 'shop'. 
        // User said "Search must work inside the same Shop/Product listing UI".
        // Let's default to 'home' grid if not there.
        if (currentView === 'product' && term.length > 0) {
            setCurrentView('home');
        }

        // Ensure we are scrolled to products if searching (optional, but good UX)
        // Only scroll if we are very far up? User said "no jump".
        // Let's avoid scrolling automatically on every keystroke. 
    };

    // Toggle mobile search bar stability
    const toggleMobileSearch = () => {
        setShowMobileSearch(prev => !prev);
        // When opening, maybe ensure we are on a list view?
        if (!showMobileSearch && currentView === 'product') {
            setCurrentView('home');
        }
    };

    // Filter products based on search term (for Home Grid)
    // Debounce is handled by React's natural batching for now, 
    // but for larger lists we might need explicit debounce. 
    // Given the list is small, direct filtering is fine and fastest (instant).
    const filteredProducts = products.filter(product => {
        const lowerTerm = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(lowerTerm) ||
            product.category.toLowerCase().includes(lowerTerm) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerTerm)))
        );
    });

    const cartTotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[₹,]/g, ''));
        return total + price * (item.quantity || 1);
    }, 0);

    return (
        <div className="relative min-h-screen text-brand-light overflow-x-hidden selection:bg-brand-primary selection:text-brand-dark">
            {/* Debug Overlay Removed */}

            {/* Main Content Wrapper - Ensure z-index is higher than background */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar
                    cartCount={cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
                    wishlistCount={wishlist.length}
                    user={user}
                    onSearch={handleSearchChange} // Desktop inline search
                    searchTerm={searchTerm} // Pass current term to sync
                    onWishlistClick={() => setIsWishlistOpen(true)}
                    onCartClick={() => setIsCartOpen(true)}
                    onLogoClick={() => handleNavigation('home')}
                    onShopClick={() => handleNavigation('shop')}
                    onUserClick={() => setIsAuthOpen(true)}
                />

                <MobileSearchBar
                    isOpen={showMobileSearch}
                    onClose={() => {
                        setShowMobileSearch(false);
                        setSearchTerm(''); // Optional: clear on close? User didn't specify, but usually "X" clears, "Cancel" closes.
                    }}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />

                <MobileBottomNav
                    currentView={currentView}
                    onNavigate={handleNavigation}
                    onSearchClick={toggleMobileSearch}
                    onCartClick={() => setIsCartOpen(true)}
                    cartCount={cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
                    isSearchOpen={showMobileSearch}
                />

                <WishlistDrawer
                    isOpen={isWishlistOpen}
                    onClose={() => setIsWishlistOpen(false)}
                    wishlistItems={wishlist}
                    products={products}
                    removeFromWishlist={toggleWishlist}
                    addToCart={(id) => {
                        const product = products.find(p => p.id === id);
                        if (product) addToCart(product);
                    }}
                />

                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    cartItems={cartItems}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateCartQuantity}
                    onCheckout={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                    }}
                />

                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    cartItems={cartItems}
                    total={cartTotal}
                />

                <PolicyModal
                    isOpen={isPolicyOpen}
                    onClose={() => setIsPolicyOpen(false)}
                    defaultTab={policyTab}
                />

                <AuthModal
                    isOpen={isAuthOpen}
                    onClose={() => setIsAuthOpen(false)}
                    onLogin={handleLogin}
                />

                <div className="min-h-screen">
                    {currentView === 'product' && selectedProduct && (
                        <div key="product" className="animate-fade-in">
                            <ProductDetail
                                product={selectedProduct}
                                onBack={() => handleNavigation('shop')}
                                addToCart={addToCart}
                                toggleWishlist={toggleWishlist}
                                isWishlisted={wishlist.includes(selectedProduct.id)}
                            />
                            <RevealOnScroll>
                                <TrustSection />
                            </RevealOnScroll>
                            <RevealOnScroll>
                                <Testimonials />
                            </RevealOnScroll>
                        </div>
                    )}

                    {currentView === 'shop' && (
                        <div key="shop" className="animate-fade-in">
                            <Shop
                                addToCart={addToCart}
                                wishlist={wishlist}
                                toggleWishlist={toggleWishlist}
                                onProductClick={handleProductClick}
                                initialCategory={selectedCategory}
                            />
                        </div>
                    )}

                    {currentView === 'home' && (
                        <div key="home" className="animate-fade-in">
                            {/* Hide Hero when searching to focus on results */}
                            {!searchTerm && <Hero onShopClick={() => handleNavigation('shop')} />}

                            {!searchTerm && (
                                <RevealOnScroll>
                                    <TrustSection />
                                </RevealOnScroll>
                            )}

                            {!searchTerm && (
                                <RevealOnScroll>
                                    <Collections onCategoryClick={handleCategoryClick} />
                                </RevealOnScroll>
                            )}

                            <div id="products" className={searchTerm ? "pt-24" : ""}>
                                {/* Pass 'disableAnimations' prop to ProductGrid if searching */}
                                <ProductGrid
                                    addToCart={addToCart}
                                    products={filteredProducts}
                                    wishlist={wishlist}
                                    toggleWishlist={toggleWishlist}
                                    isSearching={searchTerm.length > 0}
                                    onProductClick={handleProductClick}
                                    onViewAll={() => handleNavigation('shop')}
                                    disableAnimations={true}
                                />
                            </div>

                            {!searchTerm && (
                                <RevealOnScroll>
                                    <Testimonials />
                                </RevealOnScroll>
                            )}

                            {!searchTerm && (
                                <div id="brand-story">
                                    <RevealOnScroll>
                                        <BrandStory />
                                    </RevealOnScroll>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div id="footer">
                    <Footer onPolicyClick={handlePolicyClick} />
                </div>
            </div>
        </div>
    );
}

export default App;
