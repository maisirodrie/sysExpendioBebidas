import React from 'react';
import './Footer.css'; // Archivo de estilos para el footer

function Footer() {
  return (
    <footer className="bg-gray-200 py-5 px-10 flex flex-col md:flex-row justify-between items-center w-full">
      <div className="container mx-auto flex">
        <p className="text-center">&copy; Centro de Computos de la Provincia 2024 Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;
