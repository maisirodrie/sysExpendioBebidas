import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrashAlt, faSave, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Municipios } from "../api/municipios";
import Swal from "sweetalert2";
import ComponentCard from "../components/common/ComponentCard";
import Button from "../components/common/Button";

function TaskFormPage() {
  const { register, handleSubmit, setValue } = useForm();
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
      if (params.id) {
        try {
          const task = await getTask(params.id);
          if (task) {
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
        if (
          value !== null &&
          value !== undefined &&
          value !== ""
        ) {
          formData.append(key, value);
        }
      });

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      if (params.id) {
        await updateTask(params.id, formData);
      } else {
        await createTasksPublic(formData);
      }

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El registro se guardó correctamente.",
        confirmButtonText: "OK",
      });

      navigate("/task");
    } catch (error) {
      console.error("Error:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el registro.",
      });
    }
  });

  const handleLocalidadChange = (event) => {
    setSelectedLocalidadValue(event.target.value);
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

    if (selectedExpendio === "Evento Particular") {
      setValue("persona", "Física");
    } else {
      setValue("persona", "");
    }
  };

  const handleTipoPersonaChange = (e) => {
    setTipoPersona(e.target.value);
    setValue("persona", e.target.value);
  };

  const inputClasses = "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs";
  const labelClasses = "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 mt-3";

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-outfit">
      <ComponentCard
        title={params.id ? "Modificar Expediente" : "Nuevo Registro de Expendio"}
        description="Complete los datos solicitados para generar un nuevo expediente de expendio"
        headerAction={
          <Link to="/task">
            <Button
              variant="secondary"
              size="sm"
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Volver a Expedientes
            </Button>
          </Link>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="expendio" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Tipo de Expendio de Bebidas
            </label>
            <select
              id="expendio"
              {...register("expendio", { required: true })}
              onChange={handleTipoExpendioChange}
              className={inputClasses}
            >
              <option value="">Seleccione un tipo de Expendio de Bebidas</option>
              <option value="Evento Particular">Evento Particular</option>
              <option value="Local Comercial">
                Habilitación de Venta de Bebidas para Local Comercial
              </option>
            </select>
          </div>

          {tipoExpendio && (
            <>
              {tipoExpendio === "Local Comercial" && (
                <div>
                  <label htmlFor="tipoPersona" className={labelClasses}>
                    Tipo de Persona
                  </label>
                  <select
                    id="persona"
                    {...register("persona", { required: true })}
                    onChange={handleTipoPersonaChange}
                    className={inputClasses}
                  >
                    <option value="">Seleccione un tipo de persona</option>
                    <option value="Física">Física</option>
                    <option value="Jurídica">Jurídica</option>
                  </select>
                </div>
              )}
            </>
          )}

          {tipoExpendio === "Evento Particular" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="persona" className={labelClasses}>
                  Tipo de Persona
                </label>
                <input
                  id="persona"
                  type="text"
                  {...register("persona", { required: true })}
                  className={`${inputClasses} bg-gray-50 text-gray-500 cursor-not-allowed`}
                  value="Física"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="dni" className={labelClasses}>
                  DNI
                </label>
                <input
                  type="text"
                  {...register("dni", { required: true })}
                  className={inputClasses}
                  placeholder="Número de documento"
                />
              </div>

              <div>
                <label htmlFor="apellido" className={labelClasses}>
                  Apellido
                </label>
                <input
                  type="text"
                  {...register("apellido", { required: true })}
                  className={inputClasses}
                  placeholder="Apellido del solicitante"
                />
              </div>

              <div>
                <label htmlFor="nombrePersona" className={labelClasses}>
                  Nombre
                </label>
                <input
                  type="text"
                  {...register("nombre", { required: true })}
                  className={inputClasses}
                  placeholder="Nombre del solicitante"
                />
              </div>

              <div>
                <label htmlFor="localidad" className={labelClasses}>
                  Localidad
                </label>
                <select
                  {...register("localidad")}
                  value={LocalidadValue}
                  className={inputClasses}
                  onChange={handleLocalidadChange}
                >
                  <option value="">Selecciona una localidad</option>
                  {Municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.nombre}>
                      {municipio.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="domicilio" className={labelClasses}>
                  Domicilio Particular
                </label>
                <input
                  type="text"
                  {...register("domicilio", { required: true })}
                  className={inputClasses}
                  placeholder="Calle, número, barrio"
                />
              </div>

              <div>
                <label htmlFor="lugar" className={labelClasses}>
                  Lugar de Realización del evento
                </label>
                <input
                  type="text"
                  {...register("lugar", { required: true })}
                  className={inputClasses}
                  placeholder="Lugar de realización"
                />
              </div>

              <div>
                <label htmlFor="tipoevento" className={labelClasses}>
                  Tipo de Evento
                </label>
                <input
                  type="text"
                  {...register("tipoevento", { required: true })}
                  className={inputClasses}
                  placeholder="Ej: Cumpleaños, Casamiento, Festival"
                />
              </div>

              <div>
                <label htmlFor="contacto" className={labelClasses}>
                  Nro de WhatsApp
                </label>
                <input
                  type="text"
                  {...register("contacto", { required: true })}
                  className={inputClasses}
                  placeholder="Teléfono de contacto"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className={labelClasses}>
                  Email particular
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className={inputClasses}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="dias" className={labelClasses}>
                  Días del evento
                </label>
                <textarea
                  rows="2"
                  {...register("dias", { required: true })}
                  className={inputClasses}
                  placeholder="Fechas y días del evento"
                />
              </div>

              <div>
                <label htmlFor="horarios" className={labelClasses}>
                  Horarios del evento
                </label>
                <textarea
                  rows="2"
                  {...register("horarios", { required: true })}
                  className={inputClasses}
                  placeholder="Horarios previstos"
                />
              </div>
            </div>
          )}

          {tipoExpendio === "Local Comercial" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dniPropietario" className={labelClasses}>
                  DNI del Propietario
                </label>
                <input
                  type="text"
                  {...register("dni", { required: true })}
                  className={inputClasses}
                  placeholder="DNI del titular"
                />
              </div>

              <div>
                <label htmlFor="apellidoPropietario" className={labelClasses}>
                  Apellido
                </label>
                <input
                  type="text"
                  {...register("apellido", { required: true })}
                  className={inputClasses}
                  placeholder="Apellido"
                />
              </div>

              <div>
                <label htmlFor="nombrePropietario" className={labelClasses}>
                  Nombre
                </label>
                <input
                  type="text"
                  {...register("nombre", { required: true })}
                  className={inputClasses}
                  placeholder="Nombre"
                />
              </div>

              <div>
                <label htmlFor="localidad" className={labelClasses}>
                  Localidad
                </label>
                <select
                  {...register("localidad")}
                  value={LocalidadValue}
                  className={inputClasses}
                  onChange={handleLocalidadChange}
                >
                  <option value="">Selecciona una localidad</option>
                  {Municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.nombre}>
                      {municipio.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="domicilio" className={labelClasses}>
                  Domicilio Particular
                </label>
                <input
                  type="text"
                  {...register("domicilio", { required: true })}
                  className={inputClasses}
                  placeholder="Domicilio particular"
                />
              </div>

              <div>
                <label htmlFor="nroHabilitacion" className={labelClasses}>
                  Nro de Habilitación Municipal
                </label>
                <input
                  type="text"
                  {...register("nroHabilitacion", { required: true })}
                  className={inputClasses}
                  placeholder="Nro habilitación comercial"
                />
              </div>

              <div>
                <label htmlFor="domicilioLocalComercial" className={labelClasses}>
                  Domicilio del Local Comercial
                </label>
                <input
                  type="text"
                  {...register("domicilioLocalComercial", { required: true })}
                  className={inputClasses}
                  placeholder="Dirección del comercio"
                />
              </div>

              <div>
                <label htmlFor="contacto" className={labelClasses}>
                  Nro de WhatsApp
                </label>
                <input
                  type="text"
                  {...register("contacto", { required: true })}
                  className={inputClasses}
                  placeholder="Teléfono de contacto"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className={labelClasses}>
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className={inputClasses}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="horarioAtencion" className={labelClasses}>
                  Horario de Atención
                </label>
                <textarea
                  rows="2"
                  {...register("horarioAtencion", { required: true })}
                  className={inputClasses}
                  placeholder="Horarios de atención"
                />
              </div>

              <div>
                <label htmlFor="rubro" className={labelClasses}>
                  Rubro
                </label>
                <textarea
                  rows="2"
                  {...register("rubro", { required: true })}
                  className={inputClasses}
                  placeholder="Rubro comercial"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <label htmlFor="file" className={labelClasses}>
              Archivos Adjuntos
            </label>
            <input
              type="file"
              name="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer border border-gray-300 rounded-xl bg-white"
            />
          </div>

          {files.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Archivos seleccionados ({files.length}):
              </h4>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded-lg border border-gray-200">
                    <span className="truncate text-gray-700 font-medium">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium ml-2 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<FontAwesomeIcon icon={faSave} />}
              className="w-full justify-center shadow-theme-sm"
            >
              {params.id ? "Actualizar Expediente" : "Guardar Expediente"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
export default TaskFormPage;
