import { useTasks } from "../context/TasksContext";

const Vistapago = () => {
  const { pago } = useTasks(); // Usamos el hook para obtener el valor de pago

  return (
      <div>
          <p>Valor del registro U.F : ${pago}</p> {/* Aquí mostramos el valor de pago */}
      </div>
  );
};

export default Vistapago;