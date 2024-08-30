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

  useEffect(() => {
    async function fetchTask() {
      try {
        const fetchedTask = await getTask(params.id);
        setTask(fetchedTask);
        if (fetchedTask.file && fetchedTask.file.length > 0) {
          // Verifica si la URL es correcta y si el archivo está disponible
          setPdfUrl(`http://localhost:3007/api/tasks/file/${fetchedTask.file[0].filename}`);
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
      const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      // Formatear la fecha local
      return format(localDate, "dd/MM/yyyy", { locale: esLocale });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha no válida";
    }
  };

  return (
    <div className="flex items-center justify-center overflow-y-auto my-10">
      <div className="bg-gray-200 max-w-md w-full p-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Detalles del Registro</h1>
          <Link to="/task" className="btn btn-success">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <div className="text-black">
          {task ? (
            <>
              <p className="my-4"><strong>Datos del Encuestador</strong></p>
              <p className="my-4">Codigo del Organismo: {task.expe}</p>
              <p className="my-4">N° Correlativo: {task.correlativo}</p>
              <p className="my-4">Año: {task.anio}</p>
              <p className="my-4">Cuerpo: {task.cuerpo}</p>
              <p className="my-4">Fecha: {formatDate(task.fecha)}</p>
              <p className="my-4">Iniciador: {task.iniciador}</p>
              <p className="my-4">Asunto: {task.asunto}</p>
              {pdfUrl && (
                <div className="my-4">
                  <a href={pdfUrl} target="_blank" className="btn btn-primary" rel="noopener noreferrer">Ver PDF</a>
                </div>
              )}
            </>
          ) : (
            <p>Cargando...</p> // Mensaje mientras se carga la tarea
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskViewPage;
