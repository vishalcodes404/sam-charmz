import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Calendar, Clock, ChevronRight, LogIn, XCircle, RotateCcw } from 'lucide-react';
import { ShinyButton } from '../components/ui/ShinyButton';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { supabase } from '../lib/supabaseClient';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // orderId being acted on
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();
    const { user, openAuth } = useShop();

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

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

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Cancel order — only allowed for Pending or Confirmed
    const handleCancel = async (order) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        setActionLoading(order.id);
        try {
            const updates = { status: 'Cancelled' };
            // Set cancelled_at if column exists — Supabase will ignore unknown columns gracefully
            updates.cancelled_at = new Date().toISOString();

            const { error } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', order.id);

            if (error) throw error;
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updates } : o));
            showToast('success', 'Order cancelled successfully.');
        } catch (err) {
            console.error('Cancel order error:', err);
            showToast('error', err.message || 'Failed to cancel order.');
        } finally {
            setActionLoading(null);
        }
    };

    // Return order — only allowed for Delivered
    const handleReturn = async (order) => {
        if (!window.confirm('Are you sure you want to request a return for this order?')) return;
        setActionLoading(order.id);
        try {
            const updates = { status: 'Return Requested' };
            updates.return_requested_at = new Date().toISOString();

            const { error } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', order.id);

            if (error) throw error;
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updates } : o));
            showToast('success', 'Return request submitted.');
        } catch (err) {
            console.error('Return order error:', err);
            showToast('error', err.message || 'Failed to request return.');
        } finally {
            setActionLoading(null);
        }
    };

    const canCancel = (status) => ['Pending', 'Confirmed'].includes(status);
    const canReturn = (status) => status === 'Delivered';

    const getStatusColor = (status) => {
        const map = {
            Pending: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
            Confirmed: 'bg-blue-400/10 text-blue-400 border border-blue-400/20',
            Processing: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
            Shipped: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
            Delivered: 'bg-green-500/10 text-green-500 border border-green-500/20',
            Cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
            'Return Requested': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
            Returned: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
        };
        return map[status] || 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20';
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

                {/* Toast */}
                {toast && (
                    <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${toast.type === 'success' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                        {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                    </div>
                )}

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
                        {orders.map((order, index) => {
                            const status = order.status || 'Pending';
                            const isActing = actionLoading === order.id;

                            return (
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
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                                                    {status}
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
                                                {order.payment_method && (
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <span className="text-brand-gray/60">Payment:</span>
                                                        <span>{order.payment_method}</span>
                                                    </div>
                                                )}
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

                                    {/* Order Footer with Cancel/Return */}
                                    <div className="mt-6 pt-6 border-t border-brand-light/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="text-sm text-brand-gray">
                                            <span className="font-medium text-brand-light">Shipping to:</span> {order.customer_name || 'Guest'}, {order.email || 'No email provided'}
                                        </div>
                                        <div className="flex gap-3">
                                            {canCancel(status) && (
                                                <button
                                                    onClick={() => handleCancel(order)}
                                                    disabled={isActing}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isActing ? (
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                    ) : (
                                                        <XCircle className="w-4 h-4" />
                                                    )}
                                                    Cancel Order
                                                </button>
                                            )}
                                            {canReturn(status) && (
                                                <button
                                                    onClick={() => handleReturn(order)}
                                                    disabled={isActing}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-400 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isActing ? (
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                    ) : (
                                                        <RotateCcw className="w-4 h-4" />
                                                    )}
                                                    Request Return
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
