import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ProductDetail = ({ product, onBack }) => {
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const isWishlisted = wishlist.some(item => item.id === product.id);
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

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
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 aspect-[4/5] relative overflow-hidden"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-sm text-brand-primary uppercase tracking-widest mb-2 block">{product.category}</span>
                            <h1 className="font-serif text-4xl lg:text-5xl italic mb-4 text-brand-light">{product.name}</h1>
                            <p className="font-sans text-2xl mb-8 text-white">{product.price}</p>

                            <p className="font-sans text-gray-400 leading-relaxed mb-8 max-w-md">
                                Experience the elegance of our handcrafted {product.name.toLowerCase()}.
                                Designed with precision and care, this piece embodies the perfect blend of
                                traditional artistry and modern style. Perfect for everyday wear or special occasions.
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex items-center border border-white/20 max-w-[120px] rounded-full overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-3 hover:bg-white/10 text-white"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-medium text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-3 hover:bg-white/10 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex flex-1 gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-brand-primary text-brand-dark px-8 py-3 rounded-full uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(product.id)}
                                        className={`w-12 h-12 flex items-center justify-center border rounded-full ${isWishlisted ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/10' : 'border-white/20 text-white hover:bg-white/10'} transition-colors shrink-0`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-white/10 pt-8 space-y-4 font-sans text-sm text-gray-400">
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
            </div>
        </motion.div>
    );
};

export default ProductDetail;
