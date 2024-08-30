import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./taskformpage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

function TaskFormPageEdit() {
  const { register, handleSubmit, setValue } = useForm();
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
  
        // Convertir la fecha al formato Date y ajustarla a la zona horaria local
        const utcDate = new Date(task.fecha);
        const offset = 3 * 60; // Ajusta el desfase a -3 horas para Buenos Aires (UTC-3)
        const localDate = new Date(utcDate.getTime() + offset * 60 * 1000);
  
        console.log("Fecha desde la tarea:", task.fecha);
        console.log("Fecha convertida:", localDate);
  
        // Establecer valores en el formulario
        setValue("expe", task.expe);
        setValue("correlativo", task.correlativo);
        setValue("anio", task.anio);
        setValue("cuerpo", task.cuerpo);
        setSelectedDate(localDate); // Establecer la fecha en el estado
        setValue("iniciador", task.iniciador);
        setValue("asunto", task.asunto);
  
        // Mostrar información de archivos cargados previamente
        if (task.file && task.file.length > 0) {
          setSelectedFiles(task.file); // Establecer los archivos cargados previamente en el estado
        }
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);
  
  

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      const utcDate = selectedDate ? new Date(selectedDate.getTime() - (-3 * 60 * 60 * 1000)) : ""; // Convertir a UTC
      
      // Añadir campos de texto al FormData
      Object.keys(data).forEach(key => {
        if (key !== "file") {
          formData.append(key, data[key]);
        }
      });
  
      // Añadir fecha en formato ISO para almacenamiento
      formData.append('fecha', utcDate.toISOString());
  
      // Añadir archivos al FormData
      selectedFiles.forEach(file => {
        formData.append("file", file);
      });
  
      if (params.id) {
        await updateTask(params.id, formData);
      } else {
        await createTask(formData);
      }
  
      navigate("/task");
    } catch (error) {
      console.error("Error:", error);
    }
  });
  
  
  
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files)); // Almacenar los archivos seleccionados en el estado
  };

  return (
    <div
      className="flex items-center justify-center overflow-y-auto"
      style={{ marginTop: "20px", marginBottom: "20px" }}
    >
      <div className="bg-gray-300 max-w-md w-full p-10 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Editar Archivo</h1>
          <Link
            to="/task"
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />{" "}
            {/* Ícono de flecha hacia la izquierda */}
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
            N° Correlativo
          </label>
          <input
            type="text"
            {...register("correlativo", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="N° Correlativo"
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
            htmlFor="cuerpo"
            className="block text-sm font-medium text-black"
          >
            Cuerpo
          </label>
          <input
            type="text"
            {...register("cuerpo", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Cuerpo"
          />
          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-black"
          >
            Fecha
          </label>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={selectedDate} // Usa el estado de fecha seleccionado
            onChange={(date) => setSelectedDate(date)}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholderText="Seleccionar fecha"
            required
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
          <input
            type="text"
            {...register("asunto", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Asunto"
          />
          <label
            htmlFor="file"
            className="block text-sm font-medium text-black"
          >
            Archivo
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

