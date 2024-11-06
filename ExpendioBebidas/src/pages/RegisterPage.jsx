import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';

import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./taskformpage.css";

function RegisterPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { createTasksPublic, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [tipoExpendio, setTipoExpendio] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [showRequisitos, setShowRequisitos] = useState(true);
  const [horarios, setHorarios] = useState([""]); // Estado para los horarios

  useEffect(() => {
    async function loadTask() {
      console.log("useEffect ejecutado"); // Verificar si se ejecuta el efecto
      if (params.id) {
        try {
          const task = await getTask(params.id);
          console.log("Tarea cargada:", task); // Verifica qué datos se están cargando
          if (task) {
            // Rellenar los valores del formulario con la tarea existente
            setValue("expendio", task.expendio);
            setValue("persona", task.persona);
            setValue("dni", task.dni);
            setValue("apellido", task.apellido);
            setValue("nombre", task.nombre);
            setValue("localidad", task.localidad);
            setValue("domicilio", task.domicilio);
            setValue("lugar", task.lugar);
            setValue("dias", task.dias);
            setValue("horarios", task.horarios);
            setValue("tipoevento", task.tipoevento);
            setValue("email", task.email);
            setValue("contacto", task.contacto);
            setValue("nroHabilitacion", task.nroHabilitacion);
            setValue("domicilioLocalComercial", task.domicilioLocalComercial);
            setValue("rubro", task.rubro);
            setValue("horarioAtencion", task.horarioAtencion);
            setValue("habilitacionComercial", task.habilitacionComercial);
            setTipoExpendio(task.expendio);
            setTipoPersona(task.persona);
          } else {
            console.error("No se encontró la tarea.");
          }
        } catch (error) {
          console.error("Error al cargar la tarea:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al cargar la tarea.",
          });
        }
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere mientras se guarda el registro.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Agregar los horarios al formData
      horarios.forEach((horario) => {
        if (horario) formData.append("horarios[]", horario); // Usar un arreglo
      });

      files.forEach((file) => {
        formData.append("files", file);
      });

      if (params.id) {
        await updateTask(params.id, formData);
      } else {
        await createTasksPublic(formData);
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        html: `
          <p>Su registro se ha generado con éxito con el número de trámite: <strong></strong>.</p>
          <p>Para cualquier consulta, llame al: <strong>0376-4447752</strong>.</p>
        `,
        confirmButtonText: "OK",
        allowOutsideClick: false, // Evita que se cierre al hacer clic fuera
        showCloseButton: false, // Evita el botón de cierre en la esquina
      });

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el registro.",
      });
    }
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convertir el FileList a un array
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Acumular archivos
  };

  // Función para eliminar un archivo específico del acumulador
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleTipoExpendioChange = (e) => {
    const selectedExpendio = e.target.value;
    setTipoExpendio(selectedExpendio);
    setValue("expendio", selectedExpendio); // Actualiza el valor en el formulario

    // Si se selecciona "Evento Particular", establecer persona como "Física"
    if (selectedExpendio === "Evento Particular") {
      setValue("persona", "Física"); // Asegura que el valor en el formulario sea "Física"
    } else {
      setValue("persona", ""); // Limpia el campo de persona si es "Local Comercial"
    }
  };

  const handleTipoPersonaChange = (e) => {
    setTipoPersona(e.target.value);
    setValue("persona", e.target.value);
  };

  const downloadFile = async (filePath) => {
    try {
        const response = await axios.get(filePath, {
            responseType: 'blob', // Indica que es un archivo binario
        });

        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filePath.split('/').pop()); // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error('Error al descargar el archivo:', error);
        alert('Se ha producido un error al cargar el documento PDF.');
    }
};
  

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
            Registro de Expendio
          </h1>
          <Link
            to="/"
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />{" "}
            {/* Ícono de flecha hacia la izquierda */}
          </Link>
        </div>
      {/* Sección de Requisitos con documentos descargables */}
      {showRequisitos && (
    <div className="relative mb-4 bg-yellow-200 p-4 rounded-md shadow-lg">
        <h2 className="font-bold text-lg">Importante:</h2>
        <p className="text-sm text-gray-700 mt-2">
            Antes de proceder con el registro, es fundamental que leas y comprendas los requisitos necesarios para completar el proceso de manera efectiva. Por favor, asegúrate de tener los siguientes documentos listos:
        </p>
        <div className="flex space-x-2 justify-center mt-2">
            <button
                onClick={() => downloadFile(`${import.meta.env.VITE_DOCS_URL}/requisitos-local.pdf`)} // Ruta de documentos
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                Descargar para habilitación de local
            </button>
            <button
                onClick={() => downloadFile(`${import.meta.env.VITE_DOCS_URL}/requisitos-eventos.pdf`)} // Ruta de documentos
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                Descargar para habilitación de eventos
            </button>
        </div>
    </div>
)}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Selección de Tipo de Evento */}
          <label
            htmlFor="Evento"
            className="block text-sm font-medium text-black"
          >
            Tipo de Expendio Expendio de Bebidas
          </label>
          <select
            id="expendio"
            {...register("expendio", { required: true })}
            onChange={handleTipoExpendioChange}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          >
            <option value="">Seleccione un tipo de Expendio de Bebidas</option>
            <option value="Evento Particular">Evento Particular</option>
            <option value="Local Comercial">
              Habilitación de Venta de Bebidas para Local Comercial
            </option>
          </select>

          {tipoExpendio && (
            <>
              {tipoExpendio === "Local Comercial" && (
                <>
                  <label
                    htmlFor="tipoPersona"
                    className="block text-sm font-medium text-black"
                  >
                    Tipo de Persona
                  </label>
                  <select
                    id="persona"
                    {...register("persona", { required: true })}
                    onChange={handleTipoPersonaChange}
                    className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                  >
                    <option value="">Seleccione un tipo de persona</option>
                    <option value="Física">Física</option>
                    <option value="Jurídica">Jurídica</option>
                  </select>
                </>
              )}
            </>
          )}

          {tipoExpendio === "Evento Particular" && (
            <>
              {/* Campos para Evento Particular - Persona Física */}
              <label
                htmlFor="tipoPersona"
                className="block text-sm font-medium text-black"
              >
                Tipo de Persona
              </label>
              <input
                id="persona"
                type="text"
                {...register("persona", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                 Value="Física"
                 readOnly
              />

              <label
                htmlFor="dni"
                className="block text-sm font-medium text-black"
              >
                DNI
              </label>
              <input
                type="text"
                {...register("dni", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="DNI"
              />

              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-black"
              >
                Apellido
              </label>
              <input
                type="text"
                {...register("apellido", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Apellido"
              />

              <label
                htmlFor="nombrePersona"
                className="block text-sm font-medium text-black"
              >
                Nombre
              </label>
              <input
                type="text"
                {...register("nombre", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nombre"
              />

              <label
                htmlFor="localidad"
                className="block text-sm font-medium text-black"
              >
                Localidad
              </label>
              <input
                type="text"
                {...register("localidad", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Localidad"
              />

              <label
                htmlFor="domicilio"
                className="block text-sm font-medium text-black"
              >
                Domicilio Particular
              </label>
              <input
                type="text"
                {...register("domicilio", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Domicilio"
              />

              <label
                htmlFor="lugar"
                className="block text-sm font-medium text-black"
              >
                Lugar de Realización del evento
              </label>
              <input
                type="text"
                {...register("lugar", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Lugar de Realización del evento"
              />

              <label
                htmlFor="dias"
                className="block text-sm font-medium text-black"
              >
                Días del evento
              </label>
              <textarea
                type="text"
                {...register("dias", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Días"
              />

              <label
                htmlFor="horarios"
                className="block text-sm font-medium text-black"
              >
                Horarios del evento
              </label>
              <textarea
                type="text"
                {...register("horarios", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Horarios"
              />

              <label
                htmlFor="tipoevento"
                className="block text-sm font-medium text-black"
              >
                Tipo de Evento
              </label>
              <input
                type="text"
                {...register("tipoevento", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Tipo de Evento"
              />

              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email particular
              </label>
              <input
                type="text"
                {...register("email", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Email"
              />

              <label
                htmlFor="contacto"
                className="block text-sm font-medium text-black"
              >
                Nro de WhatsApp
              </label>
              <input
                type="text"
                {...register("contacto", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Teléfono de Contacto"
              />
            </>
          )}

          {tipoExpendio === "Local Comercial" && (
            <>
              {/* Campos para Habilitación de Venta de Bebidas */}
              <label
                htmlFor="dniPropietario"
                className="block text-sm font-medium text-black"
              >
                DNI del Propietario
              </label>
              <input
                type="text"
                {...register("dni", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="DNI del Propietario"
              />

              <label
                htmlFor="apellidoPropietario"
                className="block text-sm font-medium text-black"
              >
                Apellido
              </label>
              <input
                type="text"
                {...register("apellido", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Apellido del Propietario"
              />

              <label
                htmlFor="nombrePropietario"
                className="block text-sm font-medium text-black"
              >
                Nombre
              </label>
              <input
                type="text"
                {...register("nombre", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nombre del Propietario"
              />

              <label
                htmlFor="localidad"
                className="block text-sm font-medium text-black"
              >
                Localidad
              </label>
              <input
                type="text"
                {...register("localidad", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Localidad"
              />

              <label
                htmlFor="domicilio"
                className="block text-sm font-medium text-black"
              >
                Domicilio particular
              </label>
              <input
                type="text"
                {...register("domicilio", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Domicilio"
              />

              <label
                htmlFor="nroHabilitacion"
                className="block text-sm font-medium text-black"
              >
                Nro de Habilitación Municipal
              </label>
              <input
                type="text"
                {...register("nroHabilitacion", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nro de Habilitación Municipal"
              />

              <label
                htmlFor="horarios"
                className="block text-sm font-medium text-black"
              >
                Domicilio del Local Comercial
              </label>
              <input
                type="text"
                {...register("domicilioLocalComercial", {
                  required: true,
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Domicilio del Local Comercial"
              />

              <label
                htmlFor="dias"
                className="block text-sm font-medium text-black"
              >
                Horario de atención
              </label>
              <textarea
                type="text"
                {...register("horarioAtencion", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Horario de atención"
              />

              <label
                htmlFor="dias"
                className="block text-sm font-medium text-black"
              >
                Rubro
              </label>
              <textarea
                type="text"
                {...register("rubro", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Rubro"
              />

              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email
              </label>
              <input
                type="text"
                {...register("email", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Email"
              />

              <label
                htmlFor="contacto"
                className="block text-sm font-medium text-black"
              >
                Nro de Whatsapp
              </label>
              <input
                type="text"
                {...register("contacto", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Teléfono de Contacto"
              />
            </>
          )}

          <label
            htmlFor="file"
            className="block text-sm font-medium text-black"
          >
            Archivos
          </label>
          <input
            type="file"
            name="file"
            multiple
            onChange={handleFileChange}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          />

          {/* Mostrar archivos seleccionados */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Archivos seleccionados:</h3>
            <ul className="list-disc list-inside">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between">
                  {file.name}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

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

export default RegisterPage;
