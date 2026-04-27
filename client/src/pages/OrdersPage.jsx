import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Calendar, Clock, ChevronRight, LogIn } from 'lucide-react';
import { ShinyButton } from '../components/ui/ShinyButton';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { supabase } from '../lib/supabaseClient';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, openAuth } = useShop();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setOrders([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Orders fetch error:', error.message);
                setOrders([]);
            } else {
                setOrders(data || []);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [user]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Not logged in view
    if (!user) {
        return (
            <div className="pt-24 pb-20 px-4 md:px-8 min-h-screen">
                <div className="container mx-auto max-w-4xl pt-8">
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-serif text-3xl md:text-5xl mb-4 text-brand-light italic"
                        >
                            Your Orders
                        </motion.h1>
                        <div className="w-16 h-[1px] bg-brand-primary mx-auto"></div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-brand-surface border border-brand-light/10 rounded-2xl shadow-xl backdrop-blur-sm"
                    >
                        <LogIn className="w-16 h-16 text-brand-light/20 mx-auto mb-4" />
                        <h2 className="font-serif text-2xl text-brand-light mb-2">Please Sign In</h2>
                        <p className="text-brand-gray mb-8">Sign in to view your order history.</p>
                        <ShinyButton onClick={openAuth} className="!px-8 !py-3 mx-auto">
                            Sign In
                        </ShinyButton>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="pt-24 pb-20 px-4 md:px-8 min-h-screen">
                <div className="container mx-auto max-w-4xl pt-8 text-center">
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-3xl md:text-5xl mb-4 text-brand-light italic">Your Orders</h1>
                        <div className="w-16 h-[1px] bg-brand-primary mx-auto"></div>
                    </div>
                    <div className="py-20 text-brand-gray">Loading your orders...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 px-4 md:px-8 min-h-screen">
            <div className="container mx-auto max-w-4xl pt-8">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-3xl md:text-5xl mb-4 text-brand-light italic"
                    >
                        Your Orders
                    </motion.h1>
                    <div className="w-16 h-[1px] bg-brand-primary mx-auto"></div>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-brand-surface border border-brand-light/10 rounded-2xl shadow-xl backdrop-blur-sm"
                    >
                        <ShoppingBag className="w-16 h-16 text-brand-light/20 mx-auto mb-4" />
                        <h2 className="font-serif text-2xl text-brand-light mb-2">No Orders Found</h2>
                        <p className="text-brand-gray mb-8">You haven't placed any orders yet.</p>
                        <ShinyButton onClick={() => navigate('/shop')} className="!px-8 !py-3 mx-auto">
                            Start Shopping
                        </ShinyButton>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-brand-surface border border-brand-light/10 rounded-2xl p-6 md:p-8 shadow-lg hover:border-brand-light/20 transition-all duration-300 group"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-light/10 pb-6 mb-6 gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-sans text-xs uppercase tracking-widest text-brand-gray font-bold">Order #{String(order.id).slice(-6)}</span>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                    'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-brand-gray mt-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(order.created_at || order.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Package className="w-4 h-4" />
                                                <span>{order.items?.length || 0} items</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-brand-gray uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="font-serif text-2xl text-brand-light">₹{(order.total || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    <h3 className="font-sans text-sm font-bold text-brand-light uppercase tracking-widest">Items in your order</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {order.items && order.items.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-brand-light/5 rounded-xl border border-transparent group-hover:bg-brand-light/10 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-brand-light/10 rounded-lg flex items-center justify-center text-brand-light font-serif text-lg">
                                                        {item.quantity}x
                                                    </div>
                                                    <div>
                                                        <p className="font-serif text-brand-light leading-tight">{item.name}</p>
                                                        <p className="text-xs text-brand-gray mt-1">₹{item.price}</p>
                                                    </div>
                                                </div>
                                                <div className="font-medium text-brand-primary">
                                                    ₹{typeof item.price === 'string' ? parseFloat(item.price.replace(/[₹,]/g, '')) * (item.quantity || 1) : item.price * (item.quantity || 1)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="mt-6 pt-6 border-t border-brand-light/10 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-brand-gray">
                                        <span className="font-medium text-brand-light">Shipping to:</span> {order.customer_name || 'Guest'}, {order.email || 'No email provided'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
