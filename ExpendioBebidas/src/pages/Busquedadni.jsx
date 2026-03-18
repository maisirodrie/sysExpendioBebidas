import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getEstadoDniRequest } from "../api/tasks"; // Asegúrate de importar correctamente
import "./login.css";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; // Añadido faInfoCircle
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Busquedadni() {
  const [dni, setDni] = useState(""); // Estado para el DNI ingresado
  const [results, setResults] = useState([]); // Estado para los resultados
  const [searched, setSearched] = useState(false); // Flag para saber si ya se buscó

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);

    if (!dni) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, ingresa un DNI/CUIT.",
      });
      return;
    }

    try {
      const res = await getEstadoDniRequest(dni);
      setResults(res.data.tasks || []);
    } catch (error) {
      console.error("Error al buscar el estado:", error);
      setResults([]);
      if (error.response?.status !== 404) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Ocurrió un error al buscar el estado de la tarea.",
        });
      }
    }
  };

  const badgeColor = (estado) => {
    const defaultStyle = "bg-gray-500 text-white";
    if (!estado) return defaultStyle;
    
    const colors = {
      ingresado: "bg-gray-400 text-white",
      pendiente: "bg-orange-400 text-white",
      controlado: "bg-blue-400 text-white", // Se muestra 'en revisión'
      aprobado: "bg-green-500 text-white",
      rechazado: "bg-red-500 text-white",
      finalizado: "bg-neutral-800 text-white",
    };
    return colors[estado.toLowerCase()] || defaultStyle;
  };

  return (
    <section className="bg-slate-900 min-h-screen text-white flex flex-col">
      <header
        className="bg-cover bg-no-repeat py-10 text-white relative flex flex-col justify-center items-center transition-all duration-500"
        style={{
          backgroundImage: `url('./fondos/fondo.jpg')`,
          backgroundPosition: "center bottom",
          height: results.length > 0 ? "40vh" : "85vh", 
        }}
      >
        <div className="bg-dark-overlay absolute inset-0 bg-black opacity-75"></div>
        
        <div className="container mx-auto relative z-10 text-center">
          <Link to="/" className="btn btn-success mb-2 inline-block">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 px-4">
            Solicitud Provincial de Expendio de Bebidas
          </h1>
          
          <p className="px-4">Introduce tu DNI/CUIT para consultar el estado de tu trámite.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col items-center mt-6">
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingresa tu DNI/CUIT"
              className="border px-4 py-2 rounded-md text-black w-64 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="custom-button mt-4 hover:bg-blue-600 hover:border-blue-600 hover:text-white border-blue-500 border-2 px-6 py-2 rounded-md font-semibold"
            >
              Consultar
            </button>
          </form>
        </div>
      </header>

      {/* Grid de Resultados */}
      {searched && (
        <div className="container mx-auto flex-grow py-8 px-4">
          {results.length > 0 ? (
            <div>
              <div className="flex justify-center items-center mb-6">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 text-2xl mr-2" />
                <h2 className="text-2xl font-bold text-blue-300">
                  Estado del trámite
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((task, index) => {
                  const displayEstado = task.estado === 'controlado' ? 'en revisión' : task.estado;
                  return (
                    <div 
                      key={index} 
                      className="bg-white text-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-blue-400 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-lg text-blue-900 capitalize">
                            {task.expendio || "Expendición"}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${badgeColor(task.estado)}`}>
                            {displayEstado}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Titular:</strong> {task.nombre} {task.apellido}</p>
                          <p><strong>Número Expediente:</strong> {task.nroexpediente}</p>
                          <p><strong>Fecha de Ingreso:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {task.estado.toLowerCase() === 'rechazado' && task.motivoRechazo && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                          <strong className="block mb-1">Motivo de Rechazo:</strong>
                          <p className="whitespace-pre-line">{task.motivoRechazo}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-10">
              <p className="text-xl font-semibold">No se encontraron trámites registrados para el DNI/CUIT ingresado.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Busquedadni;

