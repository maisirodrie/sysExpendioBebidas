import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faShieldAlt, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import ComponentCard from '../components/common/ComponentCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const Profilepage = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const [userTask, setUserTask] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated && user && user.role === 'admin') {
            navigate('/task');
        }
    }, [user, loading, isAuthenticated, navigate]);

    useEffect(() => {
        const fetchUserTask = async () => {
            try {
                const response = await axios.get('/tasks');
                setUserTask(response.data);
            } catch (error) {
                console.error('Error fetching user task:', error);
            }
        };

        if (!loading && isAuthenticated && user && user.role !== 'admin') {
            fetchUserTask();
        }
    }, [user, loading, isAuthenticated]);

    const handleCreateTask = async () => {
        try {
            const response = await axios.post('/tasks', {
                apellido: user.apellido,
                nombre: user.nombre,
            });
            setUserTask(response.data);
            navigate('/add-task');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Cargando perfil...</p>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) return null;
    if (user?.role === 'admin') return null;

    return (
        <div className="max-w-3xl mx-auto space-y-6 font-outfit">
            <ComponentCard
                title="Perfil de Usuario"
                description="Información de tu cuenta y estado en el sistema"
                headerAction={
                    <Link to="/change-password">
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<FontAwesomeIcon icon={faKey} />}
                        >
                            Cambiar Clave
                        </Button>
                    </Link>
                }
            >
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-gray-50/70 border border-gray-100 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-theme-xs shrink-0">
                        {user.nombre?.charAt(0) || user.username?.charAt(0) || "U"}
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold text-gray-900">
                            {user.nombre ? `${user.nombre} ${user.apellido || ""}` : user.username}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">{user.email || "Sin correo asociado"}</p>
                        <div className="mt-2">
                            <Badge variant="light" color="primary" size="sm">
                                Rol: {user.role?.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Usuario del Sistema
                        </span>
                        <span className="font-semibold text-gray-800">{user.username}</span>
                    </div>

                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Estado de la Cuenta
                        </span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Activo y Verificado
                        </span>
                    </div>
                </div>

                {!userTask && (
                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 text-center sm:text-left">
                            ¿Necesitas ingresar una nueva solicitud o expediente?
                        </p>
                        <Button
                            onClick={handleCreateTask}
                            variant="primary"
                            size="md"
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        >
                            Crear Solicitud
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </div>
    );
};

export default Profilepage;
