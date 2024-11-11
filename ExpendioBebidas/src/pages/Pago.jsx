import { useState, useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import Swal from "sweetalert2";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pago = () => {
  const { pago, updatePago } = useTasks();
  const [newPagoValue, setNewPagoValue] = useState(pago);
  const navigate = useNavigate();

  useEffect(() => {
    setNewPagoValue(pago);
  }, [pago]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Mostrar alerta de carga
    Swal.fire({
      title: "Cargando...",
      text: "Por favor, espere mientras se actualiza el valor.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Actualizar el valor de pago llamando a updatePago
      await updatePago(Number(newPagoValue));

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "El valor de pago se actualizó correctamente.",
      });
      navigate("/task");
    } catch (error) {
      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el valor de pago.",
      });
      console.error(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center overflow-y-auto"
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        paddingRight: "20px",
        paddingLeft: "20px",
      }}
    >
      <div className="bg-gray-300 max-w-screen-md w-full p-10 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Actualizar Valor de Pago</h1>
          <Link to="/task" className="btn btn-success">
            <FontAwesomeIcon icon={faArrowLeft} /> {/* Ícono de flecha hacia la izquierda */}
          </Link>
        </div>
        <form onSubmit={onSubmit} className="mt-4">
          <div>
            <input
              type="number"
              value={newPagoValue}
              onChange={(e) => setNewPagoValue(e.target.value)}
              className="border border-gray-300 p-2 rounded mt-1 mb-4 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Actualizar Pago
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pago;
