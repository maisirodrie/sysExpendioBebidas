import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Municipios } from "../api/municipios";
import { faArrowLeft, faTimes, faFilePdf, faDownload, faPhoneAlt, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Button from "../components/common/Button";
import ComponentCard from "../components/common/ComponentCard";

// IMPORTACIÓN DE COMPONENTES MODULARES
import EventoParticularForm from "./EventoParticularForm";
import LocalComercialForm from "./LocalComercialForm";
import IntendenciaForm from "./IntendenciaForm";

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

      if (res && (res.nroexpediente || res.message || res._id)) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          html: `<p>Su registro se ha ${params.id ? "actualizado" : "generado"
            } con éxito. ${res.nroexpediente
              ? `El número de trámite es: <strong>${res.nroexpediente}</strong>.`
              : params.id
                ? ""
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
      console.error("Error completo:", error);
      Swal.close();

      let errorMessage = "Ocurrió un error al guardar el registro. Intente de nuevo más tarde.";

      if (error.response?.data?.message) {
        const message = error.response.data.message;
        if (Array.isArray(message)) {
          // Si es un array de errores (Zod), los listamos
          errorMessage = `<div style="text-align: left;"><strong>Por favor, corrija los siguientes campos:</strong><ul style="margin-top: 10px; list-style-type: disc; margin-left: 20px;">${message.map(msg => `<li>${msg}</li>`).join('')}</ul></div>`;
        } else {
          errorMessage = message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        html: errorMessage,
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
      "fotocopiaDniAutorizado", "certificadoAntecedentesAutorizado", "informeSocioAmbientalJuridica",
      "medidasSeguridad", "planContingenciaJuridica"
    ];

    // Lista de campos del Evento Particular
    const eventoParticularFields = [
      "dni", "apellido", "nombre", "lugar", "tipoevento", "dias", "horarios",
      "email", "contacto",

      // Requisitos de Evento
      "paseElevacionIntendente", "autorizacionMunicipal", "fotocopiaDniEvento",
      "certificadoAntecedentesEvento", "autorizacionPropietario"
    ];

    // Lista de campos de Intendencia
    const intendenciaFields = [
      "dni", "apellido", "nombre", "localidad", "contacto",
      "paseElevacionIntendente"
    ];

    // Limpiar el estado de persona y sus errores
    setTipoPersona("");
    setValue("persona", "");
    clearErrors();


    if (selectedExpendio === "Evento Particular") {
      // Si va a Evento, limpiamos todos los campos de Local Comercial e Intendencia
      localComercialFields.forEach(field => {
        setValue(field, undefined);
        unregister(field);
      });
      intendenciaFields.forEach(field => {
        setValue(field, undefined);
        unregister(field);
      });
      // Restauramos el tipo de persona para Evento 
      setValue("persona", "Física");
      setTipoPersona("Física");

    } else if (selectedExpendio === "Local Comercial") {
      // Si va a Local, limpiamos todos los campos de Evento e Intendencia
      eventoParticularFields.forEach(field => {
        setValue(field, undefined);
        unregister(field);
      });
      intendenciaFields.forEach(field => {
        setValue(field, undefined);
        unregister(field);
      });
      // Aseguramos que persona se mantenga vacío para forzar la selección inicial

    } else if (selectedExpendio === "Intendencia") {
      // Si va a Intendencia, limpiamos campos de Evento y Local Comercial
      eventoParticularFields.forEach(field => {
        setValue(field, undefined);
        unregister(field);
      });
      localComercialFields.forEach(field => {
        setValue(field, undefined);
        unregister(field);
      });
      // Ahora si necesita tipo de persona - Por defecto Persona Física
      setValue("persona", "Física");
      setTipoPersona("Física");

    } else {
      // Si se selecciona "Seleccione un tipo...", limpiamos todos
      [...localComercialFields, ...eventoParticularFields, ...intendenciaFields].forEach(field => {
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
    <div className="min-h-screen bg-gray-50/70 py-10 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-theme-sm p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Registro de Expendio
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Formulario oficial de solicitud de habilitación para expendio de bebidas alcohólicas
            </p>
          </div>
          <Link to="/">
            <Button
              variant="secondary"
              size="sm"
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Sección de Requisitos con documentos descargables */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-6 mb-6 text-amber-950 shadow-theme-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600" />
            <span>Información Importante</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed font-normal">
            Antes de proceder con el registro, es fundamental que lea y comprenda los requisitos necesarios para completar el proceso de manera efectiva. Por favor, asegúrese de tener la documentación requerida lista para adjuntar:
          </p>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faFilePdf} className="text-red-500 mr-1" />}
              onClick={() =>
                downloadFile(
                  `${import.meta.env.VITE_API_ARCHIVO.replace('/tasks/download', '')
                  }/documentos/requisitos-local.pdf`
                )
              }
            >
              Requisitos Habilitación Local (PDF)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faFilePdf} className="text-red-500 mr-1" />}
              onClick={() =>
                downloadFile(
                  `${import.meta.env.VITE_API_ARCHIVO.replace('/tasks/download', '')
                  }/documentos/requisitos-eventos.pdf`
                )
              }
            >
              Requisitos Habilitación Eventos (PDF)
            </Button>
          </div>

          {/* Sección de Requisitos de Terceros y Contacto */}
          <div className="pt-2 border-t border-amber-200/80 text-xs text-amber-900/90 space-y-2">
            <p className="font-semibold text-amber-950">
              Requisito para Trámites realizados por Terceros:
            </p>
            <p className="leading-relaxed">
              Si la gestión es realizada por una persona distinta al titular, es imprescindible adjuntar una nota de autorización <strong>firmada por el titular</strong> y <strong>certificada por Juez de Paz</strong>, detallando datos completos del titular, identificación del autorizado y alcance del trámite.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2 text-amber-950 font-medium">
              <FontAwesomeIcon icon={faPhoneAlt} className="text-amber-700" />
              <span>Para cualquier consulta o asistencia: <strong>0376-4448963</strong></span>
            </div>
          </div>
        </div>

        {/* Tabla de Aranceles */}
        <div className="my-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-theme-xs">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Categoría de Comercio / Actividad</th>
                  <th className="py-3 px-4 text-right">Arancel Vigente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition">
                  <td className="py-2.5 px-4 font-medium text-gray-800">Eventos Temporarios</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-gray-900">$ 26.389,00</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition bg-gray-50/30">
                  <td className="py-2.5 px-4 font-medium text-gray-800">Kioskos</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-gray-900">$ 71.970,00</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition">
                  <td className="py-2.5 px-4 font-medium text-gray-800">MiniMercados</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-gray-900">$ 79.167,00</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition bg-gray-50/30">
                  <td className="py-2.5 px-4 font-medium text-gray-800">Supermercados</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-gray-900">$ 88.763,00</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition">
                  <td className="py-2.5 px-4 font-medium text-gray-800">Locales Bailables, Bares, Pub</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-gray-900">$ 95.960,00</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition bg-gray-50/30">
                  <td className="py-2.5 px-4 font-medium text-gray-800">Otros (No definidos anteriormente)</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-gray-900">$ 79.167,00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Banner de Pago */}
          <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-6 mt-6 shadow-theme-xs text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-brand-900 font-bold text-sm uppercase tracking-wide">
              <span>⚠️ Solamente se reciben transferencias bancarias</span>
            </div>
            <p className="text-xs text-brand-800 leading-relaxed max-w-xl mx-auto">
              La misma deberá efectuarse una vez terminado el procedimiento de verificación de la documentación presentada, utilizando los siguientes datos:
            </p>

            <div className="bg-white/90 border border-brand-200/80 rounded-xl p-4 max-w-xl mx-auto text-left text-xs text-gray-800 space-y-2 shadow-theme-xs font-mono">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="font-semibold text-gray-600 font-sans">Alias:</span>
                <span className="font-bold text-brand-700">Expendio.2026</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="font-semibold text-gray-600 font-sans">CBU:</span>
                <span className="font-bold text-gray-900">2850001030094257979021</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="font-semibold text-gray-600 font-sans">Banco:</span>
                <span>Banco Macro S.A.</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="font-semibold text-gray-600 font-sans">Titular:</span>
                <span>TESORERIA GENERAL DE LA PROVINCIA</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="font-semibold text-gray-600 font-sans">CUIT:</span>
                <span>30-67239401-1</span>
              </div>
              <div className="pt-1 text-[11px] text-gray-500 font-sans">
                <strong>Denominación:</strong> FONDO ESPECIAL PROVINCIAL EXPENDIO DE BEBIDAS ALCOHOLICAS
              </div>
            </div>

            <p className="text-xs text-brand-900 font-medium pt-1">
              📧 Una vez efectuada la transferencia, se deberá enviar el comprobante de pago al correo:{' '}
              <a href="mailto:expendio.aranceles@misiones.gov.ar" className="underline font-bold text-brand-600 hover:text-brand-800 transition">
                expendio.aranceles@misiones.gov.ar
              </a>
            </p>
          </div>
        </div>

        {/* --- FORMULARIO PRINCIPAL --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t border-gray-200">
          {/* SELECCIÓN DE TIPO DE EXPENDIO (COMÚN A AMBOS) */}
          <div>
            <label
              htmlFor="expendio"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Tipo de Expendio de Bebidas
            </label>
            <select
              id="expendio"
              {...register("expendio", { required: true })}
              onChange={handleTipoExpendioChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
            >
              <option value="">Seleccione un tipo de Expendio de Bebidas</option>
              <option value="Evento Particular">Evento Particular</option>
              <option value="Local Comercial">
                Habilitación de Venta de Bebidas para Local Comercial
              </option>
              <option value="Intendencia">Intendencia</option>
            </select>
            {errors.expendio && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                El tipo de expendio es requerido.
              </p>
            )}
          </div>

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

          {tipoExpendio === "Intendencia" && (
            <IntendenciaForm
              register={register}
              errors={errors}
              handleLocalidadChange={handleLocalidadChange}
              watch={watch}
              setValue={setValue}
              apiUrl={apiUrl}
            />
          )}

          {tipoExpendio && (
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center shadow-theme-sm"
                disabled={!tipoExpendio}
              >
                {params.id ? "Actualizar Registro" : "Guardar Registro"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;