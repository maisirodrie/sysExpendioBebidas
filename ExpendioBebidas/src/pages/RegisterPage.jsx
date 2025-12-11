import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Municipios } from "../api/municipios";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./taskformpage.css";
import "./RegisterPage.css";

// IMPORTACIÓN DE COMPONENTES MODULARES
import EventoParticularForm from "./EventoParticularForm";
import LocalComercialForm from "./LocalComercialForm";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    unregister,
    formState: { errors },
  } = useForm();
  const { createTasksPublic, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [tipoExpendio, setTipoExpendio] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [showRequisitos, setShowRequisitos] = useState(true);
  const [horarios, setHorarios] = useState([""]);
  const [LocalidadValue, setSelectedLocalidadValue] = useState("");

  // 🔑 FIX: Definir apiUrl corregida y pasarla a los hijos
  const apiUrl = import.meta.env.VITE_API_ARCHIVO.replace('/tasks/download', '');

  // --- CARGA DE DATOS EXISTENTES (UPDATE) ---
  useEffect(() => {
    async function loadTask() {
      console.log("useEffect ejecutado");
      if (params.id) {
        try {
          const task = await getTask(params.id);
          console.log("Tarea cargada:", task);
          if (task) {
            // Rellenar los valores del formulario con la tarea existente
            // NOTA: Se incluyen todos los campos, incluso los que podrían ser mutuos
            Object.keys(task).forEach((key) => {
              setValue(key, task[key]);
            });

            setTipoExpendio(task.expendio || "");
            setTipoPersona(task.persona || "");
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

  // --- AVISO INICIAL ---
  useEffect(() => {
    Swal.fire({
      icon: "info",
      title: "Aviso Importante",
      html: "<strong>Horario de atención: De Lunes a Viernes de 7:00hs a 12:30hs.</strong><br/><br/>Si posee antecedentes judiciales, el expendio será rechazado.<br/><br/>Se solicita que el trámite se realice con 72hs de antelación.",
      confirmButtonText: "OK",
    });
  }, []);

  // --- SUBMIT DEL FORMULARIO ---
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

      // 🚀 LÓGICA DE PROCESAMIENTO DE DATOS Y ARCHIVOS (MODIFICADA)
      Object.keys(data).forEach((key) => {
        const value = data[key];

        // 1. Manejo de ARCHIVOS (FileList)
        if (value instanceof FileList && value.length > 0) {
          // Si es un FileList, iteramos y adjuntamos cada archivo
          // usando la 'key' (nombre de campo: ej. 'notaSolicitud') para Multer.fields().
          Array.from(value).forEach((file) => {
            formData.append(key, file);
          });
        }
        // 2. Manejo de DATOS DE TEXTO/OTROS
        else if (
          value !== null &&
          value !== undefined &&
          !(value instanceof FileList) && // Asegurar que no sea un FileList vacío
          (typeof value !== "object" || Object.keys(value).length > 0)
        ) {
          formData.append(key, value);
        }
      });

      // ❌ Se eliminó la lógica obsoleta que usaba el estado 'files' y formData.append("files", ...)
      // FIN DE LA LÓGICA DE PROCESAMIENTO

      let res;
      if (params.id) {
        res = await updateTask(params.id, formData);
      } else {
        res = await createTasksPublic(formData);
      }

      if (res && (res.nroexpediente || res.message)) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          html: `<p>Su registro se ha ${params.id ? "actualizado" : "generado"
            } con éxito. ${res.nroexpediente
              ? `El número de trámite es: <strong>${res.nroexpediente}</strong>.`
              : `El número de expediente será asignado por mesa de entrada.`
            }</p><p>Para cualquier consulta, llame al: <strong>0376-4448963</strong>.</p>`,
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

      const serverMessage =
        error.response?.data?.message ||
        "Ocurrió un error al guardar el registro. Intente de nuevo más tarde.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: serverMessage,
      });
    }
  });

  // --- HANDLERS ---
  const handleLocalidadChange = (event) => {
    const selectedValue = event.target.value;
    setValue("localidad", selectedValue);
    if (selectedValue) {
      clearErrors("localidad");
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleTipoExpendioChange = (e) => {
    const selectedExpendio = e.target.value;
    setTipoExpendio(selectedExpendio);
    setValue("expendio", selectedExpendio);

    // --- Lógica CLAVE de Limpieza (Unregister) para evitar errores de validación cruzada ---

    // Lista de campos del Local Comercial (Persona Física/Jurídica)
    const localComercialFields = [
      "persona", "dni", "apellido", "nombre", "domicilio",
      "nroHabilitacion", "domicilioLocalComercial", "horarioAtencion", "rubro",
      "email", "contacto",

      // Requisitos de Local Comercial (Física)
      "notaSolicitud", "habilitacionMunicipal", "actaInspeccion", "ddjjDistancias",
      "ddjjHigiene", "fotocopiaDni", "informeSocioAmbiental", "certificadoAntecedentes",
      "propiedadInmueble", "planContingencia",

      // Requisitos de Local Comercial (Jurídica)
      "notaSolicitudJuridica", "habilitacionMunicipalJuridica", "estatutoSocial",
      "actaAsamblea", "actaComisionDirectiva", "ddjjDistanciasJuridica",
      "fotocopiaDniAutorizado", "certificadoAntecedentesAutorizado", "medidasSeguridad",
      "propiedadInmuebleJuridica", "planContingenciaJuridica"
    ];

    // Lista de campos del Evento Particular
    const eventoParticularFields = [
      "dni", "apellido", "nombre", "lugar", "tipoevento", "dias", "horarios",
      "email", "contacto",

      // Requisitos de Evento
      "paseElevacionIntendente", "autorizacionMunicipal", "fotocopiaDniEvento",
      "certificadoAntecedentesEvento", "autorizacionPropietario"
    ];

    // Limpiar el estado de persona y sus errores
    setTipoPersona("");
    setValue("persona", "");
    clearErrors();


    if (selectedExpendio === "Evento Particular") {
      // Si va a Evento, limpiamos todos los campos de Local Comercial
      localComercialFields.forEach(field => {
        setValue(field, undefined); // Limpiar valor
        unregister(field); // Desregistrar
      });
      // Restauramos el tipo de persona para Evento 
      setValue("persona", "Física");
      setTipoPersona("Física");

    } else if (selectedExpendio === "Local Comercial") {
      // Si va a Local, limpiamos todos los campos de Evento
      eventoParticularFields.forEach(field => {
        setValue(field, undefined); // Limpiar valor
        unregister(field); // Desregistrar
      });
      // Aseguramos que persona se mantenga vacío para forzar la selección inicial

    } else {
      // Si se selecciona "Seleccione un tipo...", limpiamos ambos
      [...localComercialFields, ...eventoParticularFields].forEach(field => {
        setValue(field, undefined);
        unregister(field);
      });

      setValue("persona", "");
      setTipoPersona("");
    }
  };

  const handleTipoPersonaChange = (e) => {
    setTipoPersona(e.target.value);
    setValue("persona", e.target.value);
  };

  const downloadFile = async (filePath) => {
    try {
      const response = await axios.get(filePath, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      Swal.fire({
        icon: "error",
        title: "Error de Descarga",
        text: "No se pudo descargar el archivo. Por favor, inténtelo de nuevo más tarde.",
      });
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
      <div className="bg-gray-300 max-w-screen-lg w-full p-10 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">
            Registro de Expendio
          </h1>
          <Link
            to="/"
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>

        {/* Sección de Requisitos con documentos descargables */}
        {/* Sección de Requisitos con documentos descargables */}
        <div className="relative mb-4 bg-yellow-200 p-4 rounded-md shadow-lg">
          <h2 className="font-bold text-lg">Importante:</h2>
          <p className="text-sm text-black-700 mt-2 font-semibold">
            Antes de proceder con el registro, es fundamental que leas y comprendas los requisitos necesarios para completar el proceso de manera efectiva. Por favor, asegúrate de tener los siguientes documentos listos:
          </p>


          {/* AJUSTE DE MARGEN AQUÍ: Cambié mt-2 por my-4 para añadir margen arriba y abajo */}
          <div className="flex space-x-2 justify-center my-4">
            <button
              onClick={() =>
                downloadFile(
                  `${import.meta.env.VITE_API_ARCHIVO.replace('/tasks/download', '')
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
                  `${import.meta.env.VITE_API_ARCHIVO.replace('/tasks/download', '')
                  }/documentos/requisitos-eventos.pdf`
                )
              }
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Descargar para habilitación de eventos
            </button>
          </div>

          {/* Sección de Requisitos de Terceros y Contacto */}
          <div>
            <h3 className="font-bold text-l">Requisito para Trámites de Terceros:</h3>
            <p className="text-sm text-black-700 mt-2 font-semibold">
              <strong></strong> Si la gestión es realizada por una persona distinta al titular, es imprescindible adjuntar una nota de autorización <strong>firmada por el titular</strong> y <strong>certificada por Juez de Paz</strong>. Dicha nota debe detallar claramente: <strong>datos completos del titular</strong>, la <strong>identificación del tercero autorizado</strong> y el <strong>alcance específico del trámite</strong> a realizar.
            </p>
            {/* Bloque de Contacto */}
            <div className="flex justify-center items-center text-center mt-5">
              <p>Para cualquier consulta, llame al: <strong>0376-4448963</strong>.</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <div className="flex justify-center items-center bg-gray-100">
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
            El monto deberá ser depositado en la cuenta corriente Nº <strong>xxxxxxxxxx</strong> una vez terminado el procedimiento de verificación de documentación presentada.
          </p>
        </div>


        {/* --- FORMULARIO PRINCIPAL --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* SELECCIÓN DE TIPO DE EXPENDIO (COMÚN A AMBOS) */}
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
          {errors.expendio && (
            <p className="text-red-500 text-sm mt-1">
              El tipo de expendio es requerido.
            </p>
          )}

          {/* RENDERIZADO CONDICIONAL DE FORMULARIOS ESPECÍFICOS */}
          {tipoExpendio === "Evento Particular" && (
            <EventoParticularForm
              register={register}
              errors={errors}
              handleLocalidadChange={handleLocalidadChange}
              watch={watch}
              setValue={setValue}
              apiUrl={apiUrl}
            />
          )}

          {tipoExpendio === "Local Comercial" && (
            <LocalComercialForm
              register={register}
              errors={errors}
              tipoPersona={tipoPersona}
              handleTipoPersonaChange={handleTipoPersonaChange}
              handleLocalidadChange={handleLocalidadChange}
              watch={watch}
              setValue={setValue}
              apiUrl={apiUrl}
            />
          )}

          {/* SECCIÓN DE SUBIDA DE ARCHIVOS (SE ELIMINÓ LA PARTE LOCAL) */}
          {/* Ahora solo se muestra el botón de submit si se ha seleccionado un tipo */}
          {tipoExpendio && (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-6 w-full"
              disabled={!tipoExpendio}
            >
              {params.id ? "Actualizar Registro" : "Guardar Registro"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;