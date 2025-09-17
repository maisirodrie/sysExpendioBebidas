import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function ResetPasswordPage() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { resetPassword, errors: apiErrors, message } = useAuth();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const newPassword = watch('newPassword');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            return;
        }

        const res = await resetPassword(token, data.newPassword);
        if (res.success) {
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
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
                            
                            <div className="flex flex-col items-center mb-6">
                                <FontAwesomeIcon icon={faLock} className="text-4xl text-blue-600 mb-2" />
                                <h1 className="text-2xl font-bold text-center text-gray-800">Restablecer Contraseña</h1>
                                <p className="text-sm text-gray-500 text-center mt-1">Ingresa tu nueva contraseña para continuar.</p>
                            </div>

                            {apiErrors && apiErrors.length > 0 && (
                                <div className="bg-red-500 p-2 text-white text-center rounded-md mb-4">
                                    {apiErrors.map((err, i) => (
                                        <div key={i}>{err}</div>
                                    ))}
                                </div>
                            )}
                            
                            {message && (
                                <div className="bg-green-500 p-2 text-white text-center rounded-md mb-4">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                         

<div className="relative">
    <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
    <input
        type={showPassword ? 'text' : 'password'}
        {...register('newPassword', { required: 'La contraseña es obligatoria' })}
        // ✅ Añade la clase text-gray-800
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10 text-gray-800"
    />
    <span
        className="absolute right-0 flex items-center pr-3 cursor-pointer text-gray-600"
        style={{ top: '20px', bottom: '0px' }}
        onClick={togglePasswordVisibility}
    >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
    </span>
    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
</div>

<div className="relative">
    <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
    <input
        type={showPassword ? 'text' : 'password'}
        {...register('confirmPassword', {
            required: 'Confirma tu nueva contraseña',
            validate: value => value === newPassword || 'Las contraseñas no coinciden.'
        })}
        // ✅ Añade la clase text-gray-800
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10 text-gray-800"
    />
    <span
        className="absolute right-0 flex items-center pr-3 cursor-pointer text-gray-600"
        style={{ top: '20px', bottom: '0px' }}
        onClick={togglePasswordVisibility}
    >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
    </span>
    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
</div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Restablecer Contraseña
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
        </section>
    );
}

export default ResetPasswordPage;