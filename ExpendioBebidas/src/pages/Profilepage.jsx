import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const Profilepage = () => {
    const { user, loading, isAuthenticated } = useAuth(); // Añade loading y isAuthenticated
    const [userTask, setUserTask] = useState(null);
    const navigate = useNavigate();

    // Mueve la lógica de navegación del administrador a un useEffect
    useEffect(() => {
        // Asegúrate de que la navegación solo ocurra si los datos del usuario han sido cargados
        if (!loading && isAuthenticated && user && user.role === 'admin') {
            navigate('/task');
        }
    }, [user, loading, isAuthenticated, navigate]);

    // Lógica para obtener las tareas del usuario, también dentro de un useEffect
    useEffect(() => {
        const fetchUserTask = async () => {
            try {
                const response = await axios.get('/api/tasks');
                setUserTask(response.data);
            } catch (error) {
                console.error('Error fetching user task:', error);
            }
        };

        // Solo carga la tarea si el usuario no es admin y ya está autenticado
        if (!loading && isAuthenticated && user && user.role !== 'admin') {
            fetchUserTask();
        }
    }, [user, loading, isAuthenticated]); // Agrega dependencias

    const handleCreateTask = async () => {
        try {
            const response = await axios.post('/api/tasks', {
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
        return <div className="flex items-center justify-center min-h-screen bg-gray-100"><p>Cargando...</p></div>;
    }
    
    if (!isAuthenticated) {
        return null;
    }

    if (user.role === 'admin') {
        // No renderiza nada si el usuario es admin, el useEffect se encarga de la redirección.
        return null;
    }

    return (
        <div className="welcome-container">
            <h1 className="welcome-title">Bienvenido</h1>
            <p className="username">{user.username}</p>
            <p className="success-message">Su formulario ha sido cargado con éxito</p>
            {!userTask && (
                <ul className="button-container">
                    <li>
                        <button onClick={handleCreateTask} className="btn btn-success">
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default Profilepage;
