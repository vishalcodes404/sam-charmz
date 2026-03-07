import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Shop from '../components/Shop';

const ShopPage = ({ searchTerm }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Default to "All" if no category is in URL
    const category = searchParams.get('category') || 'All';

    const handleProductClick = (product) => {
        navigate(`/product/${product.id || product.slug}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    return (
        <div key="shop" className="animate-fade-in">
            <Shop
                onProductClick={handleProductClick}
                initialCategory={category}
                searchTerm={searchTerm}
            />
        </div>
    );
};

export default ShopPage;
