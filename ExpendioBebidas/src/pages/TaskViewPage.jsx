import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import { useTasks } from "../context/TasksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


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
  }, [getTask, params.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "Fecha no válida";
    }
    return `${format(date, "dd/MM/yyyy", { locale: esLocale })} a las ${format(date, "HH:mm:ss")}`;
  };
  

  const renderTaskDetails = () => {
    if (!task) return null;

    // AQUI ESTABA EL ERROR: Faltaban 'estado' y 'motivoRechazo' en la desestructuración.
    const { 
      nroexpediente,
      expendio, 
      persona, 
      dni, 
      apellido, 
      nombre, 
      localidad, 
      domicilio,
      horarios, 
      lugar, 
      dias, 
      rubro, 
      tipoevento, 
      email, 
      contacto, 
      nroHabilitacion, 
      domicilioLocalComercial, 
      horarioAtencion, 
      createdAt,
      // **Añadido 'estado' y 'motivoRechazo'**
      estado,
      motivoRechazo
    } = task;

    // Nota: Aunque statusColorName se calcula, no se usa en el JSX, pero la línea es correcta ahora.
    const statusColorName = getStatusColorName(estado || 'ingresado');
    const isRechazado = estado?.toLowerCase() === "rechazado";
    const isEventoParticular = expendio === "Evento Particular";
    const isLocalComercial = expendio === "Local Comercial";
    const isPersonaFisica = persona === "física";
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
          <strong className={`text-${statusColorName}-600`}> 
            {estado ? estado.toUpperCase() : 'DESCONOCIDO'}
          </strong>
        </p>

        {/* Bloque condicional para mostrar el motivoRechazo con colores dinámicos */}
        {isRechazado && motivoRechazo && (
          <div className="my-4 p-4 border-l-4 border-red-500 bg-red-100 rounded">
            <h3 className="text-xl font-bold text-red-700 mb-2">Motivo de Rechazo</h3>
            <p className="text-lg text-red-600">{motivoRechazo}</p>
          </div>
        )}
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
      <div className="bg-gray-300 max-w-screen-md w-full p-10 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Detalles del Registro</h1>
<Link to="/task" className="btn btn-success">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <div className="text-black">
          {task ? (
            <>
              {renderTaskDetails()}

              {/* Mostrar todos los archivos asociados a la tarea */}
              {task.file && task.file.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-400">
                    <h3 className="text-xl font-bold mb-3">Archivos Adjuntos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {task.file.map((fileInfo, index) => (
                        <a
                    key={index}
                    href={`${apiUrl}/tasks/file/${fileInfo.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 text-center rounded transition duration-200 break-words w-full"
                  >
                    {fileInfo.filename}
                  </a>
                      ))}
                    </div>
                </div>
              )}
            </>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskViewPage;
