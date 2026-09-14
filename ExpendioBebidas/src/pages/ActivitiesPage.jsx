import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ComponentCard } from "../components/common/ComponentCard";
import { Badge } from "../components/common/Badge";
import { getAllActivitiesRequest } from "../api/tasks";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await getAllActivitiesRequest();
      setActivities(res.data || []);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActionBadge = (action) => {
    const act = (action || "").toLowerCase();
    if (act.includes("eliminó")) {
      return (
        <Badge color="error" size="sm">
          {action}
        </Badge>
      );
    }
    if (act.includes("restauró")) {
      return (
        <Badge color="success" size="sm">
          {action}
        </Badge>
      );
    }
    if (act.includes("creó")) {
      return (
        <Badge color="primary" size="sm">
          {action}
        </Badge>
      );
    }
    if (act.includes("estado")) {
      return (
        <Badge color="warning" size="sm">
          {action}
        </Badge>
      );
    }
    return (
      <Badge color="info" size="sm">
        {action}
      </Badge>
    );
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
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredActivities = activities.filter((item) => {
    const term = searchTerm.toLowerCase();
    const user = (
      item.userName ||
      item.userId?.username ||
      `${item.userId?.nombre || ""} ${item.userId?.apellido || ""}`
    ).toLowerCase();
    const exp = (item.nroexpediente || "").toLowerCase();
    const titular = (item.nombreTitular || "").toLowerCase();
    const dni = (item.dniTitular || "").toLowerCase();
    const act = (item.action || "").toLowerCase();
    const detalles = (item.detalles || "").toLowerCase();

    const matchesSearch =
      user.includes(term) ||
      exp.includes(term) ||
      titular.includes(term) ||
      dni.includes(term) ||
      act.includes(term) ||
      detalles.includes(term);

    if (!matchesSearch) return false;

    if (actionFilter === "all") return true;
    if (actionFilter === "elimino") return act.includes("eliminó");
    if (actionFilter === "restauro") return act.includes("restauró");
    if (actionFilter === "creo") return act.includes("creó");
    if (actionFilter === "estado") return act.includes("estado");
    if (actionFilter === "actualizo") return act.includes("actualizó");

    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-brand-100 text-brand-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Movimientos y Auditoría
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Registro histórico de todas las operaciones realizadas por los operadores en el sistema con nombres de usuarios y titulares.
            </p>
          </div>

          <button
            onClick={fetchActivities}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-theme-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        {/* TARJETA CON FILTROS Y TABLA */}
        <ComponentCard
          title="Historial de Actividades"
          desc={`${filteredActivities.length} registro(s) encontrado(s)`}
          headerAction={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all cursor-pointer text-gray-700"
              >
                <option value="all">Todas las acciones</option>
                <option value="creo">Creaciones</option>
                <option value="actualizo">Modificaciones</option>
                <option value="estado">Cambios de Estado</option>
                <option value="elimino">Eliminaciones</option>
                <option value="restauro">Restauraciones</option>
              </select>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Buscar por usuario, expediente, titular..."
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
            </div>
          }
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm">Cargando registro de movimientos...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-16 px-4 text-gray-500">
              <p className="text-base font-semibold text-gray-800">
                No se encontraron movimientos
              </p>
              <p className="text-sm mt-1">
                {searchTerm || actionFilter !== "all"
                  ? "Prueba cambiando los filtros de búsqueda."
                  : "Aún no hay actividades registradas en el sistema."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50/80 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3.5">Fecha y Hora</th>
                    <th className="px-4 py-3.5">Operador / Usuario</th>
                    <th className="px-4 py-3.5">Acción Realizada</th>
                    <th className="px-4 py-3.5">N° Expediente</th>
                    <th className="px-4 py-3.5">Titular del Trámite</th>
                    <th className="px-4 py-3.5">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredActivities.map((act) => {
                    const userName =
                      act.userName ||
                      act.userId?.nombre
                        ? `${act.userId.nombre} ${act.userId.apellido || ""}`.trim()
                        : act.userId?.username || "Usuario";
                    const userRole = act.userRole || act.userId?.role || "-";

                    return (
                      <tr key={act._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(act.createdAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-gray-900">{userName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <span className="capitalize text-brand-600 font-medium">
                              {userRole}
                            </span>
                            {act.userEmail && <span>• {act.userEmail}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {getActionBadge(act.action)}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                          {act.nroexpediente || <span className="text-gray-400 font-normal">S/N</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          {act.nombreTitular ? (
                            <div>
                              <div className="font-medium text-gray-900">{act.nombreTitular}</div>
                              {act.dniTitular && (
                                <div className="text-xs text-gray-500">DNI: {act.dniTitular}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600 max-w-xs truncate">
                          {act.detalles || act.action}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>
      </div>
    </DashboardLayout>
  );
};

export default ActivitiesPage;
