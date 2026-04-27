import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useShop } from './context/ShopContext';
import { useAdmin } from './context/AdminContext';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import PolicyModal from './components/PolicyModal';
import AuthModal from './components/AuthModal';

import MobileBottomNav from './components/MobileBottomNav';
import MobileSearchBar from './components/ui/MobileSearchBar';

// Integrated Background Animation
import SlowBackground from './components/ui/SlowBackground';

import Preloader from './components/Preloader';

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // Search State
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [policyTab, setPolicyTab] = useState('about');
    const [isPolicyOpen, setIsPolicyOpen] = useState(false);

    // Scroll to top instantly on any structural route change or search param change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [location.pathname, location.search]);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
        // If we are on product or admin page and user searches, navigate home 
        if (term.length > 0 && location.pathname !== '/' && location.pathname !== '/shop') {
            navigate('/');
        }
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(prev => !prev);
    };

    const handlePolicyClick = (tab = 'about') => {
        setPolicyTab(tab);
        setIsPolicyOpen(true);
    };

    // Read products from AdminContext (localStorage), fallback to static data
    const { products: adminProducts } = useAdmin();
    const allProducts = adminProducts;

    const filteredProducts = allProducts.filter(product => {
        const lowerTerm = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(lowerTerm) ||
            product.category.toLowerCase().includes(lowerTerm) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerTerm)))
        );
    });

    // Determine current logical view for MobileBottomNav
    const currentView = location.pathname.includes('/admin') ? 'admin' :
        location.pathname.includes('/shop') ? 'shop' :
            location.pathname.includes('/product') ? 'product' : 'home';

    // Admin panel view handled separately (no standard navbar/footer overlay)
    if (location.pathname.startsWith('/admin')) {
        return (
            <div className="relative min-h-screen text-brand-light bg-brand-dark overflow-x-hidden">
                <Preloader />
                <SlowBackground />
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center tracking-widest uppercase font-sans text-xs text-brand-gray">Loading...</div>}>
                        <Routes>
                            <Route path="/admin/*" element={<AdminPage />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen text-brand-light bg-brand-dark overflow-x-hidden">
            <Preloader />
            {/* Background Animation - Fixed to screen */}
            <SlowBackground />

            {/* Drawers & Modals attached to Context State */}
            <CartDrawer />
            <WishlistDrawer />
            <AuthModal />

            <div className="relative z-10 flex flex-col min-h-screen">

                <Navbar
                    onSearch={handleSearchChange}
                    searchTerm={searchTerm}
                    onLogoClick={() => navigate('/')}
                    onShopClick={() => navigate('/shop')}
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
                    onNavigate={(view) => {
                        if (view === 'home') navigate('/');
                        if (view === 'shop') navigate('/shop');
                        if (view === 'admin') navigate('/admin');
                        window.scrollTo(0, 0);
                    }}
                    onSearchClick={toggleMobileSearch}
                />

                <div className="min-h-screen">
                    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center tracking-widest uppercase font-sans text-xs text-brand-gray">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<HomePage searchTerm={searchTerm} filteredProducts={filteredProducts} />} />
                            <Route path="/shop" element={<ShopPage searchTerm={searchTerm} />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                        </Routes>
                    </Suspense>
                </div>

                <div id="footer">
                    <Footer onPolicyClick={handlePolicyClick} onAdminClick={() => navigate('/admin')} />
                </div>
            </div>

            <PolicyModal
                isOpen={isPolicyOpen}
                onClose={() => setIsPolicyOpen(false)}
                defaultTab={policyTab}
            />


        </div>
    );
}

export default App;
