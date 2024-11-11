import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Municipios } from "../api/municipios";
import "./taskformpage.css";
import Swal from "sweetalert2";

function TaskFormPageEdit() {
  const { register, handleSubmit, setValue } = useForm();
  const { getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]); // Cambiar a un array para manejar múltiples archivos
  const [tipoExpendio, setTipoExpendio] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState([]); // URL del archivo actual
  // Estado para almacenar archivos seleccionados para eliminar
const [filesToRemove, setFilesToRemove] = useState([]);

  const apiUrl = import.meta.env.VITE_API_ARCHIVO;
  const [LocalidadValue, setSelectedLocalidadValue] = useState("");

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
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
        // Si existen archivos, mostrar los enlaces
        if (task.file && task.file.length > 0) {
          const fileUrls = task.file.map(
            (file) => `${apiUrl}/tasks/file/${file.filename}`
          );
          setPdfUrl(fileUrls);
          setSelectedFiles(task.file);
        }
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere mientras se carga el registro.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "file") {
          formData.append(key, data[key]);
        }
      });
  
      // Agregar archivos actuales al FormData
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
      }
  
      // Agregar nuevos archivos al FormData
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }
  
      // Agregar archivos a eliminar en FormData
      filesToRemove.forEach((files) => {
        formData.append("files", files);
      });
  
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
  
      // Navegar y limpiar el estado de archivos para eliminar
      setFilesToRemove([]);
      navigate("/task");
    } catch (error) {
      console.error("Error al guardar la tarea:", error.response?.data || error.message);
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

  const handleLocalidadChange = (event) => {
    setSelectedLocalidadValue(event.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convertir el FileList a un array
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Acumular archivos
  };

// Función para marcar un archivo actual para eliminar
const removeCurrentFile = (index) => {
  const fileIdToRemove = selectedFiles[index].id;

  // Agregar el archivo a la lista de archivos a eliminar
  setFilesToRemove((prev) => [...prev, fileIdToRemove]);

  // Eliminarlo de la vista
  setPdfUrl((prevFiles) => prevFiles.filter((_, i) => i !== index));
  setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
};


// Función para alternar la selección de archivos a eliminar
const toggleFileSelection = (index) => {
  setFilesToRemove((prev) => {
    if (prev.includes(index)) {
      // Si el archivo ya está seleccionado, desmarcarlo
      return prev.filter((i) => i !== index);
    } else {
      // Si no está seleccionado, marcarlo
      return [...prev, index];
    }
  });
};

// Función para eliminar los archivos seleccionados
const removeSelectedFiles = () => {
  setPdfUrl((prevFiles) => prevFiles.filter((_, i) => !filesToRemove.includes(i)));
  setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => !filesToRemove.includes(i)));
  setFilesToRemove([]); // Limpiar la lista de archivos seleccionados
};



// Función para eliminar archivos seleccionados que aún no se han subido
const removeFile = (index) => {
  setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  resetFileInput(); // Restablecer el campo después de eliminar
};



// Función para restablecer el campo de entrada de archivos
const resetFileInput = () => {
  document.querySelector('input[type="file"]').value = files;
};

const handleSave = async () => {
  try {
    // Enviar la solicitud de actualización, incluyendo los archivos a eliminar
    await updateTask(params.id, {
      filesToRemove, // archivos marcados para eliminar
      // otros datos de la tarea, incluyendo nuevos archivos y campos actualizados
    });

    // Limpiar la lista de archivos a eliminar después de la solicitud
    setFilesToRemove([]);
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
  }
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
            Editar Registro de Archivo
          </h1>
          <Link
            to="/task"
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />{" "}
            {/* Ícono de flecha hacia la izquierda */}
          </Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Selección de Tipo de Evento */}
          <label
            htmlFor="Evento"
            className="block text-sm font-medium text-black"
          >
            Tipo de Expendio de Bebidas
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
              <select
                {...register("localidad")}
                value={LocalidadValue}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                onChange={handleLocalidadChange}
              >
                <option value="">Selecciona una localidad</option>
                {Municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.nombre}>
                    {municipio.nombre}
                  </option>
                ))}
              </select>

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
              <select
                {...register("localidad")}
                value={LocalidadValue}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                onChange={handleLocalidadChange}
              >
                <option value="">Selecciona una localidad</option>
                {Municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.nombre}>
                    {municipio.nombre}
                  </option>
                ))}
              </select>

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

          {/* Visualización de los archivos actuales */}
          {/* Visualización de los archivos actuales */}
          {pdfUrl.length > 0 && (
            <div className="my-4">
              <label className="block text-sm font-medium text-black mb-2">
                Archivos actuales:
              </label>
              {pdfUrl.map((url, index) => (
                <div key={index} className="flex justify-between items-center">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 block"
                  >
                    Ver Archivo {index + 1}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeCurrentFile(index)} // Llamada a la función de eliminación
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Entrada para reemplazar archivo */}
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
            onChange={(e) => {
              handleFileChange(e);
              resetFileInput(); // Restablece el campo de archivos después de agregar
            }}
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

          <button  onClick={handleSave}
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
