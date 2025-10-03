import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import { useTasks } from "../context/TasksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


/**
 * Mapea el estado del registro a un color base de Tailwind CSS.
 * @param {string} status - El estado de la tarea (ej: 'rechazado', 'aprobado').
 * @returns {string} El nombre del color base (ej: 'red', 'green', 'orange').
 */
const getStatusColorName = (status) => {
  // Usamos el mapa de colores que proporcionaste
  return {
    ingresado: "gray",
    pendiente: "orange",
    controlado: "blue",
    aprobado: "green",
    rechazado: "red",
    finalizado: "black",
  }[status.toLowerCase()] || "gray";
};


function TaskViewPage() {
  const { getTask } = useTasks();
  const params = useParams();
  const [task, setTask] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  // NOTA: El uso de 'import.meta.env' puede causar advertencias en algunos entornos de compilación.
  // Mantengo la línea como la provees, asumiendo que tu entorno la maneja correctamente.
  const apiUrl = import.meta.env.VITE_API_ARCHIVO;

  useEffect(() => {
    async function fetchTask() {
      try {
        const fetchedTask = await getTask(params.id);
        setTask(fetchedTask);
        
        // Configurar la URL del primer archivo PDF si existe
        if (fetchedTask.file?.length > 0) {
          setPdfUrl(`${apiUrl}/tasks/file/${fetchedTask.file[0].filename}`);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    }
    fetchTask();
  }, [getTask, params.id, apiUrl]); // Agregado apiUrl a las dependencias

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "Fecha no válida";
    }
    return `${format(date, "dd/MM/yyyy", { locale: esLocale })} a las ${format(date, "HH:mm:ss")}`;
  };
  

  const renderTaskDetails = () => {
    if (!task) return null;

    // Se añaden 'estado' y 'motivoRechazo' a la desestructuración
    const { 
      nroexpediente, expendio, persona, dni, apellido, nombre, localidad, 
      domicilio, horarios, lugar, dias, rubro, tipoevento, email, contacto, 
      nroHabilitacion, domicilioLocalComercial, horarioAtencion, createdAt,
      estado, motivoRechazo 
    } = task;
    
    // Obtener el nombre del color base (ej: 'red', 'green')
    const statusColorName = getStatusColorName(estado || 'ingresado');
    const isRechazado = estado?.toLowerCase() === "rechazado";

    const isEventoParticular = expendio === "Evento Particular";
    const isLocalComercial = expendio === "Local Comercial";
    const isPersonaJuridica = persona === "jurídica";

    return (
      <>
        
        <p className="my-4">
          <strong>Fecha de Creación:</strong> {formatDate(createdAt)}
          <p className="my-4"><strong>Nro Expediente:</strong> {nroexpediente || 'No asignado'}</p>
        </p>
        
        {/* Aplicación dinámica del color al estado */}
        <p className="my-4">
          <strong className="text-xl mr-2">Estado:</strong> 
          <span className={`font-bold p-1 rounded-md text-white bg-${statusColorName}-600`}>
            {estado ? estado.toUpperCase() : 'DESCONOCIDO'}
          </span>
        </p>

        {/* Bloque condicional para mostrar el motivoRechazo con colores dinámicos */}
        {isRechazado && motivoRechazo && (
          <div className={`bg-${statusColorName}-200 border-l-4 border-${statusColorName}-500 text-${statusColorName}-700 p-4 my-6 rounded-md shadow-lg`}>
            <h3 className="text-xl font-bold mb-2">Motivo de Rechazo</h3>
            <p className="text-lg">{motivoRechazo}</p>
          </div>
        )}
        
        {/* Resto de los detalles de la tarea... */}
        {isEventoParticular && (
          <>
          
            <p className="my-4"><strong>Tipo de Persona:</strong> {persona}</p>
            <p className="my-4"><strong>Tipo de Expendio:</strong> {expendio}</p>
            <p className="my-4"><strong>DNI:</strong> {dni}</p>
            <p className="my-4"><strong>Apellido:</strong> {apellido}</p>
            <p className="my-4"><strong>Nombre:</strong> {nombre}</p>
            <p className="my-4"><strong>Localidad:</strong> {localidad}</p>
            <p className="my-4"><strong>Domicilio Particular:</strong> {domicilio}</p>
            <p className="my-4"><strong>Lugar de Realización del evento:</strong> {lugar}</p>
            <p className="my-4"><strong>Días del evento:</strong> {dias}</p>
            <p className="my-4"><strong>Horarios del evento:</strong> {horarios}</p>
            <p className="my-4"><strong>Tipo de Evento:</strong> {tipoevento}</p>
            <p className="my-4"><strong>Email particular:</strong> {email}</p>
            <p className="my-4"><strong>Nro de WhatsApp:</strong> {contacto}</p>
            {isPersonaJuridica && (
              <p className="my-4"><strong>Número de Habilitación Municipal:</strong> {nroHabilitacion}</p>
            )}
          </>
        )}

        {isLocalComercial && (
          <>
            <p className="my-4"><strong>Tipo de Persona:</strong> {persona}</p>
            <p className="my-4"><strong>Tipo de Expendio:</strong> {expendio}</p>
            <p className="my-4"><strong>DNI del Propietario:</strong> {dni}</p>
            <p className="my-4"><strong>Apellido:</strong> {apellido}</p>
            <p className="my-4"><strong>Nombre:</strong> {nombre}</p>
            <p className="my-4"><strong>Localidad:</strong> {localidad}</p>
            <p className="my-4"><strong>Domicilio Particular:</strong> {domicilio}</p>
            <p className="my-4"><strong>Nro de Habilitación Municipal:</strong> {nroHabilitacion}</p>
            <p className="my-4"><strong>Domicilio del Local Comercial:</strong> {domicilioLocalComercial}</p>
            <p className="my-4"><strong>Horario de atención:</strong> {horarioAtencion}</p>
            <p className="my-4"><strong>Rubro:</strong> {rubro}</p>
            <p className="my-4"><strong>Email particular:</strong> {email}</p>
            <p className="my-4"><strong>Nro de WhatsApp:</strong> {contacto}</p>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex items-center justify-center overflow-y-auto" style={{ marginTop: "20px", marginBottom: "20px", paddingRight: "20px", paddingLeft: "20px" }}>
      <div className="bg-gray-300 max-w-screen-md w-full p-10 rounded-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-extrabold text-gray-800">Detalles del Registro</h1>
          <Link 
             to="/task" 
             className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 shadow-md flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
             <span>Volver</span>
          </Link>
        </div>
        <div className="text-gray-700 text-base leading-relaxed">
          {task ? (
            <>
              {renderTaskDetails()}

              {/* Mostrar todos los archivos asociados a la tarea */}
              {task.file && task.file.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-400">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Archivos Adjuntos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {task.file.map((fileInfo, index) => (
                  <a
                    key={index}
                    href={`${apiUrl}/tasks/file/${fileInfo.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 text-center rounded-lg shadow-md transition duration-200 break-words w-full text-sm truncate"
                    title={fileInfo.filename}
                  >
                    {fileInfo.filename}
                  </a>
                ))}
              </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-xl text-gray-600">Cargando detalles del registro...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskViewPage;
