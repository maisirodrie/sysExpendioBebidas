// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios'; // Importa la instancia de Axios configurada

function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState(''); // Puede ser nombre_usuario, DNI o email
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // Llama al endpoint de forgot-password de tu backend
            const res = await axios.post('/forgot-password', { identifier });
            setMessage(res.data.message[0] || 'Si el usuario existe, se ha enviado un enlace de restablecimiento a tu correo electrónico.');
        } catch (err) {
            // Manejo de errores del backend
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
                            {/* Muestra mensajes de éxito o error */}
                            {message && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    {error}
                                </div>
                            )}

                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Restablecer Contraseña</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
                                        Email o Nombre de Usuario
                                    </label>
                                    <input
                                        type="text"
                                        id="identifier"
                                        name="identifier"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="custom-button w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        disabled={loading}
                                    >
                                        {loading ? 'Enviando...' : 'Restablecer Contraseña'}
                                    </button>
                                </div>
                            </form>
                            <p className="mt-4 text-center text-gray-600">
                                <Link to="/login" className="text-blue-500 hover:underline">Volver al Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </header>
        </section>
    );
}

export default ForgotPasswordPage;