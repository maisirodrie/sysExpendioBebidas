import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ComponentCard from "../components/common/ComponentCard";
import Button from "../components/common/Button";

function RegisterPageAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await signup(values);

      Swal.fire({
        icon: "success",
        title: "¡Usuario registrado!",
        text: "El usuario fue creado correctamente y sus credenciales fueron enviadas a su correo.",
        confirmButtonColor: "#465fff",
      });

      if (values.role === "admin") {
        navigate("/task");
      } else {
        navigate("/task");
      }
    } catch (error) {
      let errorMessage = "Ocurrió un problema durante el registro. Inténtalo nuevamente.";
      if (Array.isArray(error.response?.data)) {
        errorMessage = error.response.data.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: errorMessage,
      });

      console.error("Error en el registro:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-outfit">
      <ComponentCard
        title="Alta de Usuario del Sistema"
        description="Registra un nuevo operador, fiscalizador o administrador con permisos de acceso"
        headerAction={
          <Link to="/task">
            <Button
              variant="secondary"
              size="sm"
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Volver
            </Button>
          </Link>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                {...register("nombre", { required: true })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
                placeholder="Nombre"
              />
              {errors.nombre && (
                <p className="text-rose-600 text-xs mt-1 font-medium">El nombre es requerido</p>
              )}
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                {...register("apellido", { required: true })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
                placeholder="Apellido"
              />
              {errors.apellido && (
                <p className="text-rose-600 text-xs mt-1 font-medium">El apellido es requerido</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                {...register("username", { required: true })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
                placeholder="ej: jleiva"
              />
              {errors.username && (
                <p className="text-rose-600 text-xs mt-1 font-medium">El usuario es requerido</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: true })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
                placeholder="correo@misiones.gov.ar"
              />
              {errors.email && (
                <p className="text-rose-600 text-xs mt-1 font-medium">El correo es requerido</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Rol y Permisos
            </label>
            <select
              id="role"
              {...register("role", { required: true })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs cursor-pointer"
            >
              <option value="user">Usuario (Consulta y Creación)</option>
              <option value="mesa">Mesa de Entrada</option>
              <option value="juridicos">Jurídicos (Revisión y Dictámenes)</option>
              <option value="editor">Editor (Control General)</option>
              <option value="viewer">Observador (Solo Lectura)</option>
              <option value="boss">Jefe / Directivo</option>
              <option value="admin">Administrador Total</option>
            </select>
            {errors.role && (
              <p className="text-rose-600 text-xs mt-1 font-medium">El rol es requerido</p>
            )}
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              icon={<FontAwesomeIcon icon={faUserPlus} />}
              className="w-full"
            >
              Registrar y Enviar Credenciales
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

export default RegisterPageAdmin;