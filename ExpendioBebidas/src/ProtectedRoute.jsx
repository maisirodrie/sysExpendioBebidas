import React from 'react';
import { useAuth } from './context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth();
    console.log(loading, isAuthenticated);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-100"><p>Cargando...</p></div>;
    }
    
    // Si no está autenticado y no está cargando, redirige al login
    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return (
        <Outlet />
    );
}

export default ProtectedRoute;
