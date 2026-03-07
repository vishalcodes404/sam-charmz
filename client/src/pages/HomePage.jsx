import React from 'react';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import Collections from '../components/Collections';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import BrandStory from '../components/BrandStory';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ searchTerm, filteredProducts }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/shop?category=${encodeURIComponent(category)}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    const handleShopClick = () => {
        navigate('/shop');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    const handleProductClick = (product) => {
        // Assuming products have slug or id, we use id here
        navigate(`/product/${product.id || product.slug}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    return (
        <div key="home" className="animate-fade-in">
            {!searchTerm && <Hero onShopClick={handleShopClick} />}

            {!searchTerm && <TrustSection />}
            {!searchTerm && <Collections onCategoryClick={handleCategoryClick} />}

            <div id="products" className={searchTerm ? "pt-24" : ""}>
                <ProductGrid
                    products={filteredProducts}
                    isSearching={searchTerm.length > 0}
                    onProductClick={handleProductClick}
                    onViewAll={handleShopClick}
                />
            </div>

            {!searchTerm && <Testimonials />}
            {!searchTerm && <div id="brand-story"><BrandStory /></div>}
        </div>
    );
};

export default HomePage;
