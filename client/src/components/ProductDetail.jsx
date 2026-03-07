import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShinyButton } from './ui/ShinyButton';
import ProductReviews from './ProductReviews';

const ProductDetail = ({ product, onBack }) => {
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const isWishlisted = wishlist.some(item => item.id === product.id);
    const [quantity, setQuantity] = useState(1);

    // Multi-image support with backward compat
    const allImages = product.images && Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image ? [product.image] : [];
    const [selectedIdx, setSelectedIdx] = useState(0);
    const selectedImage = allImages[selectedIdx] || allImages[0] || '';

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    // Format price for display
    const displayPrice = typeof product.price === 'number'
        ? `₹${product.price.toFixed(2)}`
        : product.price;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-brand-dark pt-24 pb-12 px-6"
        >
            <div className="container mx-auto">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest text-brand-light/70 hover:text-brand-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section with Gallery */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 aspect-[4/5] relative overflow-hidden"
                        >
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        {/* Thumbnail strip — only shown if more than 1 image */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 mt-4">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedIdx(i)}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0"
                                        style={{
                                            borderColor: i === selectedIdx
                                                ? 'var(--color-brand-primary, #D4AF37)'
                                                : 'rgba(0,0,0,0.1)',
                                            opacity: i === selectedIdx ? 1 : 0.6,
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-sm text-brand-primary uppercase tracking-widest mb-2 block">{product.category}</span>
                            <h1 className="font-serif text-4xl lg:text-5xl italic mb-4 text-brand-light">{product.name}</h1>
                            <p className="font-sans text-2xl mb-8 text-brand-light">{displayPrice}</p>

                            {/* Description Section */}
                            <div className="mb-8">
                                <h3 className="font-serif text-lg italic text-brand-light mb-2">Description</h3>
                                {product.description ? (
                                    <p className="font-sans text-brand-gray leading-relaxed max-w-md whitespace-pre-line">
                                        {product.description}
                                    </p>
                                ) : (
                                    <p className="font-sans text-brand-gray italic text-sm">
                                        No description available
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex items-center border border-brand-light/20 max-w-[120px] rounded-full overflow-hidden h-[54px]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 h-full hover:bg-brand-light/10 text-brand-light"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-medium text-brand-light">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 h-full hover:bg-brand-light/10 text-brand-light"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex flex-1 gap-4">
                                    <ShinyButton
                                        onClick={handleAddToCart}
                                        className="flex-1 w-full"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <ShoppingBag className="w-4 h-4" /> Add to Cart
                                        </span>
                                    </ShinyButton>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleWishlist(product)}
                                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                        className={`w-[54px] h-[54px] flex items-center justify-center border rounded-full ${isWishlisted ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/10' : 'border-brand-light/20 text-brand-light hover:bg-brand-light/10'} transition-colors shrink-0`}
                                    >
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                scale: isWishlisted ? [1, 1.2, 1] : [1, 0.9, 1]
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                        </motion.div>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-brand-light/10 pt-8 space-y-4 font-sans text-sm text-brand-gray">
                                <div className="flex gap-4">
                                    <span className="font-medium text-brand-light w-24">Material:</span>
                                    <span>Premium Alloy & Gold/Silver Plating</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-medium text-brand-light w-24">Shipping:</span>
                                    <span>Free shipping on orders over ₹999</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-medium text-brand-light w-24">Returns:</span>
                                    <span>7-day easy returns policy</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews productId={product.id} />
            </div>
        </motion.div>
    );
};

export default ProductDetail;
