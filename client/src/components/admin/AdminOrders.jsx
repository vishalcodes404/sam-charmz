import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'];

const STATUS_COLORS = {
    Pending: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Confirmed: 'bg-blue-400/15 text-blue-400 border-blue-400/30',
    Processing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Shipped: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    Delivered: 'bg-brand-secondary/15 text-brand-secondary border-brand-secondary/30',
    Cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
    'Return Requested': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    Returned: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

export default function AdminOrders() {
    const { orders, updateOrderStatus, deleteOrder, refreshOrders } = useAdmin();
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        refreshOrders();
    }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        const result = await deleteOrder(deleteTarget.id);
        setDeleteLoading(false);
        setDeleteTarget(null);
        if (result?.success) {
            showToast('success', 'Order deleted successfully.');
        } else {
            showToast('error', result?.error || 'Failed to delete order.');
        }
    };

    if (orders.length === 0) {
        return (
            <div className="space-y-4">
                <div>
                    <h1 className="text-xl font-semibold text-brand-light">Orders</h1>
                    <p className="text-brand-gray text-sm">No orders yet.</p>
                </div>
                <div className="bg-brand-surface border border-white/10 rounded-2xl p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-dark border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-brand-gray text-sm">When customers place orders, they'll appear here.</p>
                </div>
            </div>
        );
    }

    const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0));

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-brand-light">Orders</h1>
                    <p className="text-brand-gray text-sm">{orders.length} total orders</p>
                </div>
                <button onClick={refreshOrders} className="flex items-center gap-2 text-brand-gray hover:text-brand-light text-sm border border-white/10 rounded-xl px-4 py-2 hover:border-white/20 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                </button>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium ${toast.type === 'success' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                    {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                </div>
            )}

            <div className="bg-brand-surface border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-brand-gray text-xs uppercase tracking-wider">
                                <th className="px-4 py-3 text-left">Order ID</th>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left">Items</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sortedOrders.map((order, idx) => (
                                <tr key={order.id || idx} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs text-brand-gray">#{String(order.id || idx + 1).slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="px-4 py-3 text-brand-light font-medium">
                                        {order.customer_name || order.customerName || order.name || 'Guest'}
                                        {order.email && <p className="text-brand-gray text-xs">{order.email}</p>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-0.5">
                                            {(order.items || []).slice(0, 2).map((item, i) => (
                                                <p key={i} className="text-brand-gray text-xs">{item.name} × {item.quantity || 1}</p>
                                            ))}
                                            {(order.items || []).length > 2 && (
                                                <p className="text-brand-gray/60 text-xs">+{order.items.length - 2} more</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-brand-primary font-semibold">
                                        ₹{parseFloat(order.total || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-brand-gray text-xs whitespace-nowrap">
                                        {(order.created_at || order.date) ? new Date(order.created_at || order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.status || 'Pending'}
                                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                                            className={`text-xs font-medium border rounded-full px-3 py-1 focus:outline-none bg-transparent cursor-pointer transition-all ${STATUS_COLORS[order.status || 'Pending'] || STATUS_COLORS.Pending}`}
                                        >
                                            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-brand-surface text-brand-light">{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => setDeleteTarget(order)}
                                            className="p-2 rounded-lg text-brand-gray hover:text-red-400 hover:bg-red-500/10 transition-all"
                                            title="Delete order"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-brand-surface border border-white/15 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <p className="text-brand-light font-medium">Are you sure you want to delete this order?</p>
                        </div>
                        <p className="text-brand-gray text-xs mb-4">Order #{String(deleteTarget.id).slice(-6).toUpperCase()} — ₹{parseFloat(deleteTarget.total || 0).toFixed(2)}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} disabled={deleteLoading} className="flex-1 py-2 rounded-xl border border-white/10 text-brand-gray text-sm hover:border-white/20 transition-all disabled:opacity-50">Cancel</button>
                            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {deleteLoading ? (
                                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Deleting...</>
                                ) : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
