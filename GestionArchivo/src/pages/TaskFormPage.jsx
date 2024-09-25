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
import Swal from "sweetalert2";

function TaskFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [file, setFile] = useState(null); // Estado para almacenar el archivo seleccionado
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);

        // Configurar los valores del formulario
        setValue("expe", task.expe);
        setValue("correlativo", task.correlativo);
        setValue("anio", task.anio);
        setValue("cuerpo", task.cuerpo);
        setValue("iniciador", task.iniciador);
        setValue("asunto", task.asunto);

        // Configurar la fecha si existe
        if (task.fecha) {
          setSelectedDate(new Date(task.fecha));
        }
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Mostrar la alerta de carga
      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere mientras se carga el registro.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formattedDate = selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : "";
      const formData = new FormData();
      formData.append("expe", data.expe);
      formData.append("correlativo", data.correlativo);
      formData.append("anio", data.anio);
      formData.append("cuerpo", data.cuerpo);
      formData.append("fecha", formattedDate);
      formData.append("iniciador", data.iniciador);
      formData.append("asunto", data.asunto);

      if (file) {
        formData.append("file", file); // Asegúrate de que 'file' es el nombre del campo
      }

      // Enviar el formulario
      if (params.id) {
        await updateTask(params.id, formData);
      } else {
        await createTask(formData);
      }

      // Cerrar la alerta de carga
      Swal.close();

      // Mostrar la alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Registro cargado correctamente.",
        confirmButtonText: "OK",
      });

      navigate("/task");
    } catch (error) {
      console.error("Error:", error);

      // Cerrar la alerta de carga y mostrar un error
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El expediente ya ha sido cargado.",
      });
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Almacenar el archivo seleccionado en el estado
  };

  return (
    <div
      className="flex items-center justify-center overflow-y-auto"
      style={{ marginTop: "20px", marginBottom: "20px", paddingRight: "20px", paddingLeft: "20px" }}
    >
      <div className="bg-gray-300 max-w-screen-md w-full p-10 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Registro de Archivo</h1>
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
            selected={selectedDate}
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
          <textarea
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
            name="file"
            onChange={handleFileChange}
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

export default TaskFormPage;
