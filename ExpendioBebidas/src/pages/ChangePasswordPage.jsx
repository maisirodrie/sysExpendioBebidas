import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import PublicLayout from "../components/layout/PublicLayout";

function ChangePasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const navigate = useNavigate();
  const { changePassword, errors: authErrors } = useAuth();
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const newPassword = watch("newPassword", "");
  const confirmPassword = watch("confirmPassword", "");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    setPasswordsMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (authErrors && authErrors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cambiar la contraseña',
        text: authErrors.join(' '),
      });
    }
  }, [authErrors]);

  const onSubmit = handleSubmit(async (data) => {
    if (!passwordsMatch) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Las contraseñas no coinciden. Por favor, revísalas.',
      });
      return;
    }
    
    const { oldPassword, newPassword } = data;
    const result = await changePassword({ oldPassword, newPassword });
    
    if (result && result.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña cambiada!',
        text: 'Ahora serás redirigido para iniciar sesión.',
        showConfirmButton: false,
        timer: 3000
      }).then(() => {
        navigate("/login");
      });
      reset();
    }
  });

  return (
    <PublicLayout>
      <div className="backdrop-blur-md bg-white/95 rounded-2xl p-7 sm:p-9 border border-white/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-3 shadow-theme-xs border border-brand-200/60">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Cambiar Contraseña
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Actualiza tu clave de acceso al sistema
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Contraseña Actual (Temporal)
            </label>
            <div className="relative">
              <input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                {...register("oldPassword", { required: true })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs pr-11"
                placeholder="Contraseña Actual"
              />
              <button
                type="button"
                className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">
                La contraseña actual es requerida.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "La nueva contraseña es requerida.",
                  minLength: { value: 6, message: "Debe tener al menos 6 caracteres." }
                })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs pr-11"
                placeholder="Nueva Contraseña"
              />
              <button
                type="button"
                className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", { required: true })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs pr-11"
                placeholder="Confirmar Contraseña"
              />
              <button
                type="button"
                className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">
                Por favor, confirma la contraseña.
              </p>
            )}
            {!passwordsMatch && confirmPassword && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">
                Las contraseñas no coinciden.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-theme-xs transition-all duration-150 cursor-pointer focus:ring-4 focus:ring-brand-500/20"
          >
            Actualizar Contraseña
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/task" className="text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline">
            ← Volver al Panel
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default ChangePasswordPage;
