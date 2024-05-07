import React from 'react';
import { Link } from 'react-router-dom';
import "./login.css";

function HomePage() {
  return (
    <section>
      {/* <div className="bg-yellow-200 rounded-lg p-4 text-center">
            <h2 className="text-lg font-bold mb-2">¡Próximamente!</h2>
            <p className="text-sm text-gray-700">Esta página se habilitará</p>
          </div> */}
      
      
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
        <h1 className="text-5xl font-bold mb-4">Sistema de Registro Oficial de Hacedores y Trabajadores de la Danza en La Provincia de Misiones</h1>
          <p className="text-md mb-8">
            “La Danza abarca todas las formas de expresión artística corporal
            en sus diversos géneros, estilos y formatos interpretativos”
          </p>
          <Link
  className="hover:bg-blue-600 hover:border-blue-600 hover:text-white bg-blue-500 text-white border-blue-500 border-2 px-4 py-2 rounded-md inline-block"
  to="/login"
>
  Bienvenido
</Link> 


        </div>
      </header>
    </section>
  );
}

export default HomePage;

