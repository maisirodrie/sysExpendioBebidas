import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Generos } from "../api/genero.js";
import { Municipios } from "../api/municipios.js";
import { Animal } from "../api/animal.js";
import { Departamentos } from "../api/departamentos.js";
import Select from "react-select";
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
  const [selectedPueblosOriginarios, setSelectedPueblosOriginario] =
    useState("");
  const [selectedDomicilioFamiliar, setSelectedDomicilioFamiliar] =
    useState("");

  const [selectedPropiedadProductiva, setSelectedPropiedadProductiva] =
    useState("");
  const [selectedProduccionAgroecologica, setSelectedProduccionAgroecologica] =
    useState("");
  const [selectedProduccionConvencional, setSelectedProduccionConvencional] =
    useState("");
  const [selectedGenero1, setSelectedGenero1] = useState("");
  const [selectedGeneroValue1, setSelectedGeneroValue1] = useState("");
  const [selectedGenero2, setSelectedGenero2] = useState("");
  const [selectedGeneroValue2, setSelectedGeneroValue2] = useState("");
  const [selectedMunicipioFamiliarValue, setSelectedMunicipioFamiliarValue] =
    useState("");
  const [selectedMunicipioPredialesValue, setSelectedMunicipioPredialesValue] =
    useState("");
  const [selectedDepartamentoFamiliares, setSelectedDepartamentoFamiliarValue] =
    useState("");
  const [selectedDepartamentoPrediales, setSelectedDepartamentoPredialesValue] =
    useState("");
  const [dniError, setDniError] = useState("");

  const [selectedAnimalValue, setSelectedAnimalValue] = useState();
  const [selectedVendeComercializacion, setSelectedVendeComercializacion] = useState();

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
        setValue("genero1", task.genero1);
        setValue("cuitresp1", task.cuitresp1);
        setValue("celularresp1", task.celularresp1);
        setValue("correoresp1", task.correoresp1);
        setValue("estudiosresp1", task.estudiosresp1);

        // Responsable 2
        setValue("apellidoresp2", task.apellidoresp2);
        setValue("nombreresp2", task.nombreresp2);
        setValue("dniresp2", task.dniresp2);
        setValue("genero2", task.genero2);
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
        setValue("pueblosoriginariosfamiliar", task.pueblosoriginariosfamiliar);
        setValue(
          "cualpueblosoriginariosfamiliar",
          task.cualpueblosoriginariosfamiliar
        );
        setValue("domiciliofamiliar", task.domiciliofamiliar);
        setValue("lotefamiliar", task.lotefamiliar);
        setValue("parcelafamiliar", task.parcelafamiliar);
        setValue("seccionfamiliar", task.seccionfamiliar);
        setValue("partidafamiliar", task.partidafamiliar);
        setValue("coloniaparajefamiliar", task.coloniaparajefamiliar);
        setValue("municipiofamiliar", task.municipiofamiliar);
        setValue("departamentofamiliar", task.departamentofamiliar);

        //Datos Prediales de la unidad Productiva

        setValue("loteprediales", task.loteprediales);
        setValue("parcelaprediales", task.parcelaprediales);
        setValue("seccionprediales", task.seccionprediales);
        setValue("partidaprediales", task.partidaprediales);
        setValue("coloniaprediales", task.coloniaprediales);
        setValue("municipioprediales", task.municipioprediales);
        setValue("departamentoprediales", task.departamentoprediales);
        setValue("propiedadproductiva", task.propiedadproductiva);
        setValue("propietarioprediales", task.propietarioprediales);
        setValue("arrendatarioprediales", task.arrendatarioprediales);
        setValue("condominioprediales", task.condominioprediales);
        setValue("ocupanteprediales", task.ocupanteprediales);
        setValue("superficietotalprediales", task.superficietotalprediales);
        setValue("supagricprediales", task.supagricprediales);
        setValue("supgandprediales", task.supgandprediales);
        setValue("monteprediales", task.monteprediales);
        setValue("suppiscicolaprediales", task.suppiscicolaprediales);
        setValue("supapicolaprediales", task.supapicolaprediales);
        setValue("supactindustrialprediales", task.supactindustrialprediales);
        setValue("sinusoprediales", task.sinusoprediales);
        setValue("otrosprediales", task.otrosprediales);
        setValue("puntosgpsprediales", task.puntosgpsprediales);

        //Pefil productivo

        setValue("produccionagroecologica", task.produccionagroecologica);
        setValue(
          "situacionproduccionagroecologica",
          task.situacionproduccionagroecologica
        );
        setValue("produccionconvencional", task.produccionconvencional);
        setValue("produccionanimal", task.produccionanimal);
        setValue("produccionvegetal", task.produccionvegetal);
        setValue("accesoagua", task.accesoagua);
        setValue("modalidadaccesoagua", task.modalidadaccesoagua);
        setValue("infraestructuraproductiva", task.infraestructuraproductiva);
        setValue(
          "cualesinfraestructuraproductiva",
          task.cualesinfraestructuraproductiva
        );
        setValue("cualesmaquinariaproductiva", task.cualesmaquinariaproductiva);

        //Datos de comercializacion

        setValue("vendecomercializacion", task.vendecomercializacion);
        setValue(
          "cualesvendecomercializacion",
          task.cualesvendecomercializacion
        );
        setValue("feriaperteneciente", task.feriaperteneciente);
        setValue("puesto", task.puesto);
        setValue("carnetmanipulacion", task.carnetmanipulacion);
        setValue("vigencia", task.vigencia);
        setValue("monotributista", task.monotributista);
        setValue("excedenteproduccion", task.excedenteproduccion);
        setValue("pedido", task.pedido);
        setValue("compraproduccion", task.compraproduccion);
        setValue("agregadovalor", task.agregadovalor);
        setValue("cualesagregadovalor", task.cualesagregadovalor);
        setValue("equipamento", task.equipamento);
        setValue("cualesequipamento", task.cualesequipamento);
        setValue("difusion", task.difusion);
        setValue("cualesdifusion", task.cualesdifusion);
        setValue("registroprovincial", task.registroprovincial);
        setValue("registroproductor", task.registroproductor);
        setValue("rensapa", task.rensapa);
        setValue("carnetsanitario", task.carnetsanitario);
        setValue("municipioasignados", task.municipioasignados);
        setValue("renapa", task.renapa);

        //Set de Listas
        setSelectedGeneroValue1(task.genero1);
        setSelectedGeneroValue2(task.genero2);
        setSelectedMunicipioFamiliarValue(task.municipiofamiliar);
        setSelectedDepartamentoFamiliarValue(task.departamentofamiliar);
        setSelectedMunicipioPredialesValue(task.municipioprediales);
        setSelectedDepartamentoPredialesValue(task.departamentoprediales);

        //Set multiselector
        const produccionanimalOptions = task.produccionanimal.map(nombre => ({
          value: nombre,
          label: nombre,
        }));
        selectedAnimalValue(produccionanimalOptions);
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedData = {
        ...data,
        // produccionanimal: selectedAnimalValue.map(option => option.value),
        tieneintegrantes: data.tieneintegrantes === "SI" ? "SI" : "NO",
        convive: data.convive === "SI" ? "SI" : "NO",
        pueblosoriginariosfamiliar:
          data.pueblosoriginariosfamiliar === "SI" ? "SI" : "NO",
        domiciliofamiliar: data.domiciliofamiliar === "SI" ? "SI" : "NO",
        propiedadproductiva: data.propiedadproductiva === "SI" ? "SI" : "NO",
        produccionagroecologica:
          data.produccionagroecologica === "SI" ? "SI" : "NO",
        produccionconvencional:
          data.produccionconvencional === "SI" ? "SI" : "NO",
        accesoagua: data.accesoagua === "SI" ? "SI" : "NO",
        maquinariaproductiva: data.maquinariaproductiva === "SI" ? "SI" : "NO",
        monotributistamonotributista:
          data.monotributista === "SI" ? "SI" : "NO",
        excedenteproduccion: data.excedenteproduccion === "SI" ? "SI" : "NO",
        pedido: data.pedido === "SI" ? "SI" : "NO",
        compraproduccion: data.compraproduccion === "SI" ? "SI" : "NO",
        agregadovalor: data.agregadovalor === "SI" ? "SI" : "NO",
        equipamento: data.equipamento === "SI" ? "SI" : "NO",
        difusion: data.difusion === "SI" ? "SI" : "NO",

        
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

  //Seleccionadores

  const handleMunicipioFamiliarChange = (event) => {
    setSelectedMunicipioFamiliarValue(event.target.value);
  };

  const handleMunicipioPredialesChange = (event) => {
    setSelectedMunicipioPredialesValue(event.target.value);
  };

  const handleDepartamentoFamiliarChange = (event) => {
    setSelectedDepartamentoFamiliarValue(event.target.value);
  };

  const handleDepartamentoPredialesChange = (event) => {
    setSelectedDepartamentoPredialesValue(event.target.value);
  };

  const handleProduccionAnimalChange = (selectedOptions) => {
    setSelectedAnimalValue(selectedOptions);
  };

  const handleGeneroChange = (event, selectId) => {
    const value = event.target.value;
    if (selectId === "genero1") {
      setSelectedGenero1(value);
      setSelectedGeneroValue1(value);
    } else if (selectId === "genero2") {
      setSelectedGenero2(value);
      setSelectedGeneroValue2(value);
    }
  };

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
              htmlFor="genero1"
              className="block text-sm font-medium text-black"
            >
              Género
            </label>
            <select
              {...register("genero1", { required: true })}
              value={selectedGeneroValue1}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              onChange={(event) => handleGeneroChange(event, "genero1")}
            >
              <option value="">Selecciona un género</option>
              {Generos.map((genero) => (
                <option key={genero.id} value={genero.nombre}>
                  {genero.nombre}
                </option>
              ))}
            </select>
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
                htmlFor="genero2"
                className="block text-sm font-medium text-black"
              >
                Género
              </label>
              <select
                {...register("genero2", { required: true })}
                value={selectedGeneroValue2}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                onChange={(event) => handleGeneroChange(event, "genero2")}
              >
                <option value="">Selecciona un género</option>
                {Generos.map((genero) => (
                  <option key={genero.id} value={genero.nombre}>
                    {genero.nombre}
                  </option>
                ))}
              </select>
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
                {selectedCondicionIntegrantes === "SI" && ( //Borrar esto para la condicion
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
            <div>
              <label
                htmlFor="pueblosoriginariosfamiliar"
                className="block text-sm font-medium text-black"
              >
                ¿Pertenece a alguna comunidad de Pueblos Originarios?
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
                    checked={selectedPueblosOriginarios === "SI"}
                    {...register("pueblosoriginariosfamiliar")}
                    onChange={() => setSelectedPueblosOriginario("SI")}
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
                    checked={selectedPueblosOriginarios === "NO"}
                    {...register("pueblosoriginariosfamiliar")}
                    onChange={() => setSelectedPueblosOriginario("NO")}
                    className="form-radio h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 text-black">NO</span>
                </label>
              </div>
              {selectedPueblosOriginarios === "SI" && (
                <>
                  <label
                    htmlFor="cualpueblosoriginariosfamiliar"
                    className="block text-sm font-medium text-black"
                  >
                    ¿Cuál?
                  </label>
                  <input
                    type="text"
                    {...register("cualpueblosoriginariosfamiliar")}
                    className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                    placeholder="¿Cuál?"
                  />
                </>
              )}
            </div>
            <label
              htmlFor="domiciliofamiliar"
              className="block text-sm font-medium text-black"
            >
              <span className="subtitle">Docimicilio Familiar :</span>
            </label>
            <label
              htmlFor="domiciliofamiliar"
              className="block text-sm font-medium text-black"
            >
              ¿Vive donde produce? :
            </label>
            <div>
              <label
                htmlFor="produce_si"
                className="inline-flex items-center mt-3"
              >
                <input
                  type="radio"
                  name="produce"
                  value="SI"
                  checked={selectedDomicilioFamiliar === "SI"}
                  {...register("domiciliofamiliar")}
                  onChange={() => setSelectedDomicilioFamiliar("SI")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">SI</span>
              </label>
              <label
                htmlFor="produce_no"
                className="inline-flex items-center mt-3 ml-6"
              >
                <input
                  type="radio"
                  name="produce"
                  value="NO"
                  checked={selectedDomicilioFamiliar === "NO"}
                  {...register("domiciliofamiliar")}
                  onChange={() => setSelectedDomicilioFamiliar("NO")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">NO</span>
              </label>
            </div>
            {selectedDomicilioFamiliar === "SI" && (
              <>
            <label
              htmlFor="lotefamiliar"
              className="block text-sm font-medium text-black"
            >
              Lote
            </label>
            <input
              type="text"
              {...register("lotefamiliar")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Lote"
            />
            <label
              htmlFor="parcelafamiliar"
              className="block text-sm font-medium text-black"
            >
              Parcela
            </label>
            <input
              type="text"
              {...register("parcelafamiliar")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Parcela"
            />
            <label
              htmlFor="seccionfamiliar"
              className="block text-sm font-medium text-black"
            >
              Sección
            </label>
            <input
              type="text"
              {...register("seccionfamiliar")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Sección"
            />
            <label
              htmlFor="partidafamiliar"
              className="block text-sm font-medium text-black"
            >
              Partida Inm. N°
            </label>
            <input
              type="text"
              {...register("partidafamiliar")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Partida Inm. N°"
            />
            <label
              htmlFor="coloniaparajefamiliar"
              className="block text-sm font-medium text-black"
            >
              Colonia/Paraje
            </label>
            <input
              type="text"
              {...register("coloniaparajefamiliar")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Colonia/Paraje"
            />
            <label
              htmlFor="municipio"
              className="block text-sm font-medium text-black"
            >
              Municipio
            </label>
            <select
              {...register("municipiofamiliar", { required: true })}
              value={selectedMunicipioFamiliarValue}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              onChange={handleMunicipioFamiliarChange}
            >
              <option value="">Selecciona un municipio</option>
              {Municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.nombre}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
            <label
              htmlFor="departamento"
              className="block text-sm font-medium text-black"
            >
              Departamento
            </label>
            <select
              {...register("departamentofamiliar", { required: true })}
              value={selectedDepartamentoFamiliares}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              onChange={handleDepartamentoFamiliarChange}
            >
              <option value="">Selecciona un departamento</option>
              {Departamentos.map((departamento) => (
                <option key={departamento.id} value={departamento.nombre}>
                  {departamento.nombre}
                </option>
              ))}
            </select>
            </>
)}
            {selectedDomicilioFamiliar === "NO" && (
              <>
            <label
              htmlFor="loteprediales"
              className="block text-sm font-medium text-black"
            >
              
              Lote
            </label>
            <input
              type="text"
              {...register("loteprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Lote"
            />
            <label
              htmlFor="parcelaprediales"
              className="block text-sm font-medium text-black"
            >
              Parcela
            </label>
            <input
              type="text"
              {...register("parcelaprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Parcela"
            />
            <label
              htmlFor="seccionfamiliar"
              className="block text-sm font-medium text-black"
            >
              Sección
            </label>
            <input
              type="text"
              {...register("seccionprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Sección"
            />
            <label
              htmlFor="partidaprediales"
              className="block text-sm font-medium text-black"
            >
              Partida Inm. N°
            </label>
            <input
              type="text"
              {...register("partidaprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Partida Inm. N°"
            />
            <label
              htmlFor="coloniaprediales"
              className="block text-sm font-medium text-black"
            >
              Colonia/Paraje
            </label>
            <input
              type="text"
              {...register("coloniaprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Colonia/Paraje"
            />
            <label
              htmlFor="municipio"
              className="block text-sm font-medium text-black"
            >
              Municipio
            </label>
            <select
              {...register("municipioprediales", { required: true })}
              value={selectedMunicipioPredialesValue}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              onChange={handleMunicipioPredialesChange}
            >
              <option value="">Selecciona un municipio</option>
              {Municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.nombre}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
            <label
              htmlFor="departamentoprediales"
              className="block text-sm font-medium text-black"
            >
              Departamento
            </label>
            <select
              {...register("departamentoprediales", { required: true })}
              value={selectedDepartamentoPrediales}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              onChange={handleDepartamentoPredialesChange}
            >
              <option value="">Selecciona un departamento</option>
              {Departamentos.map((departamento) => (
                <option key={departamento.id} value={departamento.nombre}>
                  {departamento.nombre}
                </option>
              ))}
            </select>
            </>
            )}
           
            
            <label
              htmlFor="propiedadproductiva"
              className="block text-sm font-medium text-black"
            >
              ¿Tiene titulo de Propiedad Productiva?
            </label>
            <div>
              <label
                htmlFor="productiva_si"
                className="inline-flex items-center mt-3"
              >
                <input
                  type="radio"
                  name="productiva"
                  value="SI"
                  checked={selectedPropiedadProductiva === "SI"}
                  {...register("propiedadproductiva")}
                  onChange={() => setSelectedPropiedadProductiva("SI")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">SI</span>
              </label>
              <label
                htmlFor="productiva_no"
                className="inline-flex items-center mt-3 ml-6"
              >
                <input
                  type="radio"
                  name="productiva"
                  value="NO"
                  checked={selectedPropiedadProductiva === "NO"}
                  {...register("propiedadproductiva")}
                  onChange={() => setSelectedPropiedadProductiva("NO")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">NO</span>
              </label>
            </div>
            {selectedPropiedadProductiva === "NO" && (
            <>
            <label
              htmlFor="propietarioprediales"
              className="block text-sm font-medium text-black"
            >
              Propietario
            </label>
            <input
              type="text"
              {...register("propietarioprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Propietario"
            />
            <label
              htmlFor="condominioprediales"
              className="block text-sm font-medium text-black"
            >
              Condominio
            </label>
            <input
              type="text"
              {...register("condominioprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Condominio"
            />
            <label
              htmlFor="arrendatarioprediales"
              className="block text-sm font-medium text-black"
            >
              Arredatario
            </label>
            <input
              type="text"
              {...register("arrendatarioprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Arredatario"
            />
            <label
              htmlFor="ocupanteprediales"
              className="block text-sm font-medium text-black"
            >
              Ocupante
            </label>
            <input
              type="text"
              {...register("ocupanteprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Ocupante"
            />

            </>
            )}
            <label
              htmlFor="superficietotalprediales"
              className="block text-sm font-medium text-black"
            >
              Superficie Total
            </label>
            <input
              type="text"
              {...register("superficietotalprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Superficie Total"
            />
            <label
              htmlFor="coloniaprediales"
              className="block text-sm font-medium text-black"
            >
              Sup.Agric
            </label>
            <input
              type="text"
              {...register("supagricprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Sup.Agric"
            />
            <label
              htmlFor="supgandprediales"
              className="block text-sm font-medium text-black"
            >
              Sup.Ganad
            </label>
            <input
              type="text"
              {...register("supgandprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Sup.Ganad"
            />
            <label
              htmlFor="monteprediales"
              className="block text-sm font-medium text-black"
            >
              Monte
            </label>
            <input
              type="text"
              {...register("monteprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Monte"
            />
            <label
              htmlFor="suppiscicolaprediales"
              className="block text-sm font-medium text-black"
            >
              Sup.Piscícola
            </label>
            <input
              type="text"
              {...register("suppiscicolaprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Sup.Piscícola"
            />
            <label
              htmlFor="supapicolaprediales"
              className="block text-sm font-medium text-black"
            >
              Sup.Apícola
            </label>
            <input
              type="text"
              {...register("supapicolaprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Sup.Apícola"
            />
            <label
              htmlFor="supactindustrialprediales"
              className="block text-sm font-medium text-black"
            >
              Sup.Act.Industrial
            </label>
            <input
              type="text"
              {...register("supactindustrialprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Sup.Act.Industrial"
            />
            <label
              htmlFor="sinusoprediales"
              className="block text-sm font-medium text-black"
            >
              Sin Uso
            </label>
            <input
              type="text"
              {...register("sinusoprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Sin Uso"
            />
            <label
              htmlFor="otrosprediales"
              className="block text-sm font-medium text-black"
            >
              Otros
            </label>
            <input
              type="text"
              {...register("otrosprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Otros"
            />
            <label
              htmlFor="coloniaprediales"
              className="block text-sm font-medium text-black"
            >
              Punto GPS
            </label>
            <input
              type="text"
              {...register("puntosgpsprediales")}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
              placeholder="Punto GPS"
            />

            <label
              htmlFor="coloniaprediales"
              className="block text-sm font-medium text-black"
            >
              ¿Tiene Producción Convencional?
            </label>
            <div>
              <label
                htmlFor="ProduccionConvencional"
                className="inline-flex items-center mt-3"
              >
                <input
                  type="radio"
                  name="ProduccionConvencional"
                  value="SI"
                  checked={selectedProduccionConvencional === "SI"}
                  {...register("produccionconvencional")}
                  onChange={() => setSelectedProduccionConvencional("SI")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">SI</span>
              </label>
              <label
                htmlFor="ProduccionConvencional"
                className="inline-flex items-center mt-3 ml-6"
              >
                <input
                  type="radio"
                  name="ProduccionConvencional"
                  value="NO"
                  checked={selectedProduccionConvencional === "NO"}
                  {...register("produccionconvencional")}
                  onChange={() => setSelectedProduccionConvencional("NO")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">NO</span>
              </label>
            </div>
{/* 
            <label
              htmlFor="señale cuales"
              className="block text-sm font-medium text-black"
            >
              Señale Cuales
            </label> */}
            {/* <label
              htmlFor="produccionanimal"
              className="block text-sm font-medium text-black"
            >
              Producción Animal
            </label>
            <Select
              options={Animal.map(produccionanimal => ({
                value: produccionanimal.nombre,
                label: produccionanimal.nombre,
              }))}
              isMulti
              value={selectedAnimalValue}
              onChange={handleProduccionAnimalChange}
              placeholder="Seleccione la producción animal"
            /> */}
            <label
              htmlFor="coloniaprediales"
              className="block text-sm font-medium text-black"
            >
              ¿Vende lo que produce?
            </label>
            <div>
              <label
                htmlFor="vendecomercializacion"
                className="inline-flex items-center mt-3"
              >
                <input
                  type="radio"
                  name="vendecomercializacion"
                  value="SI"
                  checked={selectedVendeComercializacion === "SI"}
                  {...register("vendecomercializacion")}
                  onChange={() => setSelectedVendeComercializacion("SI")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">SI</span>
              </label>
              <label
                htmlFor="vendecomercializacion"
                className="inline-flex items-center mt-3 ml-6"
              >
                <input
                  type="radio"
                  name="vendecomercializacion"
                  value="NO"
                  checked={selectedVendeComercializacion === "NO"}
                  {...register("vendecomercializacion")}
                  onChange={() => setSelectedVendeComercializacion("NO")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">NO</span>
              </label>
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
