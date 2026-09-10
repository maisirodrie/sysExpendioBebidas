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
      style={{
        backgroundImage: "url('/fondos/fondo.jpg')",
        backgroundPosition: "center 85%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* OVERLAY OSCURO FLUIDO */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] z-0" />

      {/* TOP HEADER PÚBLICO MINIMALISTA */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/favicon.png"
            alt="Logo Provincial"
            className="h-10 w-10 rounded-xl object-contain shadow-theme-sm ring-1 ring-white/20 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-left">
            <span className="font-bold text-white text-sm sm:text-base tracking-tight leading-tight">
              Expendio de Bebidas Alcohólicas
            </span>
            <span className="text-[11px] text-gray-300 font-medium">
              Ministerio de Gobierno • Misiones
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {location.pathname !== "/" && (
            <Link
              to="/"
              className="text-xs sm:text-sm text-gray-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Inicio
            </Link>
          )}
          {location.pathname !== "/consulta-estado" && (
            <Link
              to="/consulta-estado"
              className="text-xs sm:text-sm text-gray-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Consultar Trámite
            </Link>
          )}
          {location.pathname !== "/register" && (
            <Link
              to="/register"
              className="text-xs sm:text-sm text-white bg-brand-500/80 hover:bg-brand-500 px-3.5 py-1.5 rounded-xl transition-all shadow-theme-xs border border-white/20"
            >
              Iniciar Trámite
            </Link>
          )}
          {location.pathname !== "/login" && (
            <Link
              to="/login"
              className="text-xs sm:text-sm text-gray-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Acceso Staff
            </Link>
          )}
        </nav>
      </header>

      {/* CONTENEDOR CENTRAL */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className={`w-full ${maxWidth} mx-auto my-auto animate-in fade-in zoom-in-95 duration-200`}>
          {children}
        </div>
      </main>

      {/* FOOTER PÚBLICO INSTITUCIONAL AZUL */}
      <footer className="relative z-10 w-full bg-[#1d68e1] py-2.5 px-6 flex items-center justify-end text-xs text-white shadow-lg shrink-0">
        <span>© {new Date().getFullYear()} Centro de Cómputos de la Provincia de Misiones - Todos los derechos reservados</span>
      </footer>
    </div>
  );
};

export default PublicLayout;
