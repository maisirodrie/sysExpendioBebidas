import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import PublicLayout from '../components/layout/PublicLayout';

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
        <PublicLayout>
            <div className="backdrop-blur-md bg-white/95 rounded-2xl p-7 sm:p-9 border border-white/30 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-3 shadow-theme-xs border border-brand-200/60">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Nueva Contraseña
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Ingresa tu nueva clave de acceso para continuar
                    </p>
                </div>

                {apiErrors && apiErrors.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-sm font-medium mb-4">
                        {apiErrors.map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    </div>
                )}
                
                {message && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-sm font-medium mb-4">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="newPassword">
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                {...register('newPassword', { required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs pr-11"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.newPassword.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword', {
                                required: 'Confirma tu contraseña',
                                validate: value => value === newPassword || 'Las contraseñas no coinciden'
                            })}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-theme-xs transition-all duration-150 cursor-pointer focus:ring-4 focus:ring-brand-500/20"
                    >
                        Guardar Contraseña
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Link to="/login" className="text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline">
                        ← Volver a Iniciar Sesión
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}

export default ResetPasswordPage;