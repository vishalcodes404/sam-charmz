import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';

const ProductDetail = ({ product, onBack, addToCart, toggleWishlist, isWishlisted }) => {
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-white pt-24 pb-12 px-6"
        >
            <div className="container mx-auto">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gray-600 transition-colors mb-8"
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
                            <span className="text-sm text-gray-400 uppercase tracking-widest mb-2 block">{product.category}</span>
                            <h1 className="font-serif text-4xl lg:text-5xl italic mb-4">{product.name}</h1>
                            <p className="font-sans text-2xl mb-8">{product.price}</p>

                            <p className="font-sans text-gray-600 leading-relaxed mb-8 max-w-md">
                                Experience the elegance of our handcrafted {product.name.toLowerCase()}.
                                Designed with precision and care, this piece embodies the perfect blend of
                                traditional artistry and modern style. Perfect for everyday wear or special occasions.
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex items-center border border-black max-w-[120px]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-3 hover:bg-gray-100"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-3 hover:bg-gray-100"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-black text-white px-8 py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className={`p-3 border ${isWishlisted ? 'border-red-500 text-red-500' : 'border-black hover:bg-gray-50'} transition-colors`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-gray-100 pt-8 space-y-4 font-sans text-sm text-gray-500">
                                <div className="flex gap-4">
                                    <span className="font-medium text-black w-24">Material:</span>
                                    <span>Premium Alloy & Gold/Silver Plating</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-medium text-black w-24">Shipping:</span>
                                    <span>Free shipping on orders over ₹999</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-medium text-black w-24">Returns:</span>
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
