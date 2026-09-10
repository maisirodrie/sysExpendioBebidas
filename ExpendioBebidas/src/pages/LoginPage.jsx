// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PublicLayout from "../components/layout/PublicLayout";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    signin,
    errors: signinErrors,
    isAuthenticated,
    user,
    loading,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/task");
      }
    }
  }, [isAuthenticated, navigate, user, loading]);

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PublicLayout>
      <div className="backdrop-blur-md bg-white/95 rounded-2xl p-7 sm:p-9 border border-white/30 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Iniciar Sesión
          </h1>
        </div>

        {Array.isArray(signinErrors) && signinErrors.length > 0 && (
          <div className="bg-rose-50 border border-rose-200/80 p-3.5 text-rose-700 rounded-xl mb-5 text-sm font-medium">
            {signinErrors.map((error, i) => (
              <p key={i} className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: true })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
              placeholder="Ingresa tu nombre de usuario"
            />
            {errors.username && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">
                El usuario es requerido
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Contraseña
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs pr-11"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">
                La contraseña es requerida
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-theme-xs transition-all duration-150 transform active:scale-[0.99] cursor-pointer focus:ring-4 focus:ring-brand-500/20"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200/60 text-center">
          <Link
            to="/consulta-estado"
            className="text-xs text-gray-500 hover:text-brand-600 transition-colors font-medium"
          >
            ← Volver a consulta pública de trámites
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default LoginPage;
