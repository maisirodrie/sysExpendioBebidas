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

        if (fetchedTask.file && fetchedTask.file.length > 0) {
          setPdfUrl(`${apiUrl}/tasks/file/${fetchedTask.file[0].filename}`);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    }
    fetchTask();
  }, [getTask, params.id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) {
        return "Fecha no válida";
      }
      // Obtener la fecha local
      const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      // Formatear la fecha local
      return format(localDate, "dd/MM/yyyy", { locale: esLocale });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha no válida";
    }
  };

  const tipoExpendio = task?.expendio;
  const tipoPersona = task?.persona;

  return (
    <div
      className="flex items-center justify-center overflow-y-auto"
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        paddingRight: "20px",
        paddingLeft: "20px",
      }}
    >
      <div className="bg-gray-300 max-w-screen-md w-full p-10 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">
            Detalles del Registro
          </h1>
          <Link to="/task" className="btn btn-success">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <div className="text-black">
          {task ? (
            <>
              <p className="my-4">
                <strong>Datos del Registro</strong>
              </p>

              {tipoExpendio && tipoPersona && (
                <>
                  {/* Evento Particular */}
                  {tipoExpendio === "Evento Particular" &&
                    tipoPersona === "física" && (
                      <>
                        <p className="my-4">Tipo de Persona: {task.persona}</p>
                        <p className="my-4">
                          Tipo de Expendio: {task.expendio}
                        </p>
                        <p className="my-4">DNI: {task.dni}</p>
                        <p className="my-4">Apellido: {task.apellido}</p>
                        <p className="my-4">Nombre: {task.nombre}</p>
                        <p className="my-4">Localidad: {task.localidad}</p>
                        <p className="my-4">
                          Domicilio Particular: {task.domicilio}
                        </p>
                        <p className="my-4">
                          Lugar de Realización del evento: {task.lugar}
                        </p>
                        <p className="my-4">Días del evento: {task.dias}</p>
                        <p className="my-4">
                          Horarios del evento: {task.horarios}
                        </p>
                        <p className="my-4">
                          Tipo de Evento: {task.tipoevento}
                        </p>
                        <p className="my-4">Email particular: {task.email}</p>
                        <p className="my-4">Nro de WhatsApp: {task.contacto}</p>
                      </>
                    )}

                  {tipoExpendio === "Evento Particular" &&
                    tipoPersona === "jurídica" && (
                      <>
                        <p className="my-4">Tipo de Persona: {task.persona}</p>
                        <p className="my-4">
                          Tipo de Expendio: {task.expendio}
                        </p>
                        <p className="my-4">
                          Número de Habilitación Municipal:{" "}
                          {task.nroHabilitacion}
                        </p>
                        <p className="my-4">DNI del Propietario: {task.dni}</p>
                        <p className="my-4">Apellido: {task.apellido}</p>
                        <p className="my-4">Nombre: {task.nombre}</p>
                        <p className="my-4">Localidad: {task.localidad}</p>
                        <p className="my-4">
                          Domicilio Particular: {task.domicilio}
                        </p>
                        <p className="my-4">
                          Lugar de Realización del evento: {task.lugar}
                        </p>
                        <p className="my-4">Días del evento: {task.dias}</p>
                        <p className="my-4">
                          Horarios del evento: {task.horarios}
                        </p>
                        <p className="my-4">
                          Tipo de Evento: {task.tipoevento}
                        </p>
                        <p className="my-4">Email particular: {task.email}</p>
                        <p className="my-4">Nro de WhatsApp: {task.contacto}</p>
                      </>
                    )}

                  {/* Local Comercial */}
                  {tipoExpendio === "Local Comercial" &&
                    tipoPersona === "física" && (
                      <>
                        <p className="my-4">Tipo de Persona: {task.persona}</p>
                        <p className="my-4">
                          Tipo de Expendio: {task.expendio}
                        </p>
                        <p className="my-4">DNI del Propietario: {task.dni}</p>
                        <p className="my-4">Apellido: {task.apellido}</p>
                        <p className="my-4">Nombre: {task.nombre}</p>
                        <p className="my-4">Localidad: {task.localidad}</p>
                        <p className="my-4">
                          Domicilio Particular: {task.domicilio}
                        </p>
                        <p className="my-4">
                          Nro de Habilitación Municipal: {task.nroHabilitacion}
                        </p>
                        <p className="my-4">
                          Domicilio del Local Comercial:{" "}
                          {task.domicilioLocalComercial}
                        </p>
                        <p className="my-4">
                          Horario de atención: {task.horarioAtencion}
                        </p>
                        <p className="my-4">Rubro: {task.horarios}</p>
                        <p className="my-4">Email particular: {task.email}</p>
                        <p className="my-4">Nro de WhatsApp: {task.contacto}</p>
                      </>
                    )}

                  {tipoExpendio === "Local Comercial" &&
                    tipoPersona === "jurídica" && (
                      <>
                        <p className="my-4">Tipo de Persona: {task.persona}</p>
                        <p className="my-4">
                          Tipo de Expendio: {task.expendio}
                        </p>
                        <p className="my-4">DNI del Propietario: {task.dni}</p>
                        <p className="my-4">Apellido: {task.apellido}</p>
                        <p className="my-4">Nombre: {task.nombre}</p>
                        <p className="my-4">Localidad: {task.localidad}</p>
                        <p className="my-4">
                          Domicilio Particular: {task.domicilio}
                        </p>
                        <p className="my-4">
                          Nro de Habilitación Municipal: {task.nroHabilitacion}
                        </p>
                        <p className="my-4">
                          Domicilio del Local Comercial:{" "}
                          {task.domicilioLocalComercial}
                        </p>
                        <p className="my-4">
                          Horario de atención: {task.horarioAtencion}
                        </p>
                        <p className="my-4">Rubro: {task.horarios}</p>
                        <p className="my-4">Email particular: {task.email}</p>
                        <p className="my-4">Nro de WhatsApp: {task.contacto}</p>
                      </>
                    )}
                </>
              )}

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
                        Descargar {fileInfo.filename}
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
