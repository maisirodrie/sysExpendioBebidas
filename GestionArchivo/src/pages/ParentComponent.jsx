import React, { useState, useEffect } from 'react';
import TaskFormPage from './TaskFormPage';

const ParentComponent = () => {
    // Supongamos que obtienes la información del usuario desde alguna fuente, como una API
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Aquí obtienes la información del usuario, por ejemplo, de una API
        // Luego la estableces en el estado
        const fetchUser = async () => {
            try {
                const user = /* Lógica para obtener la información del usuario */
                setUser(user);
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            {user ? (
                <TaskFormPage user={user} />
            ) : (
                <p>Cargando información del usuario...</p>
            )}
        </div>
    );
};

export default ParentComponent;