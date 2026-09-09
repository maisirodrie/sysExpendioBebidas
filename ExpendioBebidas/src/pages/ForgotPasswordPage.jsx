// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import PublicLayout from '../components/layout/PublicLayout';

function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await axios.post('/forgot-password', { identifier });
            setMessage(res.data.message[0] || 'Si el usuario existe, se ha enviado un enlace de restablecimiento a tu correo electrónico.');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(Array.isArray(err.response.data.message) 
                    ? err.response.data.message[0] 
                    : err.response.data.message);
            } else {
                setError('Error desconocido al solicitar restablecimiento de contraseña.');
            }
            console.error('Error en forgotPassword:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="backdrop-blur-md bg-white/95 rounded-2xl p-7 sm:p-9 border border-white/30 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-3 shadow-theme-xs border border-brand-200/60">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Recuperar Contraseña
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Ingresa tu email o nombre de usuario registrado
                    </p>
                </div>

                {message && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-sm font-medium mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-sm font-medium mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="identifier">
                            Email o Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
                            placeholder="ej: nombre_usuario o correo@misiones.gov.ar"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-theme-xs transition-all duration-150 cursor-pointer focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Enviando enlace...' : 'Enviar Enlace de Restablecimiento'}
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

export default ForgotPasswordPage;