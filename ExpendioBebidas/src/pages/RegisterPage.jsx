import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Municipios } from "../api/municipios";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Vistapago from "./Vistapago";
import "./taskformpage.css";
import "./RegisterPage.css"


function RegisterPage() {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const { createTasksPublic, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [tipoExpendio, setTipoExpendio] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [showRequisitos, setShowRequisitos] = useState(true);
  const [horarios, setHorarios] = useState([""]); // Estado para los horarios
  const [LocalidadValue, setSelectedLocalidadValue] = useState("");

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

  useEffect(() => {
    // Mostrar el aviso con SweetAlert
    Swal.fire({
      icon: "info",
      title: "Aviso Importante",
      html: "Si posee antecedentes judiciales, el expendio será rechazado.<br/><br/>Se solicita que el trámite se realice con 72hs de antelación.",
      confirmButtonText: "OK",
    });
  }, []);

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
            const value = data[key];
            if (value !== null && value !== undefined && (typeof value !== 'object' || Object.keys(value).length > 0)) {
                formData.append(key, value);
            }
        });

        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append("files", file);
            });
        }

        let res;
        if (params.id) {
            res = await updateTask(params.id, formData);
        } else {
            res = await createTasksPublic(formData);
        }

        if (res && res.nroexpediente) {
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                html: `<p>Su registro se ha actualizado con éxito. El número de trámite es: <strong>${res.nroexpediente}</strong>.</p><p>Para cualquier consulta, llame al: <strong>0376-4448963</strong>.</p>`,
                confirmButtonText: "OK",
                allowOutsideClick: false,
                showCloseButton: false,
            });
            navigate("/");
        } else if (res && res.message) {
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                html: `<p>Su registro se ha generado con éxito.</p><p>El número de expediente será asignado por mesa de entrada.</p><p>Para cualquier consulta, llame al: <strong>0376-4448963</strong>.</p>`,
                confirmButtonText: "OK",
                allowOutsideClick: false,
                showCloseButton: false,
            });
            navigate("/");
        } else {
            console.error("Respuesta inesperada del servidor:", res);
            throw new Error("La respuesta del servidor no fue la esperada");
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.close();
        
        const serverMessage = error.response?.data?.message || "Ocurrió un error al guardar el registro. Intente de nuevo más tarde.";

        Swal.fire({
            icon: "error",
            title: "Error",
            text: serverMessage,
        });
    }
});


  const handleLocalidadChange = (event) => {
    const selectedValue = event.target.value;
    setValue("localidad", selectedValue);
    if (selectedValue) {
      clearErrors("localidad"); // Elimina el mensaje de error si el campo tiene un valor
    }
  };
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
        // Solicitar el archivo como blob
        const response = await axios.get(filePath, {
            responseType: "blob",
        });

        // Crear una URL temporal para el blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Crear un enlace invisible y simular un clic para iniciar la descarga
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filePath.split("/").pop()); 
        document.body.appendChild(link);
        link.click();
        
        // Limpiar el enlace
        link.parentNode.removeChild(link);

    } catch (error) {
        console.error("Error al descargar el archivo:", error);
        // Si no se usa SweetAlert, puedes mostrar el error en la consola o de otra manera
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
              Antes de proceder con el registro, es fundamental que leas y
              comprendas los requisitos necesarios para completar el proceso de
              manera efectiva. Por favor, asegúrate de tener los siguientes
              documentos listos:
            </p>

            <div className="flex space-x-2 justify-center mt-2">
              <button
                onClick={() =>
                  downloadFile(
                    `${
                      import.meta.env.VITE_API_ARCHIVO
                    }/documentos/requisitos-local.pdf`
                  )
                }
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Descargar para habilitación de local
              </button>
              <button
                onClick={() =>
                  downloadFile(
                    `${
                      import.meta.env.VITE_API_ARCHIVO
                    }/documentos/requisitos-eventos.pdf`
                  )
                }
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Descargar para habilitación de eventos
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: '20px' }}>
  <p>Para cualquier consulta, llame al: <strong>0376-4448963</strong>.</p>
</div>

          </div>
        )}
        <div>
              {/* Tabla con fondo blanco */}
    <div className="text-center mt-4">
    <div className="flex justify-center items-center 
     bg-gray-100">
  <table className="table" style={{ textTransform: "uppercase" }}>
    <thead className="bg-blue-500 text-white">
      <tr>
        <th className="border border-gray-400 px-4 py-2">Categoría</th>
        <th className="border border-gray-400 px-4 py-2">Arancel</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Categoría" className="border border-gray-400 px-4 py-2">Eventos Temporarios</td>
        <td data-label="Arancel" className="border border-gray-400 px-4 py-2">S/Arancel</td>
      </tr>
      <tr>
        <td data-label="Categoría" className="border border-gray-400 px-4 py-2">Kioskos</td>
        <td data-label="Arancel" className="border border-gray-400 px-4 py-2">$1.100</td>
      </tr>
      <tr>
        <td data-label="Categoría" className="border border-gray-400 px-4 py-2">MiniMercados</td>
        <td data-label="Arancel" className="border border-gray-400 px-4 py-2">$1.100</td>
      </tr>
      <tr>
        <td data-label="Categoría" className="border border-gray-400 px-4 py-2">Supermercados</td>
        <td data-label="Arancel" className="border border-gray-400 px-4 py-2">$1.100</td>
      </tr>
      <tr>
        <td data-label="Categoría" className="border border-gray-400 px-4 py-2">Locales Bailables, Bares, Pub</td>
        <td data-label="Arancel" className="border border-gray-400 px-4 py-2">$1.100</td>
      </tr>
    </tbody>
  </table>
</div>

      <p className="text-sm mt-4">
        El monto deberá ser depositado en la cuenta corriente Nº{" "}
        <strong>xxxxxxxxxx</strong> una vez terminado el procedimiento de
        verificación de documentación presentada.
      </p>
    </div>
          {/* <h1 className="text-2xl font-bold text-black text-center">
            <Vistapago />
          </h1> */}
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
                value="Física"
                readOnly
              />

              <label
                htmlFor="dni"
                className="block text-sm font-medium text-black"
              >
                DNI
              </label>
              {errors.dni && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dni.message}
                </p>
              )}
              <input
                type="text"
                {...register("dni", { required: "El DNI es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="DNI"
              />

              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-black"
              >
                Apellido
              </label>
              {errors.apellido && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellido.message}
                </p>
              )}
              <input
                type="text"
                {...register("apellido", {
                  required: "El Apellido es requerido",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Apellido"
              />

              <label
                htmlFor="nombrePersona"
                className="block text-sm font-medium text-black"
              >
                Nombre
              </label>
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
              <input
                type="text"
                {...register("nombre", { required: "El Nombre es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nombre"
              />

              <label
                htmlFor="localidad"
                className="block text-sm font-medium text-black"
              >
                Localidad
              </label>
              {errors.localidad && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.localidad.message}
                </p>
              )}
              <select
                {...register("localidad", {
                  required: "La Localidad es requerida",
                })}
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
              {errors.domicilio && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.domicilio.message}
                </p>
              )}
              <input
                type="text"
                {...register("domicilio", {
                  required: "El Domicilio es requerido",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Domicilio"
              />

              <label
                htmlFor="lugar"
                className="block text-sm font-medium text-black"
              >
                Lugar de Realización del evento
              </label>
              {errors.lugar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lugar.message}
                </p>
              )}
              <input
                type="text"
                {...register("lugar", { required: "El Lugar es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Lugar de Realización del evento"
              />

              <label
                htmlFor="dias"
                className="block text-sm font-medium text-black"
              >
                Días del evento
              </label>
              {errors.dias && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dias.message}
                </p>
              )}
              <textarea
                type="text"
                {...register("dias", {
                  required: "Los Días del evento es requerido",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Días"
              />

              <label
                htmlFor="horarios"
                className="block text-sm font-medium text-black"
              >
                Horarios del evento
              </label>
              {errors.horarios && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.horarios.message}
                </p>
              )}
              <textarea
                type="text"
                {...register("horarios", {
                  required: "Los Horarios son requeridos",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Horarios"
              />

              <label
                htmlFor="tipoevento"
                className="block text-sm font-medium text-black"
              >
                Tipo de Evento
              </label>
              {errors.tipoevento && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tipoevento.message}
                </p>
              )}
              <input
                type="text"
                {...register("tipoevento", {
                  required: "El Tipo de Evento es requerido",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Tipo de Evento"
              />

              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email particular
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
              <input
                type="text"
                {...register("email", { required: "El Email es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Email"
              />

              <label
                htmlFor="contacto"
                className="block text-sm font-medium text-black"
              >
                Nro de WhatsApp
              </label>

              {errors.contacto && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contacto.message}
                </p>
              )}
              <input
                type="text"
                {...register("contacto", {
                  required: "El Nro de WhatsApp es requerido",
                })}
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
              {errors.dni && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dni.message}
                </p>
              )}
              <input
                type="text"
                {...register("dni", { required: "El DNI es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="DNI del Propietario"
              />

              <label
                htmlFor="apellidoPropietario"
                className="block text-sm font-medium text-black"
              >
                Apellido
              </label>
              {errors.apellido && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellido.message}
                </p>
              )}
              <input
                type="text"
                {...register("apellido", {
                  required: "El Apellido es requerido",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Apellido del Propietario"
              />

              <label
                htmlFor="nombrePropietario"
                className="block text-sm font-medium text-black"
              >
                Nombre
              </label>
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
              <input
                type="text"
                {...register("nombre", { required: "El Nombre es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nombre del Propietario"
              />

              <label
                htmlFor="localidad"
                className="block text-sm font-medium text-black"
              >
                Localidad
              </label>
              {errors.localidad && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.localidad.message}
                </p>
              )}
              <select
                {...register("localidad", {
                  required: "La Localidad es requerida",
                })}
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
              {errors.domicilio && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.domicilio.message}
                </p>
              )}
              <input
                type="text"
                {...register("domicilio", {
                  required: "El Domicilio es requerido",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Domicilio"
              />

              <label
                htmlFor="nroHabilitacion"
                className="block text-sm font-medium text-black"
              >
                Nro de Habilitación Municipal
              </label>
              {errors.nroHabilitacion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nroHabilitacion.message}
                </p>
              )}
              <input
                type="text"
                {...register("nroHabilitacion", {
                  required: "El Nro de Habilitación es requerido",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nro de Habilitación Municipal"
              />

              <label
                htmlFor="horarios"
                className="block text-sm font-medium text-black"
              >
                Domicilio del Local Comercial
              </label>
              {errors.domicilioLocalComercial && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.domicilioLocalComercial.message}
                </p>
              )}
              <input
                type="text"
                {...register("domicilioLocalComercial", {
                  required: "El Domicilio del Local es requerido",
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
              {errors.horarioAtencion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.horarioAtencion.message}
                </p>
              )}
              <textarea
                type="text"
                {...register("horarioAtencion", {
                  required: "El Horario es requerido",
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Horario de atención"
              />

              <label
                htmlFor="dias"
                className="block text-sm font-medium text-black"
              >
                Rubro
              </label>
              {errors.rubro && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.rubro.message}
                </p>
              )}
              <textarea
                type="text"
                {...register("rubro", { required: "El Rubro es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Rubro"
              />

              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
              <input
                type="text"
                {...register("email", { required: "El Email es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Email"
              />

              <label
                htmlFor="contacto"
                className="block text-sm font-medium text-black"
              >
                Nro de Whatsapp
              </label>
              {errors.contacto && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contacto.message}
                </p>
              )}
              <input
                type="text"
                {...register("contacto", {
                  required: "El contacto es requerido",
                })}
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
            {...register("file", {
              required: "Por favor selecciona al menos un archivo",
              validate: {
                maxLength: (value) =>
                  value.length <= 15 ||
                  "No puedes seleccionar más de 15 archivos",
              },
            })}
            multiple
            onChange={handleFileChange}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}

          {/* Mostrar archivos seleccionados */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Archivos seleccionados:</h3>
            <ul className="list-disc list-inside">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
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
