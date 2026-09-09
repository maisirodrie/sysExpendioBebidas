import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";

function HomePage() {
  return (
    <PublicLayout maxWidth="max-w-2xl">
      <div className="backdrop-blur-md bg-white/95 rounded-2xl p-8 sm:p-12 border border-white/30 shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-6 shadow-theme-xs border border-brand-200/60 ring-4 ring-brand-500/10">
          <img
            src="/logopagina.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-xl object-cover"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Solicitud Provincial de Expendio de Bebidas
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
          Plataforma oficial para la gestión, habilitación y consulta de permisos de expendio de bebidas alcohólicas en la Provincia de Misiones.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-medium py-3 px-6 rounded-xl shadow-theme-xs transition-all duration-150 transform active:scale-[0.99] cursor-pointer focus:ring-4 focus:ring-brand-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Iniciar Nuevo Registro
          </Link>

          <Link
            to="/consulta-estado"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 font-medium py-3 px-6 rounded-xl shadow-theme-xs transition-all duration-150 cursor-pointer focus:ring-4 focus:ring-gray-200"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Consultar Estado de Trámite
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Sistema en Línea
          </span>
          <span>•</span>
          <span>Decreto Provincial Nº 1724/04</span>
        </div>
      </div>
    </PublicLayout>
  );
}

export default HomePage;
