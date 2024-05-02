import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios from 'axios';
import './profile.css'

const Profilepage = () => {
  const { user } = useAuth();
  const [userTask, setUserTask] = useState(null);
  const navigate = useNavigate(); // Utiliza useNavigate para obtener la función navigate
  
  useEffect(() => {
    const fetchUserTask = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setUserTask(response.data);
      } catch (error) {
        console.error('Error fetching user task:', error);
      }
    };

    fetchUserTask();
  }, []);

  const handleCreateTask = async () => {
    try {
      const response = await axios.post('/api/tasks', {
        apellido: user.apellido,
        nombre: user.nombre,
      });
      
      setUserTask(response.data);
      navigate('/add-task'); // Redirige a la página de agregar tarea
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  if (user.role === 'admin') {
    navigate('/task'); // Redirige al administrador a la página de tareas
    return null; // No renderiza nada en el perfil del administrador
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
