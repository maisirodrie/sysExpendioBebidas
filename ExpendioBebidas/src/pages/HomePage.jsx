import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getEstadoDniRequest } from "../api/tasks";// Asegúrate de importar correctamente
import "./login.css";

function HomePage() {
  const [dni, setDni] = useState(""); // Estado para el DNI ingresado

  

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
        <div className="container mx-auto relative z-10 text-center space-x-4">
          <h1 className="text-5xl font-bold mb-4">
            Solicitud Provincial de Expendio de Bebidas
          </h1>
          <Link
            className="custom-button hover:bg-blue-600 hover:border-blue-600 hover:text-white border-blue-500 border-2 px-4 py-2 rounded-md inline-block mt-8"
            to="/register"
          >
            Registro Expendio
          </Link>

          <Link
            className="custom-button hover:bg-blue-600 hover:border-blue-600 hover:text-white border-blue-500 border-2 px-4 py-2 rounded-md inline-block mt-8"
            to="/consulta-estado"
          >
            Consultar Estado
          </Link>

          
        </div>
      </header>
    </section>
  );
}

export default HomePage;
