import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./taskformpage.css";

function TaskFormPage() {
  const [startDate, setStartDate] = useState(new Date());
  const { register, handleSubmit, setValue } = useForm();
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedCondicionIntegrantes, setSelectedCondicionIntegrantes] =
    useState("");
  const [selectedCondicionConvive, setSelectedCondicionConvive] = useState("");
  const [dniError, setDniError] = useState("");

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);

        // Encargado
        setValue("apellidoenc", task.apellidoenc);
        setValue("nombreenc", task.nombreenc);
        setValue("organismoenc", task.organismoenc);
        setValue("celularen", task.celularen);
        setValue("correoen", task.correoen);

        // Responsable 1
        setValue("apellidoresp1", task.apellidoresp1);
        setValue("nombreresp1", task.nombreresp1);
        setValue("dniresp1", task.dniresp1);
        setValue("cuitresp1", task.cuitresp1);
        setValue("celularresp1", task.celularresp1);
        setValue("correoresp1", task.correoresp1);
        setValue("estudiosresp1", task.estudiosresp1);

        // Responsable 2
        setValue("apellidoresp2", task.apellidoresp2);
        setValue("nombreresp2", task.nombreresp2);
        setValue("dniresp2", task.dniresp2);
        setValue("cuitresp2", task.cuitresp2);
        setValue("celularresp2", task.celularresp2);
        setValue("correoresp2", task.correoresp2);
        setValue("estudiosresp2", task.estudiosresp2);

        // Datos del grupo familiar
        setSelectedCondicionIntegrantes(task.tieneintegrantes ? "SI" : "NO");
        setValue("tieneintegrantes", task.tieneintegrantes);
        setValue("cuantosintegrantes", task.cuantosintegrantes);
        setValue("cantidadhijosgrupo", task.cantidadhijosgrupo);
        setSelectedCondicionConvive(task.convive ? "SI" : "NO");
        setValue("convive", task.convive);
        setValue("hijosasisten", task.hijosasisten);
        setValue("nivelinicialfamiliar", task.nivelinicialfamiliar);
        setValue("primariafamiliar", task.primariafamiliar);
        setValue("secundariafamiliar", task.secundariafamiliar);
        setValue("terciariaosuperiorfamiliar", task.terciariaosuperiorfamiliar);
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedData = {
        ...data,
        tieneintegrantes: data.tieneintegrantes === "SI" ? "SI" : "NO",
        convive: data.convive === "SI" ? "SI" : "NO",
      };

      console.log("Datos del formulario a enviar:", updatedData);

      if (params.id) {
        await updateTask(params.id, updatedData);
      } else {
        await createTask(updatedData);
      }
      navigate("/task");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDniError(error.response.data.message);
      } else {
        console.error("Error:", error);
      }
    }
  });

  return (
    <div
      className="flex items-center justify-center overflow-y-auto"
      style={{ marginTop: "20px", marginBottom: "20px" }}
    >
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
              placeholder="CUIT-CUIL"
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

            <div>
              <label
                htmlFor="Responsable2"
                className="block text-sm font-medium text-black"
              >
                <span className="subtitle">Responsable 2</span>
              </label>
              <label
                htmlFor="apellidoresp2"
                className="block text-sm font-medium text-black"
              >
                Apellido
              </label>
              <input
                type="text"
                {...register("apellidoresp2")}
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
                {...register("nombreresp2")}
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
                {...register("dniresp2")}
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
                {...register("cuitresp2")}
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
                {...register("celularresp2")}
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
                {...register("correoresp2")}
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
                {...register("estudiosresp2")}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                placeholder="Estudios alcanzados"
              />
            </div>

            <div>
              <label
                htmlFor="GrupoFamiliar"
                className="block text-sm font-medium text-black"
              >
                <span className="subtitle">Datos del grupo familiar</span>
              </label>
              <div className="form-group">
                <label
                  htmlFor="tieneintegrantes"
                  className="block text-sm font-medium text-black"
                >
                  ¿Hay más integrantes trabajando en la Unidad Productiva?
                </label>
                <div>
                  <label
                    htmlFor="tieneintegrantes_si"
                    className="inline-flex items-center mt-3"
                  >
                    <input
                      type="radio"
                      name="tieneintegrantes"
                      value="SI"
                      checked={selectedCondicionIntegrantes === "SI"}
                      {...register("tieneintegrantes", { required: true })}
                      onChange={() => setSelectedCondicionIntegrantes("SI")}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-black">SI</span>
                  </label>
                  <label
                    htmlFor="tieneintegrantes_no"
                    className="inline-flex items-center mt-3 ml-6"
                  >
                    <input
                      type="radio"
                      name="tieneintegrantes"
                      value="NO"
                      checked={selectedCondicionIntegrantes === "NO"}
                      {...register("tieneintegrantes", { required: true })}
                      onChange={() => setSelectedCondicionIntegrantes("NO")}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-black">NO</span>
                  </label>
                </div>
                {selectedCondicionIntegrantes === "SI" && (
                  <>
                    <label
                      htmlFor="cuantosintegrantes"
                      className="block text-sm font-medium text-black"
                    >
                      ¿Cuántos?
                    </label>
                    <input
                      type="text"
                      {...register("cuantosintegrantes", {
                        required: selectedCondicionIntegrantes === "SI",
                      })}
                      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                      placeholder="¿Cuántos?"
                    />
                    <label
                      htmlFor="cantidadhijosgrupo"
                      className="block text-sm font-medium text-black"
                    >
                      Cantidad de Hijos
                    </label>
                    <input
                      type="text"
                      {...register("cantidadhijosgrupo", {
                        required: selectedCondicionIntegrantes === "SI",
                      })}
                      className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                      placeholder="Cantidad de hijos"
                    />
                    <label
                      htmlFor="convive"
                      className="block text-sm font-medium text-black"
                    >
                      ¿Convive la familia en el mismo hogar?
                    </label>
                    <div>
                      <label
                        htmlFor="convive_si"
                        className="inline-flex items-center mt-3"
                      >
                        <input
                          type="radio"
                          name="convive"
                          value="SI"
                          checked={selectedCondicionConvive === "SI"}
                          {...register("convive")}
                          onChange={() => setSelectedCondicionConvive("SI")}
                          className="form-radio h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2 text-black">SI</span>
                      </label>
                      <label
                        htmlFor="convive_no"
                        className="inline-flex items-center mt-3 ml-6"
                      >
                        <input
                          type="radio"
                          name="convive"
                          value="NO"
                          checked={selectedCondicionConvive === "NO"}
                          {...register("convive")}
                          onChange={() => setSelectedCondicionConvive("NO")}
                          className="form-radio h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2 text-black">NO</span>
                      </label>
                    </div>

                    <>
                      <label
                        htmlFor="hijosasisten"
                        className="block text-sm font-medium text-black"
                      >
                        ¿Cuantos hijos asisten a la escuela?
                      </label>
                      <input
                        type="text"
                        {...register("hijosasisten")}
                        className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                        placeholder="¿Cuantos hijos asisten a la escuela?"
                      />

                      <label
                        htmlFor="nivelinicialfamiliar"
                        className="block text-sm font-medium text-black"
                      >
                        Nivel Inicial
                      </label>
                      <input
                        type="text"
                        {...register("nivelinicialfamiliar")}
                        className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                        placeholder="Nivel Inicial"
                      />

                      <label
                        htmlFor="primariafamiliar"
                        className="block text-sm font-medium text-black"
                      >
                        Primaria
                      </label>
                      <input
                        type="text"
                        {...register("primariafamiliar")}
                        className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                        placeholder="Primaria"
                      />

                      <label
                        htmlFor="secundariafamiliar"
                        className="block text-sm font-medium text-black"
                      >
                        Secundaria
                      </label>
                      <input
                        type="text"
                        {...register("secundariafamiliar")}
                        className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                        placeholder="Secundaria"
                      />

                      <label
                        htmlFor="terciariaosuperiorfamiliar"
                        className="block text-sm font-medium text-black"
                      >
                        Terciaria o Superior
                      </label>
                      <input
                        type="text"
                        {...register("terciariaosuperiorfamiliar")}
                        className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                        placeholder="Terciaria o Superior"
                      />
                    </>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormPage;
