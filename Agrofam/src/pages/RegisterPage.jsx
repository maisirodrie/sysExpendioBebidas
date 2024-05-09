import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: RegisterErrors, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (user.isAdmin) {
                navigate("/task"); // Redirigir al panel de tareas si es admin
            } else {
                navigate("/add-task"); // Redirigir al perfil si no es admin
            }
        }
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (values) => {
        signup(values);
    });
    
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
                            {RegisterErrors && Array.isArray(RegisterErrors) && RegisterErrors.map((error, i) => (
                                <div className='bg-red-500 p-2 text-white' key={i}>
                                    {error}
                                </div>
                            ))}

                            <h1 className='text-2xl font-bold text-black'>Registro</h1>
                            <form onSubmit={onSubmit}>
                                <div className="flex flex-col">
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
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="contraseña" className="block text-sm font-medium text-black text-left">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        {...register("password", { required: true })}
                                        className='w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300'
                                        placeholder='Contraseña'
                                    />
                                    {errors.password && (<p className='text-red-500'>Contraseña es requerida</p>)}
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="email" className="block text-sm font-medium text-black text-left">
                                        Correo
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email", { required: true })}
                                        className='w-full bg-white text-gray-600 px-4 py-2 rounded-md my-2 border border-gray-300'
                                        placeholder='Correo'
                                    />
                                    {errors.email && (<p className='text-red-500'>Correo es requerido</p>)}
                                </div>
                                <button className="custom-button">Registrarse</button>
                                <p className="flex gap-x-2 justify-between text-black">
                                    ¿Ya tienes una cuenta?
                                    <Link to="/login" className="text-sky-500">Accede</Link>
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
