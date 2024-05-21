import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Municipios } from "../api/municipios.js";
import { Directos } from "../api/directos.js";
import { Indirectos } from "../api/indirectos.js";
import { Publicas } from "../api/publica.js";
import { Privadas } from "../api/privada.js";
import { Disciplinas } from "../api/disciplina.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./taskformpage.css";
import { parse, format } from "date-fns";

import Select from "react-select";

function TaskFormPage() {
  const defaultOption = { value: "Ninguno", label: "Ninguno" };
  const defaultOptions = { value: "NINGUNO", label: "NINGUNO" };
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);

  const { register, handleSubmit, setValue } = useForm();
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState("");
  const [dniError, setDniError] = useState("");
  const [selectedMunicipioValue, setSelectedMunicipioValue] = useState("");
  const [selectedDisciplinaValue, setSelectedDisciplinaValue] = useState("");
  const [selectedDirectosValue, setSelectedDirectosValue] = useState([
    defaultOptions,
  ]);
  const [selectedIndirectosValue, setSelectedIndirectosValue] = useState([
    defaultOptions,
  ]);
  const [selectedDisciplinaDirectaValue, setSelectedDisciplinaDirectaValue] =
    useState([defaultOption]);
  const [
    selectedDisciplinaIndirectaValue,
    setSelectedDisciplinaIndirectaValue,
  ] = useState([defaultOption]);
  const [selectedFormacionPublicaValue, setSelectedFormacionPublicaValue] =
    useState([defaultOptions]);
  const [selectedDisciplinaPublicaValue, setSelectedDisciplinaPublicaValue] =
    useState([defaultOption]);
  const [selectedFormacionPrivadaValue, setSelectedFormacionPrivadaValue] =
    useState([defaultOptions]);
  const [selectedDisciplinaPrivadaValue, setSelectedDisciplinaPrivadaValue] =
    useState([defaultOption]);

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const currentDate = task.fechanacimiento
          ? new Date(task.fechanacimiento)
          : new Date();
        const task = await getTask(params.id);

        //Encargado

        setValue("apellidoenc", task.apellidoenc);
        setValue("nombreenc", task.nombreenc);
        setValue("celularen", task.celularen);
        setValue("correoen", task.correoen);

        //Responsable 1

        setValue("nombreresp1", task.nombreresp1);
        setValue("apellidoresp1", task.apellidoresp1);
        setValue("dniresp1", task.dniresp1);
        setValue("cuitresp1", task.cuitresp1);
        setValue("fechanacimientoresp1", currentDate);
        setValue("celularresp1", task.celularresp1);
        setValue("correoresp1", task.correoresp1);
        setValue("estudiosresp1", task.estudiosresp1);

        //Resposable 2

        setValue("nombreresp2", task.nombreresp2);
        setValue("apellidoresp2", task.apellidoresp2);
        setValue("dniresp2", task.dniresp2);
        setValue("cuitresp2", task.cuitresp2);
        setValue("fechanacimientoresp2", currentDate);
        setValue("celularresp2", task.celularresp2);
        setValue("correoresp2", task.correoresp2);
        setValue("estudiosresp2", task.estudiosresp2);

        setSelectedMunicipioValue(task.municipio);
        // Transforma el array de cadenas en un array de objetos para las opciones de disciplina
        const roldirectoOptions = task.roldirecto.map((nombre) => ({
          value: nombre,
          label: nombre,
        }));
        setSelectedDirectosValue(roldirectoOptions);

        const disciplinadirectaOptions = task.disciplinadirecta.map(
          (nombre) => ({ value: nombre, label: nombre })
        );
        setSelectedDisciplinaDirectaValue(disciplinadirectaOptions);

        const roldidirectoOptions = task.rolindirecto.map((nombre) => ({
          value: nombre,
          label: nombre,
        }));
        setSelectedIndirectosValue(roldidirectoOptions);

        const disciplinaindirectaOptions = task.disciplinaindirecta.map(
          (nombre) => ({ value: nombre, label: nombre })
        );
        setSelectedDisciplinaIndirectaValue(disciplinaindirectaOptions);

        const formacionpublicaOptions = task.formacionpublica.map((nombre) => ({
          value: nombre,
          label: nombre,
        }));
        setSelectedFormacionPublicaValue(formacionpublicaOptions);

        const disciplinapublicaOptions = task.disciplinapublica.map(
          (nombre) => ({ value: nombre, label: nombre })
        );
        setSelectedDisciplinaPublicaValue(disciplinapublicaOptions);

        const formacionprivadaOptions = task.formacionprivada.map((nombre) => ({
          value: nombre,
          label: nombre,
        }));
        setSelectedFormacionPrivadaValue(formacionprivadaOptions);

        const disciplinaprivadaOptions = task.disciplinaprivada.map(
          (nombre) => ({ value: nombre, label: nombre })
        );
        setSelectedDisciplinaPrivadaValue(disciplinaprivadaOptions);

        // const disciplinaOptions = task.disciplina.map(nombre => ({ value: nombre, label: nombre }));
        // setSelectedDisciplinaValue(disciplinaOptions);
      }
    }
    loadTask();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Agregar los nombres de disciplina al objeto de datos
      const formattedDate1 = selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : "";
    const formattedDate2 = selectedDate2
      ? format(selectedDate2, "yyyy-MM-dd")
      : "";
    const updatedData = {
      ...data,
      fechanacimiento1: formattedDate1,
      fechanacimiento2: formattedDate2,

        roldirecto: selectedDirectosValue.map((option) => option.value),
        disciplinadirecta: selectedDisciplinaDirectaValue.map(
          (option) => option.value
        ),
        rolindirecto: selectedIndirectosValue.map((option) => option.value),
        disciplinaindirecta: selectedDisciplinaIndirectaValue.map(
          (option) => option.value
        ),
        formacionpublica: selectedFormacionPublicaValue.map(
          (option) => option.value
        ),
        disciplinapublica: selectedDisciplinaPublicaValue.map(
          (option) => option.value
        ),
        formacionprivada: selectedFormacionPrivadaValue.map(
          (option) => option.value
        ),
        disciplinaprivada: selectedDisciplinaPrivadaValue.map(
          (option) => option.value
        ),
      };

      console.log("Datos del formulario a enviar:", updatedData);

      if (params.id) {
        await updateTask(params.id, updatedData);
      } else {
        await createTask(updatedData);
      }
      // navigate('/profile');
      navigate("/task");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDniError(error.response.data.message);
      } else {
        console.error("Error:", error);
      }
    }
  });

  const handleMunicipioChange = (event) => {
    setSelectedMunicipio(event.target.value);
    setSelectedMunicipioValue(event.target.value);
  };

  const handleDirectosChange = (selectedOptions) => {
    setSelectedDirectosValue(selectedOptions);
  };

  const handleDisciplinaDirectaChange = (selectedOptions) => {
    setSelectedDisciplinaDirectaValue(selectedOptions);
  };

  const handleIndirectosChange = (selectedOptions) => {
    setSelectedIndirectosValue(selectedOptions);
  };

  const handleDisciplinaIndirectaChange = (selectedOptions) => {
    setSelectedDisciplinaIndirectaValue(selectedOptions);
  };

  const handleFormacionPublicaChange = (selectedOptions) => {
    setSelectedFormacionPublicaValue(selectedOptions);
  };

  const handleDisciplinaPublicaChange = (selectedOptions) => {
    setSelectedDisciplinaPublicaValue(selectedOptions);
  };

  const handleFormacionPrivadaChange = (selectedOptions) => {
    setSelectedFormacionPrivadaValue(selectedOptions);
  };

  const handleDisciplinaPrivadaChange = (selectedOptions) => {
    setSelectedDisciplinaPrivadaValue(selectedOptions);
  };

  return (
    <div
      className="flex items-center justify-center overflow-y-auto"
      style={{ marginTop: "20px", marginBottom: "20px" }}
    >
      {/* Contenido del formulario aquí */}

      <div className="bg-gray-300 max-w-md w-full p-10 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Registro de Persona</h1>
          <Link
            to="/task"
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />{" "}
            {/* Ícono de flecha hacia la izquierda */}
          </Link>
        </div>
        <form onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-black"
            >
              <span className="subtitle">Datos del encuestador</span>
            </label>
          </div>
          <label
            htmlFor="apellido"
            className="block text-sm font-medium text-black"
          >
            Apellido
          </label>
          <input
            type="text"
            {...register("apellidoenc", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Apellido"
          />
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-black"
          >
            Nombres
          </label>
          <input
            type="text"
            {...register("nombreenc", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Nombres"
          />
          <label
            htmlFor="organismo"
            className="block text-sm font-medium text-black"
          >
            Organismo/Área Institucional
          </label>
          <input
            type="text"
            {...register("celularen", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Organismo/Área Institucional"
          />
          <label
            htmlFor="celular"
            className="block text-sm font-medium text-black"
          >
            Celular
          </label>
          <input
            type="text"
            {...register("correoen", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Celular"
          />
          <label
            htmlFor="correo"
            className="block text-sm font-medium text-black"
          >
            Correo
          </label>
          <input
            type="text"
            {...register("apellido", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Correo"
          />

          <div>
            <label
              htmlFor="Personales"
              className="block text-sm font-medium text-black"
            >
              <span className="subtitle">
                Datos personales de las y los responsables de la unidad
                productiva
              </span>
            </label>
            <label
              htmlFor="apellidoresp1"
              className="block text-sm font-medium text-black"
            >
              Apellido
            </label>

            <input
              type="text"
              {...register("apellidoresp1", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Apellido"
            />

            <label
              htmlFor="nombreresp1"
              className="block text-sm font-medium text-black"
            >
              Nombre
            </label>
            <input
              type="text"
              {...register("nombreresp1", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Nombre"
            />
            <label
              htmlFor="dniresp1"
              className="block text-sm font-medium text-black"
            >
              DNI
            </label>
            <input
              type="text"
              {...register("dniresp1", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="DNI"
            />

            <label
              htmlFor="cuitresp1"
              className="block text-sm font-medium text-black"
            >
              CUIT-CUIL
            </label>
            <input
              type="text"
              {...register("cuitresp1", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="DNI"
            />

            <label
              htmlFor="fechanacimientoresp1"
              className="block text-sm font-medium text-black"
            >
              Fecha de nacimiento
            </label>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholderText="Seleccionar fecha de nacimiento"
              required // Esta es la forma de hacer que el campo sea requerido directamente en HTML
            />

            <label
              htmlFor="celularresp1"
              className="block text-sm font-medium text-black"
            >
              Celular
            </label>
            <input
              type="text"
              {...register("celularresp1", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Celular"
            />

            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-black"
            >
              Correo
            </label>
            <input
              type="text"
              {...register("telefono", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Teléfono"
            />

            <label
              htmlFor="estudiosresp1"
              className="block text-sm font-medium text-black"
            >
              Estudios alcanzados
            </label>
            <input
              type="text"
              {...register("estudiosresp1", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Estudios alcanzados"
            />

            {/* Responsable 2 */}

            <label
              htmlFor="apellidoresp2"
              className="block text-sm font-medium text-black"
            >
              Apellido
            </label>

            <input
              type="text"
              {...register("apellidoresp2", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Apellido"
            />

            <label
              htmlFor="nombreresp2"
              className="block text-sm font-medium text-black"
            >
              Nombre
            </label>
            <input
              type="text"
              {...register("nombreresp2", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Nombre"
            />
            <label
              htmlFor="dniresp2"
              className="block text-sm font-medium text-black"
            >
              DNI
            </label>
            <input
              type="text"
              {...register("dniresp2", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="DNI"
            />

            <label
              htmlFor="cuitresp2"
              className="block text-sm font-medium text-black"
            >
              CUIT-CUIL
            </label>
            <input
              type="text"
              {...register("cuitresp2", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="DNI"
            />

            <label
              htmlFor="fechanacimientoresp2"
              className="block text-sm font-medium text-black"
            >
              Fecha de nacimiento
            </label>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={selectedDate2}
              onChange={(date) => setSelectedDate2(date)}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholderText="Seleccionar fecha de nacimiento 2"
              required
            />

            <label
              htmlFor="celularresp2"
              className="block text-sm font-medium text-black"
            >
              Celular
            </label>
            <input
              type="text"
              {...register("celularresp2", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Celular"
            />

            <label
              htmlFor="correoresp2"
              className="block text-sm font-medium text-black"
            >
              Correo
            </label>
            <input
              type="text"
              {...register("correoresp2", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Teléfono"
            />

            <label
              htmlFor="estudiosresp2"
              className="block text-sm font-medium text-black"
            >
              Estudios alcanzados
            </label>
            <input
              type="text"
              {...register("estudiosresp2", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Estudios alcanzados"
            />

            {/* <label htmlFor="roldirecto" className="block text-sm font-medium text-black">
            Rol Directo que desempeña en la danza
          </label>
           <Select
            options={Directos.map(roldirecto => ({ value: roldirecto.nombre, label: roldirecto.nombre }))}
            isMulti
            value={selectedDirectosValue}
            onChange={handleDirectosChange}
          />

           <label htmlFor="disciplinadirecta" className="block text-sm font-medium text-black">
            Disciplina del rol directo en que se desempeña
            </label>
            <Select
            options={Disciplinas.map(disciplinadirecta => ({ value: disciplinadirecta.nombre, label: disciplinadirecta.nombre }))}
            isMulti
            value={selectedDisciplinaDirectaValue}
            onChange={handleDisciplinaDirectaChange}
          />

<label htmlFor="roldirecto" className="block text-sm font-medium text-black">
            Rol Indirecto que desempeña en la danza
          </label>
           <Select
            options={Indirectos.map(roldindirecto => ({ value: roldindirecto.nombre, label: roldindirecto.nombre }))}
            isMulti
            value={selectedIndirectosValue}
            onChange={handleIndirectosChange}
          />

           <label htmlFor="disciplinadirecta" className="block text-sm font-medium text-black">
            Disciplina del rol indirecto en que se desempeña
            </label>
            <Select
            options={Disciplinas.map(disciplinaindirecta => ({ value: disciplinaindirecta.nombre, label: disciplinaindirecta.nombre }))}
            isMulti
            value={selectedDisciplinaIndirectaValue}
            onChange={handleDisciplinaIndirectaChange}
          />




<label htmlFor="formacionpublica" className="block text-sm font-medium text-black">
    Formación académica en instituciones públicas de educación Superior / universitario/ posgrados
  </label>
  <Select
    options={Publicas.map(formacionpublica => ({ value: formacionpublica.nombre, label: formacionpublica.nombre }))}
    isMulti
    value={selectedFormacionPublicaValue}
    onChange={handleFormacionPublicaChange}
    placeholder='Seleccione la formación pública'
  />
            <label htmlFor="disciplinapublica" className="block text-sm font-medium text-black">
            Disciplina en que se formó
            </label>
           <Select
            options={Disciplinas.map(disciplinapublica => ({ value: disciplinapublica.nombre, label: disciplinapublica.nombre }))}
            isMulti
            value={selectedDisciplinaPublicaValue}
            onChange={handleDisciplinaPublicaChange}
            placeholder='Seleccione en que disciplina'
          />

<label htmlFor="publico" className="block text-sm font-medium text-black">
Indique la/las institución/es en la que finalizo sus estudios:
            </label>
            <input type='text' {...register("publico")} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Ingrese la/s institución/es' />

<label htmlFor="formacionprivada" className="block text-sm font-medium text-black">
    Formación académica en instituciones privadas de educación Superior / universitario/ posgrados
  </label>
  <Select
    options={Privadas.map(formacionprivada => ({ value: formacionprivada.nombre, label: formacionprivada.nombre }))}
    isMulti
    value={selectedFormacionPrivadaValue}
    onChange={handleFormacionPrivadaChange}
    placeholder='Seleccione la formación privada'
  />
            <label htmlFor="disciplinaprivada" className="block text-sm font-medium text-black">
            Disciplina en que se formó
            </label>
           <Select
            options={Disciplinas.map(disciplinaprivada => ({ value: disciplinaprivada.nombre, label: disciplinaprivada.nombre }))}
            isMulti
            value={selectedDisciplinaPrivadaValue}
            onChange={handleDisciplinaPrivadaChange}
            placeholder='Seleccione en que disciplina'
          />

<label htmlFor="privada" className="block text-sm font-medium text-black">
Indique la/las institución/es en la que finalizo sus estudios:
            </label>
            <input type='text' {...register("privada")} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Ingrese la/s institución/es' /> */}

            {/* <select {...register("disciplina", { required: true })} value={selectedDisciplinaValue} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' onChange={handleDisciplinaChange}>
              <option value="">Selecciona Disciplina</option>
              {Disciplinas.map(disciplina => (
                <option key={disciplina.id} value={disciplina.nombre}>{disciplina.nombre}</option>
              ))}
            </select> */}
            {/* <input type='text' {...register("disciplina", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Disciplina' /> */}

            {/* <label
              htmlFor="observaciones"
              className="block text-sm font-medium text-black"
            >
              Observaciones
            </label>
            <textarea
              id="observaciones"
              {...register("observaciones")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Observaciones"
              rows={4} // Define la cantidad de filas que mostrará el textarea
            /> */}
          </div>

          <button className="bg-blue-500 px-4 py-1 rounded-md my-2 disabled:bg-blue-300 text-white">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskFormPage;
