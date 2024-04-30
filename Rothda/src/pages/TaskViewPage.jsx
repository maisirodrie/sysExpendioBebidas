import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de estrella
import { useTasks } from '../context/TasksContext';

function TaskViewPage() {
  const { getTask } = useTasks();
  const params = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const fetchedTask = await getTask(params.id);
        // Formatear la fecha de nacimiento antes de establecerla en el estado
        if (fetchedTask && fetchedTask.fechanacimiento) {
          fetchedTask.fechanacimiento = new Date(fetchedTask.fechanacimiento).toISOString().split('T')[0];
        }
        setTask(fetchedTask);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    }
    fetchTask();
  }, [getTask, params.id]);

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
              <p className="my-4"><strong>Fecha de nacimiento:</strong> {task.fechanacimiento ? new Date(task.fechanacimiento).toLocaleDateString('es-AR') : 'No especificada'}</p>
              <p className="my-4"><strong>Género:</strong> {task.genero}</p>
              <p className="my-4"><strong>Lugar de nacimiento:</strong> {task.nacimiento}</p>
              <p className="my-4"><strong>Municipio:</strong> {task.municipio}</p>
              <p className="my-4"><strong>Dirección Postal:</strong> {task.postal}</p>
              <p className="my-4"><strong>Años de residencia en la provincia de Misiones:</strong> {task.residencia}</p>
              <p className="my-4"><strong>Nacionalidad:</strong> {task.nacionalidad}</p>
              <p className="my-4"><strong>Correo:</strong> {task.correo}</p>
              <p className="my-4"><strong>Teléfono:</strong> {task.telefono}</p>
              
              {/* <p className="my-4"><strong>Localidad:</strong> {task.localidad}</p> */}
              
              
              
              <p className="my-4"><strong>Rol Directo que desempeña en la danza:</strong></p>
              <ul>
                {task.roldirecto.map((roldirecto, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faStar} className="text-black-300 mr-2" /> {/* Icono de estrella */}
                    {roldirecto}
                  </li>
                ))}
              </ul>

              <p className="my-4"><strong>Disciplina en que se desempeña:</strong></p>
              
              
              <ul>
                {task.disciplinadirecta.map((disciplinadirecta, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faStar} className="text-black-300 mr-2" /> {/* Icono de estrella */}
                    {disciplinadirecta}
                  </li>
                ))}
              </ul>

              <p className="my-4"><strong>Rol Indirecto que desempeña en la danza:</strong></p>
              <ul>
                {task.rolindirecto.map((rolindirecto, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faStar} className="text-black-300 mr-2" /> {/* Icono de estrella */}
                    {rolindirecto}
                  </li>
                ))}
              </ul>

              <p className="my-4"><strong>Disciplina en que se desempeña:</strong></p>
              
              
              <ul>
                {task.disciplinaindirecta.map((disciplinaindirecta, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faStar} className="text-black-300 mr-2" /> {/* Icono de estrella */}
                    {disciplinaindirecta}
                  </li>
                ))}
              </ul>

              <p className="my-4"><strong>Formación académica Pública:</strong></p>
              <ul>
                {task.formacionpublica.map((formacionpublica, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faStar} className="text-black-300 mr-2" /> {/* Icono de estrella */}
                    {formacionpublica}
                  </li>
                ))}
              </ul>

              <p className="my-4"><strong>Disciplina en que se formó:</strong></p>

              <ul>
                {task.disciplinapublica.map((disciplinapublica, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faStar} className="text-black-300 mr-2" /> {/* Icono de estrella */}
                    {disciplinapublica}
                  </li>
                ))}
              </ul>

             
              <p className="my-4"><strong>Formación en la/las institución/es en la que finalizo sus estudios :</strong>{task.publico}</p>

              <p className="my-4"><strong>Formación académica privada:</strong></p>
              <ul>
                {task.formacionprivada.map((formacionprivada, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faStar} className="text-black-300 mr-2" /> {/* Icono de estrella */}
                    {formacionprivada}
                  </li>
                ))}
              </ul>

              <p className="my-4"><strong>Disciplina en que se formó:</strong></p>

              <ul>
                {task.disciplinaprivada.map((disciplinaprivada, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faStar} className="text-black-300 mr-2" /> {/* Icono de estrella */}
                    {disciplinaprivada}
                  </li>
                ))}
              </ul>

              <p className="my-4"><strong>Formación en la/las institución/es en la que finalizo sus estudios :</strong>{task.privada}</p>
              
              
            
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
