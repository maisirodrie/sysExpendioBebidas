import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRouteRegistro = ({ element }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    // Si el usuario no es un administrador, redirige al perfil
    return <Navigate to="/profile" />;
  }

  // Si el usuario está autenticado y es un administrador, renderiza el elemento de la ruta
  return <Route element={element} />;
};

export default ProtectedRouteRegistro;