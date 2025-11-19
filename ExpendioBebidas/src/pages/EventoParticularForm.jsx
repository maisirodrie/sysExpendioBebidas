import React from 'react';
import { Municipios } from '../api/municipios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faUpload, faFilePdf, faTrashAlt } from "@fortawesome/free-solid-svg-icons"; 

// --- Constantes de Requisitos para Eventos (INCLUIDAS AQUÍ) ---
const RequisitosEventos = [
  { key: "paseElevacionIntendente", label: "Pase de Elevación del Intendente (a).", required: true },
  { key: "autorizacionMunicipal", label: "Autorización Municipal con días y horarios expresos (b).", required: true },
  { key: "fotocopiaDniEvento", label: "Fotocopia de DNI (1ra. y 2da. hoja) (c).", required: true },
  { key: "certificadoAntecedentesEvento", label: "Informe de certificado de antecedentes (d).", required: true },
  { key: "autorizacionPropietario", label: "Autorización del Propietario del lugar (e).", required: true },
  { key: "copiasCertificadas", label: "Las copias a, b y c deben estar certificadas por Juez de Paz o Notario.", required: false, isInfo: true },
  { key: "plazoPresentacion", label: "La solicitud debe presentarse 10 días antes del evento.", required: false, isInfo: true },
];

// Componente para manejar la carga de un documento individual
const DocumentUploadField = ({ req, register, watch, errors, existingFile, removeExistingFile, apiUrl }) => {
    
    const file = watch(req.key); 
    // Corregido: Verificamos si hay un FileList (archivo subido) y si tiene elementos
    const isFileSelected = file instanceof FileList && file.length > 0;
    const hasError = errors[req.key] !== undefined;
    
    // Muestra el archivo existente SI NO se ha seleccionado uno nuevo
    const showExistingFile = existingFile && !isFileSelected;
    
    const downloadUrl = showExistingFile 
        ? `${apiUrl}/tasks/file/${existingFile.filename}`
        : null;

    const fileNameDisplay = isFileSelected 
        ? file[0].name 
        : showExistingFile ? existingFile.originalname : null;

    return (
        <div id={`file-upload-container-${req.key}`} 
             className={`flex flex-col p-2 rounded-md my-1 border transition-all duration-300 ${
                hasError ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-grow">
                    <FontAwesomeIcon
                        icon={isFileSelected || showExistingFile ? faCheckCircle : faUpload}
                        className={`mr-3 ${isFileSelected || showExistingFile ? "text-green-500" : "text-blue-500"}`}
                    />
                    <span className={`text-sm flex-grow ${isFileSelected || showExistingFile ? "text-gray-600" : "text-black"}`}>
                        {req.label}
                        {req.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                    </span>
                </div>

                {req.isInfo ? (
                    <span className="text-xs text-yellow-700 font-semibold italic">INFORMACIÓN IMPORTANTE</span>
                ) : (
                    <div className="ml-4 flex space-x-2 items-center">

                        {/* BLOQUE UNIFICADO: Muestra nombre (con "Existente:") y botones */}
                        {showExistingFile && (
                            <div className="flex space-x-1 items-center">
                                {/* Nombre del archivo existente */}
                                <span className="text-xs text-gray-700 italic max-w-[100px] truncate">
                                    Existente: {fileNameDisplay}
                                </span>
                                {/* Botón Ver (PDF Icon) */}
                                <a 
                                    href={downloadUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faFilePdf} />
                                </a>
                                {/* Botón Eliminar */}
                                <button
                                    type="button"
                                    // CLAVE: Usamos el ID del archivo para eliminarlo
                                    onClick={() => removeExistingFile(existingFile.id)}
                                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        )}
                        {/* ----------------------------------------------- */}

                        {/* Muestra el nombre del archivo si hay uno NUEVO seleccionado */}
                        {isFileSelected && !showExistingFile && (
                            <span className="text-xs text-gray-700 italic max-w-[100px] truncate">
                                Nuevo: {fileNameDisplay}
                            </span>
                        )}
                        
                        {/* Input de archivo (label) */}
                        <label htmlFor={req.key} className={`cursor-pointer text-xs font-semibold px-3 py-1 rounded-md transition-all duration-200 ${
                            isFileSelected || showExistingFile ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}>
                            {isFileSelected || showExistingFile ? "Reemplazar" : "Subir archivo"}
                            <input
                                id={req.key}
                                type="file"
                                {...register(req.key, {
                                    // La validación required se aplica si es requerido Y NO hay un archivo existente para mantener
                                    required: req.required && !showExistingFile ? `${req.label} es obligatorio.` : false,
                                })}
                                className="hidden"
                                // Esto es útil para poder subir el mismo archivo si el usuario cancela la subida
                                onClick={(e) => { e.target.value = null; }}
                            />
                        </label>
                    </div> 
                )} 
            </div>
            {hasError && (
                <span className="text-red-500 text-xs mt-1 ml-6 block">
                    {errors[req.key].message}
                </span>
            )}
        </div>
    );
};


const RequisitosEventosDisplay = ({ register, watch, errors, existingFilesMap, removeExistingFile, apiUrl }) => {
  return (
    <div className="bg-blue-100 p-4 rounded-md mt-4 mb-4 border border-blue-300">
      <h4 className="font-bold text-lg text-blue-800 mb-2">Documentación Requerida (Evento Particular)</h4>
      <p className="text-sm text-blue-700 mb-3">
        ⚠️ **Debe subir cada archivo individualmente.** La falta de documentos obligatorios será causal de rechazo.
      </p>
      <div className="space-y-2">
        {RequisitosEventos.map((req) => (
          <DocumentUploadField
            key={req.key}
            req={req}
            register={register}
            watch={watch}
            errors={errors} 
            // CLAVE: Mapeo del archivo existente
            existingFile={existingFilesMap ? existingFilesMap[req.key] : null} 
            removeExistingFile={removeExistingFile}
            apiUrl={apiUrl}
          />
        ))}
      </div>
    </div>
  );
};


const EventoParticularForm = ({ 
    register, 
    errors, 
    handleLocalidadChange, 
    watch, 
    setValue,
    setFocus,
    // ⬇️ Estas props deben recibirse de TaskFormPageEdit
    existingFilesMap, 
    removeExistingFile, 
    apiUrl 
}) => (
    // ... (El resto del formulario que contiene los campos de texto)
  <>
    <h3 className="text-xl font-semibold text-black mt-4 mb-2 border-b pb-1">Datos del Evento</h3>

    <label htmlFor="dni" className="block text-sm font-medium text-black">
      DNI del Peticionante
    </label>
    {errors.dni && (
      <p className="text-red-500 text-sm mt-1">{errors.dni.message}</p>
    )}
    <input
      type="text"
      {...register("dni", { required: "El DNI es requerido" })}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="DNI del Peticionante"
    />

    <label htmlFor="apellido" className="block text-sm font-medium text-black">
      Apellido
    </label>
    {errors.apellido && (
      <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>
    )}
    <input
      type="text"
      {...register("apellido", { required: "El Apellido es requerido" })}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="Apellido del Peticionante"
    />
    
    <label htmlFor="nombre" className="block text-sm font-medium text-black">
      Nombre
    </label>
    {errors.nombre && (
      <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
    )}
    <input
      type="text"
      {...register("nombre", { required: "El Nombre es requerido" })}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="Nombre del Peticionante"
    />

    <label htmlFor="localidad" className="block text-sm font-medium text-black">
      Localidad del Evento
    </label>
    {errors.localidad && (
      <p className="text-red-500 text-sm mt-1">{errors.localidad.message}</p>
    )}
    <select
      {...register("localidad", { required: "La Localidad es requerida" })}
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
    
    <label htmlFor="lugar" className="block text-sm font-medium text-black">
      Lugar donde se realizará el evento
    </label>
    {errors.lugar && (
      <p className="text-red-500 text-sm mt-1">{errors.lugar.message}</p>
    )}
    <input
      type="text"
      {...register("lugar")}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="Dirección o nombre del lugar"
    />

    <label htmlFor="tipoevento" className="block text-sm font-medium text-black">
      Tipo de Evento
    </label>
    {errors.tipoevento && (
      <p className="text-red-500 text-sm mt-1">{errors.tipoevento.message}</p>
    )}
    <input
      type="text"
      {...register("tipoevento")}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="Ej: Fiesta bailable, Peña, Concierto"
    />

    <label htmlFor="dias" className="block text-sm font-medium text-black">
      Días de Realización (especificar)
    </label>
    {errors.dias && (
      <p className="text-red-500 text-sm mt-1">{errors.dias.message}</p>
    )}
    <input
      type="text"
      {...register("dias")}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="Ej: 15 y 16 de Diciembre de 2025"
    />

    <label htmlFor="horarios" className="block text-sm font-medium text-black">
      Horarios del Evento
    </label>
    {errors.horarios && (
      <p className="text-red-500 text-sm mt-1">{errors.horarios.message}</p>
    )}
    <input
      type="text"
      {...register("horarios")}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="Ej: De 22:00 hs. a 04:00 hs."
    />

    {/* Email y Contacto (generalmente necesarios) */}
    <label htmlFor="email" className="block text-sm font-medium text-black">
      Email de Contacto
    </label>
    {errors.email && (
      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
    )}
    <input
      type="email"
      {...register("email")}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="Email"
    />

    <label htmlFor="contacto" className="block text-sm font-medium text-black">
      Nro de Whatsapp
    </label>
    {errors.contacto && (
      <p className="text-red-500 text-sm mt-1">{errors.contacto.message}</p>
    )}
    <input
      type="tel"
      {...register("contacto")}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      placeholder="Teléfono de Contacto"
    />

  {/* --- SECCIÓN REQUISITOS INTERACTIVOS (USA existingFilesMap) --- */}
    <RequisitosEventosDisplay 
        register={register} 
        watch={watch} 
        errors={errors} 
        // ⬇️ Props de gestión de archivos
        existingFilesMap={existingFilesMap}
        removeExistingFile={removeExistingFile}
        apiUrl={apiUrl}
    />
    {/* ------------------------------------------ */}

  </>
);

export default EventoParticularForm;