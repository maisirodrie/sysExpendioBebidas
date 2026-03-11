import React from 'react';
import { Municipios } from '../api/municipios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faUpload, faFilePdf, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// --- Constantes de Requisitos para Eventos (CON HTML para Negrita) ---
const RequisitosEventos = [
    { key: "paseElevacionIntendente", label: "Pase de Elevación del Intendente (a).", required: true },
    { key: "autorizacionMunicipal", label: "Autorización Municipal con días y horarios expresos (b).", required: true },
    { key: "fotocopiaDniEvento", label: "Fotocopia de DNI (1ra. y 2da. hoja) (c).", required: true },
    {
        key: "certificadoAntecedentesEvento",
        label: "Informe de certificado de antecedentes <b>Provinciales</b> (d).",
        required: true
    },
    { key: "autorizacionPropietario", label: "Autorización del Propietario del lugar (e).", required: true },
    { key: "copiasCertificadas", label: "Las copias a, b y c deben estar certificadas por Juez de Paz o Notario.", required: false, isInfo: true },
    { key: "plazoPresentacion", label: "La solicitud debe presentarse 10 días antes del evento.", required: false, isInfo: true },
];
// ----------------------------------------------------------------------


// Componente para manejar la carga de un documento individual (CON CORRECCIÓN HTML)
// Componente para manejar la carga de un documento individual (CON CORRECCIÓN HTML)
const DocumentUploadField = ({ req, register, watch, errors, existingFile, removeExistingFile, apiUrl, isEdit, addFilesToField, filesToAdd, removeFileToAdd }) => {

    const file = watch(req.key);
    const isFileSelected = file instanceof FileList && file.length > 0;
    const hasError = errors[req.key] !== undefined;

    const showExistingFile = existingFile && !isFileSelected;
    // ⬅️ DEFENSIVO: Asegurar que filesToAdd existe y es un objeto
    const filesToAddForField = (filesToAdd && filesToAdd[req.key]) ? filesToAdd[req.key] : [];

    const downloadUrl = showExistingFile
        ? `${apiUrl.replace('/tasks/download', '')}/tasks/file/${existingFile.filename}`
        : null;

    const fileNameDisplay = isFileSelected
        ? file[0].name
        : showExistingFile ? existingFile.originalname : null;

    // Handler para el botón "Agregar"
    const handleAddFiles = (e) => {
        const files = e.target.files;
        console.log('🟢 handleAddFiles ejecutado:', { fieldKey: req.key, filesCount: files?.length, files: files });

        if (files && files.length > 0) {
            // ⬅️ CRÍTICO: Convertir FileList a Array INMEDIATAMENTE
            // FileList es una referencia, si reseteamos el input después, se vacía
            const filesArray = Array.from(files);
            console.log('📋 Archivos convertidos a array:', filesArray.map(f => f.name));

            // Resetear el input ANTES de llamar addFilesToField
            e.target.value = null;

            // ⬅️ DEFENSIVO: Verificar que addFilesToField existe antes de llamarlo
            if (addFilesToField && typeof addFilesToField === 'function') {
                console.log('✅ Llamando addFilesToField para:', req.key);
                addFilesToField(req.key, filesArray);  // ⬅️ Pasamos el ARRAY, no el FileList
                console.log('📝 Archivos agregados exitosamente');
            } else {
                console.error('❌ addFilesToField no está definido o no es una función');
            }
        } else {
            console.warn('⚠️ No files selected o files es null');
        }
    };

    return (
        <div id={`file-upload-container-${req.key}`}
            className={`flex flex-col p-2 rounded-md my-1 border transition-all duration-300 ${hasError ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
                }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-grow">
                    <FontAwesomeIcon
                        icon={isFileSelected || showExistingFile || filesToAddForField.length > 0 ? faCheckCircle : faUpload}
                        className={`mr-3 ${isFileSelected || showExistingFile || filesToAddForField.length > 0 ? "text-green-500" : "text-blue-500"}`}
                    />

                    {/* 🔑 CORRECCIÓN: Usamos dangerouslySetInnerHTML para interpretar el <b> */}
                    <span
                        className={`text-sm flex-grow ${isFileSelected || showExistingFile || filesToAddForField.length > 0 ? "text-gray-600" : "text-black"}`}
                        dangerouslySetInnerHTML={{
                            // Combinamos el label con el asterisco de requerido incrustado en HTML
                            __html: req.label + (req.required && !req.isInfo ? '<span class="text-red-500 ml-1 font-bold">*</span>' : '')
                        }}
                    />
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
                                    // Cambiado para pasar la key del campo, crucial para el setValue externo
                                    onClick={() => removeExistingFile(existingFile.id, req.key)}
                                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        )}
                        {/* ----------------------------------------------- */}

                        {/* Muestra el nombre del archivo si hay uno NUEVO seleccionado para REEMPLAZAR */}
                        {isFileSelected && !showExistingFile && (
                            <span className="text-xs text-gray-700 italic max-w-[100px] truncate">
                                Nuevo: {fileNameDisplay}
                            </span>
                        )}

                        {/* Input de archivo para REEMPLAZAR (label) */}
                        <label htmlFor={req.key} className={`cursor-pointer text-xs font-semibold px-3 py-1 rounded-md transition-all duration-200 ${isFileSelected || showExistingFile ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}>
                            {isFileSelected || showExistingFile ? "Reemplazar" : "Subir archivo"}
                            <input
                                id={req.key}
                                type="file"
                                {...register(req.key, {
                                    required: isEdit // Si estamos editando...
                                        ? false // ... el campo NUNCA es requerido por RHF, permitiendo guardar.
                                        : req.required // Si es creación, aplica la regla normal.
                                            ? `${req.label} es obligatorio.`
                                            : false,
                                })}
                                className="hidden"
                                onClick={(e) => { e.target.value = null; }}
                            />
                        </label>

                        {/* Botón AGREGAR (solo si existe archivo o hay archivos para agregar) */}
                        {(showExistingFile || filesToAddForField.length > 0) && (
                            <label htmlFor={`${req.key}-add`} className="cursor-pointer text-xs font-semibold px-3 py-1 rounded-md transition-all duration-200 bg-green-500 hover:bg-green-600 text-white">
                                Agregar
                                <input
                                    id={`${req.key}-add`}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleAddFiles}
                                />
                            </label>
                        )}
                    </div>
                )}
            </div>

            {/* Mostrar lista de archivos a agregar */}
            {filesToAddForField.length > 0 && (
                <div className="mt-2 ml-6 space-y-1">
                    <p className="text-xs font-semibold text-green-700">Archivos a agregar:</p>
                    {filesToAddForField.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-green-50 p-1 rounded">
                            <span className="text-xs text-gray-700 truncate flex-grow">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    // ⬅️ DEFENSIVO: Verificar que removeFileToAdd existe
                                    if (removeFileToAdd && typeof removeFileToAdd === 'function') {
                                        removeFileToAdd(req.key, index);
                                    } else {
                                        console.error('removeFileToAdd no está definido');
                                    }
                                }}
                                className="text-red-500 hover:text-red-700 ml-2"
                            >
                                <FontAwesomeIcon icon={faTrashAlt} size="xs" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {hasError && (
                <span className="text-red-500 text-xs mt-1 ml-6 block">
                    {errors[req.key].message}
                </span>
            )}
        </div>
    );
};
// ----------------------------------------------------------------------


const RequisitosEventosDisplay = ({ register, watch, errors, existingFilesMap, removeExistingFile, apiUrl, isEdit, addFilesToField, filesToAdd, removeFileToAdd }) => {
    return (
        <div className="bg-blue-100 p-4 rounded-md mt-4 mb-4 border border-blue-300">
            <h4 className="font-bold text-lg text-blue-800 mb-2">Documentación Requerida (Evento Particular)</h4>
            <p className="text-sm text-blue-700 mb-3">
                ⚠️ **Debe subir cada archivo individualmente.** La falta de documentos obligatorios será causa de rechazo.
            </p>
            <div className="space-y-2">
                {RequisitosEventos.map((req) => (
                    <DocumentUploadField
                        key={req.key}
                        req={req}
                        register={register}
                        watch={watch}
                        errors={errors}
                        existingFile={existingFilesMap ? existingFilesMap[req.key] : null}
                        removeExistingFile={removeExistingFile}
                        apiUrl={apiUrl}
                        isEdit={isEdit}
                        addFilesToField={addFilesToField}
                        filesToAdd={filesToAdd}
                        removeFileToAdd={removeFileToAdd}
                    />
                ))}

                {/* Renderizar las notas informativas separadas, si es necesario, 
          aunque DocumentUploadField las maneja si isInfo está en true */}
                {RequisitosEventos
                    .filter(req => req.isInfo)
                    .map(info => (
                        <DocumentUploadField // Reutilizamos el componente para mantener el estilo
                            key={info.key}
                            req={info}
                            register={register}
                            watch={watch}
                            errors={errors}
                            existingFilesMap={existingFilesMap}
                            removeExistingFile={removeExistingFile}
                            apiUrl={apiUrl}
                            isEdit={isEdit}
                            addFilesToField={addFilesToField}
                            filesToAdd={filesToAdd}
                            removeFileToAdd={removeFileToAdd}
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
    existingFilesMap,
    removeExistingFile,
    apiUrl,
    isEdit,
    addFilesToField,
    filesToAdd,
    removeFileToAdd
}) => (
    <>
        <h3 className="text-xl font-semibold text-black mt-4 mb-2 border-b pb-1">Datos del Evento</h3>

        {/* DNI */}
        <label htmlFor="dni" className="block text-sm font-medium text-black">
            DNI del Peticionante
        </label>
        {errors.dni && (
            <p className="text-red-500 text-sm mt-1">{errors.dni.message}</p>
        )}
        <input
            type="text"
            {...register("dni", {
                required: "El DNI es requerido",
                pattern: {
                    value: /^\d+$/,
                    message: "El DNI debe contener solo dígitos (sin puntos ni guiones)"
                },
                minLength: {
                    value: 8,
                    message: "El DNI debe tener al menos 8 dígitos"
                }
            })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="DNI del Peticionante"
        />

        {/* Apellido */}
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

        {/* Nombre */}
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

        {/* Localidad */}
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

        {/* Lugar de Realización */}
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

        {/* Tipo de Evento */}
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

        {/* Días de Realización */}
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

        {/* Horarios del Evento */}
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

        {/* Email de Contacto */}
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

        {/* Nro de Whatsapp */}
        <label htmlFor="contacto" className="block text-sm font-medium text-black">
            Nro de Whatsapp
        </label>
        {errors.contacto && (
            <p className="text-red-500 text-sm mt-1">{errors.contacto.message}</p>
        )}
        <input
            type="tel"
            {...register("contacto", {
                required: "El número de WhatsApp es requerido",
                pattern: {
                    value: /^\d+$/,
                    message: "El número debe contener solo dígitos"
                }
            })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Ej: 3764123456"
        />

        {/* --- SECCIÓN REQUISITOS INTERACTIVOS --- */}
        <RequisitosEventosDisplay
            register={register}
            watch={watch}
            errors={errors}
            existingFilesMap={existingFilesMap}
            removeExistingFile={removeExistingFile}
            apiUrl={apiUrl}
            isEdit={isEdit}
            addFilesToField={addFilesToField}
            filesToAdd={filesToAdd}
            removeFileToAdd={removeFileToAdd}
        />
        {/* ------------------------------------------ */}

    </>
);

export default EventoParticularForm;