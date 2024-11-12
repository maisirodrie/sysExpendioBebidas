import { useState, useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import Swal from "sweetalert2";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pago = () => {
  const { pago, updatePago } = useTasks();
  const [unidaduf, setUnidadUF] = useState(1); // Unidad de UF predeterminada
  const [valoruf, setValorUF] = useState(pago?.valoruf || 0); // Valor de U.F. obtenido de `pago`
  const [valortotal, setImporteTotal] = useState(valoruf * unidaduf); // Calcula el importe total
  const navigate = useNavigate();

  useEffect(() => {
    if (pago) {
      setValorUF(pago.valoruf || 0);
      setUnidadUF(1); // Valor predeterminado de unidad U.F.
    }
  }, [pago]);

  useEffect(() => {
    // Recalcula el importe total cuando cambian `valoruf` o `unidadUF`
    setImporteTotal(valoruf * unidaduf);
  }, [valoruf, unidaduf]);

  const onSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Cargando...",
      text: "Por favor, espere mientras se actualiza el valor.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await updatePago({
        valoruf: Number(valoruf),
        unidaduf: Number(unidaduf),
        valortotal, // Usa el valor ya calculado por useEffect
      });

      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "El valor de pago se actualizó correctamente.",
      });
      navigate("/task");
    } catch (error) {
      console.error(
        "Error al actualizar el valor de Pago:",
        error.response || error
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el valor de pago.",
      });
    }
  };

  const handleChangeValorUF = (e) => {
    setValorUF(e.target.value ? Number(e.target.value) : 0);
  };

  const handleChangeUnidadUF = (e) => {
    setUnidadUF(e.target.value ? Number(e.target.value) : 1); // Asegurando un valor por defecto
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
          <h1 className="text-2xl font-bold text-black">
            Actualizar Valor de Pago
          </h1>
          <Link to="/task" className="btn btn-success">
            <FontAwesomeIcon icon={faArrowLeft} />{" "}
            {/* Ícono de flecha hacia la izquierda */}
          </Link>
        </div>
        <form onSubmit={onSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-black font-semibold">
              Valor de Unidad UF:
            </label>
            <input
              type="number"
              value={unidaduf}
              onChange={handleChangeUnidadUF}
              className="border border-gray-300 p-2 rounded mt-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black font-semibold">
              Valor de U.F.:
            </label>
            <input
              type="number"
              value={valoruf}
              onChange={handleChangeValorUF}
              className="border border-gray-300 p-2 rounded mt-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black font-semibold">
              Importe Total:
            </label>
            <input
              type="number"
              value={valortotal}
              disabled
              className="border border-gray-300 p-2 rounded mt-1 w-full bg-gray-200 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
          >
            Actualizar Pago
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pago;
