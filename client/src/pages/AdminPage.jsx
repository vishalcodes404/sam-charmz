import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminLayout from '../components/admin/AdminLayout';

const AdminPage = () => {
    const { isAdminLoggedIn } = useAdmin();
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/');
    };

    if (!isAdminLoggedIn) return <AdminLogin />;
    return <AdminLayout onExitAdmin={handleExit} />;
};

export default AdminPage;
