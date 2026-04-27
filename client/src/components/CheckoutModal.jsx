import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle, CreditCard, Loader2, LogIn } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShinyButton } from './ui/ShinyButton';
import { supabase } from '../lib/supabaseClient';

const CheckoutModal = ({ isOpen, onClose }) => {
    const { cart, user, openAuth, clearCart } = useShop();
    const total = cart.reduce((acc, item) => {
        const price = parseFloat(String(item.price || '0').replace(/[₹,]/g, ''));
        return acc + price * (item.quantity || 1);
    }, 0);

    const [step, setStep] = useState('details'); // details, processing, success, login
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({ name: '', email: '', address: '', city: '', postcode: '' });

    // Pre-fill email from user
    useEffect(() => {
        if (user && !formData.email) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.name,
            }));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Must be logged in
        if (!user) {
            setStep('login');
            return;
        }

        setStep('processing');
        setLoading(true);
        setErrorMsg('');

        try {
            const order = {
                user_id: user.id,
                customer_name: formData.name,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                postcode: formData.postcode,
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity || 1,
                    price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price || '0').replace(/[₹,]/g, '')),
                    product_id: item.id,
                })),
                total,
                status: 'Pending',
            };

            const { error } = await supabase
                .from('orders')
                .insert([order]);

            if (error) {
                throw error;
            }

            setLoading(false);
            setStep('success');
            // Clear only this user's cart
            clearCart();
        } catch (err) {
            console.error('Order creation error:', err);
            setErrorMsg(err.message || 'Failed to place order. Please try again.');
            setLoading(false);
            setStep('details');
        }
    };

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('details');
                setErrorMsg('');
            }, 300);
        }
    }, [isOpen]);

    const handleLoginAndReturn = () => {
        onClose();
        openAuth();
    };

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
                        className="fixed left-0 right-0 top-0 bottom-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-brand-surface z-[90] shadow-2xl overflow-hidden rounded-lg flex flex-col"
                    >
                        <div className="p-6 border-b border-brand-light/10 flex justify-between items-center bg-brand-primary/5">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-green-600" />
                                <h2 className="font-serif text-xl italic">
                                    {step === 'success' ? 'Order Confirmed' : step === 'login' ? 'Sign In Required' : 'Secure Checkout'}
                                </h2>
                            </div>
                            <button onClick={onClose} className="hover:bg-brand-light/10 p-2 rounded-full transition-colors text-brand-gray">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            {/* Login required view */}
                            {step === 'login' && (
                                <div className="text-center py-10">
                                    <LogIn className="w-16 h-16 text-brand-light/20 mx-auto mb-4" />
                                    <h3 className="font-serif text-2xl text-brand-light mb-2">Please Sign In</h3>
                                    <p className="text-brand-gray mb-8">You need to be signed in to place an order.</p>
                                    <ShinyButton onClick={handleLoginAndReturn} className="!px-8 !py-3 mx-auto">
                                        Sign In / Register
                                    </ShinyButton>
                                </div>
                            )}

                            {step === 'details' && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {errorMsg && (
                                        <div className="bg-red-500/15 text-red-400 p-4 rounded-lg text-sm border border-red-500/30">
                                            {errorMsg}
                                        </div>
                                    )}

                                    {!user && (
                                        <div className="bg-brand-primary/10 text-brand-primary p-4 rounded-lg text-sm border border-brand-primary/30">
                                            Please sign in to place your order.
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-sans font-bold text-sm uppercase tracking-widest border-b border-brand-light/10 pb-2 text-brand-light">Shipping Information</h3>
                                            <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full border border-brand-light/20 bg-brand-light/5 text-brand-light p-3 text-sm focus:border-brand-primary outline-none transition-colors" />
                                            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full border border-brand-light/20 bg-brand-light/5 text-brand-light p-3 text-sm focus:border-brand-primary outline-none transition-colors" />
                                            <input required type="text" placeholder="Address" value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} className="w-full border border-brand-light/20 bg-brand-light/5 text-brand-light p-3 text-sm focus:border-brand-primary outline-none transition-colors" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input required type="text" placeholder="City" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} className="w-full border border-brand-light/20 bg-brand-light/5 text-brand-light p-3 text-sm focus:border-brand-primary outline-none transition-colors" />
                                                <input required type="text" placeholder="Postcode" value={formData.postcode} onChange={e => setFormData(p => ({ ...p, postcode: e.target.value }))} className="w-full border border-brand-light/20 bg-brand-light/5 text-brand-light p-3 text-sm focus:border-brand-primary outline-none transition-colors" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-sans font-bold text-sm uppercase tracking-widest border-b border-brand-light/10 pb-2 text-brand-light">Payment Details</h3>
                                            <div className="border border-brand-light/10 p-4 rounded bg-brand-light/5 flex items-center gap-3">
                                                <CreditCard className="w-5 h-5 text-brand-gray" />
                                                <span className="text-sm text-brand-gray">Cash on Delivery (COD)</span>
                                            </div>
                                            <p className="text-xs text-brand-gray mt-2">Payment will be collected at the time of delivery.</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-brand-light/10 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-brand-gray">Total amount to pay</p>
                                            <p className="font-serif text-2xl font-bold text-brand-light">₹{total.toLocaleString()}</p>
                                        </div>
                                        <ShinyButton type="submit" className="!px-8 !py-4 !uppercase !tracking-widest !text-sm flex items-center gap-2">
                                            <Lock className="w-4 h-4" /> Place Order
                                        </ShinyButton>
                                    </div>
                                </form>
                            )}

                            {step === 'processing' && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 animate-spin text-brand-light mb-4" />
                                    <p className="font-serif text-xl italic text-brand-light">Placing your order...</p>
                                    <p className="text-sm text-brand-gray mt-2">Please do not close this window</p>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="text-center py-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </motion.div>
                                    <h3 className="font-serif text-3xl italic mb-4 text-brand-light">Thank You!</h3>
                                    <p className="text-brand-gray mb-8 max-w-md mx-auto">
                                        Your order has been successfully placed. You will receive a confirmation email shortly with your order details and tracking number.
                                    </p>
                                    <ShinyButton onClick={onClose} className="!px-8 !py-3 !uppercase !tracking-widest !text-sm">
                                        Continue Shopping
                                    </ShinyButton>
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
