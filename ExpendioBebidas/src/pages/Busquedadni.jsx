import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getEstadoDniRequest } from "../api/tasks"; // Asegúrate de importar correctamente
import "./login.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Busquedadni() {
  const [dni, setDni] = useState(""); // Estado para el DNI ingresado

  // ... (resto de tu código)

const handleSearch = async (e) => {
  e.preventDefault();

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
    const { nombre, apellido, nroexpediente, estado, motivoRechazo } = res.data;

    if (!nombre || !apellido) {
      Swal.fire({
        icon: "info",
        title: "No encontrado",
        text: "No se encontraron datos para este DNI.",
      });
      return;
    }

    // Preparación de datos para el modal
    const estadoMayusculas = estado.toUpperCase();
    const estadoColores = {
      ingresado: "gray",
      pendiente: "orange",
      controlado: "blue",
      aprobado: "green",
      rechazado: "red",
      finalizado: "black",
    };
    const colorEstado = estadoColores[estado.toLowerCase()] || "black";
    const nroExpedienteDisplay = nroexpediente === null ? "No asignado" : nroexpediente;
    const motivoRechazoConSaltos = motivoRechazo ? motivoRechazo.replace(/\n/g, '<br/>') : '';

    // Unifica todo el contenido HTML en una sola cadena
    const modalHtml = `
      <div style="text-align: left; padding-left: 20px;">
        <strong>Nombre:</strong> ${nombre} ${apellido}<br/>
        <strong>Nro. Expediente:</strong> ${nroExpedienteDisplay}<br/>
        <strong>Estado:</strong> 
        <span style="color: ${colorEstado}; font-weight: bold;">${estadoMayusculas}</span>
        ${estado.toLowerCase() === "rechazado" && motivoRechazo ? `
          <div style="margin-top: 10px;">
            <strong>Motivo:</strong><br/>
            <span style="display: block; padding-left: 20px;">${motivoRechazoConSaltos}</span>
          </div>` : ''}
      </div>
    `;

    // Muestra el modal con el contenido unificado
    Swal.fire({
      icon: "info",
      title: "Estado del trámite",
      html: modalHtml,
    });

  } catch (error) {
    console.error("Error al buscar el estado:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        "Ocurrió un error al buscar el estado de la tarea.",
    });
  }
};

  

  return (
    <section>
      <header
        className="bg-cover bg-no-repeat py-10 text-white relative flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('./fondos/fondo.jpg')`,
          backgroundPosition: "center bottom",
          height: "85vh",
        }}
      >
        
        <div className="bg-dark-overlay absolute inset-0 bg-black opacity-75"></div>
        
        <div className="container mx-auto relative z-10 text-center">
            <Link
                      to="/"
                      className="btn btn-success"
                      onClick={() => navigate("/")}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />{" "}
                      {/* Ícono de flecha hacia la izquierda */}
                    </Link>
          
          <h1 className="text-5xl font-bold mb-4">
            Solicitud Provincial de Expendio de Bebidas
          </h1>
          
          
          {/* Campo de búsqueda */}
          <p>Introduce tu DNI/CUIT para consultar el estado de tu trámite.</p>
          <form onSubmit={handleSearch} className="flex flex-col items-center mt-8">
            
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingresa tu DNI/CUIT"
              className="border px-2 py-2 rounded-md text-black w-34 text-center"
            />
            <button
              type="submit"
              className="custom-button mt-4 hover:bg-blue-600 hover:border-blue-600 hover:text-white border-blue-500 border-2 px-4 py-2 rounded-md"
            >
              Consultar
            </button>
            
          </form>
        </div>
      </header>
    </section>
  );
}

export default Busquedadni;