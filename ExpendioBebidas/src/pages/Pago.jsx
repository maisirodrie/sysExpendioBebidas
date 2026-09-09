import { useState, useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import Swal from "sweetalert2";
import { faArrowLeft, faCoins, faCalculator } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComponentCard from "../components/common/ComponentCard";
import Button from "../components/common/Button";

const Pago = () => {
  const { pago, updatePago } = useTasks();
  const [unidaduf, setUnidadUF] = useState(1);
  const [valoruf, setValorUF] = useState(pago?.valoruf || 0);
  const [valortotal, setImporteTotal] = useState(valoruf * unidaduf);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (pago) {
      setValorUF(pago.valoruf || 0);
      setUnidadUF(1);
    }
  }, [pago]);

  useEffect(() => {
    setImporteTotal(valoruf * unidaduf);
  }, [valoruf, unidaduf]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updatePago({
        valoruf: Number(valoruf),
        unidaduf: Number(unidaduf),
        valortotal,
      });

      Swal.fire({
        icon: "success",
        title: "Valores actualizados",
        text: "Los aranceles de Unidad Fija (U.F.) se actualizaron correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/task");
    } catch (error) {
      console.error("Error al actualizar el valor de Pago:", error.response || error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el valor de pago.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeValorUF = (e) => {
    setValorUF(e.target.value ? Number(e.target.value) : 0);
  };

  const handleChangeUnidadUF = (e) => {
    setUnidadUF(e.target.value ? Number(e.target.value) : 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-outfit">
      <ComponentCard
        title="Actualizar Valores de Arancel (U.F.)"
        description="Parámetros de cálculo para aranceles del Fondo Especial Provincial de Expendio"
        headerAction={
          <Link to="/task">
            <Button
              variant="secondary"
              size="sm"
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Volver
            </Button>
          </Link>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Cantidad de Unidades U.F.
            </label>
            <input
              type="number"
              value={unidaduf}
              onChange={handleChangeUnidadUF}
              min="0"
              step="any"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs"
              required
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Multiplicador de unidades fijas aplicable a la tasa.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Valor unitario de cada U.F. ($ ARS)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold">$</span>
              <input
                type="number"
                value={valoruf}
                onChange={handleChangeValorUF}
                min="0"
                step="any"
                className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition shadow-theme-xs font-mono font-semibold"
                required
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Precio vigente de la Unidad Fija según reglamentación provincial.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider block">
                Importe Total Calculado
              </span>
              <span className="text-2xl font-extrabold text-brand-900 font-mono">
                $ {valortotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faCalculator} className="text-lg" />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Guardar Nuevo Valor de Arancel
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default Pago;
