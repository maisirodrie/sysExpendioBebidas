import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from 'jspdf';
import * as XLSX from "xlsx"; // Importa SheetJS
import 'jspdf-autotable'; // Esta línea importa el complemento para `autoTable`
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
  faDollar,
  faFilePdf,
  faFileExcel
} from "@fortawesome/free-solid-svg-icons";
import "./Table.css";
import Paginator from "./Paginator";
import Swal from "sweetalert2";
import { DateTime } from "luxon";


// Función auxiliar para unificar el nroexpediente
const getExpedienteString = (nroexpediente) => {
  if (Array.isArray(nroexpediente)) {
    return nroexpediente.join(' / '); // Une el array con un separador
  }
  return nroexpediente || ''; // Devuelve la cadena si es una cadena, o cadena vacía si es null/undefined
}


function Table() {
  const { tasks, deleteTask, getTasks, updateTaskStatus, updateTask, setTasks } = useTasks();
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

  // Función para cambiar el estado de "Pagado/No Pagado"
  const handlePaidToggle = async (task) => {
    const updatedStatus = !task.pago; // Cambia entre pagado y no pagado
    // Supongamos que `updateTaskStatus` puede actualizar el estado de pago
    await updateTask(task._id, { pago: updatedStatus });
    await getTasks(); // Refresca la lista después de actualizar
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  const reversedTasks = [...tasks].reverse();

  const filteredTasks = !search
    ? reversedTasks
    : reversedTasks.filter((task) => {
      // CORRECCIÓN 2: Uso de la función auxiliar para convertir el array a string para la búsqueda.
      const nroexpediente = getExpedienteString(task.nroexpediente).toLowerCase();

      const apellido = task.apellido ? task.apellido.toLowerCase() : "";
      const nombre = task.nombre ? task.nombre.toLowerCase() : "";
      const dni = task.dni ? task.dni.toLowerCase() : "";
      const localidad = task.localidad ? task.localidad.toLowerCase() : "";
      const persona = task.persona ? task.persona.toLowerCase() : "";
      const expendio = task.expendio ? task.expendio.toLowerCase() : "";
      const estado = task.estado ? task.estado.toLowerCase() : "";
      const searchLowerCase = search.toLowerCase();

      return (
        nroexpediente.includes(searchLowerCase) ||
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
    canEdit: ["admin", "editor", "mesa",].includes(user.role),
    canDelete: ["admin", "editor"].includes(user.role),
    canAddUser: ["admin"].includes(user.role),
    canAddTask: ["admin", "editor"].includes(user.role),
    canViewStatus: ["admin", "viewer", "juridicos", "mesa", "editor"].includes(user.role),
    canEditStatus: ["mesa", "juridicos", "admin", "editor"].includes(user.role),
    canPagoEditStatus: ["admin"].includes(user.role),
    canPagado: ["admin"].includes(user.role),
  };


  // Función para determinar si un usuario puede editar una tarea específica
  const canEditTask = (task) => {
    // Admin, editor y mesa pueden editar en cualquier estado
    if (["admin", "editor", "mesa"].includes(user.role)) {
      return true;
    }

    return false;
  };

  const handleRefresh = async () => await getTasks();


  const statusOptions = {
    mesa: {
      ingresado: ["ingresado", "pendiente", "controlado"],
      pendiente: ["pendiente", "controlado"],
      aprobado: ["aprobado", "finalizado"],
      rechazado: ["rechazado", "pendiente", "controlado", "finalizado"]
    },
    juridicos: {
      controlado: ["controlado", "aprobado", "rechazado"],
    },
    admin: {
      any: ["pendiente", "controlado", "aprobado", "rechazado", "finalizado", "ingresado"] // Admin puede cambiar cualquier estado
    },
    editor: {
      any: ["pendiente", "controlado", "aprobado", "rechazado", "finalizado", "ingresado"] // Admin puede cambiar cualquier estado
    }
  };

  const getStatusOptions = (task) => {
    const roleOptions = statusOptions[user.role] || {}; // Obtener opciones según el rol
    const availableOptions = roleOptions[task.estado] || roleOptions.any || []; // Si no tiene opciones específicas, tomar "any"
    return availableOptions.length ? availableOptions : [];
  };


  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const currentTask = tasks.find(t => t._id === taskId);

      if (!currentTask) {
        Swal.fire("Error", "No se encontró el expediente.", "error");
        return;
      }

      let updatedTask = null; // Variable para almacenar la tarea actualizada desde el backend

      if ((user.role === "juridicos" || user.role === "admin" || user.role === "editor") && newStatus === "rechazado") {
        const { value: motivoRechazo } = await Swal.fire({
          title: "Motivo del Rechazo",
          input: "textarea",
          inputLabel: "Por favor, especifique la razón del rechazo.",
          inputPlaceholder: "Escriba aquí...",
          inputValue: currentTask.motivoRechazo || '',
          showCancelButton: true,
          confirmButtonText: "Guardar",
          cancelButtonText: "Cancelar",
          inputValidator: (value) => {
            if (!value) {
              return "Necesita escribir un motivo para rechazar el expediente.";
            }
          },
        });

        if (motivoRechazo !== undefined) {
          // 1. Llama a la función de contexto y CAPTURA la respuesta COMPLETA
          updatedTask = await updateTask(taskId, { estado: newStatus, motivoRechazo: motivoRechazo });
          Swal.fire("Expediente Actualizado", "El motivo de rechazo ha sido guardado.", "success");
          // ❌ Eliminado: await getTasks();
        } else {
          Swal.fire("Cambio Cancelado", "El cambio de estado ha sido cancelado.", "info");
          return; // Salir si se cancela
        }
      } else {
        // 2. Llama a la función de contexto (solo estado) y CAPTURA la respuesta COMPLETA
        updatedTask = await updateTaskStatus(taskId, newStatus);
        Swal.fire("Estado actualizado", "El estado se ha modificado correctamente", "success");
        // ❌ Eliminado: await getTasks();
      }

      // 3. 🚀 ACTUALIZACIÓN INSTANTÁNEA: Usar la respuesta del backend para actualizar el estado `tasks`
      if (updatedTask) {
        setTasks(tasks.map(t => (t._id === taskId ? updatedTask : t)));
      }

    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      Swal.fire("Error", "No se pudo actualizar el estado de la tarea.", "error");
    }
  };

  // Función para mapear el estado de la BD al nombre visual
  const getDisplayStatus = (status) => {
    return status === 'controlado' ? 'en revisión' : status;
  };

  const getStatusColor = (status) => {
    const displayStatus = getDisplayStatus(status);
    return {
      ingresado: "gray",
      pendiente: "orange",
      revisado: "blue",
      "en revisión": "blue",
      aprobado: "green",
      rechazado: "red",
      finalizado: "black",
    }[displayStatus] || "gray";
  };

  const getStatusIcon = (status) => (
    <FontAwesomeIcon
      icon={faCircle}
      style={{ color: getStatusColor(status), fontSize: "10px" }}
    />
  );


  const handleGenerateReport = () => {
    Swal.fire({
      title: "¿Desea generar un reporte en PDF?",
      text: "El reporte incluirá todos los detalles de los registros actuales.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Generar Reporte",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Crear una nueva instancia de jsPDF
        const doc = new jsPDF();
        doc.setFontSize(12);

        // Título del reporte
        doc.text("Reporte de Expendio", 10, 10);

        // Crear el contenido de la tabla
        const tableData = filteredTasks.map((task) => [
          // CORRECCIÓN 3: Uso de la función auxiliar para PDF
          getExpedienteString(task.nroexpediente),
          task.apellido || "",
          task.nombre || "",
          task.dni || "",
          task.localidad || "",
          task.persona || "",
          task.expendio || "",
          task.estado || "",
        ]);

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
          startY: 20,
          head: [
            ["N° Expediente", "Apellido", "Nombre", "DNI", "Localidad", "Tipo de Persona", "Tipo de Expendio", "Estado"]
          ],
          body: tableData,
          margin: { top: 10 },
          styles: { fontSize: 10 }
        });

        // Guardar el PDF
        doc.save("Reporte_expendio.pdf");

        Swal.fire("Reporte Generado", "El reporte se ha generado exitosamente.", "success");
      }
    });
  };

  const handleGenerateExcel = () => {
    Swal.fire({
      title: "¿Desea generar un reporte en Excel?",
      text: "El reporte incluirá todos los detalles de los registros actuales.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Generar Reporte",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Crear una hoja de cálculo
        const worksheet = XLSX.utils.json_to_sheet(filteredTasks.map(task => ({
          // CORRECCIÓN 4: Uso de la función auxiliar para Excel
          "N° Expediente": getExpedienteString(task.nroexpediente),
          "Apellido": task.apellido || "",
          "Nombre": task.nombre || "",
          "DNI": task.dni || "",
          "Localidad": task.localidad || "",
          "Tipo de Persona": task.persona || "",
          "Tipo de Expendio": task.expendio || "",
          "Estado": task.estado || "",
        })));

        // Crear un libro de Excel y agregar la hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

        // Generar y descargar el archivo
        XLSX.writeFile(workbook, "Reporte_Expendio.xlsx");
        Swal.fire("Reporte Generado", "El reporte se ha generado exitosamente.", "success");
      }
    });
  };

  function formatFechaCreacion(fecha) {
    return DateTime.fromISO(fecha).setZone("America/Argentina/Buenos_Aires").toFormat("dd/MM/yyyy HH:mm");
  }


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
                {/* Botón para generar el reporte PDF */}
                {/* <button onClick={handleGenerateReport} className="btn btn-danger">
                  <FontAwesomeIcon icon={faFilePdf} />
                </button> */}
                {/* Botón para generar el reporte en Excel */}
                <button onClick={handleGenerateExcel} className="btn btn-success">
                  <FontAwesomeIcon icon={faFileExcel} />
                </button>
              </li>
            </ul>

            <br />
            <div className="table-scroll">
              <table className="table" style={{ textTransform: "uppercase" }}>
                <thead>
                  <tr>
                    <th colSpan="13" className="table-title">Listado de Archivos</th>
                  </tr>
                  <tr>
                    <th>N° Expediente</th>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>DNI/CUIT</th>
                    <th className="border border-gray-400 px-4 py-2">Fecha de Creación</th>

                    <th>Localidad</th>
                    <th>Tipo de Persona</th>
                    <th>Tipo de Expendio</th>

                    <th>Estado</th>
                    {permissions.canPagado && <th>Pagado</th>}
                    <th>Ver</th>
                    {permissions.canEdit && <th>Editar</th>}
                    {permissions.canDelete && <th>Borrar</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => (
                    <tr
                      key={task._id}
                      style={{
                        backgroundColor: task.expendio === "Evento Particular"
                          ? "#e8f5e9" // Verde claro para Evento Particular
                          : task.expendio === "Local Comercial"
                            ? "#e3f2fd" // Azul claro para Local Comercial
                            : task.expendio === "Intendencia"
                              ? "#fff9c4" // Amarillo claro para Intendencia
                              : "transparent"
                      }}
                    >
                      {/* CORRECCIÓN 1: Unir el array antes de aplicar toUpperCase() */}
                      <td data-label="N° Expediente">{getExpedienteString(task.nroexpediente).toUpperCase()}</td>

                      <td data-label="Apellido">{task.apellido?.toUpperCase()}</td>
                      <td data-label="Nombre">{task.nombre?.toUpperCase()}</td>
                      <td data-label="DNI/CUIT">{task.dni?.toUpperCase()}</td>
                      <td data-label="Fecha de Creación" className="border border-gray-400 px-4 py-2">
                        {formatFechaCreacion(task.createdAt)}
                      </td>
                      <td data-label="Localidad">{task.localidad?.toUpperCase()}</td>
                      <td data-label="Tipo de Persona">{task.persona?.toUpperCase()}</td>
                      <td data-label="Tipo de expendio" style={{ fontWeight: "600" }}>
                        {task.expendio?.toUpperCase()}
                      </td>
                      {permissions.canViewStatus && (
                        <td data-label="Estado">
                          {permissions.canEditStatus && getStatusOptions(task).length > 0 ? (
                            <select
                              value={task.estado || "ingresado"}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              style={{ color: getStatusColor(task.estado) }}
                            >
                              {getStatusOptions(task).map((state) => (
                                <option key={state} value={state} style={{ color: getStatusColor(state) }}>
                                  {(state === 'controlado' ? 'en revisión' : state).charAt(0).toUpperCase() + (state === 'controlado' ? 'en revisión' : state).slice(1)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span style={{ color: getStatusColor(task.estado) }}>
                              {(task.estado === 'controlado' ? 'en revisión' : task.estado)?.charAt(0).toUpperCase() + (task.estado === 'controlado' ? 'en revisión' : task.estado)?.slice(1)} {getStatusIcon(task.estado)}
                            </span>
                          )}
                          {/* AÑADE ESTE BOTÓN AQUÍ */}
                          {task.estado === "rechazado" && (user.role === "juridicos" || user.role === "admin" || user.role === "editor") && (
                            <button
                              onClick={() => handleStatusChange(task._id, "rechazado")}
                              className="btn-dark"
                              title="Editar motivo de rechazo"
                            >
                              <FontAwesomeIcon icon={faEdit} />Editar Motivo
                            </button>
                          )}
                        </td>
                      )}
                      {permissions.canPagado && (
                        <td data-label="Pagado">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={task.pago || false}
                              onChange={() => handlePaidToggle(task)}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                      )}
                      <td data-label="Ver">
                        <Link className="btn btn-success" to={`/view/task/${task._id}`}>
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>
                      {canEditTask(task) && (
                        <td data-label="Editar">
                          <Link className="btn btn-primary" to={`/edit-task/${task._id}`}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                        </td>
                      )}
                      {permissions.canDelete && (
                        <td data-label="Borrar">
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

