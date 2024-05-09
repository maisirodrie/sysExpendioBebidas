import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "./login.css";

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        // Si es un administrador, redirige a la página de administrador
        navigate("/task");
      } else if (user.role === 'user') {
        // Si es un usuario normal y ya está registrado, redirige a su perfil
        navigate("/profile");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <section>
      <header
        className="bg-cover bg-no-repeat py-10 text-white relative flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('./fondos/fondo.jpg')`,
          backgroundPosition: 'center bottom', // Centra horizontalmente y alinea en la parte inferior
          padding: '10vw 2rem', // Padding ajustable en unidades relativas (viewport width)
        }}
      >
        <div className="bg-dark-overlay absolute inset-0"></div> {/* Superposición de color oscuro */}
        <div className="container mx-auto relative z-10 text-center">
          <div className=" flex items-center justify-center">
            <div className="bg-gray-200 shadow-md max-w-md w-full p-10 rounded-md">
            {Array.isArray(signinErrors) && signinErrors.map((error, i) => (
  <div className='bg-red-500 p-2 text-white' key={i}>
    {error}
  </div>
))}

              <h1 className='text-2xl font-bold text-black'>Acceso</h1>
              <form onSubmit={onSubmit}>
              <label htmlFor="username" className="block text-sm font-medium text-black text-left">
                                Usuario
                            </label>
                <input
                  type="text"
                  {...register("username", { required: true })}
                  className='w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300'
                  placeholder='Usuario'
                />
                {errors.username && (<p className='text-red-500'>Usuario es requerido</p>)}
                
                <label htmlFor="password" className="block text-sm font-medium text-black text-left">
                                Contraseña
                            </label>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className='w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300'
                  placeholder='Contraseña'
                />
                {errors.password && (<p className='text-red-500'>Contraseña es requerida</p>)}
                <button className="custom-button">Iniciar Sesión</button>
              </form>
              {/* <p className="flex gap-x-2 justify-between text-black">
                ¿No tienes una cuenta?
                <Link to="/register" className="text-sky-500">Registrate</Link>
              </p> */}
            </div>
          </div>
        </div>
      </header>
    </section>
  );
}

export default LoginPage;
