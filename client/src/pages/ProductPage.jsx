import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import ProductDetail from '../components/ProductDetail';
import TrustSection from '../components/TrustSection';
import Testimonials from '../components/Testimonials';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products } = useAdmin();

    // Find the product by id or slug (loose equality handles string/number mismatch)
    const product = products.find(p => String(p.id) === String(id) || p.slug === id);

    if (!product) {
        return (
            <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-serif text-brand-primary mb-4">Product Not Found</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="px-8 py-3 bg-brand-primary text-brand-dark rounded-full font-medium hover:bg-brand-highlight transition-colors"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    return (
        <div key="product" className="animate-fade-in">
            <ProductDetail
                product={product}
                onBack={() => navigate('/shop')}
            />
            <TrustSection />
            <Testimonials />
        </div>
    );
};

export default ProductPage;
