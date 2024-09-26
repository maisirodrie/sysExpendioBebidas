import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function TaskFormPageEdit() {
  const { register, handleSubmit, setValue } = useForm();
  const { getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null); // URL del archivo actual
  const apiUrl = import.meta.env.VITE_API_ARCHIVO;

  // Cargar la tarea actual al montar el componente
  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);

        // Ajustar fecha local (UTC -3 para Buenos Aires)
        const utcDate = new Date(task.fecha);
        const offset = 3 * 60; // UTC -3
        const localDate = new Date(utcDate.getTime() + offset * 60 * 1000);

        // Asignar los valores de la tarea al formulario
        setValue("expe", task.expe);
        setValue("correlativo", task.correlativo);
        setValue("anio", task.anio);
        setValue("cuerpo", task.cuerpo);
        setSelectedDate(localDate);
        setValue("iniciador", task.iniciador);
        setValue("asunto", task.asunto);

        // Si existe un archivo, mostrar el enlace al archivo actual
        if (task.file && task.file.length > 0) {
          const fileUrl = `${apiUrl}/tasks/file/${task.file[0].filename}`;
          setPdfUrl(fileUrl);
          setSelectedFiles(task.file); // Mantiene referencia al archivo actual
        }
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);

  // Manejo de la selección de archivo
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // Enviar el formulario
  const onSubmit = handleSubmit(async (data) => {
    try {
      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere mientras se carga el registro.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const formData = new FormData();
      const utcDate = selectedDate
        ? new Date(selectedDate.getTime() - -3 * 60 * 60 * 1000) // Convertir a UTC -3
        : "";

      // Agregar todos los campos, excepto el archivo
      Object.keys(data).forEach((key) => {
        if (key !== "file") {
          formData.append(key, data[key]);
        }
      });

      formData.append("fecha", utcDate.toISOString());

      // Si se selecciona un nuevo archivo, añadirlo al formData
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("file", file);
        });
      }

      // Si existe un ID, actualizar la tarea
      if (params.id) {
        await updateTask(params.id, formData);
        Swal.close();
        Swal.fire({
          title: "¡Éxito!",
          text: "Registro actualizado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      navigate("/task");
    } catch (error) {
      console.error("Error:", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al guardar el registro.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });

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
          <h1 className="text-2xl font-bold text-black">Editar Archivo</h1>
          <Link
            to="/task"
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />{" "}
          </Link>
        </div>
        <form onSubmit={onSubmit}>
          <label
            htmlFor="expe"
            className="block text-sm font-medium text-black"
          >
            Codigo del Organismo
          </label>
          <input
            type="text"
            {...register("expe", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Expediente N°"
          />

          <label
            htmlFor="correlativo"
            className="block text-sm font-medium text-black"
          >
            Número de Correlativo
          </label>
          <input
            type="text"
            {...register("correlativo", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Número correlativo"
          />

          <label
            htmlFor="anio"
            className="block text-sm font-medium text-black"
          >
            Año
          </label>
          <input
            type="text"
            {...register("anio", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Año"
          />

          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-black"
          >
            Fecha
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            dateFormat="dd/MM/yyyy"
          />

          <label
            htmlFor="iniciador"
            className="block text-sm font-medium text-black"
          >
            Iniciador
          </label>
          <input
            type="text"
            {...register("iniciador", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Iniciador"
          />

          <label
            htmlFor="asunto"
            className="block text-sm font-medium text-black"
          >
            Asunto
          </label>
          <textarea
            {...register("asunto", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Asunto"
          />

          <label
            htmlFor="cuerpo"
            className="block text-sm font-medium text-black"
          >
            Cuerpo
          </label>
          <textarea
            {...register("cuerpo", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Cuerpo"
          />

          {/* Mostrar el archivo actual si existe */}
          {pdfUrl && (
   <div className="my-4">
   <label
     htmlFor="archivo"
     className="block text-sm font-medium text-black mb-2" // Agregué mb-2 para margen inferior
   >
     Archivo actual:
   </label>
   <div></div>
   <a
     href={pdfUrl}
     target="_blank"
     rel="noopener noreferrer"
     className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 cursor-pointer"
   >
     Ver
   </a>
 </div>
 
          )}

          <label
            htmlFor="file"
            className="block text-sm font-medium text-black"
          >
            Reemplazar Archivo (opcional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            multiple
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskFormPageEdit;
