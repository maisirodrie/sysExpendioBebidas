import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getEstadoDniRequest } from "../api/tasks";
import PublicLayout from "../components/layout/PublicLayout";
import Badge from "../components/common/Badge";

function Busquedadni() {
  const [dni, setDni] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!dni.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingresa tu número de DNI o CUIT.",
      });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await getEstadoDniRequest(dni.trim());
      setResults(res.data.tasks || []);
    } catch (error) {
      console.error("Error al buscar el estado:", error);
      setResults([]);
      if (error.response?.status !== 404) {
        Swal.fire({
          icon: "error",
          title: "Error de consulta",
          text: error.response?.data?.message || "Ocurrió un error al buscar el estado del trámite.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado) => {
    if (!estado) return <Badge variant="light" color="neutral">Sin Estado</Badge>;
    const st = estado.toLowerCase();
    switch (st) {
      case "ingresado":
        return <Badge variant="light" color="neutral" dot>Ingresado</Badge>;
      case "pendiente":
        return <Badge variant="light" color="warning" dot>Pendiente</Badge>;
      case "controlado":
        return <Badge variant="light" color="info" dot>En Revisión</Badge>;
      case "aprobado":
        return <Badge variant="light" color="success" dot>Aprobado</Badge>;
      case "rechazado":
        return <Badge variant="light" color="error" dot>Rechazado</Badge>;
      case "finalizado":
        return <Badge variant="solid" color="neutral">Finalizado</Badge>;
      default:
        return <Badge variant="light" color="neutral">{estado}</Badge>;
    }
  };

  return (
    <PublicLayout maxWidth="max-w-4xl" fullHeight={false}>
      <div className="space-y-6">
        {/* BUSCADOR CARD */}
        <div className="backdrop-blur-md bg-white/95 rounded-2xl p-6 sm:p-8 border border-white/30 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-3 shadow-theme-xs border border-brand-200/60">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Consultar Estado de Trámite
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Ingresa tu DNI o CUIT sin puntos para verificar el avance de tu expediente de expendio.
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ej: 28313573 o 30717756599"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs text-center font-medium"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto shrink-0 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-medium py-2.5 px-6 rounded-xl shadow-theme-xs transition-all duration-150 cursor-pointer focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50"
            >
              {loading ? "Buscando..." : "Consultar"}
            </button>
          </form>
        </div>

        {/* RESULTADOS */}
        {searched && (
          <div className="space-y-4">
            {results.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {results.map((task, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-theme-sm flex flex-col justify-between transition-all hover:shadow-theme-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                            Expediente
                          </span>
                          <h3 className="text-base font-bold text-gray-900">
                            {task.nroexpediente || "Sin asignar"}
                          </h3>
                        </div>
                        <div>{getStatusBadge(task.estado)}</div>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                        <p>
                          <strong className="text-gray-800">Titular:</strong> {task.nombre} {task.apellido}
                        </p>
                        <p>
                          <strong className="text-gray-800">Tipo de Expendio:</strong> {task.expendio || "No especificado"}
                        </p>
                        <p>
                          <strong className="text-gray-800">Fecha de Ingreso:</strong>{" "}
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString("es-AR") : "Reciente"}
                        </p>
                      </div>
                    </div>

                    {/* MOTIVOS Y OBSERVACIONES */}
                    {task.motivoRechazo && task.estado?.toLowerCase() !== "aprobado" && task.estado?.toLowerCase() !== "finalizado" && (
                      task.estado?.toLowerCase() === "rechazado" ? (
                        <div className="mt-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm">
                          <strong className="block mb-1 font-semibold flex items-center gap-1.5 text-rose-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Motivo de Observación / Rechazo:
                          </strong>
                          <p className="whitespace-pre-line text-rose-700 leading-relaxed">{task.motivoRechazo}</p>
                        </div>
                      ) : (
                        <div className="mt-2 p-3.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
                          <span className="text-lg">⏳</span>
                          <div>
                            <strong className="block mb-0.5 font-semibold text-sky-900">Documentación en Verificación:</strong>
                            <p className="text-xs text-sky-700"><strong>Motivos previos:</strong> {task.motivoRechazo}</p>
                          </div>
                        </div>
                      )
                    )}

                    {task.estado?.toLowerCase() === "aprobado" && task.motivoAprobacion && (
                      <div className="mt-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm">
                        <strong className="block mb-1 font-semibold text-emerald-900">
                          Información de Pago / Aprobación:
                        </strong>
                        <p className="whitespace-pre-line text-emerald-700 leading-relaxed">{task.motivoAprobacion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-md bg-white/95 rounded-2xl p-8 border border-white/30 text-center shadow-lg">
                <p className="text-sm font-semibold text-gray-700">
                  No se encontraron trámites registrados para el DNI/CUIT: <span className="text-brand-600 font-bold">{dni}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Verifica que el número ingresado sea correcto o comunícate con la Subsecretaría de Gobierno.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default Busquedadni;
