import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import AdminReviews from './AdminReviews';

const navItems = [
    {
        id: 'dashboard', label: 'Dashboard', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        )
    },
    {
        id: 'products', label: 'Products', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )
    },
    {
        id: 'categories', label: 'Categories', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        )
    },
    {
        id: 'orders', label: 'Orders', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        )
    },
    {
        id: 'reviews', label: 'Reviews', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        )
    },
];

export default function AdminLayout({ onExitAdmin }) {
    const { adminLogout } = useAdmin();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        adminLogout();
        onExitAdmin();
    };

    const renderPage = () => {
        switch (activeTab) {
            case 'dashboard': return <AdminDashboard onNavigate={setActiveTab} />;
            case 'products': return <AdminProducts />;
            case 'categories': return <AdminCategories />;
            case 'orders': return <AdminOrders />;
            case 'reviews': return <AdminReviews />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex font-sans text-brand-light">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-brand-surface border-r border-white/10 flex flex-col shrink-0 z-20`}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-yellow-600 flex items-center justify-center shrink-0">
                        <span className="text-brand-dark font-bold text-xs">SC</span>
                    </div>
                    {sidebarOpen && <span className="font-serif text-brand-primary font-bold text-lg">Sam Charmz</span>}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 space-y-1 px-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                                ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30'
                                : 'text-brand-gray hover:bg-white/5 hover:text-brand-light'
                                }`}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-brand-surface border-b border-white/10 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(p => !p)}
                            className="text-brand-gray hover:text-brand-light transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-brand-light font-semibold capitalize">{activeTab}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-brand-gray">Logged in as</p>
                            <p className="text-sm text-brand-primary font-medium">Admin</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-yellow-600 flex items-center justify-center">
                            <span className="text-brand-dark font-bold text-xs">A</span>
                        </div>
                        <button
                            onClick={onExitAdmin}
                            title="Back to Store"
                            className="ml-2 text-brand-gray hover:text-brand-light transition-colors text-xs border border-white/10 rounded-lg px-3 py-1.5"
                        >
                            ← Store
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
