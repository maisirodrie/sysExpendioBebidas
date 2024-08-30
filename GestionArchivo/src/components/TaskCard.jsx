import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faEye,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "./Table.css";
import Paginator from "./Paginator";

function Table() {
  const { tasks, deleteTask } = useTasks();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const handleDelete = (id) => {
    deleteTask(id);
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  const filteredTasks = !search
    ? tasks
    : tasks.filter((task) => {
        const expe = task.expe ? task.expe.toLowerCase() : "";
        const correlativo = task.correlativo
          ? task.correlativo.toLowerCase()
          : "";
        const anio = task.anio ? task.anio.toLowerCase() : "";
        const cuerpo = task.cuerpo ? task.cuerpo.toLowerCase() : "";
        const fecha = task.fecha ? task.fecha.toLowerCase() : "";
        const iniciador = task.iniciador ? task.iniciador.toLowerCase() : "";
        const asunto = task.asunto ? task.asunto.toLowerCase() : "";
        const searchLowerCase = search.toLowerCase();

        return (
          expe.includes(searchLowerCase) ||
          correlativo.includes(searchLowerCase) ||
          anio.includes(searchLowerCase) ||
          cuerpo.includes(searchLowerCase) ||
          fecha.includes(searchLowerCase) ||
          iniciador.includes(searchLowerCase) ||
          asunto.includes(searchLowerCase)
        );
      });

  // Paginación
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    
    // Crear un objeto Date en UTC
    const utcDate = new Date(dateStr);
    
    // Obtener el desfase horario de la zona de Buenos Aires en minutos
    const offset = 3 * 60; // -3 horas en minutos
    
    // Crear una nueva fecha en la zona horaria local
    const localDate = new Date(utcDate.getTime() + offset * 60 * 1000);
    
    // Obtener el día, mes y año en la zona horaria local
    const day = String(localDate.getUTCDate()).padStart(2, '0');
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
    const year = localDate.getUTCFullYear();
    
    // Formatear la fecha en 'dd/MM/yyyy'
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container-fluid bg-primary vh-100 vw-100 d-flex align-items-center justify-content-center">
      <div className="row">
        <div className="col-md-12">
          <div className="table-container">
            <div className="table-title">Buscador</div>
            <div className="input-group mb-3">
              <input
                value={search}
                onChange={searcher}
                type="text"
                placeholder="Buscar"
                className="form-control border border-gray-300 focus:outline-none"
                aria-describedby="search-icon"
              />
              <span
                className="input-group-text bg-white border-none"
                id="search-icon"
              >
                <FontAwesomeIcon icon={faSearch} className="ml-2" />
              </span>
            </div>
            <ul className="button-container">
              <li>
                <Link to="/add-task" className="btn btn-success">
                  <FontAwesomeIcon icon={faPlus} />
                </Link>
              </li>
            </ul>
            <br />
            <div className="table-scroll">
              <table className="table" style={{ textTransform: "uppercase" }}>
                <thead>
                  <tr>
                    <th colSpan="13" className="table-title">
                      Listado de Archivos
                    </th>
                  </tr>
                  <tr>
                    <th>Codigo de Organismo</th>
                    <th>N° Correlativo</th>
                    <th>Año</th>
                    <th>Cuerpo</th>
                    <th>Fecha</th>
                    <th>Iniciador</th>
                    <th>Asunto</th>
                    <th>Ver</th>
                    <th>Editar</th>
                    <th>Borrar</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.expe ? task.expe.toUpperCase() : ""}</td>
                      <td>
                        {task.correlativo ? task.correlativo.toUpperCase() : ""}
                      </td>
                      <td>{task.anio ? task.anio.toUpperCase() : ""}</td>
                      <td>{task.cuerpo ? task.cuerpo.toUpperCase() : ""}</td>
                      <td>
                        {formatDate(task.fecha)}
                      </td>
                      <td>
                        {task.iniciador ? task.iniciador.toUpperCase() : ""}
                      </td>
                      <td>{task.asunto ? task.asunto.toUpperCase() : ""}</td>

                      <td>
                        <div className="button-container">
                          <Link
                            className="btn btn-success"
                            to={`/view/task/${task._id}`}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="button-container">
                          <Link
                            className="btn btn-primary"
                            to={`/edit-task/${task._id}`}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="button-container">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(task._id)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Paginator
            currentPage={currentPage}
            totalPages={Math.ceil(filteredTasks.length / tasksPerPage)}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
