import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Badge from "../common/Badge";
import Swal from "sweetalert2";

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar Sesión?",
      text: "¿Estás seguro de que deseas salir del sistema?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#465fff",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  const navItems = [
    {
      label: "Expedientes",
      path: "/task",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      visible: true,
    },
    {
      label: "Nuevo Trámite",
      path: "/add-task",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      visible: user?.role === "admin" || user?.role === "mesa" || user?.role === "editor",
    },
    {
      label: "Gestión de Usuarios",
      path: "/registeradmin",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      visible: user?.role === "admin",
    },
    {
      label: "Valores y Aranceles (U.F.)",
      path: "/pago",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      visible: user?.role === "admin" || user?.role === "mesa",
    },
    {
      label: "Mi Perfil",
      path: "/profile",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      visible: true,
    },
  ];

  const initials = user?.nombre
    ? `${user.nombre.charAt(0)}${user?.apellido ? user.apellido.charAt(0) : ""}`.toUpperCase()
    : (user?.username?.slice(0, 2) || "EX").toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/70 flex font-outfit text-gray-800">
      {/* OVERLAY PARA MÓVIL */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* LOGO AREA */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100 gap-3">
          <img
            src="/logopagina.jpg"
            alt="Logo"
            className="h-9 w-9 rounded-xl object-cover shadow-theme-xs ring-1 ring-brand-500/20"
          />
          {(sidebarOpen || mobileOpen) && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-900 tracking-tight leading-tight">
                Expendio Bebidas
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                Gobierno de Misiones
              </span>
            </div>
          )}
        </div>

        {/* NAVEGACIÓN */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {(sidebarOpen || mobileOpen) && (
            <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Menú Principal
            </p>
          )}

          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!sidebarOpen ? item.label : ""}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-brand-50 text-brand-600 font-semibold shadow-theme-xs ring-1 ring-brand-500/15"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
                >
                  <span
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {(sidebarOpen || mobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
        </div>

        {/* FOOTER DEL SIDEBAR */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Cerrar Sesión" : ""}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors group cursor-pointer ${
              !sidebarOpen && !mobileOpen ? "justify-center" : ""
            }`}
          >
            <svg
              className="w-5 h-5 shrink-0 text-rose-500 group-hover:text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {(sidebarOpen || mobileOpen) && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* HEADER SUPERIOR */}
        <header className="h-16 sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-theme-xs">
          <div className="flex items-center gap-3">
            {/* BOTÓN HAMBURGUESA SVG FIJO DE 3 BARRAS (SIN CAMBIAR A 'X') */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileOpen(!mobileOpen);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-brand-500/20 outline-none cursor-pointer"
              aria-label="Alternar navegación"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Panel Administrativo
            </span>
          </div>

          {/* DERECHA: USUARIO DROPDOWN */}
          <div className="flex items-center gap-3" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-brand-500/20 outline-none cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 font-bold text-xs flex items-center justify-center shadow-theme-xs">
                  {initials}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.nombre ? `${user.nombre} ${user.apellido || ""}` : user?.username || "Usuario"}
                  </span>
                  <span className="text-[11px] text-gray-500 capitalize">
                    {user?.role || "Operador"}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* MENÚ DROPDOWN */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-gray-200 shadow-theme-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.nombre ? `${user.nombre} ${user.apellido || ""}` : user?.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {user?.email || "Sin email registrado"}
                    </p>
                    <Badge variant="light" color="primary" size="sm">
                      Rol: {user?.role || "Usuario"}
                    </Badge>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi Perfil
                    </Link>
                    <Link
                      to="/change-password"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Cambiar Contraseña
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
