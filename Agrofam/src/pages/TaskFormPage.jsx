import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Municipios } from "../api/municipios.js";
import { Condiciones } from "../api/condicion.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./taskformpage.css";
import { parse, format } from "date-fns";

import Select from "react-select";

function TaskFormPage() {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);

  const { register, handleSubmit, setValue, watch } = useForm();
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedCondicionIntegrantes, setSelectedCondicionIntegrantes] = useState("");
  const [selectedCondicionConvive, setSelectedCondicionConvive] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [dniError, setDniError] = useState("");
  const [selectedMunicipioValue, setSelectedMunicipioValue] = useState("");
  const [selectCondicionIntegrantesValue, setSelectedCondicionIntegrantesValue] = useState("");
  const [selectCondicionConviveValue, setSelectedCondicionConviveValue] = useState("");

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
        setValue("organismoenc", task.organismoenc);
        setValue("celularen", task.celularen);
        setValue("correoen", task.correoen);

        //Responsable 1

        setValue("nombreresp1", task.nombreresp1);
        setValue("apellidoresp1", task.apellidoresp1);
        setValue("dniresp1", task.dniresp1);
        setValue("cuitresp1", task.cuitresp1);
        setValue("celularresp1", task.celularresp1);
        setValue("correoresp1", task.correoresp1);
        setValue("estudiosresp1", task.estudiosresp1);

        //Resposable 2

        setValue("nombreresp2", task.nombreresp2);
        setValue("apellidoresp2", task.apellidoresp2);
        setValue("dniresp2", task.dniresp2);
        setValue("cuitresp2", task.cuitresp2);
        setValue("celularresp2", task.celularresp2);
        setValue("correoresp2", task.correoresp2);
        setValue("estudiosresp2", task.estudiosresp2);

        //Datos del grupo familiar
        setSelectedCondicionIntegrantesValue(task.tieneintegrantes);
        setValue("cuantosintegrantes", task.cuantosintegrantes);
        setValue("cantidadhijosgrupo", task.cantidadhijosgrupo);
        setSelectedCondicionConviveValue(task.convive);
        setValue("hijosasisten", task.hijosasisten);
        setSelectedMunicipioValue(task.municipio);
        // Transforma el array de cadenas en un array de objetos para las opciones de disciplina
      }
    }
    loadTask();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Agregar los nombres de disciplina al objeto de datos
      const updatedData = {
        ...data,
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

  const handleCondicionIntegrantesChange = (event) => {
    setSelectedCondicionIntegrantes(event.target.value);
    setSelectedCondicionIntegrantesValue(event.target.value);
  };

  const handleCondicionConviveChange = (event) => {
    setSelectedCondicionConvive(event.target.value);
    setSelectedCondicionConviveValue(event.target.value);
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
              htmlFor="Encuestador"
              className="block text-sm font-medium text-black"
            >
              <span className="subtitle">Datos del encuestador</span>
            </label>
          </div>
          <label
            htmlFor="apellidoenc"
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
            htmlFor="nombreenc"
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
            htmlFor="organismoenc"
            className="block text-sm font-medium text-black"
          >
            Organismo/Área Institucional
          </label>
          <input
            type="text"
            {...register("organismoenc", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Organismo/Área Institucional"
          />
          <label
            htmlFor="celularen"
            className="block text-sm font-medium text-black"
          >
            Celular
          </label>
          <input
            type="text"
            {...register("celularen", { required: true })}
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
            {...register("correoen", { required: true })}
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
              htmlFor="correoresp1"
              className="block text-sm font-medium text-black"
            >
              Correo
            </label>
            <input
              type="text"
              {...register("correoresp1", { required: true })}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Correo"
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
              placeholder="CUIT-CUIL"
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
              placeholder="Correo"
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
          </div>

          <label
            htmlFor="Personales"
            className="block text-sm font-medium text-black"
          >
            <span className="subtitle">Datos del grupo familiar</span>
          </label>

          <label
            htmlFor="Tiene Integrantes"
            className="block text-sm font-medium text-black"
          >
            ¿Tiene integrantes trabajando?
          </label>

          <select
            {...register("tieneintegrantes", { required: true })}
            value={selectedCondicionIntegrantes}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            onChange={handleCondicionIntegrantesChange}
          >
            <option value="">Selecciona una opción</option>
            {Condiciones.map((tieneintegrantes) => (
              <option key={tieneintegrantes.id} value={tieneintegrantes.nombre}>
                {tieneintegrantes.nombre}
              </option>
            ))}
          </select>

          <label
            htmlFor="Cuantos integrantes"
            className="block text-sm font-medium text-black"
          >
            ¿Cuántos?
          </label>

          <input
            type="text"
            {...register("cuantosintegrantes", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Cuantos integrates"
          />

          <label
            htmlFor="Cuantos integrantes"
            className="block text-sm font-medium text-black"
          >
            Cantidad de Hijos
          </label>

          <input
            type="text"
            {...register("cantidadhijosgrupo", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="Cuantos de Hijos"
          />

          <label
            htmlFor="Cuantos integrantes"
            className="block text-sm font-medium text-black"
          >
            ¿Convive la Familia en el mismo hogar?
          </label>

          <select
            {...register("convive", { required: true })}
            value={selectedCondicionConvive}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            onChange={handleCondicionConviveChange}
          >
            <option value="">Selecciona una opción</option>
            {Condiciones.map((convive) => (
              <option key={convive.id} value={convive.nombre}>
                {convive.nombre}
              </option>
            ))}
          </select>

          <label
            htmlFor="Cuantos integrantes"
            className="block text-sm font-medium text-black"
          >
            ¿Cuantos hijos asisten a la escuela?
          </label>

          <input
            type="text"
            {...register("hijosasisten", { required: true })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
            placeholder="¿Cuantos hijos asisten a la escuela?"
          />

          {/* 
          <select
            {...register("tieneintegrantes", {
              required: true,
            })}
            className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
          >
            <option value="">Seleccionar</option>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select> */}

          {/* Campo para ingresar la cantidad */}
          {/* {watch("integrantesTrabajando.tieneIntegrantes") === "Si" && (
            <>
              <label
                htmlFor="integrantesTrabajando.cantidad"
                className="block text-sm font-medium text-black"
              >
                ¿Cuántos integrantes trabajan?
              </label>
              <input
                type="number"
                {...register("integrantesTrabajando.cantidad", {
                  required: true,
                })}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Cantidad de integrantes"
              />
            </>
          )} */}

          <button className="bg-blue-500 px-4 py-1 rounded-md my-2 disabled:bg-blue-300 text-white">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskFormPage;
