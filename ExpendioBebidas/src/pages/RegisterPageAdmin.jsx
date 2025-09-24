import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function RegisterPageAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, errors: RegisterErrors } = useAuth();
  const navigate = useNavigate();

  // Lógica para manejar el registro y la redirección según el rol del usuario
  const onSubmit = handleSubmit(async (values) => {
    try {
      // Mostrar alerta de carga
      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere mientras se carga el registro.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Intentar el registro del usuario
      await signup(values);

      // Cerrar la alerta de carga
      Swal.close();

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El usuario fue registrado correctamente.",
        confirmButtonText: "OK",
      });

      // Redirigir según el rol del usuario registrado
      if (values.role === "admin") {
        navigate("/task"); // Redirigir a la página de tareas si es admin
      } else {
        navigate("/profile"); // Redirigir a la página de perfil si es un usuario común
      }
    } catch (error) {
      // Cerrar la alerta de carga
      Swal.close();

      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema durante el registro. Inténtalo nuevamente.",
      });

      console.error("Error en el registro:", error);
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
        {RegisterErrors &&
          Array.isArray(RegisterErrors) &&
          RegisterErrors.map((error, i) => (
            <div className="bg-red-500 p-2 text-white" key={i}>
              {error}
            </div>
          ))}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Registro</h1>
          <Link
            to="/task"
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />{" "}
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
              <option value="jurídicos">Jurídicos</option>
            </select>
            {errors.role && <p className="text-red-500">El rol es requerido</p>}
          </div>
          <button className="custom-button">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPageAdmin;
