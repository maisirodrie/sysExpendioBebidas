import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ComponentCard } from "../components/common/ComponentCard";
import { Badge } from "../components/common/Badge";
import { getDeletedTasksRequest, restoreDeletedTaskRequest } from "../api/tasks";
import Swal from "sweetalert2";

const DeletedTasksPage = () => {
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDeletedTasks = async () => {
    try {
      setLoading(true);
      const res = await getDeletedTasksRequest();
      setDeletedTasks(res.data || []);
    } catch (error) {
      console.error("Error al cargar expedientes eliminados:", error);
      Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: error.response?.data?.message || "No se pudieron cargar los expedientes eliminados.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedTasks();
  }, []);

  const handleRestore = (task) => {
    const expedienteStr = task.nroexpediente || "S/N";
    const titularStr = `${task.nombre || ""} ${task.apellido || ""}`.trim() || "Sin titular";

    Swal.fire({
      title: "¿Restaurar Expediente?",
      html: `¿Confirmas que deseas restaurar el expediente <b>${expedienteStr}</b> perteneciente a <b>${titularStr}</b>?<br/><span class="text-sm text-gray-500">Volverá a aparecer en la lista activa de trámites sin perder ningún dato.</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, restaurar expediente",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await restoreDeletedTaskRequest(task._id);
          Swal.fire({
            icon: "success",
            title: "¡Restaurado!",
            text: `El expediente ${expedienteStr} fue restaurado con éxito.`,
            confirmButtonColor: "#465fff",
            timer: 2000,
          });
          fetchDeletedTasks();
        } catch (error) {
          console.error("Error al restaurar:", error);
          Swal.fire({
            icon: "error",
            title: "Error al restaurar",
            text: error.response?.data?.message || "Ocurrió un error al restaurar el expediente.",
          });
        }
      }
    });
  };

  const filteredTasks = deletedTasks.filter((t) => {
    const term = searchTerm.toLowerCase();
    const exp = (t.nroexpediente || "").toLowerCase();
    const nombre = `${t.nombre || ""} ${t.apellido || ""}`.toLowerCase();
    const dni = (t.dni || "").toLowerCase();
    const deletedBy = (t.deletedByName || "").toLowerCase();
    const tipo = (t.expendio || "").toLowerCase();
    return (
      exp.includes(term) ||
      nombre.includes(term) ||
      dni.includes(term) ||
      deletedBy.includes(term) ||
      tipo.includes(term)
    );
  });

  const getBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "aprobado":
      case "finalizado":
        return "success";
      case "pendiente":
        return "warning";
      case "controlado":
        return "info";
      case "rechazado":
        return "error";
      default:
        return "neutral";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
              Papelera de Eliminados
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Base protegida exclusiva para el Administrador. Si un expediente fue borrado por error, puedes restaurarlo con un solo clic conservando todos sus datos y documentos.
            </p>
          </div>

          <button
            onClick={fetchDeletedTasks}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-theme-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        {/* TARJETA PRINCIPAL CON TABLA */}
        <ComponentCard
          title="Expedientes Eliminados"
          desc={`${filteredTasks.length} trámite(s) en papelera`}
          headerAction={
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar por expediente, DNI, titular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          }
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm">Consultando papelera de eliminados...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                No hay expedientes eliminados
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                {searchTerm
                  ? "No se encontraron trámites eliminados que coincidan con la búsqueda."
                  : "La papelera de reciclaje está vacía. Todos los expedientes se encuentran en la lista activa."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50/80 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3.5">N° Expediente</th>
                    <th className="px-4 py-3.5">Titular / DNI</th>
                    <th className="px-4 py-3.5">Tipo de Trámite</th>
                    <th className="px-4 py-3.5">Estado Previo</th>
                    <th className="px-4 py-3.5">Eliminado Por</th>
                    <th className="px-4 py-3.5">Fecha de Eliminación</th>
                    <th className="px-4 py-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTasks.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-rose-50/30 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-bold text-gray-900">
                        {t.nroexpediente || <span className="text-gray-400 font-normal">S/N</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-gray-900">
                          {t.nombre} {t.apellido}
                        </div>
                        <div className="text-xs text-gray-500">DNI: {t.dni || "-"}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                          {t.expendio || "General"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge color={getBadgeColor(t.estado)} size="sm">
                          {t.estado || "ingresado"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-gray-900">
                          {t.deletedByName || "Usuario"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Rol: <span className="capitalize">{t.deletedByRole || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                        {formatDate(t.deletedAt)}
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleRestore(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer shadow-sm"
                          title="Restaurar a la lista activa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Restaurar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>
      </div>
    </DashboardLayout>
  );
};

export default DeletedTasksPage;
