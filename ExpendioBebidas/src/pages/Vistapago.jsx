import { useTasks } from "../context/TasksContext";

const Vistapago = () => {
  const { pago } = useTasks(); // Usamos el hook para obtener el valor de pago

  return (
      <div className="bg-gray-100 p-4 rounded-md shadow-md max-w-md mx-auto mt-4">
      <p>Valor del registro : ${pago?.valortotal || 0}</p>
    </div>
  );
};

export default Vistapago;
