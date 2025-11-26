import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import { useTasks } from "../context/TasksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


const getStatusColorName = (status) => {
  return {
    ingresado: "gray",
    pendiente: "orange",
    controlado: "blue",
    aprobado: "green", // ✅ CORREGIDO: De "gree" a "green"
    rechazado: "red",
    finalizado: "black",
  }[status.toLowerCase()] || "gray";
};

// --- 1. Mapeo de Nombres de Archivos ---
const FILE_NAME_MAP = {
  // Local Comercial (Física)
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

  // Local Comercial (Jurídica)
  notaSolicitudJuridica: "Solicitud", // Mapea a 'Solicitud dirigida al Subsecretario'
  habilitacionMunicipalJuridica: "Constancia Habilitación Municipal", // Mapea a 'Constancia de Habilitación Municipal y Nro.'
  estatutoSocial: "Estatuto Social",
  actaAsamblea: "Acta de Asamblea", // Mapea a 'Acta de asamblea de la última elección de autoridades'
  actaComisionDirectiva: "Acta de Comisión Directiva", // Mapea a 'Acta de Comisión Directiva autorizando la gestión del Permiso'
  ddjjDistanciasJuridica: "Declaración Distancias", // Mapea a 'Declaración sobre la distancia existente'
  fotocopiaDniAutorizado: "Fotocopia DNI Autorizado", // Mapea a 'Fotocopia del DNI de la persona autorizada'
  certificadoAntecedentesAutorizado: "Certificado Antecedentes Autorizado", // Mapea a 'Informe de certificado de antecedentes del peticionante'
  medidasSeguridad: "Constancia de Medidas de Seguridad/Higiene", // Mapea a 'Constancia Municipal sobre medidas de seguridad e higiene'
  propiedadInmuebleJuridica: "Comprobante Propiedad Inmueble", // Mapea a 'Comprobantes que acrediten la propiedad del Inmueble'
  planContingenciaJuridica: "Plan de Contingencia / Bomberos", // Mapea a 'Plan de Contingencia y Constancia Bomberos'

  // Evento Particular
  paseElevacionIntendente: "Pase de Elevación",
  autorizacionMunicipal: "Autorización Municipal",
  fotocopiaDniEvento: "Fotocopia de DNI", // Mapea a 'Fotocopia de DNI (1ra. y 2da. hoja)'
  certificadoAntecedentesEvento: "Certificado de Antecedentes", // Mapea a 'Informe de certificado de antecedentes'
  autorizacionPropietario: "Autorización del Propietario del Lugar",
};

// 🔑 ORDEN DE VISUALIZACIÓN SOLICITADO
const FILE_DISPLAY_ORDER = [
  /* --- Evento Particular --- */
  'paseElevacionIntendente',
  'autorizacionMunicipal',
  // Usamos el mapeo común para DNI si es un archivo compartido, o específico
  'fotocopiaDniEvento', 
  'certificadoAntecedentesEvento',
  'autorizacionPropietario',
  
  /* --- Local Comercial (Persona Física) --- */
  'notaSolicitud',
  'habilitacionMunicipal',
  'actaInspeccion',
  'ddjjDistancias',
  'ddjjHigiene',
  // Usamos el mapeo común para DNI si es un archivo compartido, o específico
  'fotocopiaDni', 
  'informeSocioAmbiental',
  'certificadoAntecedentes',
  'propiedadInmueble',
  'planContingencia',

  /* --- Local Comercial (Persona Jurídica) --- */
  'notaSolicitudJuridica',
  'habilitacionMunicipalJuridica',
  'estatutoSocial',
  'actaAsamblea',
  'actaComisionDirectiva',
  'ddjjDistanciasJuridica',
  'fotocopiaDniAutorizado',
  'certificadoAntecedentesAutorizado',
  'medidasSeguridad',
  'propiedadInmuebleJuridica',
  'planContingenciaJuridica',
];


// Función de ayuda para obtener el nombre legible o el nombre de archivo por defecto
const getFriendlyFileName = (filename) => {
  // Buscar la clave del campo (la parte inicial del nombre de archivo antes del guion)
  const keyMatch = filename.match(/^([a-zA-Z]+)/);
  if (keyMatch && FILE_NAME_MAP[keyMatch[1]]) {
    return FILE_NAME_MAP[keyMatch[1]];
  }
  // Si no se encuentra un mapeo, retorna el nombre de archivo sin el hash/extensión (opcional)
  return filename;
};

// Función auxiliar para obtener la clave del campo (ej: 'notaSolicitud') a partir del nombre de archivo
const getFileKey = (filename) => {
    const match = filename.match(/^([a-zA-Z]+)/);
    return match ? match[1] : ''; 
};


// --- 2. Componente TaskViewPage ---
function TaskViewPage() {
  const { getTask } = useTasks();
  const params = useParams();
  const [task, setTask] = useState(null);

  const apiUrl = import.meta.env.VITE_API_ARCHIVO;

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
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "Fecha no válida";
    }
    return `${format(date, "dd/MM/yyyy", { locale: esLocale })} a las ${format(date, "HH:mm:ss")}`;
  };
  

  const renderTaskDetails = () => {
    if (!task) return null;

    // Desestructuración de campos
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
      motivoRechazo
    } = task;

    const statusColorName = getStatusColorName(estado || 'ingresado');
    const isRechazado = estado?.toLowerCase() === "rechazado";
    const isEventoParticular = expendio === "Evento Particular";
    const isLocalComercial = expendio === "Local Comercial";
    const isPersonaJuridica = persona?.toLowerCase() === "jurídica"; 

    return (
      <>
        
        <p className="my-4">
          <strong>Fecha de Creación:</strong> {formatDate(createdAt)}
          <p className="my-4"><strong>Nro Expediente:</strong> {nroexpediente || 'No asignado'}</p>
        </p>
        {/* Aplicación dinámica del color al estado */}
        <p className="my-4">
          <strong className="text-xl mr-2">Estado:</strong> 
          <strong className={`text-${statusColorName}-600`}> 
            {estado ? estado.toUpperCase() : 'DESCONOCIDO'}
          </strong>
        </p>

        {/* Bloque condicional para mostrar el motivoRechazo con colores dinámicos */}
        {isRechazado && motivoRechazo && (
          <div className="my-4 p-4 border-l-4 border-red-500 bg-red-100 rounded">
            <h3 className="text-xl font-bold text-red-700 mb-2">Motivo de Rechazo</h3>
            <p className="text-lg text-red-600">{motivoRechazo}</p>
          </div>
        )}
        {isEventoParticular && (
          <>
          
            <p className="my-4"><strong>Tipo de Persona:</strong> {persona}</p>
            <p className="my-4"><strong>Tipo de Expendio:</strong> {expendio}</p>
            <p className="my-4"><strong>DNI:</strong> {dni}</p>
            <p className="my-4"><strong>Apellido:</strong> {apellido}</p>
            <p className="my-4"><strong>Nombre:</strong> {nombre}</p>
            <p className="my-4"><strong>Localidad:</strong> {localidad}</p>
            <p className="my-4"><strong>Domicilio Particular:</strong> {domicilio}</p>
            <p className="my-4"><strong>Lugar de Realización del evento:</strong> {lugar}</p>
            <p className="my-4"><strong>Días del evento:</strong> {dias}</p>
            <p className="my-4"><strong>Horarios del evento:</strong> {horarios}</p>
            <p className="my-4"><strong>Tipo de Evento:</strong> {tipoevento}</p>
            <p className="my-4"><strong>Email particular:</strong> {email}</p>
            <p className="my-4"><strong>Nro de WhatsApp:</strong> {contacto}</p>
          </>
        )}

        {isLocalComercial && (
          <>
            <p className="my-4"><strong>Tipo de Persona:</strong> {persona}</p>
            <p className="my-4"><strong>Tipo de Expendio:</strong> {expendio}</p>
            <p className="my-4"><strong>{isPersonaJuridica ? 'CUIT de la Empresa' : 'DNI del Propietario'}:</strong> {dni}</p>
            <p className="my-4"><strong>Apellido:</strong> {apellido}</p>
            <p className="my-4"><strong>Nombre:</strong> {nombre}</p>
            <p className="my-4"><strong>Localidad:</strong> {localidad}</p>
            <p className="my-4"><strong>Domicilio Particular:</strong> {domicilio}</p>
            <p className="my-4"><strong>Nro de Habilitación Municipal:</strong> {nroHabilitacion}</p>
            <p className="my-4"><strong>Domicilio del Local Comercial:</strong> {domicilioLocalComercial}</p>
            <p className="my-4"><strong>Horario de atención:</strong> {horarioAtencion}</p>
            <p className="my-4"><strong>Rubro:</strong> {rubro}</p>
            <p className="my-4"><strong>Email particular:</strong> {email}</p>
            <p className="my-4"><strong>Nro de WhatsApp:</strong> {contacto}</p>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex items-center justify-center overflow-y-auto" style={{ marginTop: "20px", marginBottom: "20px", paddingRight: "20px", paddingLeft: "20px" }}>
      <div className="bg-gray-300 max-w-screen-lg w-full p-10 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Detalles del Registro</h1>
          <Link to="/task" className="btn btn-success">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <div className="text-black">
          {task ? (
            <>
              {renderTaskDetails()}

              {/* Mostrar todos los archivos adjuntos usando el mapeo de nombres */}
              {task.file && task.file.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-400">
                    <h3 className="text-xl font-bold mb-3">Archivos Adjuntos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {task.file
                        // 🔑 ORDENAMIENTO IMPLEMENTADO AQUÍ
                        .sort((fileA, fileB) => {
                            const keyA = getFileKey(fileA.filename);
                            const keyB = getFileKey(fileB.filename);

                            // Obtener el índice de prioridad. Si no existe en la lista, le asignamos un índice alto (9999)
                            const indexA = FILE_DISPLAY_ORDER.indexOf(keyA);
                            const indexB = FILE_DISPLAY_ORDER.indexOf(keyB);

                            // Ordena por los índices. Los no mapeados van al final.
                            const finalIndexA = indexA === -1 ? 9999 : indexA;
                            const finalIndexB = indexB === -1 ? 9999 : indexB;

                            return finalIndexA - finalIndexB;
                        })
                        .map((fileInfo) => (
                          <a
                            key={fileInfo.id.toString()} // Usar el ID como key
                            href={`${apiUrl}/tasks/file/${fileInfo.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 text-center rounded transition duration-200 break-words w-full"
                          >
                            {/* Usa la función de mapeo aquí */}
                            📂 {getFriendlyFileName(fileInfo.filename)}
                          </a>
                      ))}
                    </div>
                </div>
              )}
            </>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskViewPage;