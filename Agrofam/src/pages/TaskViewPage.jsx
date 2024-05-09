import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { useTasks } from '../context/TasksContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons';

function TaskViewPage() {
  const { getTask } = useTasks();
  const params = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const fetchedTask = await getTask(params.id);
        console.log('Fecha de nacimiento de la tarea:', fetchedTask.fechanacimiento);
        setTask(fetchedTask);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    }
    fetchTask();
  }, [getTask, params.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Obtener la fecha local
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    // Formatear la fecha local
    return format(localDate, 'dd/MM/yyyy', { locale: esLocale });
  };
  
  

  return (
    <div className="flex items-center justify-center overflow-y-auto my-10">
      <div className="bg-gray-200 max-w-md w-full p-10 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Detalles del Registro</h1>
          <Link to="/task" className="btn btn-success">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <div className="text-black">
          {task && (
            <>
              <p className="my-4"><strong>Apellido:</strong> {task.apellido}</p>
              <p className="my-4"><strong>Nombre:</strong> {task.nombre}</p>
              <p className="my-4"><strong>DNI:</strong> {task.dni}</p>
              <p className="my-4"><strong>Fecha de nacimiento:</strong> {formatDate(task.fechanacimiento)}</p>
             



              <p className="my-4"><strong>Género:</strong> {task.genero}</p>
              <p className="my-4"><strong>Lugar de nacimiento:</strong> {task.nacimiento}</p>
              <p className="my-4"><strong>Municipio:</strong> {task.municipio}</p>
              <p className="my-4"><strong>Dirección Postal:</strong> {task.postal}</p>
              {/* <p className="my-4"><strong>Años de residencia en la provincia de Misiones:</strong> {task.residencia}</p> */}
              <p className="my-4"><strong>Nacionalidad:</strong> {task.nacionalidad}</p>
              <p className="my-4"><strong>Correo:</strong> {task.correo}</p>
              <p className="my-4"><strong>Teléfono:</strong> {task.telefono}</p>
              
              {/* <p className="my-4"><strong>Localidad:</strong> {task.localidad}</p> */}
              
              
              
            
              <p className="my-4"><strong>Dirección:</strong> {task.direccion}</p>
              

              <p className="my-4"><strong>Observaciones:</strong> </p>
              <textarea
              
  id="observaciones"
  readOnly
  className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2 resize-none"
  style={{ minHeight: '100px' }} // Altura mínima del textarea
  value={task.observaciones}
/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskViewPage;
