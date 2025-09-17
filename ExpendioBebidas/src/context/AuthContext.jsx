import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { registerRequest, loginRequest, verifyTokenRequest, changePasswordRequest, resetPasswordRequest  } from '../api/auth';
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Interceptor de Axios para incluir el token en cada solicitud
axios.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (errors && errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const signup = async (userData) => {
        try {
            const res = await registerRequest(userData);
            return res;
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const signin = async (userData) => {
        try {
            const res = await loginRequest(userData);
            setIsAuthenticated(true);
            setUser(res.data);
            return res;
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    const changePassword = async (userData) => {
    try {
        const res = await changePasswordRequest(userData);
        
        // 🚨 Paso clave: Limpiar el estado de usuario para forzar el re-login
        setUser(null);
        setIsAuthenticated(false);
        setErrors([]);
        setMessage("Contraseña cambiada con éxito.");
        
        return { success: true, data: res.data };
    } catch (error) {
        // ... (manejo de errores existente) ...
        const errorMessage = error.response?.data?.message || "Error al cambiar la contraseña.";
        setErrors([errorMessage]);
        setMessage(null);
        return { success: false, error: errorMessage };
    }

    
};
  // 🚨 Nueva función para el restablecimiento de contraseña
    const resetPassword = async (token, newPassword) => {
        try {
            const res = await resetPasswordRequest(token, newPassword);
            setMessage(res.data.message);
            setErrors([]);
            return { success: true, message: res.data.message };
        } catch (error) {
            const errorMessage = error.response?.data?.message || ["Error al restablecer la contraseña."];
            setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
            setMessage(null);
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }
            try {
                const res = await verifyTokenRequest();
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                setIsAuthenticated(true);
                setUser(res.data);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            logout,
            changePassword,
            resetPassword,
            user,
            loading,
            isAuthenticated,
            errors,
            message,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
