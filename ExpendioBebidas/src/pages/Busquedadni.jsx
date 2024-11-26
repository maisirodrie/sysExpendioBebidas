import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getEstadoDniRequest } from "../api/tasks";// Asegúrate de importar correctamente
import "./login.css";

function Busquedadni() {
  const [dni, setDni] = useState(""); // Estado para el DNI ingresado

  const handleSearch = async () => {
    if (!dni) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, ingresa un DNI.",
      });
      return;
    }
  
    try {
      const res = await getEstadoDniRequest(dni);
      const { nombre, apellido, nroexpediente, estado } = res.data;
  
      if (!nombre || !apellido) {
        Swal.fire({
          icon: "info",
          title: "No encontrado",
          text: "No se encontraron datos para este DNI.",
        });
        return;
      }
  
      // Convertir el estado a mayúsculas
      const estadoMayusculas = estado.toUpperCase();
  
      // Determinar color del estado
      const estadoColores = {
        ingresado: "gray",
        pendiente: "orange",
        controlado: "blue",
        aprobado: "green",
        rechazado: "red",
        finalizado: "black",
      };
  
      const colorEstado = estadoColores[estado.toLowerCase()] || "black";
  
      // Mostrar datos con SweetAlert2
      Swal.fire({
        icon: "info",
        title: "Estado del trámite",
        html: `
          <strong>Nombre:</strong> ${nombre} ${apellido}<br/>
          <strong>Nro. Expediente:</strong> ${nroexpediente}<br/>
          <strong>Estado:</strong> 
          <span style="color: ${colorEstado}; font-weight: bold;">${estadoMayusculas}</span>
        `,
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
          padding: "12vw 2rem",
        }}
      >
        <div className="bg-dark-overlay absolute inset-0"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Solicitud Provincial de Expendio de Bebidas
          </h1>

          {/* Campo de búsqueda */}
          <div className="flex flex-col items-center mt-8">
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingresa el DNI"
              className="border px-2 py-2 rounded-md text-black w-34 text-center"
            />
            <button
              onClick={handleSearch}
              className="custom-button mt-4  hover:bg-blue-600 hover:border-blue-600 hover:text-white border-blue-500 border-2 px-4 py-2 rounded-md"
            >
              Consultar
            </button>
          </div>
        </div>
      </header>
    </section>
  );
}

export default Busquedadni;
