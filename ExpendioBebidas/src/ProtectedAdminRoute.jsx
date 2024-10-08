import React from 'react';
import { useAuth } from './context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedAdminRoute({ element }) {
    const { loading, isAuthenticated, user } = useAuth();
  
    if (loading) return <h1>Loading...</h1>;
  
    if (!isAuthenticated) return <Navigate to="/login" replace />;
  
    // Verificar si el usuario es un administrador
    if (user.role !== 'admin') {
      return <Navigate to="/profile" replace />; // Redirigir a /add-task si el usuario no es un administrador
    }
  
    // Permitir acceso a la ruta actual si el usuario es un administrador
    return <Outlet />;
}

export default ProtectedAdminRoute;
