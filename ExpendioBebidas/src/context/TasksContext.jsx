import { createContext, useContext, useState } from "react";
import { createTasksRequest,createTasksPublicRequest, deleteTasksRequest, getTaskRequest, getTasksRequest, updateTasksRequest, getPagoRequest,updatePagoRequest, getEstadoDniRequest } from "../api/tasks";
import { trusted } from "mongoose";
import React, { useEffect } from "react";

const TaskContext = createContext()

export const useTasks = () => {
    const context = useContext(TaskContext)

    if (!context) {
        throw new Error("useTasks must be used withing a TaskProvider")
    }

    return context;
}

export function TaskProvider({ children }) {

    const [tasks, setTasks] = useState([]);
    const [pago, setPago] = useState({
  unidaduf: 0,
  valoruf: 0,
  valortotal: 0,  // Aquí también debería estar valortotal
});

    const getTasks = async () => {
        try {
            const res = await getTasksRequest()
            setTasks(res.data)
        } catch (error) {
            console.error(error)
        }

    }


    const createTask = async (task) => {
        const res = await createTasksRequest(task)
        console.log(task)
        return res.data
    }

    const createTasksPublic = async (task) => {
        const res = await createTasksPublicRequest(task);
        console.log("Respuesta del servidor:", res); // Verifica que la respuesta contenga lo que esperas
        return res.data;  // Devuelve la respuesta correcta
    }
    
    const deleteTask = async (id) => {
        try {
            const res = await deleteTasksRequest(id);
            if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const getDni = async (dni) => {
        const res = await getEstadoDniRequest(dni);
        return res.data;
      };
      
    

    const getTask = async (id) =>{
        const res = await getTaskRequest(id)
        return res.data
    }

    const updateTask = async (id,task) =>{
        await updateTasksRequest(id, task)

    }

    // Dentro del TaskProvider, agrega esta función:
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            // Llamada a la API para actualizar el estado de la tarea en el backend
            const res = await updateTasksRequest(taskId, { estado: newStatus });
            
            // Verificar si la actualización fue exitosa antes de actualizar el estado localmente
            if (res.status === 200) {
                setTasks((prevTasks) => 
                    prevTasks.map((task) => 
                        task._id === taskId ? { ...task, estado: newStatus } : task
                    )
                );
            }
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea:", error);
        }
    };

    const updatePagoStatus = async (id, pagoStatus) => {
        try {
            // Realiza la solicitud al backend para actualizar el estado del pago
            const res = await updatePagoRequest(id, { pago: pagoStatus });
            if (res.status === 200) {
                // Si la respuesta es exitosa, actualiza el estado de pago en el frontend
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === id ? { ...task, pago: pagoStatus } : task
                    )
                );
            }
        } catch (error) {
            console.error("Error al actualizar el estado de pago:", error);
        }
    };
    


    
    const getPago = async () => {
        try {
          const res = await getPagoRequest(); // Suponiendo que la respuesta es la que muestras
          setPago({
            unidaduf: res.data.unidaduf, // Asigna todos los valores necesarios
            valoruf: res.data.valoruf,
            valortotal: res.data.valortotal,
          });
        } catch (error) {
          console.error("Error al obtener el pago:", error);
        }
      };
      
      const updatePago = async (newPagoValue) => {
        try {
          console.log("Datos a enviar:", newPagoValue);
          const res = await updatePagoRequest(newPagoValue);
          setPago({
            unidaduf: res.data.unidaduf,
            valoruf: res.data.valoruf,
            valortotal: res.data.valortotal,
          });
        } catch (error) {
          if (error.response) {
            console.error("Error al actualizar el valor de Pago:", error.response.data); // Muestra detalles del error de la respuesta
            console.error("Código de estado:", error.response.status); // Código de estado
          } else {
            console.error("Error al actualizar el valor de Pago:", error.message); // Muestra el mensaje de error
          }
        }
      };
      
      
    

    useEffect(() => {
        getPago(); // Obtiene el valor de Pago cuando el componente se monta
    }, []); // Solo se ejecuta una vez cuando el componente se monta




return (
    <TaskContext.Provider value={{   tasks,
        createTask,
        createTasksPublic,
        getTasks,
        deleteTask,
        getTask,
        updateTask,
        updateTaskStatus,
        pago,
        getPago,
        getDni,
        updatePagoStatus,
        updatePago }}>
        {children}
    </TaskContext.Provider>
)

}