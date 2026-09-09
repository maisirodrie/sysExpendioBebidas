import React from 'react';
import { useAuth } from './context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';

function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-outfit">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Cargando sistema...</p>
                </div>
            </div>
        );
    }
    
    // Si no está autenticado y no está cargando, redirige al login
    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}

export default ProtectedRoute;
