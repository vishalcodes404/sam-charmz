import React from 'react';
import { useAdmin } from '../../context/AdminContext';

function StatCard({ label, value, icon, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-brand-surface border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:border-white/20 hover:scale-[1.02] transition-all duration-200 text-left w-full"
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-brand-light">{value}</p>
                <p className="text-brand-gray text-sm mt-0.5">{label}</p>
            </div>
        </button>
    );
}

export default function AdminDashboard({ onNavigate }) {
    const { products, categories, orders } = useAdmin();
    const pendingOrders = orders.filter(o => !o.status || o.status === 'Pending').length;

    return (
        <div className="space-y-8 max-w-5xl">
            <div>
                <h1 className="text-2xl font-serif font-bold text-brand-primary">Welcome back, Admin 👋</h1>
                <p className="text-brand-gray text-sm mt-1">Here's what's happening with Sam Charmz today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Products"
                    value={products.length}
                    onClick={() => onNavigate('products')}
                    color="bg-brand-primary/15 text-brand-primary"
                    icon={
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatCard
                    label="Categories"
                    value={categories.length}
                    onClick={() => onNavigate('categories')}
                    color="bg-purple-500/15 text-purple-400"
                    icon={
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Orders"
                    value={orders.length}
                    onClick={() => onNavigate('orders')}
                    color="bg-brand-secondary/15 text-brand-secondary"
                    icon={
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                />
                <StatCard
                    label="Pending Orders"
                    value={pendingOrders}
                    onClick={() => onNavigate('orders')}
                    color="bg-orange-500/15 text-orange-400"
                    icon={
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-semibold text-brand-gray uppercase tracking-widest mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: '+ Add Product', tab: 'products', color: 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20' },
                        { label: '+ Add Category', tab: 'categories', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20' },
                        { label: 'View Orders', tab: 'orders', color: 'bg-brand-secondary/10 border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/20' },
                    ].map(action => (
                        <button
                            key={action.tab}
                            onClick={() => onNavigate(action.tab)}
                            className={`border rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${action.color}`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Products */}
            <div>
                <h3 className="text-sm font-semibold text-brand-gray uppercase tracking-widest mb-4">Recent Products</h3>
                <div className="bg-brand-surface border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-brand-gray text-xs uppercase tracking-wider">
                                <th className="px-4 py-3 text-left">Product</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.slice(0, 5).map(p => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 flex items-center gap-3">
                                        <img src={p.images?.[0] || p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                                        <span className="text-brand-light font-medium">{p.name}</span>
                                    </td>
                                    <td className="px-4 py-3 text-brand-gray">{p.category}</td>
                                    <td className="px-4 py-3 text-right text-brand-primary font-medium">₹{parseFloat(p.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
