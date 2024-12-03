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

function Table() {
  const { tasks, deleteTask, getTasks, updateTaskStatus, updateTask } = useTasks();
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
      const nroexpediente = task.nroexpediente ? task.nroexpediente.toLowerCase() : "";
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
    canEdit: ["admin", "editor", "mesa"].includes(user.role),
    canDelete: ["admin", "editor"].includes(user.role),
    canAddUser: ["admin"].includes(user.role),
    canAddTask: ["admin", "editor"].includes(user.role),
    canViewStatus: ["admin", "viewer", "juridicos", "mesa"].includes(user.role),
    canEditStatus: ["mesa", "juridicos","admin"].includes(user.role),
    canPagoEditStatus: ["admin"].includes(user.role),
    canPagado: ["admin","mesa"].includes(user.role),
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
          task.nroexpediente || "",
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
          "N° Expediente": task.nroexpediente || "",
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
                    <th colSpan="12" className="table-title">Listado de Archivos</th>
                  </tr>
                  <tr>
                    <th>N° Expediente</th>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>DNI</th>
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
                    <tr key={task._id}>
                      <td>{task.nroexpediente?.toUpperCase()}</td>
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
                      {permissions.canPagado && (
                      <td>
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
