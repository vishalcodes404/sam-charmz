import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';

const WishlistDrawer = ({ isOpen, onClose, wishlistItems, products, removeFromWishlist, addToCart }) => {
    // Filter products to show only those in the wishlist
    const items = products.filter(product => wishlistItems.includes(product.id));

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h2 className="font-serif text-2xl italic">Your Wishlist ({items.length})</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-4">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                    <p className="font-sans text-lg">Your wishlist is empty.</p>
                                    <button
                                        onClick={onClose}
                                        className="text-black border-b border-black text-sm uppercase tracking-wide mt-2"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-serif text-lg leading-tight mb-1">{item.name}</h3>
                                                    <p className="font-sans text-sm text-gray-500">{item.price}</p>
                                                </div>

                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={() => { addToCart(item.id); removeFromWishlist(item.id); }}
                                                        className="flex-1 bg-black text-white text-xs uppercase tracking-widest py-2 px-4 hover:bg-gray-800 transition-colors"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromWishlist(item.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WishlistDrawer;
