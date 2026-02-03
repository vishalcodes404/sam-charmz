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

    const [policyTab, setPolicyTab] = useState('about');
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term) {
            handleNavigation('home'); // Go to home grid for search results
            setTimeout(() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    // Filter products based on search term (for Home Grid)
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const cartTotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[₹,]/g, ''));
        return total + price * (item.quantity || 1);
    }, 0);

    return (
        <div className="bg-gradient-animate min-h-screen">
            <Navbar
                cartCount={cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
                wishlistCount={wishlist.length}
                user={user}
                onSearch={handleSearch}
                onWishlistClick={() => setIsWishlistOpen(true)}
                onCartClick={() => setIsCartOpen(true)}
                onLogoClick={() => handleNavigation('home')}
                onShopClick={() => handleNavigation('shop')}
                onUserClick={() => setIsAuthOpen(true)}
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

            {currentView === 'product' && selectedProduct && (
                <>
                    <ProductDetail
                        product={selectedProduct}
                        onBack={() => handleNavigation('shop')}
                        addToCart={addToCart}
                        toggleWishlist={toggleWishlist}
                        isWishlisted={wishlist.includes(selectedProduct.id)}
                    />
                    <TrustSection />
                    <Testimonials />
                </>
            )}

            {currentView === 'shop' && (
                <Shop
                    addToCart={addToCart}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    onProductClick={handleProductClick}
                    initialCategory={selectedCategory}
                />
            )}

            {currentView === 'home' && (
                <>
                    <Hero onShopClick={() => handleNavigation('shop')} />
                    <TrustSection />
                    <Collections onCategoryClick={handleCategoryClick} />
                    <div id="products">
                        <ProductGrid
                            addToCart={addToCart}
                            products={filteredProducts}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            isSearching={searchTerm.length > 0}
                            onProductClick={handleProductClick}
                            onViewAll={() => handleNavigation('shop')}
                        />
                    </div>
                    <Testimonials />
                    <div id="brand-story">
                        <BrandStory />
                    </div>
                </>
            )}

            <div id="footer">
                <Footer onPolicyClick={handlePolicyClick} />
            </div>
        </div>
    );
}

export default App;
