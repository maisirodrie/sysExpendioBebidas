import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import { useTasks } from "../context/TasksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function TaskViewPage() {
  const { getTask } = useTasks();
  const params = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const fetchedTask = await getTask(params.id);
        setTask(fetchedTask);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    }
    fetchTask();
  }, [getTask, params.id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) {
        return "Fecha no válida"; // Return a fallback message for invalid dates
      }
      // Obtener la fecha local
      const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      // Formatear la fecha local
      return format(localDate, "dd/MM/yyyy", { locale: esLocale });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha no válida"; // Return a fallback message in case of an error
    }
  };

  return (
    <div className="flex items-center justify-center overflow-y-auto my-10">
      <div className="bg-gray-200 max-w-md w-full p-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">
            Detalles del Registro
          </h1>
          <Link to="/task" className="btn btn-success">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <div className="text-black">
          {task && (
            <>
              <p className="my-4">
                <strong>Datos del Encuestador</strong>
              </p>
              <p className="my-4">Apellido : {task.apellidoenc}</p>
              <p className="my-4">
                <>Nombre : </> {task.nombreenc}
              </p>
              <p className="my-4">
                <>Organismo/Área Institucional : </> {task.organismoenc}
              </p>
              <p className="my-4">
                <>Celular : </> {task.celularen}
              </p>
              <p className="my-4">
                <>Correo : </> {task.correoen}
              </p>
              <p className="my-4">
                <strong>
                  Datos personales de las y los responsables de la unidad
                  productiva
                </strong>
              </p>
              <p className="my-4">
                <>Apellido : </> {task.apellidoresp1}
              </p>
              <p className="my-4">
                <>Nombre : </> {task.nombreresp1}
              </p>
              <p className="my-4">
                <>DNI : </> {task.dniresp1}
              </p>
              <p className="my-4">
                <>Género : </> {task.genero1}
              </p>
              <p className="my-4">
                <>CUIT-CUIL : </> {task.cuitresp1}
              </p>
              <p className="my-4">
                <>Celular : </> {task.celularresp1}
              </p>
              <p className="my-4">
                <>Correo : </> {task.correoresp1}
              </p>
              <p className="my-4">
                <>Estudios alcanzados : </> {task.estudiosresp1}
              </p>
              <p className="my-4">
                <>Apellido : </> {task.apellidoresp2}
              </p>
              <p className="my-4">
                <>Nombre : </> {task.nombreresp2}
              </p>
              <p className="my-4">
                <>DNI :</> {task.dniresp2}
              </p>
              <p className="my-4">
                <>Género : </> {task.genero2}
              </p>
              <p className="my-4">
                <>CUIT-CUIL : </> {task.cuitresp2}
              </p>
              <p className="my-4">
                <>Celular : </> {task.celularresp2}
              </p>
              <p className="my-4">
                <>Correo : </> {task.correoresp2}
              </p>
              <p className="my-4">
                <>Estudios alcanzados : </> {task.estudiosresp2}
              </p>

              <p className="my-4">
                <strong>Datos del grupo familiar</strong>
              </p>
              <p className="my-4">
                <>
                  ¿Hay más <strong>integrantes trabajando</strong> en la Unidad
                  Productiva? :{" "}
                </>{" "}
                {task.tieneintegrantes}
              </p>
              {task.tieneintegrantes === "SI" && (
                <>
                  <p className="my-4">
                    <strong>¿Cuantos integrantes?: </strong>
                    {task.cuantosintegrantes}{" "}
                  </p>
                  <p className="my-4">
                    <strong>Cantidad de Hijos: </strong>
                    {task.cantidadhijosgrupo}{" "}
                  </p>
                  <p className="my-4">
                    <strong>¿Convive la Familia en el mismo hogar? : </strong>
                    {task.convive}
                  </p>
                  {task.convive === "SI" && (
                    <>
                      <p className="my-4">
                        <strong>¿Cuantos hijos asisten a la escuela?: </strong>
                        {task.hijosasisten}
                      </p>
                      <p className="my-4">
                        <strong>Nivel Inicial: </strong>
                        {task.nivelinicialfamiliar}
                      </p>
                      <p className="my-4">
                        <strong>Primaria: </strong>
                        {task.primariafamiliar}
                      </p>
                      <p className="my-4">
                        <strong>Secundaria: </strong>
                        {task.secundariafamiliar}
                      </p>
                      <p className="my-4">
                        <strong>Terciaria o Superior: </strong>
                        {task.terciariaosuperiorfamiliar}
                      </p>
                    </>
                  )}
                </>
              )}
              <p className="my-4">
                <strong>
                  ¿Pertenece a alguna comunidad de Pueblos Originarios?:{" "}
                </strong>
                {task.pueblosoriginariosfamiliar}
              </p>
              {task.pueblosoriginariosfamiliar === "SI" && (
                <p className="my-4">
                  <strong>¿Cuál?: </strong>
                  {task.cualpueblosoriginariosfamiliar}
                </p>
              )}
              <p className="my-4">
                <strong>Docimicilio Familiar : </strong>
              </p>
              <p className="my-4">
                <>¿Vive donde produce? : </>
                {task.domiciliofamiliar}
              </p>
              <p className="my-4">
                <>Lote : </>
                {task.lotefamiliar}
              </p>
              <p className="my-4">
                <>Parcela : </>
                {task.parcelafamiliar}
              </p>
              <p className="my-4">
                <>Sección : </>
                {task.seccionfamiliar}
              </p>
              <p className="my-4">
                <>Partida Inm. N° : </>
                {task.partidafamiliar}
              </p>
              <p className="my-4">
                <>Colonia/Pasaje : </>
                {task.coloniaparajefamiliar}
              </p>
              <p className="my-4">
                <>Municipio : </>
                {task.municipiofamiliar}
              </p>
              <p className="my-4">
                <>Departamento : </>
                {task.departamentofamiliar}
              </p>

              <p className="my-4">
                <strong>Datos Prediales De La Unidad Productiva </strong>
              </p>
              <p className="my-4">
                <>Lote : </>
                {task.loteprediales}
              </p>
              <p className="my-4">
                <>Parcela : </>
                {task.parcelaprediales}
              </p>
              <p className="my-4">
                <>Sección : </>
                {task.seccionprediales}
              </p>
              <p className="my-4">
                <>Partida Inm. N° : </>
                {task.partidaprediales}
              </p>
              <p className="my-4">
                <>Colonia/Pasaje : </>
                {task.coloniaprediales}
              </p>
              <p className="my-4">
                <>Municipio : </>
                {task.municipioprediales}
              </p>
              <p className="my-4">
                <>Departamento : </>
                {task.departamentoprediales}
              </p>
              <p className="my-4">
                <>Propietario : </>
                {task.propietarioprediales}
              </p>
              <p className="my-4">
                <>Condominio : </>
                {task.condominioprediales}
              </p>
              <p className="my-4">
                <>Arredatario : </>
                {task.arrendatarioprediales}
              </p>
              <p className="my-4">
                <>Ocupante : </>
                {task.ocupanteprediales}
              </p>
              <p className="my-4">
                <>Superficie Total : </>
                {task.superficietotalprediales}
              </p>
              <p className="my-4">
                <>Supe.Agric : </>
                {task.supagricprediales}
              </p>
              <p className="my-4">
                <>Sup.Ganad : </>
                {task.supgandprediales}
              </p>
              <p className="my-4">
                <>Monte : </>
                {task.monteprediales}
              </p>
              <p className="my-4">
                <>Sup.Piscícola : </>
                {task.supapicolaprediales}
              </p>
              <p className="my-4">
                <>Sup.Apicola : </>
                {task.suppiscicolaprediales}
              </p>
              <p className="my-4">
                <>Sup.Act.Industrial : </>
                {task.supactindustrialprediales}
              </p>
              <p className="my-4">
                <>Sin uso : </>
                {task.sinusoprediales}
              </p>
              <p className="my-4">
                <>Otros : </>
                {task.otrosprediales}
              </p>
              <p className="my-4">
                <>Punto GPS : </>
                {task.puntosgpsprediales}
              </p>

              <p className="my-4">
                <strong>Perfil Porductivo </strong>
              </p>
              <p className="my-4">
                <>¿Realiza Producción Agroecológica? : </>
                {task.produccionagroecologica}
              </p>
              <p className="my-4">
                <>Cuales : </>
              </p>

              <p className="my-4">
                <>¿Tiene Producción Convencional? : </>
                {task.produccionconvencional}
              </p>
              <p className="my-4">
                <>Producción Animal: </>
              </p>
              <ul>
                {task &&
                  task.produccionanimal.map((animal, index) => (
                    <li key={index}>{animal}</li>
                  ))}
              </ul>

              <p className="my-4">
                <>Producción Vegetal: </>
              </p>
              <ul>
                {task &&
                  task.produccionvegetal.map((vegetal, index) => (
                    <li key={index}>{vegetal}</li>
                  ))}
              </ul>
              <p className="my-4">
                <>¿Cuenta con accesso agua? : </>
                {task.accesoagua}
              </p>
              <p className="my-4">
                <>Modalidad : </>
              </p>
              <ul>
                {task &&
                  task.modalidadaccesoagua.map((agua, index) => (
                    <li key={index}>{agua}</li>
                  ))}
              </ul>
              <p className="my-4">
                <>¿Cuenta con infraestructura Productiva? : </>
                {task.infraestructuraproductiva}
              </p>
              <p className="my-4">
                <>Cuales : </>
              </p>
              <ul>
                {task &&
                  task.cualesinfraestructuraproductiva.map((infraestructura, index) => (
                    <li key={index}>{infraestructura}</li>
                  ))}
              </ul>

              <p className="my-4">
                <>¿Cuenta con Maquinaria Productiva? : </>
                {task.maquinariaproductiva}
              </p>
              <p className="my-4">
                <>Cuales : </>
              </p>
              <ul>
                {task &&
                  task.cualesmaquinariaproductiva.map((maquinaria, index) => (
                    <li key={index}>{maquinaria}</li>
                  ))}
              </ul>

              <p className="my-4">
                <>¿Vende lo que produce? : </>
                {task.vendecomercializacion}
              </p>
              <p className="my-4">
                <>Donde : </>
              </p>
              <ul>
                {task &&
                  task.cualesvendecomercializacion.map((vende, index) => (
                    <li key={index}>{vende}</li>
                  ))}
              </ul>

              <p className="my-4">
                <>Feria a la que pertenece : </>
                {task.feriaperteneciente}
              </p>
              <p className="my-4">
                <>Puesto N° : </>
                {task.puesto}
              </p>
              <p className="my-4">
                <>Presenta carnet de manipulación de alimentos : </>
                {task.carnetmanipulacion}
              </p>
              <p className="my-4">
                <>Vigencia : </>
                {task.vigencia}
              </p>
              <p className="my-4">
                <>¿Es Monotributista : </>
                {task.monotributista}
              </p>
              <p className="my-4">
                <>Señale si cuenta las siguietnes situaciones : </>
              </p>
              <p className="my-4">
                <>¿Actualmente cuenta con excedente de producción? : </>
                {task.excedenteproduccion}
              </p>
              <p className="my-4">
                <>¿Realiza su producción solo a pedido? : </>
                {task.pedido}
              </p>
              <p className="my-4">
                <>¿Compra producción para atender la demanda que tiene? : </>
                {task.agregadovalor}
              </p>
              <p className="my-4">
                <>¿Hace Agregado de Valor? : </>
                {task.cualesagregadovalor}
              </p>
              <p className="my-4">
                <>¿Posee Equipamiento? : </>
                {task.equipamento}
              </p>
              <p className="my-4">
                <>Cuales : </>
                {task.cualesequipamento}
              </p>
              <p className="my-4">
                <>¿Realiza Difusión y promoción de sus productos? : </>
                {task.difusion}
              </p>
              <p className="my-4">
                <>Por medio de que canales : </>
                {task.cualesdifusion}
              </p>

              <p className="my-4">
                <strong>Registros Asignados </strong>
              </p>
              <p className="my-4">
                <>Registro Provincial de Productor Feriante N° : </>
                {task.registroprovincial}
              </p>
              <p className="my-4">
                <>Registro de Productor Agroecológico N° : </>
                {task.registroproductor}
              </p>
              <p className="my-4">
                <>Renspa (SENASA) N° : </>
                {task.rensapa}
              </p>
              <p className="my-4">
                <>Carnet Sanitario N° : </>
                {task.carnetsanitario}
              </p>
              <p className="my-4">
                <>Municipio : </>
                {task.municipioasignados}
              </p>
              <p className="my-4">
                <>Renapa N° : </>
                {task.renapa}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskViewPage;
