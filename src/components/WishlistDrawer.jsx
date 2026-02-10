import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShinyButton } from './ui/ShinyButton';

const WishlistDrawer = () => {
    const {
        isWishlistOpen, closeWishlist,
        wishlist, toggleWishlist, moveToCart
    } = useShop();

    return (
        <AnimatePresence>
            {isWishlistOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeWishlist}
                        className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-brand-surface z-[70] shadow-2xl flex flex-col border-l border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-brand-surface">
                            <h2 className="font-serif text-2xl italic text-brand-light">Your Wishlist ({wishlist.length})</h2>
                            <button
                                onClick={closeWishlist}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-brand-light"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {wishlist.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-4">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                    <p className="font-sans text-lg">Your wishlist is empty.</p>
                                    <button
                                        onClick={closeWishlist}
                                        className="text-brand-primary border-b border-brand-primary text-sm uppercase tracking-wide mt-2 hover:text-brand-light hover:border-brand-light transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {wishlist.map(item => (
                                        <div key={item.id} className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group border border-transparent hover:border-white/5">
                                            <div className="w-24 h-24 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-serif text-lg leading-tight mb-1 text-brand-light">{item.name}</h3>
                                                    <p className="font-sans text-sm text-brand-primary">{item.price}</p>
                                                </div>

                                                <div className="flex gap-3 mt-4">
                                                    <ShinyButton
                                                        onClick={() => moveToCart(item)}
                                                        className="flex-1 !py-2 !px-4 !text-xs !uppercase !font-bold !tracking-widest"
                                                    >
                                                        Add to Cart
                                                    </ShinyButton>
                                                    <button
                                                        onClick={() => toggleWishlist(item)}
                                                        className="p-2 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-400/30 transition-colors rounded-lg hover:bg-red-400/10"
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
