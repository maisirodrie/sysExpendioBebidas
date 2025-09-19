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
  const [files, setFiles] = useState([]);
  const [tipoExpendio, setTipoExpendio] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [nroExpedienteParts, setNroExpedienteParts] = useState({
    correlativo: "",
    codigoOrganismo: "",
    anio: "",
  });

  const apiUrl = import.meta.env.VITE_API_ARCHIVO;

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
        if (task.nroexpediente) {
          const parts = task.nroexpediente.split("/");
          if (parts.length === 2) {
            const [correlativo, anio] = parts;
            const correlativoParts = correlativo.split("-");
            if (correlativoParts.length === 2) {
              setNroExpedienteParts({
                correlativo: correlativoParts[0],
                codigoOrganismo: correlativoParts[1],
                anio: anio,
              });
            } else if (correlativoParts.length === 1) {
              setNroExpedienteParts({
                correlativo: correlativoParts[0],
                codigoOrganismo: "",
                anio: anio,
              });
            }
          }
        }

        setValue("expendio", task.expendio);
        setValue("persona", task.persona);
        setValue("dni", task.dni);
        setValue("apellido", task.apellido);
        setValue("nombre", task.nombre);
        setValue("localidad", task.localidad); // Esta línea es correcta y establece el valor
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

      if (
        nroExpedienteParts.correlativo &&
        nroExpedienteParts.codigoOrganismo &&
        nroExpedienteParts.anio
      ) {
        const fullNroExpediente = `${nroExpedienteParts.correlativo}-${nroExpedienteParts.codigoOrganismo}/${nroExpedienteParts.anio}`;
        formData.append("nroexpediente", fullNroExpediente);
      }

      Object.keys(data).forEach((key) => {
        if (key !== "correlativo" && key !== "codigoOrganismo" && key !== "anio") {
          formData.append(key, data[key]);
        }
      });

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      if (filesToRemove && filesToRemove.length > 0) {
        formData.append("filesToRemove", JSON.stringify(filesToRemove));
      }

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

      setFilesToRemove([]);
      navigate("/task");
    } catch (error) {
      console.error(
        "Error al guardar la tarea:",
        error.response?.data || error.message
      );
      Swal.close();
      const errorMessage = error.response?.data?.message || "Ocurrió un error al guardar el registro. Por favor, intente de nuevo.";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        timer: 4000,
        showConfirmButton: false,
      });
    }
  });

  const handleNroExpedienteChange = (e, field) => {
    const { value } = e.target;
    setNroExpedienteParts((prevParts) => ({ ...prevParts, [field]: value }));
  };

  // --- Esta variable de estado y función no son necesarias si usas react-hook-form ---
  // const [LocalidadValue, setSelectedLocalidadValue] = useState("");
  // const handleLocalidadChange = (event) => {
  //   setSelectedLocalidadValue(event.target.value);
  // };
  // --- FIN DE CÓDIGO INNECESARIO ---

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeCurrentFile = (index) => {
    const fileIdToRemove = selectedFiles[index].id;
    setFilesToRemove((prev) => [...prev, fileIdToRemove]);
    setPdfUrl((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    document.querySelector('input[type="file"]').value = "";
  };

  const handleTipoExpendioChange = (e) => {
    const selectedExpendio = e.target.value;
    setTipoExpendio(selectedExpendio);
    setValue("expendio", selectedExpendio);

    if (selectedExpendio === "Evento Particular") {
      setValue("persona", "Física");
    } else {
      setValue("persona", "");
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
          </Link>
        </div>
        <form onSubmit={onSubmit} className="mt-4">
          <label
            htmlFor="nroexpediente"
            className="block text-sm font-medium text-black"
          >
            Número de Expediente
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="nroexpediente-correlativo"
              value={nroExpedienteParts.correlativo || ""}
              onChange={(e) => handleNroExpedienteChange(e, "correlativo")}
              className="w-1/3 bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Correlativo"
            />
            <span className="text-black text-3xl my-2">-</span>
            <input
              type="text"
              name="nroexpediente-codigoOrganismo"
              value={nroExpedienteParts.codigoOrganismo || ""}
              onChange={(e) => handleNroExpedienteChange(e, "codigoOrganismo")}
              className="w-1/3 bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Cod. Organismo"
            />
            <span className="text-black text-3xl my-2">/</span>
            <input
              type="text"
              name="nroexpediente-anio"
              value={nroExpedienteParts.anio || ""}
              onChange={(e) => handleNroExpedienteChange(e, "anio")}
              className="w-1/3 bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Año"
            />
          </div>
          <label
            htmlFor="expendio"
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
                    htmlFor="persona"
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
              <label
                htmlFor="persona"
                className="block text-sm font-medium text-black"
              >
                Tipo de Persona
              </label>
              <input
                id="persona"
                type="text"
                {...register("persona", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                defaultValue="Física"
                readOnly
              />
              <label htmlFor="dni" className="block text-sm font-medium text-black">
                DNI
              </label>
              <input
                type="text"
                {...register("dni", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="DNI"
              />
              <label htmlFor="apellido" className="block text-sm font-medium text-black">
                Apellido
              </label>
              <input
                type="text"
                {...register("apellido", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Apellido"
              />
              <label htmlFor="nombrePersona" className="block text-sm font-medium text-black">
                Nombre
              </label>
              <input
                type="text"
                {...register("nombre", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nombre"
              />
              <label htmlFor="localidad" className="block text-sm font-medium text-black">
                Localidad
              </label>
              <select
                {...register("localidad")}
                // --- CÓDIGO ELIMINADO: Ya no necesitas esta prop ni la función onChange ---
                // value={LocalidadValue}
                // onChange={handleLocalidadChange}
                // ---
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              >
                <option value="">Selecciona una localidad</option>
                {Municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.nombre}>
                    {municipio.nombre}
                  </option>
                ))}
              </select>
              <label htmlFor="domicilio" className="block text-sm font-medium text-black">
                Domicilio Particular
              </label>
              <input
                type="text"
                {...register("domicilio", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Domicilio"
              />
              <label htmlFor="lugar" className="block text-sm font-medium text-black">
                Lugar de Realización del evento
              </label>
              <input
                type="text"
                {...register("lugar", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Lugar de Realización del evento"
              />
              <label htmlFor="dias" className="block text-sm font-medium text-black">
                Días del evento
              </label>
              <textarea
                type="text"
                {...register("dias", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Días"
              />
              <label htmlFor="horarios" className="block text-sm font-medium text-black">
                Horarios del evento
              </label>
              <textarea
                type="text"
                {...register("horarios", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Horarios"
              />
              <label htmlFor="tipoevento" className="block text-sm font-medium text-black">
                Tipo de Evento
              </label>
              <input
                type="text"
                {...register("tipoevento", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Tipo de Evento"
              />
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email particular
              </label>
              <input
                type="text"
                {...register("email", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Email"
              />
              <label htmlFor="contacto" className="block text-sm font-medium text-black">
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
              <label htmlFor="dniPropietario" className="block text-sm font-medium text-black">
                DNI del Propietario
              </label>
              <input
                type="text"
                {...register("dni", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="DNI del Propietario"
              />
              <label htmlFor="apellidoPropietario" className="block text-sm font-medium text-black">
                Apellido
              </label>
              <input
                type="text"
                {...register("apellido", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Apellido del Propietario"
              />
              <label htmlFor="nombrePropietario" className="block text-sm font-medium text-black">
                Nombre
              </label>
              <input
                type="text"
                {...register("nombre", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nombre del Propietario"
              />
              <label htmlFor="localidad" className="block text-sm font-medium text-black">
                Localidad
              </label>
              <select
                {...register("localidad")}
                // Ya no necesitas las props 'value' y 'onChange'
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              >
                <option value="">Selecciona una localidad</option>
                {Municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.nombre}>
                    {municipio.nombre}
                  </option>
                ))}
              </select>
              <label htmlFor="domicilio" className="block text-sm font-medium text-black">
                Domicilio particular
              </label>
              <input
                type="text"
                {...register("domicilio", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Domicilio"
              />
              <label htmlFor="nroHabilitacion" className="block text-sm font-medium text-black">
                Nro de Habilitación Municipal
              </label>
              <input
                type="text"
                {...register("nroHabilitacion", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nro de Habilitación Municipal"
              />
              <label htmlFor="horarios" className="block text-sm font-medium text-black">
                Domicilio del Local Comercial
              </label>
              <input
                type="text"
                {...register("domicilioLocalComercial", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Domicilio del Local Comercial"
              />
              <label htmlFor="dias" className="block text-sm font-medium text-black">
                Horario de atención
              </label>
              <textarea
                type="text"
                {...register("horarioAtencion", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Horario de atención"
              />
              <label htmlFor="dias" className="block text-sm font-medium text-black">
                Rubro
              </label>
              <textarea
                type="text"
                {...register("rubro", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Rubro"
              />
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="text"
                {...register("email", { required: true })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Email"
              />
              <label htmlFor="contacto" className="block text-sm font-medium text-black">
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
                    onClick={() => removeCurrentFile(index)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          <label htmlFor="file" className="block text-sm font-medium text-black">
            Archivos
          </label>
          <input
            type="file"
            name="file"
            multiple
            onChange={handleFileChange}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          />

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

export default TaskFormPageEdit;
