import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./taskformpage.css";

function TaskFormPageEdit() {
  const [startDate, setStartDate] = useState(new Date());
  const { register, handleSubmit, setValue } = useForm();
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);

        // Encargado
        setValue("expe", task.expe);
        setValue("correlativo", task.correlativo);
        setValue("anio", task.anio);
        setValue("cuerpo", task.cuerpo);
        setValue("fecha", task.fecha);
        setValue("iniciador", task.iniciador);
        setValue("asunto", task.asunto);
        setValue("iniciador", task.iniciador);
        setValue("file", task.file);
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedData = {
        ...data,
      };

      console.log("Datos del formulario a enviar:", updatedData);

      if (params.id) {
        await updateTask(params.id, updatedData);
      } else {
        await createTask(updatedData);
      }
      navigate("/task");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDniError(error.response.data.message);
      } else {
        console.error("Error:", error);
      }
    }
  });

  //Funciones

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
          <input
            type="text"
            {...register("fecha", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Fecha"
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
            {...register("file", { required: true })} multiple onChange={handleFileChange}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
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
