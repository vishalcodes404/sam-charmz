import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems, removeFromCart, updateQuantity, onCheckout }) => {

    const totalPrice = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[₹,]/g, ''));
        return total + price * (item.quantity || 1);
    }, 0);

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
                            <h2 className="font-serif text-2xl italic">Shopping Cart ({cartItems.length})</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-4">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                    <p className="font-sans text-lg">Your cart is empty.</p>
                                    <button
                                        onClick={onClose}
                                        className="text-black border-b border-black text-sm uppercase tracking-wide mt-2"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {cartItems.map(item => (
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

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center gap-3 border border-gray-200 rounded px-2 py-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                            className="text-gray-500 hover:text-black disabled:opacity-30"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-medium w-4 text-center">{item.quantity || 1}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="text-gray-500 hover:text-black"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-colors rounded"
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

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-sans text-gray-500">Subtotal</span>
                                    <span className="font-serif text-xl">₹{totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>
                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
