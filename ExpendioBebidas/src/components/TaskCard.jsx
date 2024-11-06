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

  const canEdit = ["admin", "editor"].includes(user.role);
  const canDelete = ["admin", "editor"].includes(user.role);
  const canAddUser = !["user", "viewer", "editor"].includes(user.role);
  const canAddTask = !["user", "viewer"].includes(user.role);
  const canViewStatus = ["admin", "viewer", "juridicos", "mesa"].includes(
    user.role
  );
  const canEditStatus = ["mesa", "juridicos"].includes(user.role);

  const handleRefresh = async () => {
    await getTasks();
  };

  const getStatusOptions = (task) => {
    const options = [];

    // Opciones para mesa
if (user.role === "mesa") {
  // Si está en "aprobado" o "rechazado", mesa puede cambiar a "finalizado"
  if (task.estado === "aprobado" || task.estado === "rechazado" || task.estado === "finalizado") {
    options.push("aprobado", "finalizado");
  }
  
  // Mesa siempre puede cambiar a "pendiente" desde cualquier estado
  if (task.estado === "controlado" || task.estado === "pendiente") {
    options.push("pendiente", "controlado");
  }
}


    // Opciones para jurídicos
    if (user.role === "juridicos") {
      // Juridicos puede cambiar de "controlado" a "aprobado" o "rechazado"
      options.push("aprobado", "rechazado", "controlado");
    }
    

    return options;
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus); // Llamada a la API para actualizar el estado
    Swal.fire({
      title: "Estado actualizado",
      text: "El estado de la tarea se ha modificado correctamente",
      icon: "success",
      timer: 2000,
    });
  };

  // Función que asigna un color a cada estado
  const getStatusColor = (status) => {
    switch (status) {
      case "ingresado":
        return "black"; // Blanco para Ingresado
      case "pendiente":
        return "orange"; // Naranja para Pendiente
      case "controlado":
        return "blue"; // Azul para Controlado
      case "aprobado":
        return "green"; // Verde para Aprobado
      case "rechazado":
        return "red"; // Rojo para Rechazado
      case "finalizado":
        return "black"; // Negro para Finalizado
      default:
        return "gray"; // Color predeterminado en caso de no encontrar el estado
    }
  };

  // Función que asigna un ícono a cada estado
  const getStatusIcon = (status) => {
    switch (status) {
      case "ingresado":
        return (
          <FontAwesomeIcon
            icon={faCircle}
            style={{ color: "gray", fontSize: "10px" }}
          />
        );
      case "pendiente":
        return (
          <FontAwesomeIcon
            icon={faCircle}
            style={{ color: "orange", fontSize: "10px" }}
          />
        );
      case "controlado":
        return (
          <FontAwesomeIcon
            icon={faCircle}
            style={{ color: "blue", fontSize: "10px" }}
          />
        );
      case "aprobado":
        return (
          <FontAwesomeIcon
            icon={faCircle}
            style={{ color: "green", fontSize: "10px" }}
          />
        );
      case "rechazado":
        return (
          <FontAwesomeIcon
            icon={faCircle}
            style={{ color: "red", fontSize: "10px" }}
          />
        );
      case "finalizado":
        return (
          <FontAwesomeIcon
            icon={faCircle}
            style={{ color: "black", fontSize: "10px" }}
          />
        );
      default:
        return null; // Sin ícono por defecto
    }
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
              <li className="d-flex gap-2">
                {canAddTask && (
                  <Link to="/add-task" className="btn btn-success">
                    <FontAwesomeIcon icon={faFileCirclePlus} />
                  </Link>
                )}
                {canAddUser && (
                  <Link to="/registeradmin" className="btn btn-success">
                    <FontAwesomeIcon icon={faUserPlus} />
                  </Link>
                )}
                <Link onClick={handleRefresh} className="btn btn-success">
                  <FontAwesomeIcon icon={faRotate} />
                </Link>
              </li>
            </ul>

            <br />
            <div className="table-scroll">
              <table className="table" style={{ textTransform: "uppercase" }}>
                <thead>
                  <tr>
                    <th colSpan="10" className="table-title">
                      Listado de Archivos
                    </th>
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
                    {canEdit && <th>Editar</th>}
                    {canDelete && <th>Borrar</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => (
                    <tr key={task._id}>
                      <td data-label="Apellido">
                        {task.apellido ? task.apellido.toUpperCase() : ""}
                      </td>
                      <td data-label="Nombre">
                        {task.nombre ? task.nombre.toUpperCase() : ""}
                      </td>
                      <td data-label="DNI">
                        {task.dni ? task.dni.toUpperCase() : ""}
                      </td>
                      <td data-label="Localidad">
                        {task.localidad ? task.localidad.toUpperCase() : ""}
                      </td>
                      <td data-label="Tipo de Persona">
                        {task.persona ? task.persona.toUpperCase() : ""}
                      </td>
                      <td data-label="Tipo de Expendio">
                        {task.expendio ? task.expendio.toUpperCase() : ""}
                      </td>
                      {canViewStatus && (
                        // Renderizando la tabla o el componente con los estados
                        <td data-label="Estado">
                          {canEditStatus ? (
                            <select
                              value={task.estado || "ingresado"}
                              onChange={(e) =>
                                handleStatusChange(task._id, e.target.value)
                              }
                              style={{
                                color: getStatusColor(task.estado),
                              }}
                            >
                              {getStatusOptions(task, user).map((state) => (
                                <option
                                  key={state}
                                  value={state}
                                  style={{
                                    color: getStatusColor(state),
                                  }}
                                >
                                  {state.charAt(0).toUpperCase() +
                                    state.slice(1)}{" "}
                                  {/* Capitaliza el estado */}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              <span
                                style={{ color: getStatusColor(task.estado) }}
                              >
                                {task.estado.charAt(0).toUpperCase() +
                                  task.estado.slice(1)}{" "}
                                {/* Capitaliza el estado */}
                                {getStatusIcon(task.estado)}
                              </span>
                            </>
                          )}
                        </td>
                      )}
                      <td data-label="Ver">
                        <div className="button-container">
                          <Link
                            className="btn btn-success"
                            to={`/view/task/${task._id}`}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        </div>
                      </td>
                      {canEdit && (
                        <td data-label="Editar">
                          <div className="button-container">
                            <Link
                              className="btn btn-primary"
                              to={`/edit-task/${task._id}`}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                          </div>
                        </td>
                      )}
                      {canDelete && (
                        <td data-label="Borrar">
                          <div className="button-container">
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(task._id)}
                            >
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
