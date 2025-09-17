// src/pages/LoginPage.jsx

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Asegúrate de que este archivo no tenga reglas que sobrescriban Tailwind
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
    <section>
      <header
        className="bg-gray-800 bg-cover bg-no-repeat py-10 text-white relative flex flex-col justify-center items-center rounded-b-lg"
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
              {Array.isArray(signinErrors) && signinErrors.length > 0 && (
                <div className="bg-red-500 p-3 text-white rounded-md mb-4 text-sm font-semibold">
                  {signinErrors.map((error, i) => (
                    <p key={i}>{error}</p>
                  ))}
                </div>
              )}

              <h1 className="text-3xl font-bold text-gray-800 mb-6">Acceso</h1>
              <form onSubmit={onSubmit}>
                <div className="mb-4 text-left">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Usuario
                  </label>
                  <input
                    type="text"
                    {...register("username", { required: true })}
                    className="mt-1 w-full bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Usuario"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      Usuario es requerido
                    </p>
                  )}
                </div>

                <div className="mb-6 text-left relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    className="mt-1 w-full bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Contraseña"
                  />
                  <span
                    // ✅ Clases actualizadas para usar tu CSS
                    className="absolute right-0 flex items-center pr-3 cursor-pointer text-gray-600 password-icon"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      Contraseña es requerida
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="custom-button w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Iniciar Sesión
                </button>
              </form>
              <div className="mt-4 text-center">
                <a
                  href="/forgot-password"
                  className="text-sm text-gray-600 hover:text-blue-500 hover:underline transition-colors duration-300"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </section>
  );
}

export default LoginPage;
