import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faEye,
  faFileCirclePlus,
  faSearch,
  faUserPlus,
  faRotate,
  faCircle,
  faCoins,
  faDollar,
} from "@fortawesome/free-solid-svg-icons";
import "./Table.css";
import Paginator from "./Paginator";
import Swal from "sweetalert2";

function Table() {
  const { tasks, deleteTask, getTasks, updateTaskStatus } = useTasks();
  const { user } = useAuth(); // Suponiendo que 'user' contiene el rol del usuario
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  async function handleDelete(id) {
    Swal.fire({
      title: "¿Está seguro que desea eliminar este archivo?",
      confirmButtonText: "Eliminar",
      denyButtonText: "Cancelar",
      showDenyButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteTask(id);
        Swal.fire({
          title: "Éxito",
          text: "Archivo eliminado correctamente",
          icon: "success",
          timer: 3500,
        });
      }
    });
  }

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  const reversedTasks = [...tasks].reverse();

  const filteredTasks = !search
    ? reversedTasks
    : reversedTasks.filter((task) => {
        const apellido = task.apellido ? task.apellido.toLowerCase() : "";
        const nombre = task.nombre ? task.nombre.toLowerCase() : "";
        const dni = task.dni ? task.dni.toLowerCase() : "";
        const localidad = task.localidad ? task.localidad.toLowerCase() : "";
        const persona = task.persona ? task.persona.toLowerCase() : "";
        const expendio = task.expendio ? task.expendio.toLowerCase() : "";
        const estado = task.estado ? task.estado.toLowerCase() : "";
        const searchLowerCase = search.toLowerCase();

        return (
          apellido.includes(searchLowerCase) ||
          nombre.includes(searchLowerCase) ||
          dni.includes(searchLowerCase) ||
          localidad.includes(searchLowerCase) ||
          persona.includes(searchLowerCase) ||
          expendio.includes(searchLowerCase) ||
          estado.includes(searchLowerCase)
        );
      });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const utcDate = new Date(dateStr);
    const offset = 3 * 60;
    const localDate = new Date(utcDate.getTime() + offset * 60 * 1000);
    const day = String(localDate.getUTCDate()).padStart(2, "0");
    const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
    const year = localDate.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  const permissions = {
    canEdit: ["admin", "editor", "mesa"].includes(user.role),
    canDelete: ["admin", "editor"].includes(user.role),
    canAddUser: ["admin"].includes(user.role),
    canAddTask: ["admin", "editor"].includes(user.role),
    canViewStatus: ["admin", "viewer", "juridicos", "mesa"].includes(user.role),
    canEditStatus: ["mesa", "juridicos","admin"].includes(user.role),
    canPagoEditStatus: ["admin"].includes(user.role),
  };

  const handleRefresh = async () => await getTasks();

  const statusOptions = {
    mesa: {
      ingresado: ["ingresado", "pendiente", "controlado"],
      pendiente: ["pendiente", "controlado"],
      aprobado: ["aprobado", "finalizado"],
      rechazado: ["rechazado", "finalizado"]
    },
    juridicos: {
      controlado: ["controlado", "aprobado", "rechazado"]
    },
    admin: {
      any: ["pendiente", "controlado", "aprobado", "rechazado", "finalizado", "ingresado"] // Admin puede cambiar cualquier estado
    }
  };
  
  const getStatusOptions = (task) => {
    const roleOptions = statusOptions[user.role] || {}; // Obtener opciones según el rol
    const availableOptions = roleOptions[task.estado] || roleOptions.any || []; // Si no tiene opciones específicas, tomar "any"
    return availableOptions.length ? availableOptions : [];
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus);
    Swal.fire("Estado actualizado", "El estado se ha modificado correctamente", "success");
  };

  const getStatusColor = (status) => {
    return {
      ingresado: "gray",
      pendiente: "orange",
      controlado: "blue",
      aprobado: "green",
      rechazado: "red",
      finalizado: "black",
    }[status] || "gray";
  };

  const getStatusIcon = (status) => (
    <FontAwesomeIcon
      icon={faCircle}
      style={{ color: getStatusColor(status), fontSize: "10px" }}
    />
  );


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
              <li className="d-flex gap-2">
                {permissions.canAddTask && (
                  <Link to="/add-task" className="btn btn-success">
                    <FontAwesomeIcon icon={faFileCirclePlus} />
                  </Link>
                )}
                {permissions.canAddUser && (
                  <Link to="/registeradmin" className="btn btn-success">
                    <FontAwesomeIcon icon={faUserPlus} />
                  </Link>
                )}
                <button onClick={handleRefresh} className="btn btn-success">
                  <FontAwesomeIcon icon={faRotate} />
                </button>
                {permissions.canPagoEditStatus && (
                <Link to="/pago" className="btn btn-success">
                    <FontAwesomeIcon icon={faDollar} />
                  </Link>
               )}
              </li>
            </ul>

            <br />
            <div className="table-scroll">
              <table className="table" style={{ textTransform: "uppercase" }}>
                <thead>
                  <tr>
                    <th colSpan="10" className="table-title">Listado de Archivos</th>
                  </tr>
                  <tr>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Localidad</th>
                    <th>Tipo de Persona</th>
                    <th>Tipo de Expendio</th>
                    <th>Estado</th>
                    <th>Ver</th>
                    {permissions.canEdit && <th>Editar</th>}
                    {permissions.canDelete && <th>Borrar</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.apellido?.toUpperCase()}</td>
                      <td>{task.nombre?.toUpperCase()}</td>
                      <td>{task.dni?.toUpperCase()}</td>
                      <td>{task.localidad?.toUpperCase()}</td>
                      <td>{task.persona?.toUpperCase()}</td>
                      <td>{task.expendio?.toUpperCase()}</td>
                      {permissions.canViewStatus && (
                        <td>
                           {permissions.canEditStatus && getStatusOptions(task).length > 0 ? (
                            <select
                              value={task.estado || "ingresado"}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              style={{ color: getStatusColor(task.estado) }}
                            >
                              {getStatusOptions(task).map((state) => (
                                <option key={state} value={state} style={{ color: getStatusColor(state) }}>
                                  {state.charAt(0).toUpperCase() + state.slice(1)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span style={{ color: getStatusColor(task.estado) }}>
                              {task.estado?.charAt(0).toUpperCase() + task.estado?.slice(1)} {getStatusIcon(task.estado)}
                            </span>
                          )}
                        </td>
                      )}
                      <td>
                        <Link className="btn btn-success" to={`/view/task/${task._id}`}>
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>
                      {permissions.canEdit && (
                        <td>
                          <Link className="btn btn-primary" to={`/edit-task/${task._id}`}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                        </td>
                      )}
                      {permissions.canDelete && (
                        <td>
                          <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
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
