import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
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
  faFileExcel,
  faFilter,
  faTimes,
  faBuilding,
  faUsers,
  faMapMarkerAlt,
  faCheckDouble,
  faLock,
  faLockOpen
} from "@fortawesome/free-solid-svg-icons";
import Paginator from "./Paginator";
import "./Table.css";
import Swal from "sweetalert2";
import { DateTime } from "luxon";
import ComponentCard from "./common/ComponentCard";
import Badge from "./common/Badge";
import Button from "./common/Button";

// Función auxiliar para unificar el nroexpediente
const getExpedienteString = (nroexpediente) => {
  if (Array.isArray(nroexpediente)) {
    return nroexpediente.join(" / ");
  }
  return nroexpediente || "";
};

function Table() {
  const { tasks, deleteTask, getTasks, updateTaskStatus, updateTask, setTasks } = useTasks();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // Modo Edición Global (Métrica interactiva)
  const [globalEditEnabled, setGlobalEditEnabled] = useState(true);

  // Estados para búsqueda avanzada
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterEstado, setFilterEstado] = useState("");
  const [filterLocalidad, setFilterLocalidad] = useState("");
  const [filterExpendio, setFilterExpendio] = useState("");
  const [filterRubro, setFilterRubro] = useState("");

  const toggleGlobalEdit = () => {
    const newState = !globalEditEnabled;
    setGlobalEditEnabled(newState);
    Swal.fire({
      icon: newState ? "success" : "info",
      title: newState ? "Edición Rápida Activada" : "Edición Rápida Pausada",
      text: newState
        ? "Los operadores con permisos pueden cambiar estados de expedientes."
        : "Se ha establecido el modo de solo lectura temporal.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  async function handleDelete(id) {
    Swal.fire({
      title: "¿Está seguro que desea eliminar este expediente?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#e11d48",
      denyButtonText: "Cancelar",
      denyButtonColor: "#64748b",
      showDenyButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteTask(id);
        Swal.fire({
          title: "Eliminado",
          text: "El expediente ha sido eliminado correctamente.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
      }
    });
  }

  // Función para cambiar el estado de "Pagado/No Pagado"
  const handlePaidToggle = async (task) => {
    const updatedStatus = !task.pago;
    await updateTask(task._id, { pago: updatedStatus });
    await getTasks();
  };

  const searcher = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const uniqueLocalidades = [...new Set(tasks.map((t) => t.localidad).filter(Boolean))].sort();
  const reversedTasks = [...tasks].reverse();

  const filteredTasks = reversedTasks.filter((task) => {
    if (search) {
      const searchLowerCase = search.toLowerCase();
      const nroexpediente = getExpedienteString(task.nroexpediente).toLowerCase();
      const apellido = task.apellido ? task.apellido.toLowerCase() : "";
      const nombre = task.nombre ? task.nombre.toLowerCase() : "";
      const dni = task.dni ? task.dni.toLowerCase() : "";
      const localidad = task.localidad ? task.localidad.toLowerCase() : "";
      const persona = task.persona ? task.persona.toLowerCase() : "";
      const expendio = task.expendio ? task.expendio.toLowerCase() : "";
      const estado = task.estado ? task.estado.toLowerCase() : "";
      const rubro = task.rubro ? task.rubro.toLowerCase() : "";

      const matchesGlobal =
        nroexpediente.includes(searchLowerCase) ||
        apellido.includes(searchLowerCase) ||
        nombre.includes(searchLowerCase) ||
        dni.includes(searchLowerCase) ||
        localidad.includes(searchLowerCase) ||
        persona.includes(searchLowerCase) ||
        expendio.includes(searchLowerCase) ||
        estado.includes(searchLowerCase) ||
        rubro.includes(searchLowerCase);

      if (!matchesGlobal) return false;
    }

    if (filterEstado && task.estado?.toLowerCase() !== filterEstado.toLowerCase()) return false;
    if (filterLocalidad && task.localidad?.toLowerCase() !== filterLocalidad.toLowerCase()) return false;
    if (filterExpendio && task.expendio?.toLowerCase() !== filterExpendio.toLowerCase()) return false;
    if (filterRubro && (!task.rubro || !task.rubro.toLowerCase().includes(filterRubro.toLowerCase()))) return false;

    return true;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const permissions = {
    canEdit: ["admin", "editor", "mesa"].includes(user?.role),
    canDelete: ["admin", "editor"].includes(user?.role),
    canAddUser: ["admin"].includes(user?.role),
    canAddTask: ["admin", "editor", "mesa"].includes(user?.role),
    canViewStatus: ["admin", "viewer", "juridicos", "mesa", "editor"].includes(user?.role),
    canEditStatus: ["mesa", "juridicos", "admin", "editor"].includes(user?.role) && globalEditEnabled,
    canPagoEditStatus: ["admin", "mesa"].includes(user?.role),
    canPagado: ["admin"].includes(user?.role),
  };

  const canEditTask = (task) => {
    if (["admin", "editor", "mesa"].includes(user?.role)) {
      return true;
    }
    return false;
  };

  const handleRefresh = async () => {
    Swal.fire({
      title: "Actualizando registros...",
      didOpen: () => Swal.showLoading(),
      timer: 800,
      showConfirmButton: false,
    });
    await getTasks();
  };

  const statusOptions = {
    mesa: {
      ingresado: ["ingresado", "pendiente", "controlado"],
      pendiente: ["pendiente", "controlado"],
      aprobado: ["aprobado", "finalizado"],
      rechazado: ["rechazado", "pendiente", "controlado", "finalizado"],
    },
    juridicos: {
      controlado: ["controlado", "aprobado", "rechazado"],
    },
    admin: {
      any: ["pendiente", "controlado", "aprobado", "rechazado", "finalizado", "ingresado"],
    },
    editor: {
      any: ["pendiente", "controlado", "aprobado", "rechazado", "finalizado", "ingresado"],
    },
  };

  const getStatusOptions = (task) => {
    const roleOptions = statusOptions[user?.role] || {};
    const availableOptions = roleOptions[task.estado] || roleOptions.any || [];
    return availableOptions.length ? availableOptions : [];
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const currentTask = tasks.find((t) => t._id === taskId);
      if (!currentTask) {
        Swal.fire("Error", "No se encontró el expediente.", "error");
        return;
      }

      let updatedTask = null;

      if (
        (user.role === "juridicos" || user.role === "admin" || user.role === "editor") &&
        newStatus === "rechazado"
      ) {
        const { value: motivoRechazo } = await Swal.fire({
          title: "Motivo del Rechazo / Observación",
          input: "textarea",
          inputLabel: "Especifique el motivo de la observación para el solicitante:",
          inputPlaceholder: "Escriba aquí...",
          inputValue: currentTask.motivoRechazo || "",
          showCancelButton: true,
          confirmButtonText: "Guardar Rechazo",
          confirmButtonColor: "#e11d48",
          cancelButtonText: "Cancelar",
          inputValidator: (value) => {
            if (!value) return "Debe ingresar un motivo para registrar la observación.";
          },
        });

        if (motivoRechazo !== undefined) {
          const res = await updateTask(taskId, { estado: newStatus, motivoRechazo });
          updatedTask = res.task || res;
          Swal.fire("Guardado", "El motivo de rechazo ha sido registrado.", "success");
        } else {
          return;
        }
      } else if (
        (user.role === "juridicos" || user.role === "admin" || user.role === "editor") &&
        newStatus === "aprobado"
      ) {
        const { value: motivoAprobacion } = await Swal.fire({
          title: "Información de Pago / Aprobación",
          input: "textarea",
          inputLabel: "Especifique el arancel o detalle para proceder al pago:",
          inputPlaceholder: "Escriba aquí...",
          inputValue: currentTask.motivoAprobacion || "",
          showCancelButton: true,
          confirmButtonText: "Aprobar y Notificar",
          confirmButtonColor: "#059669",
          cancelButtonText: "Cancelar",
          inputValidator: (value) => {
            if (!value) return "Debe ingresar el detalle de pago para aprobar el expediente.";
          },
        });

        if (motivoAprobacion !== undefined) {
          const res = await updateTask(taskId, { estado: newStatus, motivoAprobacion });
          updatedTask = res.task || res;
          Swal.fire("Aprobado", "La información de aprobación ha sido guardada.", "success");
        } else {
          return;
        }
      } else {
        updatedTask = await updateTaskStatus(taskId, newStatus);
        Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: `El expediente cambió a ${newStatus}`,
          timer: 1800,
          showConfirmButton: false,
        });
      }

      if (updatedTask) {
        setTasks(tasks.map((t) => (t._id === taskId ? { ...t, ...updatedTask } : t)));
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      Swal.fire("Error", "No se pudo actualizar el estado del expediente.", "error");
    }
  };

  // Colores de fondo por Tipo de Expendio
  const getRowBgColor = (expendio) => {
    if (!expendio) return "transparent";
    const exp = expendio.trim().toLowerCase();
    if (exp === "evento particular") return "#e8f5e9"; // Verde claro
    if (exp === "local comercial") return "#e3f2fd";   // Celeste claro
    if (exp === "intendencia") return "#fff9c4";       // Amarillo claro
    return "transparent";
  };

  const getRowClass = (expendio) => {
    if (!expendio) return "";
    const exp = expendio.trim().toLowerCase();
    if (exp === "evento particular") return "row-evento-particular";
    if (exp === "local comercial") return "row-local-comercial";
    if (exp === "intendencia") return "row-intendencia";
    return "";
  };

  // Color exacto del texto según Estado
  const getStatusColor = (status) => {
    const st = (status === "controlado" ? "en revisión" : status || "").toLowerCase();
    switch (st) {
      case "aprobado":
        return "#28a745"; // Verde
      case "rechazado":
        return "#dc3545"; // Rojo
      case "controlado":
      case "en revisión":
        return "#007bff"; // Azul
      case "pendiente":
        return "#fd7e14"; // Naranja
      case "finalizado":
        return "#212529"; // Negro/Oscuro
      case "ingresado":
      default:
        return "#6c757d"; // Gris
    }
  };

  const getStatusIcon = (status) => (
    <FontAwesomeIcon
      icon={faCircle}
      style={{ color: getStatusColor(status), fontSize: "10px", marginLeft: "4px" }}
    />
  );

  const handleGenerateExcel = () => {
    Swal.fire({
      title: "¿Descargar reporte en Excel?",
      text: `Se exportarán ${filteredTasks.length} registros actualmente filtrados.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Descargar Excel",
      confirmButtonColor: "#059669",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const worksheet = XLSX.utils.json_to_sheet(
          filteredTasks.map((task) => ({
            "N° Expediente": getExpedienteString(task.nroexpediente),
            Apellido: task.apellido || "",
            Nombre: task.nombre || "",
            "DNI/CUIT": task.dni || "",
            "Fecha Creación": formatFechaCreacion(task.createdAt),
            Localidad: task.localidad || "",
            "Tipo Persona": task.persona || "",
            "Tipo Expendio": task.expendio || "",
            Rubro: task.rubro || "",
            Estado: task.estado || "",
            Pagado: task.pago ? "SÍ" : "NO",
          }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expedientes");
        XLSX.writeFile(workbook, `Reporte_Expendio_${DateTime.now().toFormat("yyyyMMdd_HHmm")}.xlsx`);
        Swal.fire("Reporte Generado", "El archivo Excel se descargó correctamente.", "success");
      }
    });
  };

  function formatFechaCreacion(fecha) {
    if (!fecha) return "-";
    return DateTime.fromISO(fecha).setZone("America/Argentina/Buenos_Aires").toFormat("dd/MM/yyyy HH:mm");
  }

  // Cálculos para métricas
  const totalTasksCount = tasks.length;
  const uniqueMunicipiosCount = new Set(tasks.map((t) => t.localidad).filter(Boolean)).size;
  const localesComercialesCount = tasks.filter((t) => t.expendio === "Local Comercial").length;

  const hasActiveFilters = Boolean(filterEstado || filterLocalidad || filterExpendio || filterRubro);

  return (
    <div className="space-y-6 font-outfit">
      {/* 1. SECCIÓN DE MÉTRICAS KPI (ESTILO ECOMMERCEMETRICS TAILADMIN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: TOTAL EXPEDIENTES */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs flex items-center justify-between transition-all hover:shadow-theme-sm">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Expedientes
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {totalTasksCount}
            </h3>
            <div className="mt-2">
              <Badge variant="light" color="primary" size="sm">
                Activos en BD
              </Badge>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200/60 shadow-theme-xs shrink-0">
            <FontAwesomeIcon icon={faUsers} className="text-xl" />
          </div>
        </div>

        {/* KPI 2: MUNICIPIOS ÚNICOS */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs flex items-center justify-between transition-all hover:shadow-theme-sm">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Municipios Únicos
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {uniqueMunicipiosCount}
            </h3>
            <div className="mt-2">
              <Badge variant="light" color="info" size="sm">
                Provincia Misiones
              </Badge>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200/60 shadow-theme-xs shrink-0">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
          </div>
        </div>

        {/* KPI 3: LOCALES COMERCIALES */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs flex items-center justify-between transition-all hover:shadow-theme-sm">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Locales Comerciales
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {localesComercialesCount}
            </h3>
            <div className="mt-2">
              <Badge variant="light" color="success" size="sm">
                Habilitaciones
              </Badge>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-theme-xs shrink-0">
            <FontAwesomeIcon icon={faBuilding} className="text-xl" />
          </div>
        </div>

        {/* KPI 4: PERMISO EDICIÓN GLOBAL CON TOGGLE */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs flex items-center justify-between transition-all hover:shadow-theme-sm">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Edición Global
            </span>
            <h3 className="text-lg font-bold text-gray-800 mt-1">
              {globalEditEnabled ? "Habilitada" : "Bloqueada"}
            </h3>
            <div className="mt-2">
              <button
                onClick={toggleGlobalEdit}
                className={`cursor-pointer px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                  globalEditEnabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    : "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                }`}
              >
                {globalEditEnabled ? "Alternar a Pausa" : "Habilitar Edición"}
              </button>
            </div>
          </div>
          <div
            onClick={toggleGlobalEdit}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-theme-xs shrink-0 cursor-pointer transition-all ${
              globalEditEnabled
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-rose-50 text-rose-600 border-rose-200"
            }`}
          >
            <FontAwesomeIcon
              icon={globalEditEnabled ? faLockOpen : faLock}
              className="text-xl"
            />
          </div>
        </div>
      </div>

      {/* 2. CARD PRINCIPAL CON CONTROLES, FILTROS Y TABLA */}
      <ComponentCard
        title="Gestión y Control de Expedientes"
        description="Listado completo de solicitudes de expendio de bebidas alcohólicas registradas en la provincia"
        headerAction={
          <div className="flex flex-wrap items-center gap-2">
            {permissions.canAddTask && (
              <Link to="/add-task">
                <Button
                  size="sm"
                  variant="primary"
                  icon={<FontAwesomeIcon icon={faFileCirclePlus} />}
                >
                  Nuevo Trámite
                </Button>
              </Link>
            )}

            {permissions.canAddUser && (
              <Link to="/registeradmin">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<FontAwesomeIcon icon={faUserPlus} />}
                >
                  Usuario
                </Button>
              </Link>
            )}

            {permissions.canPagoEditStatus && (
              <Link to="/pago">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<FontAwesomeIcon icon={faDollar} />}
                >
                  Aranceles
                </Button>
              </Link>
            )}

            <Button
              size="sm"
              variant="secondary"
              icon={<FontAwesomeIcon icon={faRotate} />}
              onClick={handleRefresh}
              title="Recargar expedientes"
            />

            <Button
              size="sm"
              variant="success"
              icon={<FontAwesomeIcon icon={faFileExcel} />}
              onClick={handleGenerateExcel}
            >
              Excel
            </Button>
          </div>
        }
      >
        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="space-y-3 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={searcher}
                placeholder="Buscar por titular, DNI, número de expediente, rubro, localidad..."
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
              />
              <span className="absolute left-3.5 top-3 text-gray-400">
                <FontAwesomeIcon icon={faSearch} className="text-sm" />
              </span>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-1"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              )}
            </div>

            <Button
              variant={showAdvanced ? "primary" : "secondary"}
              size="md"
              onClick={() => setShowAdvanced(!showAdvanced)}
              icon={<FontAwesomeIcon icon={faFilter} />}
              className="shrink-0"
            >
              Filtros {hasActiveFilters && "•"}
            </Button>
          </div>

          {/* PANEL DE FILTROS AVANZADOS */}
          {showAdvanced && (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 animate-in fade-in duration-150 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Estado
                  </label>
                  <select
                    value={filterEstado}
                    onChange={(e) => {
                      setFilterEstado(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
                  >
                    <option value="">Todos los Estados</option>
                    <option value="ingresado">Ingresado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="controlado">En revisión</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Localidad
                  </label>
                  <select
                    value={filterLocalidad}
                    onChange={(e) => {
                      setFilterLocalidad(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
                  >
                    <option value="">Todas las Localidades</option>
                    {uniqueLocalidades.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Tipo de Expendio
                  </label>
                  <select
                    value={filterExpendio}
                    onChange={(e) => {
                      setFilterExpendio(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
                  >
                    <option value="">Todos los Tipos</option>
                    <option value="Local Comercial">Local Comercial</option>
                    <option value="Evento Particular">Evento Particular</option>
                    <option value="Intendencia">Intendencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Rubro
                  </label>
                  <input
                    type="text"
                    value={filterRubro}
                    onChange={(e) => {
                      setFilterRubro(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Ej: Kiosco, Bar..."
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setFilterEstado("");
                      setFilterLocalidad("");
                      setFilterExpendio("");
                      setFilterRubro("");
                      setCurrentPage(1);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. TABLA DE EXPEDIENTES */}
        <div className="table-scroll overflow-x-auto rounded-xl border border-gray-200">
          <table className="table" style={{ textTransform: "uppercase", width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#4186dc", color: "white" }}>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>N° Expediente</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Apellido</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Nombre</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>DNI/CUIT</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Fecha de Creación</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Localidad</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Tipo de Persona</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Tipo de Expendio</th>
                {permissions.canViewStatus && (
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Estado</th>
                )}
                {permissions.canPagado && (
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Pagado</th>
                )}
                <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Ver</th>
                {permissions.canEdit && (
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Editar</th>
                )}
                {permissions.canDelete && (
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#4186dc", color: "white" }}>Borrar</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => {
                  const options = getStatusOptions(task);
                  const isSelectable = permissions.canEditStatus && options.length > 0;

                  return (
                    <tr
                      key={task._id}
                      className={`hover:brightness-95 transition-all ${getRowClass(task.expendio)}`}
                      style={{ backgroundColor: getRowBgColor(task.expendio) }}
                    >
                      <td data-label="N° Expediente" className="text-center font-bold text-gray-900" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        {getExpedienteString(task.nroexpediente).toUpperCase() || "-"}
                      </td>

                      <td data-label="Apellido" className="text-center text-gray-800 uppercase font-medium" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        {task.apellido?.toUpperCase() || "-"}
                      </td>

                      <td data-label="Nombre" className="text-center text-gray-800 uppercase font-medium" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        {task.nombre?.toUpperCase() || "-"}
                      </td>

                      <td data-label="DNI/CUIT" className="text-center text-gray-800 font-mono" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        {task.dni?.toUpperCase() || "-"}
                      </td>

                      <td data-label="Fecha de Creación" className="text-center text-gray-700 whitespace-nowrap text-xs" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        {formatFechaCreacion(task.createdAt)}
                      </td>

                      <td data-label="Localidad" className="text-center text-gray-800 uppercase" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        {task.localidad?.toUpperCase() || "-"}
                      </td>

                      <td data-label="Tipo de Persona" className="text-center text-gray-800 uppercase" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        {task.persona?.toUpperCase() || "-"}
                      </td>

                      <td data-label="Tipo de Expendio" className="text-center text-gray-900 uppercase font-bold" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        {task.expendio?.toUpperCase() || "-"}
                      </td>

                      {permissions.canViewStatus && (
                        <td data-label="Estado" className="text-center" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                          {isSelectable ? (
                            <select
                              value={task.estado || "ingresado"}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              style={{
                                color: getStatusColor(task.estado),
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                width: "135px",
                                height: "32px",
                                textAlign: "center",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                backgroundColor: "white",
                                cursor: "pointer"
                              }}
                            >
                              {options.map((state) => (
                                <option key={state} value={state} style={{ color: getStatusColor(state), fontWeight: "bold" }}>
                                  {(state === 'controlado' ? 'en revisión' : state).charAt(0).toUpperCase() + (state === 'controlado' ? 'en revisión' : state).slice(1)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              style={{
                                color: getStatusColor(task.estado),
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                              }}
                            >
                              {(task.estado === 'controlado' ? 'en revisión' : task.estado)?.toUpperCase()} {getStatusIcon(task.estado)}
                            </span>
                          )}

                          {task.estado === "rechazado" && ["juridicos", "admin", "editor"].includes(user?.role) && (
                            <div style={{ marginTop: "4px" }}>
                              <button
                                onClick={() => handleStatusChange(task._id, "rechazado")}
                                className="btn-dark"
                                title="Editar motivo de rechazo"
                                style={{
                                  backgroundColor: "#343a40",
                                  color: "white",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  cursor: "pointer",
                                  border: "none"
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} style={{ marginRight: "4px" }} />Editar Motivo
                              </button>
                            </div>
                          )}

                          {task.estado === "aprobado" && ["juridicos", "admin", "editor"].includes(user?.role) && (
                            <div style={{ marginTop: "4px" }}>
                              <button
                                onClick={() => handleStatusChange(task._id, "aprobado")}
                                className="btn-dark"
                                title="Editar información de pago"
                                style={{
                                  backgroundColor: "#343a40",
                                  color: "white",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  cursor: "pointer",
                                  border: "none"
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} style={{ marginRight: "4px" }} />Editar Info Pago
                              </button>
                            </div>
                          )}
                        </td>
                      )}

                      {permissions.canPagado && (
                        <td data-label="Pagado" className="text-center" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
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

                      <td data-label="Ver" className="text-center" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                        <Link
                          to={`/view/task/${task._id}`}
                          className="btn btn-success"
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            width: "36px",
                            height: "34px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                            textDecoration: "none"
                          }}
                          title="Ver"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>

                      {permissions.canEdit && (
                        <td data-label="Editar" className="text-center" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                          {canEditTask(task) && (
                            <Link
                              to={`/edit-task/${task._id}`}
                              className="btn btn-primary"
                              style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                width: "36px",
                                height: "34px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "4px",
                                textDecoration: "none"
                              }}
                              title="Editar"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                          )}
                        </td>
                      )}

                      {permissions.canDelete && (
                        <td data-label="Borrar" className="text-center" style={{ padding: "10px 8px", border: "1px solid #ccc" }}>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="btn btn-danger"
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              width: "36px",
                              height: "34px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "4px",
                              border: "none",
                              cursor: "pointer"
                            }}
                            title="Borrar"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={13}
                    className="px-6 py-12 text-center text-gray-500"
                    style={{ border: "1px solid #ccc" }}
                  >
                    No se encontraron expedientes registrados con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PIE DE TABLA: CONTADOR Y PAGINADOR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-3 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            Mostrando{" "}
            <span className="font-semibold text-gray-800">
              {filteredTasks.length > 0 ? indexOfFirstTask + 1 : 0}
            </span>{" "}
            a{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(indexOfLastTask, filteredTasks.length)}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-gray-800">
              {filteredTasks.length}
            </span>{" "}
            expedientes
          </p>

          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </ComponentCard>
    </div>
  );
}

export default Table;
