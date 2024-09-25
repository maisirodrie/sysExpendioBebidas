import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faEdit,
  faEye,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "./Table.css";
import Paginator from "./Paginator";
import Swal from 'sweetalert2';

function Table() {
  const { tasks, deleteTask } = useTasks();
  const { user } = useAuth(); // Suponiendo que 'user' contiene el rol del usuario
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  async function handleDelete(id) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar este archivo?',
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
      showDenyButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteTask(id); // Asegúrate de que `deleteTask` es la función correcta
        Swal.fire({ title: "Éxito", text: "Archivo eliminado correctamente", icon: "success", timer: 3500 });
      }
    });
  }

  const searcher = (e) => {
    setSearch(e.target.value);
  };

// Invertir el orden de las tareas al inicio
const reversedTasks = [...tasks].reverse(); // Crea una copia de tasks y la invierte

const filteredTasks = !search
  ? reversedTasks // Usa las tareas invertidas directamente si no hay búsqueda
  : reversedTasks.filter((task) => {
      const expe = task.expe ? task.expe.toLowerCase() : "";
      const correlativo = task.correlativo ? task.correlativo.toLowerCase() : "";
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

// Calcular los índices para la paginación
const indexOfLastTask = currentPage * tasksPerPage;
const indexOfFirstTask = indexOfLastTask - tasksPerPage;

// Slicing para obtener las tareas actuales
const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const utcDate = new Date(dateStr);
    const offset = 3 * 60;
    const localDate = new Date(utcDate.getTime() + offset * 60 * 1000);
    const day = String(localDate.getUTCDate()).padStart(2, '0');
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const year = localDate.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  const canView = ['admin', 'user', 'boss', 'viewer'].includes(user.role);
  const canEdit = ['admin', 'user'].includes(user.role);
  const canDelete = user.role === 'admin';
  const canAddTask = !['boss', 'viewer'].includes(user.role);

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
              <span className="input-group-text bg-white border-none" id="search-icon">
                <FontAwesomeIcon icon={faSearch} className="ml-2" />
              </span>
            </div>
            {canAddTask && (
              <ul className="button-container">
                <li>
                  <Link to="/add-task" className="btn btn-success">
                    <FontAwesomeIcon icon={faPlus} />
                  </Link>
                </li>
              </ul>
            )}
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
                    {canEdit && <th>Editar</th>}
                    {canDelete && <th>Borrar</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => (
                    <tr key={task._id}>
                      <td data-label="Codigo de Organismo">{task.expe ? task.expe.toUpperCase() : ""}</td>
                      <td data-label="N° Correlativo">{task.correlativo ? task.correlativo.toUpperCase() : ""}</td>
                      <td data-label="Año">{task.anio ? task.anio.toUpperCase() : ""}</td>
                      <td data-label="Cuerpo">{task.cuerpo ? task.cuerpo.toUpperCase() : ""}</td>
                      <td data-label="Fecha">{formatDate(task.fecha)}</td>
                      <td data-label="Iniciador">{task.iniciador ? task.iniciador.toUpperCase() : ""}</td>
                      <td data-label="Asunto">{task.asunto ? task.asunto.toUpperCase() : ""}</td>
                      <td data-label="Ver">
                        <div className="button-container">
                          <Link className="btn btn-success" to={`/view/task/${task._id}`}>
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        </div>
                      </td>
                      {canEdit && (
                        <td data-label="Editar">
                          <div className="button-container">
                            <Link className="btn btn-primary" to={`/edit-task/${task._id}`}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                          </div>
                        </td>
                      )}
                      {canDelete && (
                        <td data-label="Borrar">
                          <div className="button-container">
                            <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </div>
                        </td>
                      )}
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

