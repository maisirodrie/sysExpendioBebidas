import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

        const utcDate = new Date(task.fecha);
        const offset = 3 * 60; // Ajusta el desfase a -3 horas para Buenos Aires (UTC-3)
        const localDate = new Date(utcDate.getTime() + offset * 60 * 1000);

        setValue("expe", task.expe);
        setValue("correlativo", task.correlativo);
        setValue("anio", task.anio);
        setValue("cuerpo", task.cuerpo);
        setSelectedDate(localDate);
        setValue("iniciador", task.iniciador);
        setValue("asunto", task.asunto);

        if (task.file && task.file.length > 0) {
          setSelectedFiles(task.file);
        }
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Mostrar SweetAlert2 loading
      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere mientras se carga el registro.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      const utcDate = selectedDate ? new Date(selectedDate.getTime() - (-3 * 60 * 60 * 1000)) : "";

      Object.keys(data).forEach(key => {
        if (key !== "file") {
          formData.append(key, data[key]);
        }
      });

      formData.append('fecha', utcDate.toISOString());

      selectedFiles.forEach(file => {
        formData.append("file", file);
      });

      if (params.id) {
        await updateTask(params.id, formData);

        // Cerrar SweetAlert2 loading y mostrar éxito
        Swal.close();
        Swal.fire({
          title: "¡Éxito!",
          text: "Registro actualizado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createTask(formData);

        // Cerrar SweetAlert2 loading y mostrar éxito
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

      // Cerrar SweetAlert2 loading y mostrar error
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

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
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

