import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 🚨 Nueva lógica para verificar si el usuario debe cambiar la contraseña
  const isChangingPassword = isAuthenticated && user && user.mustChangePassword;

  return (
    <nav className="bg-gray-200 px-10 flex flex-col md:flex-row md:items-center justify-between w-full">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-4">
          <Link to={isAuthenticated && !isChangingPassword ? (user.role === 'admin' ? "/task" : "/") : "/"}>
            <img src="/logos/logoccpm.png" alt="Logo" className="h-20" />
          </Link>
        </h1>
        {isAuthenticated && !isChangingPassword && ( // 🚨 Se oculta si el usuario está cambiando la contraseña
          <div className="flex-grow" />
        )}
      </div>
      {/* 🚨 Se muestra el menú de usuario solo si está autenticado Y NO está cambiando la contraseña */}
      {isAuthenticated && !isChangingPassword && (
        <div className="flex items-center">
          <ul className="flex items-center gap-x-2">
            <li>
              <FontAwesomeIcon icon={faUser} className="text-black h-6 w-6" />
            </li>
            <li>
              {user.nombre} {user.apellido}
            </li>
          </ul>
          <button onClick={handleLogout} className="custom-button ml-4">
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}