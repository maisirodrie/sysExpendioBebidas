import React, { useEffect, useState, useMemo, useRef } from "react"; // 🔑 Importar useRef
import { useForm, useWatch } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./taskformpage.css";
import Swal from "sweetalert2";

// Importar los componentes de formulario modulares
import LocalComercialForm from "./LocalComercialForm";
import EventoParticularForm from "./EventoParticularForm";

// Mapeo de Nombres de Archivos (Mantenido)
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
    habilitacionMunicipalJuridica: "Constancia Habilitación Municipal (Jurídica)",
    estatutoSocial: "Estatuto Social",
    actaAsamblea: "Acta de Asamblea",
    actaComisionDirectiva: "Acta de Comisión Directiva",
    ddjjDistanciasJuridica: "Declaración Distancias (Jurídica)",
    fotocopiaDniAutorizado: "Fotocopia DNI Autorizado",
    certificadoAntecedentesAutorizado: "Certificado Antecedentes Autorizado",
    medidasSeguridad: "Constancia de Medidas de Seguridad/Higiene",
    propiedadInmuebleJuridica: "Comprobante Propiedad Inmueble (Jurídica)",
    planContingenciaJuridica: "Plan de Contingencia / Bomberos (Jurídica)",
    paseElevacionIntendente: "Pase de Elevación",
    autorizacionMunicipal: "Autorización Municipal",
    fotocopiaDniEvento: "Fotocopia de DNI (Evento)",
    certificadoAntecedentesEvento: "Certificado de Antecedentes (Evento)",
    autorizacionPropietario: "Autorización del Propietario del Lugar",
};

// Función de ayuda para obtener el nombre legible o el nombre de archivo por defecto (Mantenido)
const getFriendlyFileName = (filename) => {
    const keyMatch = filename.match(/^([a-zA-Z]+)/);
    if (keyMatch && FILE_NAME_MAP[keyMatch[1]]) {
        return FILE_NAME_MAP[keyMatch[1]];
    }
    return filename;
};


// Función para obtener las claves de campo válidas (Mantenido)
const getMappedFileKeys = (expendio, persona) => {
    if (expendio === "Local Comercial") {
        if (persona === "Física") return ["notaSolicitud", "habilitacionMunicipal", "actaInspeccion", "ddjjDistancias", "ddjjHigiene", "fotocopiaDni", "informeSocioAmbiental", "certificadoAntecedentes", "propiedadInmueble", "planContingencia"];
        if (persona === "Jurídica") return ["notaSolicitudJuridica", "habilitacionMunicipalJuridica", "estatutoSocial", "actaAsamblea", "actaComisionDirectiva", "ddjjDistanciasJuridica", "fotocopiaDniAutorizado", "certificadoAntecedentesAutorizado", "medidasSeguridad", "propiedadInmuebleJuridica", "planContingenciaJuridica"];
    }
    if (expendio === "Evento Particular") return ["paseElevacionIntendente", "autorizacionMunicipal", "fotocopiaDniEvento", "certificadoAntecedentesEvento", "autorizacionPropietario"];
    return [];
};


function TaskFormPageEdit() {
     const formRef = useRef(null);
    const scrollRef = useRef(null); // 🔑 Referencia para el contenedor principal
    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        setFocus,
        formState: { errors },
    } = useForm();
    const { getTask, updateTask } = useTasks();
    const navigate = useNavigate();
    const params = useParams();

    const [taskData, setTaskData] = useState(null);
    const [filesToRemove, setFilesToRemove] = useState([]);
    const formValues = useWatch({ control });
    const tipoExpendioWatch = formValues?.expendio;
    const tipoPersonaWatch = formValues?.persona;
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    // ... (nroExpedienteParts y apiUrl se mantienen) ...
    const [nroExpedienteParts, setNroExpedienteParts] = useState({
        correlativo: "",
        codigoOrganismo: "",
        anio: "",
    });

    const apiUrl = import.meta.env.VITE_API_ARCHIVO;
    
    // Obtener los fieldnames válidos para el formulario actual (Mantenido)
    const currentMappedFieldnames = useMemo(() => {
        return getMappedFileKeys(tipoExpendioWatch, tipoPersonaWatch);
    }, [tipoExpendioWatch, tipoPersonaWatch]);


    const existingFilesMap = useMemo(() => {
        return selectedFiles.reduce((map, file) => {
            const filename = file.filename || "";
            const inferredFieldname = file.fieldname || filename.split('_')[0].split('-')[0];
            
            if (inferredFieldname) {
                file.fieldname = inferredFieldname; 
                map[inferredFieldname] = file;
            }
            return map;
        }, {});
    }, [selectedFiles]);

    // ... (handleTipoExpendioChange, handleTipoPersonaChange, handleLocalidadChange se mantienen) ...
    const handleTipoExpendioChange = (e) => {
        const selectedExpendio = e.target.value;
        setValue("expendio", selectedExpendio);
        if (selectedExpendio === "Evento Particular") {
            setValue("persona", "Física");
        } else if (selectedExpendio === "Local Comercial") {
            setValue("persona", "");
        }
    };
    const handleTipoPersonaChange = (e) => {
        setValue("persona", e.target.value);
    };

    const handleLocalidadChange = (e) => {
        setValue("localidad", e.target.value);
    };

    // Función de eliminación (Mantenido)
    const removeExistingFileByKey = (fileId) => {
        const fileIdString = fileId.toString();

        setFilesToRemove((prev) =>
            prev.includes(fileIdString) ? prev : [...prev, fileIdString]
        );
        
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((file) => file.id.toString() !== fileIdString)
        );
    };

    // Carga de tarea (Mantenido)
    useEffect(() => {
        async function loadTask() {
            if (params.id) {
                const task = await getTask(params.id);
                
                setTaskData(task); 

                // Carga de Número de Expediente
                if (task.nroexpediente) {
                    const parts = task.nroexpediente.split("/");
                    if (parts.length === 2) {
                        const [correlativo, anio] = parts;
                        const correlativoParts = correlativo.split("-");
                        if (correlativoParts.length >= 1) {
                            setNroExpedienteParts({
                                correlativo: correlativoParts[0],
                                codigoOrganismo: correlativoParts[1] || "",
                                anio: anio,
                            });
                        }
                    }
                }
                
                // Carga de archivos existentes (IDs como string)
                if (task.file && task.file.length > 0) {
                    setSelectedFiles(task.file.map(f => ({ ...f, id: f.id.toString() })));
                }

                // Mapeo de valores de la tarea a los campos del formulario
                Object.keys(task).forEach((key) => {
                    if (key !== 'file' && task[key] !== null && task[key] !== undefined) {
                        setValue(key, task[key]);
                    }
                });
            }
        }
        loadTask();
    }, [params.id, setValue, getTask]);

    // 🔑 VALIDACIÓN Y SUBMIT DEL FORMULARIO (MODIFICACIÓN CLAVE)
    const onSubmit = handleSubmit(async (data) => {
        // Validación de archivos requeridos (si existen)
        const missingFiles = currentMappedFieldnames.filter(fieldName => {
            // Un archivo falta si:
            // 1. No existe un archivo existente para ese fieldName en existingFilesMap
            // Y
            // 2. No se ha subido un archivo nuevo en el campo de entrada (data[fieldName] no es un FileList con archivos)
            
            const existingFile = existingFilesMap[fieldName];
            const isNewFile = data[fieldName] instanceof FileList && data[fieldName].length > 0;
            
            return !existingFile && !isNewFile;
        });

       if (missingFiles.length > 0) {
            const firstMissingFile = missingFiles[0];
            const friendlyName = getFriendlyFileName(firstMissingFile);
            
            // 1. Mostrar alerta
            Swal.fire({
                title: "Archivos Faltantes",
                html: `Debe subir el archivo requerido: <b>${friendlyName}</b>.`,
                icon: "warning",
                confirmButtonText: "Aceptar y ver",
            }).then(() => {
                
                // 🔑 MODIFICACIÓN CLAVE: Envolver el scroll en un setTimeout(0)
                setTimeout(() => {
                    const containerId = `file-upload-container-${firstMissingFile}`;
                    const targetElement = document.getElementById(containerId);
                    
                    // --- Diagnóstico en consola ---
                    console.log("Scroll ID buscado:", containerId);
                    console.log("Elemento encontrado:", targetElement);
                    console.log("Referencia de Scroll (scrollRef.current):", scrollRef.current);
                    // -----------------------------

                    if (targetElement && scrollRef.current) {
                        // Calcula la posición relativa del elemento dentro del contenedor scrollable
                        const offset = targetElement.offsetTop - scrollRef.current.offsetTop; 
                        
                        // Determina dónde debe estar el scroll (ej: 50px antes del elemento)
                        const scrollTo = offset -50; 

                        scrollRef.current.scrollTo({ 
                            top: scrollTo > 0 ? scrollTo : 0, 
                            behavior: 'smooth' 
                        });
                        
                        // Intentamos re-enfocar para asegurar visibilidad (aunque no siempre mueva el scroll)
                        setFocus(firstMissingFile); 
                        
                    } else if (targetElement) {
                        // Fallback simple si no tenemos la referencia scrollRef, pero sí el elemento.
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 0); // Ejecutar después de que SweetAlert2 haya completado su ciclo
            });
            return; // Detener el submit
        }
        
        // --- CONTINÚA EL PROCESO DE SUBMIT SI NO HAY ARCHIVOS FALTANTES ---
        try {
            Swal.fire({
                title: "Cargando...",
                text: "Por favor, espere mientras se actualiza el registro.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const formData = new FormData();
            const existingFilesToKeep = []; 

            // 1. Añadir el número de expediente
            if (
                nroExpedienteParts.correlativo ||
                nroExpedienteParts.codigoOrganismo ||
                nroExpedienteParts.anio
            ) {
                const fullNroExpediente =
                    `${nroExpedienteParts.correlativo || ""}` +
                    (nroExpedienteParts.codigoOrganismo
                        ? `-${nroExpedienteParts.codigoOrganismo}`
                        : "") +
                    (nroExpedienteParts.anio ? `/${nroExpedienteParts.anio}` : "");

                if (fullNroExpediente.trim() !== "/") {
                    formData.append("nroexpediente", fullNroExpediente);
                }
            }

            // 2. DETERMINAR QUÉ ARCHIVOS EXISTENTES SE DEBEN MANTENER (LÓGICA AUTOMATIZADA)
            if (taskData && taskData.file) {
                taskData.file.forEach(file => {
                    const isRelevantField = currentMappedFieldnames.includes(file.fieldname);
                    const isMarkedForRemoval = filesToRemove.includes(file.id.toString());
                    
                    // Solo mantenemos archivos si son relevantes para el formulario actual Y no han sido marcados para eliminación manual
                    if (isRelevantField && !isMarkedForRemoval) {
                        existingFilesToKeep.push({ 
                            id: file.id.toString(), 
                            fieldname: file.fieldname 
                        });
                    }
                    // Cualquier archivo que NO esté en currentMappedFieldnames (el sobrante) 
                    // NO se agrega a existingFilesToKeep, por lo que el backend lo ELIMINARÁ.
                });
            }

            // 3. Lógica de procesamiento de DATOS Y ARCHIVOS NUEVOS
            Object.keys(data).forEach((key) => {
                const value = data[key];

                // 3a. Manejo de ARCHIVOS NUEVOS (Sustitución Automática)
                if (value instanceof FileList && value.length > 0) {
                    Array.from(value).forEach((file) => {
                        formData.append(key, file);
                    });

                    // Si se sube un nuevo archivo, eliminamos el archivo antiguo del mismo fieldname 
                    // de la lista de archivos a mantener (Sustitución).
                    const indexToRemove = existingFilesToKeep.findIndex(ef => ef.fieldname === key);
                    if (indexToRemove !== -1) {
                        existingFilesToKeep.splice(indexToRemove, 1);
                    }
                } 
                
                // 3b. Manejo de DATOS DE TEXTO/OTROS
                else if (
                    key !== "correlativo" &&
                    key !== "codigoOrganismo" &&
                    key !== "anio" &&
                    value !== null &&
                    value !== undefined &&
                    !(value instanceof FileList)
                ) {
                    formData.append(key, value);
                }
            });

            // 4. ADJUNTAR LAS LISTAS PARA EL BACKEND
            formData.append("existingFilesToKeep", JSON.stringify(existingFilesToKeep));

            // Aseguramos que filesToRemove se envíe incluso si está vacío
            formData.append("filesToRemove", JSON.stringify(filesToRemove));
            
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
            Swal.close();
            console.error("Error al actualizar el registro:", error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al actualizar el registro. Por favor, inténtelo de nuevo.",
                icon: "error",
            });
        }
    });
    // ... (handleNroExpedienteChange se mantiene) ...
    const handleNroExpedienteChange = (e, field) => {
        const { value } = e.target;
        setNroExpedienteParts((prevParts) => ({ ...prevParts, [field]: value }));
    };

    return (
        <div
        ref={scrollRef}
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
                        onClick={() => navigate("/task")}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                </div>
                {/* 🔑 Asignar la referencia al formulario */}
                <form ref={formRef} onSubmit={onSubmit} className="mt-4">
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
                    {/* Renderizado Condicional de Evento Particular */}
                    {tipoExpendioWatch === "Evento Particular" && (
                        <EventoParticularForm
                            register={register}
                            errors={errors}
                            handleLocalidadChange={handleLocalidadChange}
                            watch={watch} 
                            existingFilesMap={existingFilesMap}
                            removeExistingFile={removeExistingFileByKey}
                            setFocus={setFocus} 
                            apiUrl={apiUrl}
                        />
                    )}
                    
                    {/* Renderizado Condicional de Local Comercial */}
                    {tipoExpendioWatch === "Local Comercial" && (
                        <LocalComercialForm
                            register={register}
                            errors={errors}
                            tipoPersona={tipoPersonaWatch}
                            handleTipoPersonaChange={handleTipoPersonaChange}
                            handleLocalidadChange={handleLocalidadChange}
                            watch={watch} 
                            setValue={setValue} 
                            existingFilesMap={existingFilesMap}
                            removeExistingFile={removeExistingFileByKey}
                            setFocus={setFocus} 
                            apiUrl={apiUrl}
                        />
                    )}
                    
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