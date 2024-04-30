import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Espera a que se complete el proceso de cierre de sesión
    navigate("/login"); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <nav className="bg-gray-200 px-10 flex flex-col md:flex-row md:items-center justify-between w-full">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-4">
          <Link to={isAuthenticated ? (user.role === 'admin' ? "/task" : "/profile") : "/"}>
            <img src="/logos/LOGO IPD Misiones.png" alt="Logo" className="h-20" />
          </Link>
        </h1>
        {isAuthenticated && (
          <div className="flex-grow" /> 
        )}
      </div>
      {isAuthenticated && (
        <div className="flex items-center">
          <ul className="flex gap-x-">
            <li>Bienvenido {user.username}</li>
          </ul>
          <button onClick={handleLogout} className="custom-button ml-4">
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
}




