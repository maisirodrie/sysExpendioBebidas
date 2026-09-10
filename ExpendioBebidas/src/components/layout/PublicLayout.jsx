import React from "react";
import { Link, useLocation } from "react-router-dom";

export const PublicLayout = ({
  children,
  title = "",
  subtitle = "",
  maxWidth = "max-w-md",
  fullHeight = true,
}) => {
  const location = useLocation();

  return (
    <div
      className={`relative min-h-screen ${
        fullHeight ? "md:h-screen md:overflow-hidden" : ""
      } bg-slate-900 flex flex-col font-outfit`}
    >
      {/* TOP HEADER PÚBLICO .navbar-modern */}
      <header
        className="relative z-50 w-full px-6 flex items-center justify-between shrink-0 border-b border-slate-200/80"
        style={{
          background: "linear-gradient(135deg, #fff, #f1f5f9, #e2e8f0)",
          boxShadow: "0 2px 15px #00000014",
          minHeight: "4.5rem",
        }}
      >
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logos/logoccpm.png"
            alt="Misiones - Centro de Cómputos"
            className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="font-bold text-gray-900 text-sm sm:text-base tracking-tight leading-tight">
              Expendio de Bebidas Alcohólicas
            </span>
            <span className="text-[11px] text-gray-500 font-medium">
              Ministerio de Gobierno • Misiones
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {location.pathname !== "/" && (
            <Link
              to="/"
              className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              Inicio
            </Link>
          )}
          {location.pathname !== "/consulta-estado" && (
            <Link
              to="/consulta-estado"
              className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              Consultar Trámite
            </Link>
          )}
          {location.pathname !== "/register" && (
            <Link
              to="/register"
              className="text-xs sm:text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 px-3.5 py-1.5 rounded-xl transition-all shadow-theme-xs border border-brand-600"
            >
              Iniciar Trámite
            </Link>
          )}
          {location.pathname !== "/login" && (
            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              Acceso Staff
            </Link>
          )}
        </nav>
      </header>

      {/* CONTENEDOR CENTRAL EXACTO DE ROHTDA */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <section
          className="flex-1 w-full h-full flex flex-col justify-center items-center px-4 py-4 relative overflow-hidden font-outfit"
          style={{
            backgroundImage: 'url("/fondos/fondo.jpg")',
            backgroundPosition: "center 85%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />
          <div className={`relative z-10 w-full ${maxWidth} mx-auto my-auto animate-in fade-in zoom-in-95 duration-200 overflow-y-auto`}>
            {children}
          </div>
        </section>
      </div>

      {/* FOOTER PÚBLICO INSTITUCIONAL AZUL */}
      <footer className="relative z-10 w-full bg-[#1d68e1] py-2.5 px-6 flex items-center justify-center shadow-lg shrink-0 text-center font-medium">
        <p className="footer-text">© {new Date().getFullYear()} Centro de Cómputos de la Provincia de Misiones - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
