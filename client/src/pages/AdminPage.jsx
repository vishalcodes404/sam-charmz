import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminLayout from '../components/admin/AdminLayout';

const AdminPage = () => {
    const { isAdminLoggedIn, adminChecking } = useAdmin();
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/');
    };

    // Show spinner while checking admin access (with timeout safety in AdminContext)
    if (adminChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-brand-gray text-sm uppercase tracking-widest">Checking access...</p>
                </div>
            </div>
        );
    }

    if (!isAdminLoggedIn) return <AdminLogin />;
    return <AdminLayout onExitAdmin={handleExit} />;
};

export default AdminPage;
