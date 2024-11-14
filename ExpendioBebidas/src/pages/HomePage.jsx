import React from 'react';
import { Link } from 'react-router-dom';
import "./login.css";

function HomePage() {
  return (
    <section>
      <header
        className="bg-cover bg-no-repeat py-10 text-white relative flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('./fondos/fondo.jpg')`,
          backgroundPosition: 'center bottom', // Centra horizontalmente y alinea en la parte inferior
          padding: '12vw 2rem', // Padding ajustable en unidades relativas (viewport width)
        }}
      >
        <div className="bg-dark-overlay absolute inset-0"></div> {/* Superposición de color oscuro */}
        <div className="container mx-auto relative z-10 text-center"> {/* Contenido del encabezado */}
          <h1 className="text-5xl font-bold mb-4">Solicitud Provincial de Expendio de Bebidas</h1>
          
         
          
          {/* Agregar la clase personalizada al Link */}
          <Link
            className="custom-button hover:bg-blue-600 hover:border-blue-600 hover:text-white border-blue-500 border-2 px-4 py-2 rounded-md inline-block mt-4"
            to="/register"
          >
            Bienvenido
          </Link>
        </div>
      </header>
    </section>
  );
}

export default HomePage;
