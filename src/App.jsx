import React, { useState } from 'react';
import { useShop } from './context/ShopContext';

// Components
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

import MobileBottomNav from './components/MobileBottomNav';
import MobileSearchBar from './components/ui/MobileSearchBar';

// Integrated Background Animation
import { BackgroundGradientAnimation } from './components/ui/background-gradient-animation';

import { products } from './data/products';

function App() {
    // Context hook is used in Main, or Components, but we need to declare App inside provider.
    // App handles Routing/View State
    const [currentView, setCurrentView] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Search State
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [policyTab, setPolicyTab] = useState('about');
    const [isPolicyOpen, setIsPolicyOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

    const handleSearchChange = (term) => {
        setSearchTerm(term);
        if (currentView === 'product' && term.length > 0) {
            setCurrentView('home');
        }
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(prev => !prev);
    };

    const handlePolicyClick = (tab = 'about') => {
        setPolicyTab(tab);
        setIsPolicyOpen(true);
    };

    const filteredProducts = products.filter(product => {
        const lowerTerm = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(lowerTerm) ||
            product.category.toLowerCase().includes(lowerTerm) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerTerm)))
        );
    });

    return (
        <div className="relative min-h-screen text-brand-light bg-brand-dark overflow-x-hidden">
            {/* Background Animation - Fixed to screen */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <BackgroundGradientAnimation containerClassName="h-full w-full" />
            </div>

            {/* Drawers & Modals attached to Context State */}
            <CartDrawer />
            <WishlistDrawer />
            <AuthModal />

            <div className="relative z-10 flex flex-col min-h-screen">

                <Navbar
                    onSearch={handleSearchChange}
                    searchTerm={searchTerm}
                    onLogoClick={() => handleNavigation('home')}
                    onShopClick={() => handleNavigation('shop')}
                />

                <MobileSearchBar
                    isOpen={showMobileSearch}
                    onClose={() => {
                        setShowMobileSearch(false);
                        setSearchTerm('');
                    }}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />

                <MobileBottomNav
                    currentView={currentView}
                    onNavigate={handleNavigation}
                    onSearchClick={toggleMobileSearch}
                />

                <div className="min-h-screen">
                    {currentView === 'product' && selectedProduct && (
                        <div key="product" className="animate-fade-in">
                            <ProductDetail
                                product={selectedProduct}
                                onBack={() => handleNavigation('shop')}
                            />
                            <TrustSection />
                            <Testimonials />
                        </div>
                    )}

                    {currentView === 'shop' && (
                        <div key="shop" className="animate-fade-in">
                            <Shop
                                onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product'); }}
                                initialCategory={selectedCategory}
                            />
                        </div>
                    )}

                    {currentView === 'home' && (
                        <div key="home" className="animate-fade-in">
                            {!searchTerm && <Hero onShopClick={() => handleNavigation('shop')} />}


                            {!searchTerm && <TrustSection />}
                            {!searchTerm && <Collections onCategoryClick={handleCategoryClick} />}

                            <div id="products" className={searchTerm ? "pt-24" : ""}>
                                <ProductGrid
                                    products={filteredProducts}
                                    isSearching={searchTerm.length > 0}
                                    onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product'); }}
                                    onViewAll={() => handleNavigation('shop')}
                                />
                            </div>

                            {!searchTerm && <Testimonials />}
                            {!searchTerm && <div id="brand-story"><BrandStory /></div>}
                        </div>
                    )}
                </div>

                <div id="footer">
                    <Footer onPolicyClick={handlePolicyClick} />
                </div>
            </div>

            <PolicyModal
                isOpen={isPolicyOpen}
                onClose={() => setIsPolicyOpen(false)}
                defaultTab={policyTab}
            />

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />

        </div>
    );
}

export default App;
