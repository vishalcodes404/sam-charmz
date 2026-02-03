import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle, CreditCard, Loader2 } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, cartItems, total }) => {
    const [step, setStep] = useState('details'); // details, processing, success
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep('processing');
        setLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            setStep('success');
        }, 2000);
    };

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setStep('details'), 300);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-0 right-0 top-0 bottom-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-white z-[90] shadow-2xl overflow-hidden rounded-lg flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-green-600" />
                                <h2 className="font-serif text-xl italic">
                                    {step === 'success' ? 'Order Confirmed' : 'Secure Checkout'}
                                </h2>
                            </div>
                            <button onClick={onClose} className="hover:bg-gray-200 p-2 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            {step === 'details' && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-sans font-bold text-sm uppercase tracking-widest border-b pb-2">Shipping Information</h3>
                                            <input required type="text" placeholder="Full Name" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors" />
                                            <input required type="email" placeholder="Email Address" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors" />
                                            <input required type="text" placeholder="Address" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input required type="text" placeholder="City" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors" />
                                                <input required type="text" placeholder="Postcode" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-sans font-bold text-sm uppercase tracking-widest border-b pb-2">Payment Details</h3>
                                            <div className="border border-gray-300 p-4 rounded bg-gray-50 flex items-center gap-3">
                                                <CreditCard className="w-5 h-5 text-gray-500" />
                                                <span className="text-sm text-gray-500">Card Payment (Simulated)</span>
                                            </div>
                                            <input required type="text" placeholder="Card Number" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input required type="text" placeholder="MM/YY" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors" />
                                                <input required type="text" placeholder="CVC" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Total amount to pay</p>
                                            <p className="font-serif text-2xl font-bold">₹{total.toLocaleString()}</p>
                                        </div>
                                        <button type="submit" className="bg-black text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
                                            <Lock className="w-4 h-4" /> Pay Securely
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 'processing' && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 animate-spin text-black mb-4" />
                                    <p className="font-serif text-xl italic">Processing Payment...</p>
                                    <p className="text-sm text-gray-500 mt-2">Please do not close this window</p>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="text-center py-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </motion.div>
                                    <h3 className="font-serif text-3xl italic mb-4">Thank You!</h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        Your order has been successfully placed. You will receive a confirmation email shortly with your order details and tracking number.
                                    </p>
                                    <button onClick={onClose} className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
                                        Continue Shopping
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
