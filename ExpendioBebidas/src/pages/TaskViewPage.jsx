import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import { useTasks } from "../context/TasksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    return format(date, "dd/MM/yyyy", { locale: esLocale });
  };

  const renderTaskDetails = () => {
    if (!task) return null;

    const { expendio, persona, dni, apellido, nombre, localidad, domicilio, lugar, dias, rubro, tipoevento, email, contacto, nroHabilitacion, domicilioLocalComercial, horarioAtencion } = task;

    const isEventoParticular = expendio === "Evento Particular";
    const isLocalComercial = expendio === "Local Comercial";
    const isPersonaFisica = persona === "física";
    const isPersonaJuridica = persona === "jurídica";

    return (
      <>
        <p className="my-4"><strong>Datos del Registro</strong></p>
        
        {isEventoParticular && (
          <>
            <p className="my-4">Tipo de Persona: {persona}</p>
            <p className="my-4">Tipo de Expendio: {expendio}</p>
            <p className="my-4">DNI: {dni}</p>
            <p className="my-4">Apellido: {apellido}</p>
            <p className="my-4">Nombre: {nombre}</p>
            <p className="my-4">Localidad: {localidad}</p>
            <p className="my-4">Domicilio Particular: {domicilio}</p>
            <p className="my-4">Lugar de Realización del evento: {lugar}</p>
            <p className="my-4">Días del evento: {dias}</p>
            <p className="my-4">Horarios del evento: {horarios}</p>
            <p className="my-4">Tipo de Evento: {tipoevento}</p>
            <p className="my-4">Email particular: {email}</p>
            <p className="my-4">Nro de WhatsApp: {contacto}</p>
            {isPersonaJuridica && (
              <p className="my-4">Número de Habilitación Municipal: {nroHabilitacion}</p>
            )}
          </>
        )}

        {isLocalComercial && (
          <>
            <p className="my-4">Tipo de Persona: {persona}</p>
            <p className="my-4">Tipo de Expendio: {expendio}</p>
            <p className="my-4">DNI del Propietario: {dni}</p>
            <p className="my-4">Apellido: {apellido}</p>
            <p className="my-4">Nombre: {nombre}</p>
            <p className="my-4">Localidad: {localidad}</p>
            <p className="my-4">Domicilio Particular: {domicilio}</p>
            <p className="my-4">Nro de Habilitación Municipal: {nroHabilitacion}</p>
            <p className="my-4">Domicilio del Local Comercial: {domicilioLocalComercial}</p>
            <p className="my-4">Horario de atención: {horarioAtencion}</p>
            <p className="my-4">Rubro: {rubro}</p>
            <p className="my-4">Email particular: {email}</p>
            <p className="my-4">Nro de WhatsApp: {contacto}</p>
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
                <div className="my-4">
                  <h2 className="font-bold">Archivos Asociados</h2>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {task.file.map((fileInfo, index) => (
                      <a
                        key={index}
                        href={`${apiUrl}/tasks/file/${fileInfo.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
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
