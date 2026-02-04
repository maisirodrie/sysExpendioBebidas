import React from 'react';
import { Municipios } from '../api/municipios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faUpload, faFilePdf, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// Requisito único para Intendencia
const RequisitosIntendencia = [
    { key: "paseElevacionIntendente", label: "Pase a Elevación del Intendente", required: true },
];

// Componente para manejar la carga del documento
const DocumentUploadField = ({ req, register, watch, errors, existingFile, removeExistingFile, apiUrl, isEdit, addFilesToField, filesToAdd, removeFileToAdd }) => {
    const file = watch(req.key);
    const isFileSelected = file instanceof FileList && file.length > 0;
    const hasError = errors[req.key] !== undefined;

    const showExistingFile = existingFile && !isFileSelected;
    const filesToAddForField = (filesToAdd && filesToAdd[req.key]) ? filesToAdd[req.key] : [];

    const downloadUrl = showExistingFile
        ? `${apiUrl.replace('/tasks/download', '')}/tasks/file/${existingFile.filename}`
        : null;

    const fileNameDisplay = isFileSelected
        ? file[0].name
        : showExistingFile ? existingFile.originalname : null;

    const handleAddFiles = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const filesArray = Array.from(files);
            e.target.value = null;
            if (addFilesToField && typeof addFilesToField === 'function') {
                addFilesToField(req.key, filesArray);
            }
        }
    };

    return (
        <div className={`flex flex-col p-2 rounded-md my-1 border transition-all duration-300 ${hasError ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-grow">
                    <FontAwesomeIcon
                        icon={isFileSelected || showExistingFile || filesToAddForField.length > 0 ? faCheckCircle : faUpload}
                        className={`mr-3 ${isFileSelected || showExistingFile || filesToAddForField.length > 0 ? "text-green-500" : "text-blue-500"}`}
                    />
                    <span className={`text-sm flex-grow ${isFileSelected || showExistingFile || filesToAddForField.length > 0 ? "text-gray-600" : "text-black"}`}>
                        {req.label}
                        {req.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                    </span>
                </div>

                <div className="ml-4 flex space-x-2 items-center">
                    {showExistingFile && (
                        <div className="flex space-x-1 items-center">
                            <span className="text-xs text-gray-700 italic max-w-[100px] truncate">
                                Existente: {fileNameDisplay}
                            </span>
                            <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 p-1">
                                <FontAwesomeIcon icon={faFilePdf} />
                            </a>
                            <button type="button" onClick={() => removeExistingFile(existingFile.id, req.key)} className="text-red-500 hover:text-red-700 p-1">
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </div>
                    )}

                    {isFileSelected && !showExistingFile && (
                        <span className="text-xs text-gray-700 italic max-w-[100px] truncate">
                            Nuevo: {fileNameDisplay}
                        </span>
                    )}

                    <label htmlFor={req.key} className={`cursor-pointer text-xs font-semibold px-3 py-1 rounded-md ${isFileSelected || showExistingFile ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
                        {isFileSelected || showExistingFile ? "Reemplazar" : "Subir archivo"}
                        <input
                            id={req.key}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            {...register(req.key, {
                                required: isEdit ? false : (req.required ? `${req.label} es obligatorio.` : false),
                            })}
                            className="hidden"
                            onClick={(e) => { e.target.value = null; }}
                        />
                    </label>

                    {(showExistingFile || filesToAddForField.length > 0) && (
                        <>
                            <label htmlFor={`${req.key}-add`} className="cursor-pointer text-xs font-semibold px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white">
                                Agregar
                                <input
                                    id={`${req.key}-add`}
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={handleAddFiles}
                                    className="hidden"
                                />
                            </label>
                        </>
                    )}
                </div>
            </div>

            {filesToAddForField.length > 0 && (
                <div className="mt-2 pl-8 border-l-2 border-green-400">
                    <p className="text-xs font-semibold text-green-700">Archivos a agregar ({filesToAddForField.length}):</p>
                    <ul className="list-disc list-inside">
                        {filesToAddForField.map((f, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-center justify-between">
                                <span>{f.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFileToAdd(req.key, idx)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {hasError && (
                <p className="text-red-500 text-xs mt-1">{errors[req.key]?.message || "Este archivo es obligatorio."}</p>
            )}
        </div>
    );
};

function IntendenciaForm({
    register,
    errors,
    handleLocalidadChange,
    watch,
    setValue,
    apiUrl,
    existingFilesMap = {},
    removeExistingFile = () => { },
    isEdit = false,
    addFilesToField = () => { },
    filesToAdd = {},
    removeFileToAdd = () => { }
}) {
    return (
        <>
            <h3 className="text-xl font-semibold text-black mt-4 mb-2 border-b pb-1">Datos de Intendencia</h3>

            {/* DNI */}
            <label htmlFor="dni" className="block text-sm font-medium text-black">
                DNI
            </label>
            {errors.dni && (
                <p className="text-red-500 text-sm mt-1">{errors.dni.message}</p>
            )}
            <input
                type="text"
                id="dni"
                {...register("dni", { required: "El DNI es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Ingrese DNI"
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
                id="apellido"
                {...register("apellido", { required: "El Apellido es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Apellido"
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
                id="nombre"
                {...register("nombre", { required: "El Nombre es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Nombre"
            />

            {/* Localidad */}
            <label htmlFor="localidad" className="block text-sm font-medium text-black">
                Localidad
            </label>
            {errors.localidad && (
                <p className="text-red-500 text-sm mt-1">{errors.localidad.message}</p>
            )}
            <select
                id="localidad"
                {...register("localidad", { required: "La Localidad es requerida" })}
                onChange={handleLocalidadChange}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            >
                <option value="">Selecciona una localidad</option>
                {Municipios.map((municipio, index) => (
                    <option key={index} value={typeof municipio === 'string' ? municipio : municipio.nombre}>
                        {typeof municipio === 'string' ? municipio : municipio.nombre}
                    </option>
                ))}
            </select>

            {/* Número de WhatsApp */}
            <label htmlFor="contacto" className="block text-sm font-medium text-black">
                Nro de WhatsApp
            </label>
            {errors.contacto && (
                <p className="text-red-500 text-sm mt-1">{errors.contacto.message}</p>
            )}
            <input
                type="text"
                id="contacto"
                {...register("contacto", { required: "El número de WhatsApp es requerido" })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Ej: 3764123456"
            />

            {/* Documentación Requerida */}
            <div className="bg-blue-100 p-4 rounded-md mt-4 mb-4 border border-blue-300">
                <h4 className="font-bold text-lg text-blue-800 mb-2">Documentación Requerida (Intendencia)</h4>
                <p className="text-sm text-blue-700 mb-3">
                    ⚠️ **Debe subir el archivo individualmente.** La falta del documentos obligatorio será causa de rechazo.
                </p>
                <div className="space-y-2">
                    {RequisitosIntendencia.map((req) => (
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
                </div>
            </div>
        </>
    );
}

export default IntendenciaForm;
