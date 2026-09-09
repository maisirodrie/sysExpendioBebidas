import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFilePdf, faBuilding, faUser, faCalendarAlt, faMapMarkerAlt, faPhone } from "@fortawesome/free-solid-svg-icons";
import ComponentCard from "../components/common/ComponentCard";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";

// --- 1. Mapeo de Nombres de Archivos ---
const FILE_NAME_MAP = {
  notaSolicitud: "Nota de Solicitud",
  habilitacionMunicipal: "Copia Habilitación Municipal",
  actaInspeccion: "Acta de Inspección / Bromatología",
  ddjjDistancias: "Declaración Jurada de Distancias",
  ddjjHigiene: "Declaración Jurada de Higiene y Seguridad",
  fotocopiaDni: "Fotocopia de DNI",
  informeSocioAmbiental: "Informe Socio Ambiental",
  certificadoAntecedentes: "Certificado de Antecedentes",
  propiedadInmueble: "Comprobante de Propiedad del Inmueble",
  planContingencia: "Plan de Contingencia / Constancia Bomberos",
  notaSolicitudJuridica: "Solicitud (Jurídica)",
  habilitacionMunicipalJuridica: "Constancia Habilitación Municipal",
  estatutoSocial: "Estatuto Social",
  actaAsamblea: "Acta de Asamblea",
  actaComisionDirectiva: "Acta de Comisión Directiva",
  ddjjDistanciasJuridica: "Declaración Distancias",
  fotocopiaDniAutorizado: "Fotocopia DNI Autorizado",
  certificadoAntecedentesAutorizado: "Certificado Antecedentes Autorizado",
  informeSocioAmbientalJuridica: "Informe Socio Ambiental",
  medidasSeguridad: "Constancia de Medidas de Seguridad/Higiene",
  planContingenciaJuridica: "Plan de Contingencia / Bomberos",
  paseElevacionIntendente: "Pase de Elevación",
  autorizacionMunicipal: "Autorización Municipal",
  fotocopiaDniEvento: "Fotocopia de DNI",
  certificadoAntecedentesEvento: "Certificado de Antecedentes",
  autorizacionPropietario: "Autorización del Propietario del Lugar",
};

const FILE_DISPLAY_ORDER = [
  'paseElevacionIntendente',
  'autorizacionMunicipal',
  'fotocopiaDniEvento',
  'certificadoAntecedentesEvento',
  'autorizacionPropietario',
  'notaSolicitud',
  'habilitacionMunicipal',
  'actaInspeccion',
  'ddjjDistancias',
  'ddjjHigiene',
  'fotocopiaDni',
  'informeSocioAmbiental',
  'certificadoAntecedentes',
  'propiedadInmueble',
  'planContingencia',
  'notaSolicitudJuridica',
  'habilitacionMunicipalJuridica',
  'estatutoSocial',
  'actaAsamblea',
  'actaComisionDirectiva',
  'ddjjDistanciasJuridica',
  'fotocopiaDniAutorizado',
  'certificadoAntecedentesAutorizado',
  'informeSocioAmbientalJuridica',
  'medidasSeguridad',
  'planContingenciaJuridica',
];

const getFriendlyFileName = (filename) => {
  const keyMatch = filename.match(/^([a-zA-Z]+)/);
  if (keyMatch && FILE_NAME_MAP[keyMatch[1]]) {
    return FILE_NAME_MAP[keyMatch[1]];
  }
  return filename;
};

const getFileKey = (filename) => {
  const match = filename.match(/^([a-zA-Z]+)/);
  return match ? match[1] : '';
};

const getMatchingFilesForAudit = (motivo) => {
  if (!motivo) return [];
  const motivoLower = motivo.toLowerCase();
  const matches = [];

  const keywords = {
    notaSolicitud: ["nota de solicitud", "nota solicitud", "solicitud"],
    notaSolicitudJuridica: ["solicitud (jurídica)", "solicitud juridica"],
    habilitacionMunicipal: ["habilitación municipal", "habilitacion municipal", "copia habilitación", "copia habilitacion"],
    habilitacionMunicipalJuridica: ["habilitación municipal (jurídica)", "habilitacion municipal juridica", "constancia habilitación municipal"],
    actaInspeccion: ["acta de inspección", "acta inspeccion", "bromatología", "bromatologia", "inspección", "inspeccion"],
    ddjjDistancias: ["distancias", "declaración jurada de distancias", "ddjj distancias"],
    ddjjDistanciasJuridica: ["declaración distancias", "ddjj distancias juridica"],
    ddjjHigiene: ["higiene y seguridad", "ddjj higiene"],
    fotocopiaDni: ["fotocopia de dni", "dni", "cuit"],
    fotocopiaDniAutorizado: ["dni autorizado", "cuit autorizado"],
    fotocopiaDniEvento: ["dni (evento)", "dni evento"],
    informeSocioAmbiental: ["informe socio ambiental", "socio ambiental", "socioambiental"],
    informeSocioAmbientalJuridica: ["socio ambiental (jurídica)", "socioambiental juridica"],
    certificadoAntecedentes: ["antecedentes", "policía", "policia", "informe judicial", "judicial"],
    certificadoAntecedentesAutorizado: ["antecedentes autorizado", "policía autorizado", "policia autorizado", "antecedentes penal"],
    certificadoAntecedentesEvento: ["antecedentes (evento)", "policia evento", "antecedentes evento"],
    propiedadInmueble: ["propiedad", "inmueble", "título", "titulo", "comprobante de propiedad"],
    planContingencia: ["contingencia", "bomberos"],
    planContingenciaJuridica: ["contingencia (jurídica)", "contingencia juridica", "bomberos (jurídica)"],
    estatutoSocial: ["estatuto", "estatuto social"],
    actaAsamblea: ["asamblea", "acta de asamblea"],
    actaComisionDirectiva: ["comisión directiva", "comision directiva"],
    medidasSeguridad: ["medidas de seguridad", "constancia de medidas"],
    paseElevacionIntendente: ["pase", "elevación", "intendente", "pase de elevacion"],
    autorizacionMunicipal: ["autorización municipal", "autorizacion municipal"],
    autorizacionPropietario: ["autorización del propietario", "autorizacion propietario"]
  };

  Object.keys(keywords).forEach(key => {
    const hasMatch = keywords[key].some(kw => motivoLower.includes(kw));
    if (hasMatch) {
      matches.push(key);
    }
  });

  return matches;
};

function TaskViewPage() {
  const { getTask } = useTasks();
  const { user } = useAuth();
  const params = useParams();
  const [task, setTask] = useState(null);

  const rawApiUrl = import.meta.env.VITE_API_ARCHIVO || "";
  const apiUrl = rawApiUrl.replace("/tasks/download", "");

  useEffect(() => {
    async function fetchTask() {
      try {
        const fetchedTask = await getTask(params.id);
        setTask(fetchedTask);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    }
    fetchTask();
  }, [getTask, params.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return "Fecha no válida";
    return `${format(date, "dd/MM/yyyy", { locale: esLocale })} a las ${format(date, "HH:mm:ss")}`;
  };

  const getStatusBadge = (estado) => {
    if (!estado) return <Badge variant="light" color="neutral">Sin estado</Badge>;
    const st = estado.toLowerCase();
    switch (st) {
      case "ingresado":
        return <Badge variant="light" color="neutral" dot size="lg">Ingresado</Badge>;
      case "pendiente":
        return <Badge variant="light" color="warning" dot size="lg">Pendiente</Badge>;
      case "controlado":
        return <Badge variant="light" color="info" dot size="lg">En Revisión</Badge>;
      case "aprobado":
        return <Badge variant="light" color="success" dot size="lg">Aprobado</Badge>;
      case "rechazado":
        return <Badge variant="light" color="error" dot size="lg">Rechazado</Badge>;
      case "finalizado":
        return <Badge variant="solid" color="neutral" size="lg">Finalizado</Badge>;
      default:
        return <Badge variant="light" color="neutral" size="lg">{estado}</Badge>;
    }
  };

  const matchingAuditKeys = task?.motivoRechazo ? getMatchingFilesForAudit(task.motivoRechazo) : [];

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  const {
    nroexpediente,
    expendio,
    persona,
    dni,
    apellido,
    nombre,
    localidad,
    domicilio,
    horarios,
    lugar,
    dias,
    rubro,
    tipoevento,
    email,
    contacto,
    nroHabilitacion,
    domicilioLocalComercial,
    horarioAtencion,
    createdAt,
    estado,
    motivoRechazo,
    motivoAprobacion
  } = task;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-outfit">
      {/* HEADER DE NAVEGACIÓN */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Expediente Digital
            </span>
            <span>•</span>
            <span className="text-xs text-gray-400">ID: {task._id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {nroexpediente || "Expediente sin asignar"}
          </h1>
        </div>

        <Link to="/task">
          <Button
            variant="secondary"
            size="md"
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
          >
            Volver a Expedientes
          </Button>
        </Link>
      </div>

      {/* ESTADO GENERAL Y FECHA CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Estado Actual
          </span>
          <div className="mt-1.5">{getStatusBadge(estado)}</div>
        </div>

        <div className="sm:text-right">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Fecha de Ingreso al Sistema
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>

      {/* MOTIVOS DE RECHAZO / OBSERVACIÓN */}
      {motivoRechazo && estado?.toLowerCase() !== "aprobado" && estado?.toLowerCase() !== "finalizado" && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 shadow-theme-xs">
          <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold text-base">
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Observaciones / Motivo de Rechazo</span>
          </div>
          <p className="text-sm text-rose-700 whitespace-pre-line leading-relaxed pl-7">
            {motivoRechazo}
          </p>
        </div>
      )}

      {/* MOTIVO DE APROBACIÓN */}
      {estado?.toLowerCase() === "aprobado" && motivoAprobacion && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-theme-xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-base">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Información de Pago y Aprobación</span>
          </div>
          <p className="text-sm text-emerald-800 whitespace-pre-line leading-relaxed pl-7">
            {motivoAprobacion}
          </p>
        </div>
      )}

      {/* SECCIÓN 1: DATOS DEL TITULAR */}
      <ComponentCard
        title="Datos del Titular / Solicitante"
        description="Información personal y de contacto registrada"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Nombre Completo
            </span>
            <span className="font-semibold text-gray-900 text-base">
              {apellido} {nombre}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              DNI / CUIT
            </span>
            <span className="font-mono text-gray-800 font-semibold">
              {dni}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Tipo de Persona
            </span>
            <span className="text-gray-800 font-medium">
              {persona || "Física"}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Localidad
            </span>
            <span className="text-gray-800 font-medium uppercase">
              {localidad || "-"}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Domicilio Particular
            </span>
            <span className="text-gray-800 font-medium">
              {domicilio || "-"}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Teléfono / WhatsApp
            </span>
            <span className="text-gray-800 font-medium">
              {contacto || "-"}
            </span>
          </div>

          {email && (
            <div className="sm:col-span-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Correo Electrónico
              </span>
              <span className="text-gray-800 font-medium">
                {email}
              </span>
            </div>
          )}
        </div>
      </ComponentCard>

      {/* SECCIÓN 2: DETALLES DEL EXPENDIO */}
      <ComponentCard
        title="Detalles del Expendio"
        description={`Modalidad declarada: ${expendio}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Tipo de Expendio
            </span>
            <span className="font-semibold text-brand-600">
              {expendio}
            </span>
          </div>

          {expendio === "Local Comercial" && (
            <>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  N° Habilitación Municipal
                </span>
                <span className="text-gray-800 font-semibold font-mono">
                  {nroHabilitacion || "-"}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Rubro Comercial
                </span>
                <span className="text-gray-800 font-medium">
                  {rubro || "-"}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Domicilio del Local Comercial
                </span>
                <span className="text-gray-800 font-medium">
                  {domicilioLocalComercial || "-"}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Horario de Atención
                </span>
                <span className="text-gray-800 font-medium">
                  {horarioAtencion || "-"}
                </span>
              </div>
            </>
          )}

          {expendio === "Evento Particular" && (
            <>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Tipo de Evento
                </span>
                <span className="text-gray-800 font-medium">
                  {tipoevento || "-"}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Lugar del Evento
                </span>
                <span className="text-gray-800 font-medium">
                  {lugar || "-"}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Días del Evento
                </span>
                <span className="text-gray-800 font-medium">
                  {dias || "-"}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Horarios del Evento
                </span>
                <span className="text-gray-800 font-medium">
                  {horarios || "-"}
                </span>
              </div>
            </>
          )}
        </div>
      </ComponentCard>

      {/* SECCIÓN 3: ARCHIVOS ADJUNTOS CON AUDITORÍA INTELIGENTE */}
      <ComponentCard
        title="Documentación Digital Adjunta"
        description={`${task.file?.length || 0} archivos en formato PDF respaldados en el servidor`}
      >
        {/* PANEL DE AUDITORÍA PRIORITARIO PARA JURÍDICOS/ADMIN */}
        {(user?.role === "juridicos" || user?.role === "admin" || user?.role === "editor") && matchingAuditKeys.length > 0 && (
          <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
            <strong className="flex items-center gap-1.5 font-bold mb-1">
              <span>⚠️</span> Documentos observados a verificar con prioridad:
            </strong>
            <p className="font-semibold uppercase text-amber-800">
              {matchingAuditKeys.map((k) => FILE_NAME_MAP[k] || k).join(" • ")}
            </p>
          </div>
        )}

        {task.file && task.file.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {task.file
              .sort((fileA, fileB) => {
                const keyA = getFileKey(fileA.filename);
                const keyB = getFileKey(fileB.filename);
                const indexA = FILE_DISPLAY_ORDER.indexOf(keyA);
                const indexB = FILE_DISPLAY_ORDER.indexOf(keyB);
                const finalIndexA = indexA === -1 ? 9999 : indexA;
                const finalIndexB = indexB === -1 ? 9999 : indexB;
                return finalIndexA - finalIndexB;
              })
              .map((fileInfo) => {
                const fileKey = getFileKey(fileInfo.filename);
                const isAuditTarget =
                  (user?.role === "juridicos" || user?.role === "admin" || user?.role === "editor") &&
                  matchingAuditKeys.includes(fileKey);

                return (
                  <a
                    key={fileInfo.id?.toString() || fileInfo.filename}
                    href={`${apiUrl}/tasks/file/${fileInfo.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all group ${
                      isAuditTarget
                        ? "bg-amber-50/70 border-amber-300 hover:border-amber-400 hover:shadow-theme-sm ring-2 ring-amber-400/30"
                        : "bg-white border-gray-200 hover:border-brand-300 hover:shadow-theme-xs hover:bg-brand-50/30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isAuditTarget
                          ? "bg-amber-100 text-amber-700"
                          : "bg-brand-50 text-brand-600 group-hover:bg-brand-100"
                      }`}
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="text-lg" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-brand-600">
                        {getFriendlyFileName(fileInfo.filename)}
                      </p>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        Ver documento PDF →
                      </span>
                      {isAuditTarget && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-white">
                          Observado
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-sm">
            No se registran archivos adjuntos cargados para este expediente.
          </div>
        )}
      </ComponentCard>
    </div>
  );
}

export default TaskViewPage;