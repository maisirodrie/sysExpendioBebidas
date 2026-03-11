import React from "react";
import { Municipios } from "../api/municipios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUpload,
  faFilePdf,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

// --- Constantes de Requisitos Detallados (CON HTML PARA NEGRITA) ---
const RequisitosFisica = [
  {
    key: "notaSolicitud",
    label: "Nota de Solicitud dirigida al Subsecretario (a).",
    required: true,
  },
  {
    key: "habilitacionMunicipal",
    label: "Copia de la Habilitación Municipal Definitiva (b).",
    required: true,
  },
  {
    key: "actaInspeccion",
    label: "Acta y/o Constancia de inspección Municipal o de Bromatología (c).",
    required: true,
  },
  {
    key: "ddjjDistancias",
    label: "Declaración Jurada sobre las distancias (d).",
    required: true,
  },
  {
    key: "ddjjHigiene",
    label: "Declaración Jurada sobre elementos de Higiene y Seguridad (e).",
    required: true,
  },
  {
    key: "fotocopiaDni",
    label: "Fotocopia del Documento Nacional de Identidad (f).",
    required: true,
  },
  {
    key: "informeSocioAmbiental",
    label: "Informe Socio Ambiental de la Comisaría (g).",
    required: true,
  },
  {
    key: "certificadoAntecedentes",
    label:
      "Informe de Certificado de Antecedentes <b>Provinciales</b> del peticionante (h).", // ⬅️ MODIFICADO
    required: true,
  },
  {
    key: "propiedadInmueble",
    label: "Comprobantes que acrediten la propiedad del Inmueble (i).",
    required: true,
  },
  {
    key: "planContingencia",
    label: "Plan de Contingencia y Constancia Bomberos (si aplica).",
    required: true,
  },
  {
    key: "copiasCertificadas",
    label: "Todas las copias deben estar debidamente CERTIFICADAS.",
    required: false,
    isInfo: true,
  },
];

const RequisitosJuridica = [
  {
    key: "notaSolicitudJuridica",
    label: "Solicitud dirigida al Subsecretario (a).",
    required: true,
  },
  {
    key: "habilitacionMunicipalJuridica",
    label: "Constancia de Habilitación Municipal y Nro. (b).",
    required: true,
  },
  { key: "estatutoSocial", label: "Estatuto Social (c).", required: true },
  {
    key: "actaAsamblea",
    label: "Acta de asamblea de la última elección de autoridades (d).",
    required: true,
  },
  {
    key: "actaComisionDirectiva",
    label: "Acta de Comisión Directiva autorizando la gestión del Permiso (e).",
    required: true,
  },
  {
    key: "ddjjDistanciasJuridica",
    label: "Declaración sobre la distancia existente (f).",
    required: true,
  },
  {
    key: "fotocopiaDniAutorizado",
    label: "Fotocopia del DNI de la persona autorizada (g).",
    required: true,
  },
  {
    key: "certificadoAntecedentesAutorizado",
    label:
      "Informe de certificado de antecedentes <b>Provinciales</b> del peticionante (h).", // ⬅️ MODIFICADO
    required: true,
  },
  {
    key: "medidasSeguridad",
    label: "Constancia Municipal sobre medidas de seguridad e higiene (i).",
    required: true,
  },
  {
    key: "propiedadInmuebleJuridica",
    label: "Comprobantes que acrediten la propiedad del Inmueble.",
    required: true,
  },
  {
    key: "planContingenciaJuridica",
    label: "Plan de Contingencia y Constancia Bomberos (si aplica).",
    required: true,
  },
  {
    key: "copiasCertificadasJuridica",
    label: "Todas las copias deben estar debidamente CERTIFICADAS.",
    required: false,
    isInfo: true,
  },
];
// ----------------------------------------------------------------------

// Componente para manejar la carga de un documento individual (CON CORRECCIÓN HTML)
const DocumentUploadField = ({
  req,
  register,
  watch,
  errors,
  existingFile,
  removeExistingFile,
  apiUrl,
  isEdit,
  addFilesToField,
  filesToAdd,
  removeFileToAdd,
}) => {
  // 1. Monitoreamos el campo para archivos NUEVOS (React Hook Form)
  const file = watch(req.key);
  const isNewFileSelected = file && file.length > 0;
  const hasError = errors[req.key] !== undefined;
  // ⬅️ DEFENSIVO: Asegurar que filesToAdd existe
  const filesToAddForField = (filesToAdd && filesToAdd[req.key]) ? filesToAdd[req.key] : [];

  // 2. Verificamos si hay un archivo existente O un archivo nuevo seleccionado
  const isFilePresent = isNewFileSelected || existingFile || filesToAddForField.length > 0;

  // Handler para el botón "Agregar"
  const handleAddFiles = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // ⬅️ CRÍTICO: Convertir FileList a Array INMEDIATAMENTE
      const filesArray = Array.from(files);

      // Resetear el input ANTES de llamar addFilesToField
      e.target.value = null;

      // ⮅️ DEFENSIVO: Verificar que addFilesToField existe
      if (addFilesToField && typeof addFilesToField === 'function') {
        addFilesToField(req.key, filesArray);  // ⬅️ Pasamos el ARRAY
      } else {
        console.error('addFilesToField no está definido');
      }
    }
  };

  return (
    <div
      id={`file-upload-container-${req.key}`} // ID para el scroll
      className={`flex flex-col p-2 rounded-md my-1 border transition-all duration-300 ${hasError ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
        }`}
    >
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div className="flex items-center flex-grow">
          {" "}
          <FontAwesomeIcon
            icon={isFilePresent ? faCheckCircle : faUpload}
            className={`mr-3 ${isFilePresent ? "text-green-500" : "text-blue-500"
              }`}
          />
          {" "}
          {/* 🔑 CORRECCIÓN: Usamos dangerouslySetInnerHTML para interpretar el <b> y manejar el asterisco */}
          {" "}
          <span
            className={`text-sm flex-grow ${isFilePresent ? "text-gray-600" : "text-black"
              }`}
            dangerouslySetInnerHTML={{
              __html:
                req.label +
                (req.required && !req.isInfo
                  ? '<span class="text-red-500 ml-1 font-bold">*</span>'
                  : ""),
            }}
          />
          {" "}
        </div>
        {" "}
        {req.isInfo ? (
          <span className="text-xs text-yellow-700 font-semibold italic">
            INFORMACIÓN IMPORTANTE
          </span>
        ) : (
          <div className="ml-4 flex space-x-2 items-center">
            {/* MOSTRAR NOMBRE DEL ARCHIVO NUEVO O EXISTENTE */}
            {" "}
            {isNewFileSelected && (
              <span className="text-xs text-orange-700 italic max-w-[100px] truncate">
                Nuevo: {file[0].name}                 {" "}
              </span>
            )}
            {" "}
            {existingFile && !isNewFileSelected && (
              <span className="text-xs text-gray-700 italic max-w-[100px] truncate">
                Existente: {existingFile.originalname}
                {" "}
              </span>
            )}
            {/* OPCIÓN DE VER/ELIMINAR ARCHIVO EXISTENTE */}
            {" "}
            {existingFile && !isNewFileSelected && (
              <div className="flex space-x-1">
                {/* Botón Ver */}                 {" "}
                <a
                  href={`${apiUrl.replace('/tasks/download', '')}/tasks/file/${existingFile.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded-full transition-colors"
                >
                  <FontAwesomeIcon icon={faFilePdf} />
                  {" "}
                </a>
                {/* Botón Eliminar */}
                <button
                  type="button"
                  // 🔑 CAMBIO AQUÍ: Añadimos req.key como segundo parámetro
                  onClick={() => removeExistingFile(existingFile.id, req.key)}
                  className="text-red-500 hover:text-red-700 px-2 py-1 rounded-full transition-colors"
                  title={`Eliminar ${existingFile.originalname}`}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                {" "}
              </div>
            )}
            {/* Input de archivo (oculto) */}
            {" "}
            <label
              htmlFor={req.key}
              className={`cursor-pointer text-xs font-semibold px-3 py-1 rounded-md transition-all duration-200 ${isFilePresent
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              {isFilePresent ? "Reemplazar" : "Subir archivo"}
              {" "}
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
                onClick={(e) => {
                  e.target.value = null;
                }}
              />
              {" "}
            </label>

            {/* Botón AGREGAR (solo si existe archivo o hay archivos para agregar) */}
            {(existingFile || filesToAddForField.length > 0) && (
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
            {" "}
          </div>
        )}
        {" "}
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
                onClick={() => removeFileToAdd(req.key, index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <FontAwesomeIcon icon={faTrashAlt} size="xs" />
              </button>
            </div>
          ))}
        </div>
      )}
      {" "}
      {hasError && (
        <p className="text-red-500 text-xs mt-1 ml-6">
          {errors[req.key].message}       {" "}
        </p>
      )}
      {" "}
    </div>
  );
};

// RequisitosDisplay (Renderiza la lista de documentos)
const RequisitosDisplay = ({
  tipoPersona,
  register,
  watch,
  errors,
  existingFilesMap,
  removeExistingFile,
  apiUrl,
  setFocus,
  isEdit,
  addFilesToField,
  filesToAdd,
  removeFileToAdd,
}) => {
  let requisitos =
    tipoPersona === "Física" ? RequisitosFisica : RequisitosJuridica;
  let titulo =
    tipoPersona === "Física"
      ? "Documentación Requerida (Persona Física)"
      : "Documentación Requerida (Persona Jurídica)";

  if (!tipoPersona) return null;

  return (
    <div className="bg-blue-100 p-4 rounded-md mt-4 mb-4 border border-blue-300">
      <h4 className="font-bold text-lg text-blue-800 mb-2">{titulo}</h4>
      {" "}
      <p className="text-sm text-blue-700 mb-3">
        ⚠️ **Debe subir cada archivo individualmente.** Puede **ver** el
        archivo existente, **reemplazarlo** subiendo uno nuevo, o **eliminarlo**
        directamente.      {" "}
      </p>
      {" "}
      <div className="space-y-2">
        {" "}
        {requisitos.map((req) => (
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
        {" "}
      </div>
      {" "}
    </div>
  );
};

// LocalComercialForm (Exportado)
const LocalComercialForm = ({
  register,
  errors,
  tipoPersona,
  handleTipoPersonaChange,
  handleLocalidadChange,
  watch,
  existingFilesMap,
  removeExistingFile,
  apiUrl,
  setFocus,
  isEdit,
  addFilesToField,
  filesToAdd,
  removeFileToAdd,
}) => (
  <>
    {" "}
    <h3 className="text-xl font-semibold text-black mt-4 mb-2 border-b pb-1">
      Datos del Local Comercial y Propietario
    </h3>
    {/* Selección Tipo de Persona */}   {" "}
    <label htmlFor="persona" className="block text-sm font-medium text-black">
      Tipo de Persona    {" "}
    </label>
    {" "}
    {errors.persona && (
      <p className="text-red-500 text-sm mt-1">
        El tipo de persona es requerido
      </p>
    )}
    {" "}
    <select
      id="persona"
      {...register("persona", { required: "El Tipo de Persona es requerido" })}
      onChange={handleTipoPersonaChange}
      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
      value={tipoPersona}
    >
      <option value="">Seleccione un tipo de persona</option>     {" "}
      <option value="Física">Física</option>     {" "}
      <option value="Jurídica">Jurídica</option>   {" "}
    </select>
    {" "}
    {tipoPersona && (
      <>
        {/* Resto de los campos de texto del formulario */}   {" "}
        <label htmlFor="dni" className="block text-sm font-medium text-black">
          {" "}
          {tipoPersona === "Jurídica"
            ? "CUIT de la Empresa"
            : "DNI del Propietario"}
          {" "}
        </label>
        {" "}
        {errors.dni && (
          <p className="text-red-500 text-sm mt-1">{errors.dni.message}</p>
        )}
        {" "}
        <input
          type="text"
          {...register("dni", {
            required: `${tipoPersona === "Jurídica" ? "El CUIT" : "El DNI"
              } es requerido`,
            pattern: {
              value: /^\d+$/,
              message: "Debe contener solo dígitos (sin puntos ni guiones)"
            },
            minLength: {
              value: 8,
              message: "Debe tener al menos 8 dígitos"
            }
          })}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder={
            tipoPersona === "Jurídica"
              ? "CUIT de la Empresa"
              : "DNI del Propietario"
          }
        />
        {" "}
        <label
          htmlFor="apellido"
          className="block text-sm font-medium text-black"
        >
          Apellido
        </label>
        {" "}
        {errors.apellido && (
          <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>
        )}
        {" "}
        <input
          type="text"
          {...register("apellido", { required: "El Apellido es requerido" })}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder="Apellido del Propietario"
        />
        {" "}
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-black"
        >
          Nombre
        </label>
        {" "}
        {errors.nombre && (
          <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
        )}
        {" "}
        <input
          type="text"
          {...register("nombre", { required: "El Nombre es requerido" })}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder="Nombre del Propietario"
        />
        {" "}
        <label
          htmlFor="localidad"
          className="block text-sm font-medium text-black"
        >
          Localidad
        </label>
        {" "}
        {errors.localidad && (
          <p className="text-red-500 text-sm mt-1">
            {errors.localidad.message}
          </p>
        )}
        {" "}
        <select
          {...register("localidad", { required: "La Localidad es requerida" })}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          onChange={handleLocalidadChange}
        >
          <option value="">Selecciona una localidad</option>     {" "}
          {Municipios.map((municipio) => (
            <option key={municipio.id} value={municipio.nombre}>
              {municipio.nombre}
            </option>
          ))}
          {" "}
        </select>
        {" "}
        <label
          htmlFor="domicilio"
          className="block text-sm font-medium text-black"
        >
          Domicilio particular
        </label>
        {" "}
        {errors.domicilio && (
          <p className="text-red-500 text-sm mt-1">
            {errors.domicilio.message}
          </p>
        )}
        {" "}
        <input
          type="text"
          {...register("domicilio")}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder="Domicilio"
        />
        {" "}
        <label
          htmlFor="nroHabilitacion"
          className="block text-sm font-medium text-black"
        >
          Nro de Habilitación Municipal
        </label>
        {" "}
        {errors.nroHabilitacion && (
          <p className="text-red-500 text-sm mt-1">
            {errors.nroHabilitacion.message}
          </p>
        )}
        {" "}
        <input
          type="text"
          {...register("nroHabilitacion")}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder="Nro de Habilitación Municipal"
        />
        {" "}
        <label
          htmlFor="domicilioLocalComercial"
          className="block text-sm font-medium text-black"
        >
          Domicilio del Local Comercial
        </label>
        {" "}
        {errors.domicilioLocalComercial && (
          <p className="text-red-500 text-sm mt-1">
            {errors.domicilioLocalComercial.message}
          </p>
        )}
        {" "}
        <input
          type="text"
          {...register("domicilioLocalComercial")}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder="Domicilio del Local Comercial"
        />
        {" "}
        <label
          htmlFor="horarioAtencion"
          className="block text-sm font-medium text-black"
        >
          Horario de atención
        </label>
        {" "}
        {errors.horarioAtencion && (
          <p className="text-red-500 text-sm mt-1">
            {errors.horarioAtencion.message}
          </p>
        )}
        {" "}
        <textarea
          {...register("horarioAtencion")}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder="Horario de atención"
        />
        {" "}
        <label htmlFor="rubro" className="block text-sm font-medium text-black">
          Rubro
        </label>
        {" "}
        {errors.rubro && (
          <p className="text-red-500 text-sm mt-1">{errors.rubro.message}</p>
        )}
        {" "}
        <textarea
          {...register("rubro")}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder="Rubro"
        />
        {" "}
        <label htmlFor="email" className="block text-sm font-medium text-black">
          Email
        </label>
        {" "}
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
        {" "}
        <input
          type="email"
          {...register("email")}
          className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          placeholder="Email"
        />
        {" "}
        <label
          htmlFor="contacto"
          className="block text-sm font-medium text-black"
        >
          Nro de Whatsapp
        </label>
        {" "}
        {errors.contacto && (
          <p className="text-red-500 text-sm mt-1">{errors.contacto.message}</p>
        )}
        {" "}
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
        {/* --- SECCIÓN REQUISITOS INTERACTIVOS (Ya corregido) --- */}   {" "}
        <RequisitosDisplay
          tipoPersona={tipoPersona}
          register={register}
          watch={watch}
          errors={errors}
          existingFilesMap={existingFilesMap}
          removeExistingFile={removeExistingFile}
          apiUrl={apiUrl}
          setFocus={setFocus}
          isEdit={isEdit}
          addFilesToField={addFilesToField}
          filesToAdd={filesToAdd}
          removeFileToAdd={removeFileToAdd}
        />
        {" "}
      </>
    )}
    {" "}
  </>
);

export default LocalComercialForm;
