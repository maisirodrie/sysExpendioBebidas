import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
  
  // States to control password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Watch password fields in real-time
  const newPassword = watch("newPassword", "");
  const confirmPassword = watch("confirmPassword", "");

  // State for real-time password matching feedback
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    // This effect runs whenever newPassword or confirmPassword change
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
    // Only submit if passwords match
    if (!passwordsMatch) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Las contraseñas no coinciden. Por favor, revísalas.',
      });
      return;
    }
    
    // Send only the required fields to the server
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
    <section>
      <header
        className="bg-cover bg-no-repeat py-10 text-white relative flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('./fondos/fondo.jpg')`,
          backgroundPosition: "center bottom",
          height: "85vh",
        }}
      >
        <div className="bg-dark-overlay absolute inset-0 bg-black opacity-75"></div>
        <div className="container mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 shadow-xl max-w-md w-full p-10 rounded-xl">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Cambiar Contraseña
              </h1>
              <form onSubmit={onSubmit}>
                {/* Contraseña Actual */}
                <div className="mb-4 text-left">
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contraseña Actual (Temporal)
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      {...register("oldPassword", { required: true })}
                      className="mt-1 w-full bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="Contraseña Actual"
                    />
                    <span
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-600"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
                    </span>
                  </div>
                  {errors.oldPassword && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      La contraseña actual es requerida.
                    </p>
                  )}
                </div>

                {/* Nueva Contraseña */}
                <div className="mb-4 text-left">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      {...register("newPassword", { 
                        required: "La nueva contraseña es requerida.",
                        minLength: {
                          value: 6,
                          message: "La contraseña debe tener al menos 6 caracteres."
                        }
                      })}
                      className="mt-1 w-full bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="Nueva Contraseña"
                    />
                    <span
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                    </span>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirmar Nueva Contraseña */}
                <div className="mb-6 text-left">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: true,
                      })}
                      className="mt-1 w-full bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="Confirmar Nueva Contraseña"
                    />
                    <span
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </span>
                  </div>
                  {/* Real-time feedback for password matching */}
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      Las contraseñas no coinciden.
                    </p>
                  )}
                  {/* Check for the required error from react-hook-form */}
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      La confirmación de la contraseña es requerida.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="custom-button w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Cambiar Contraseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
    </section>
  );
}

export default ChangePasswordPage;
