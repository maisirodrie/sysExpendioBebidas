import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: RegisterErrors, user } = useAuth();
  const navigate = useNavigate();

  // // Redirigir si el usuario está autenticado
  // useEffect(() => {
  //     if (isAuthenticated) {
  //         if (user.role === 'admin') {
  //             navigate("/task"); // Redirigir al panel de tareas si es admin
  //         } else {
  //             navigate("/add-task"); // Redirigir a la página de añadir tareas si no es admin
  //         }
  //     }
  // }, [isAuthenticated, navigate, user]);

  const onSubmit = handleSubmit(async (values) => {
    await signup(values); // Llamada a la función signup
  });

  return (
    <section>
      <header
        className="bg-cover bg-no-repeat py-10 text-white relative flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('./fondos/fondo.jpg')`,
          backgroundPosition: "center bottom",
          padding: "10vw 2rem",
        }}
      >
        <div className="bg-dark-overlay absolute inset-0"></div>
        <div className="container mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 shadow-md max-w-md w-full p-10 rounded-md">
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
                  {/* Ícono de flecha hacia la izquierda */}
                </Link>
              </div>

              <form onSubmit={onSubmit}>
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
                    <option value="admin">Administrador</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500">El rol es requerido</p>
                  )}
                </div>

                {/* Campo para contraseña */}
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black text-left"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    {...register("password", { required: true })}
                    className="w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300"
                    placeholder="Contraseña"
                  />
                  {errors.password && (
                    <p className="text-red-500">Contraseña es requerida</p>
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

                <button className="custom-button">Registrar</button>
                <p className="flex gap-x-2 justify-between text-black">
                  ¿Ya tienes una cuenta?
                  <Link to="/login" className="text-sky-500">
                    Accede
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </header>
    </section>
  );
}

export default RegisterPage;
