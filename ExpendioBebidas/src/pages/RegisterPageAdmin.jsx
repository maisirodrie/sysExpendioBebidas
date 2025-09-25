import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function RegisterPageAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup } = useAuth(); // Se elimina la importación de `errors` del contexto
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      // Intenta el registro del usuario
      await signup(values);

      // Muestra la alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El usuario fue registrado correctamente y las credenciales fueron enviadas al correo.",
        confirmButtonText: "OK",
      });

      // Redirige según el rol del usuario registrado
      if (values.role === "admin") {
        navigate("/task");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      // Manejo específico para errores de usuario/correo duplicado
      let errorMessage = "Ocurrió un problema durante el registro. Inténtalo nuevamente.";
      
      // Si el error es un array (del backend), lo unimos para mostrarlo en SweetAlert
      if (Array.isArray(error.response?.data)) {
        errorMessage = error.response.data.join(", ");
      } else if (error.response?.data?.message) {
        // Si el error es un objeto con una propiedad 'message'
        errorMessage = error.response.data.message;
      }

      // Muestra la alerta de error con el mensaje dinámico
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });

      console.error("Error en el registro:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div
      className="flex items-center justify-center overflow-y-auto"
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        paddingRight: "20px",
        paddingLeft: "20px",
      }}
    >
      <div className="bg-gray-300 max-w-screen-md w-full p-10 rounded-md">
        {/* Se eliminó la sección que renderizaba los errores del contexto */}
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Registro</h1>
          <Link
            to="/task"
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>

        <form onSubmit={onSubmit}>
          {/* Campo para nombre */}
          <div className="flex flex-col">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-black text-left"
            >
              Nombre
            </label>
            <input
              type="text"
              {...register("nombre", { required: true })}
              className="w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300"
              placeholder="Nombre"
            />
            {errors.nombre && (
              <p className="text-red-500">Nombre es requerido</p>
            )}
          </div>

          {/* Campo para apellido */}
          <div className="flex flex-col">
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-black text-left"
            >
              Apellido
            </label>
            <input
              type="text"
              {...register("apellido", { required: true })}
              className="w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300"
              placeholder="Apellido"
            />
            {errors.apellido && (
              <p className="text-red-500">Apellido es requerido</p>
            )}
          </div>

          {/* Campo para usuario */}
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-black text-left"
            >
              Usuario
            </label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300"
              placeholder="Usuario"
            />
            {errors.username && (
              <p className="text-red-500">Usuario es requerido</p>
            )}
          </div>

          {/* Campo para correo */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black text-left"
            >
              Correo
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300"
              placeholder="Correo"
            />
            {errors.email && (
              <p className="text-red-500">Correo es requerido</p>
            )}
          </div>

          {/* Campo para rol */}
          <div className="flex flex-col">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-black text-left"
            >
              Rol
            </label>
            <select
              {...register("role", { required: true })}
              className="w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300"
            >
              <option value="user">Usuario</option>
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
              <option value="boss">Jefe</option>
              <option value="viewer">Observador</option>
              <option value="mesa">Mesa de entrada</option>
              <option value="juridicos">Jurídicos</option>
            </select>
            {errors.role && <p className="text-red-500">El rol es requerido</p>}
          </div>

          <button
            className="custom-button mt-4"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Cargando...
              </>
            ) : (
              "Registrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPageAdmin;