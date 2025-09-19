import { createContext, useContext, useState, useEffect } from "react";
import { createTasksRequest, createTasksPublicRequest, deleteTasksRequest, getTaskRequest, getTasksRequest, updateTasksRequest, getPagoRequest, updatePagoRequest, getEstadoDniRequest, reporteExcelRequest, reportePDFRequest,updateTaskStatusRequest } from "../api/tasks";
import { useAuth } from "../context/AuthContext";

const TaskContext = createContext();

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
};

export function TaskProvider({ children }) {
    // Obtenemos isAuthenticated, loading y logout del hook useAuth
    const { isAuthenticated, loading, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [errors, setErrors] = useState([]); // Añadido para manejar los errores
    const [pago, setPago] = useState({
        unidaduf: 0,
        valoruf: 0,
        valortotal: 0,
    });

    // Efecto para limpiar los errores después de 5 segundos
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    const getTasks = async () => {
        try {
            const res = await getTasksRequest();
            setTasks(res.data);
        } catch (error) {
            console.error(error);
            // Manejamos el error de token inválido o expirado
            if (error.response && error.response.status === 403) {
                logout(); // Llama a la función de logout para limpiar el token
                setErrors(["Sesión expirada o token inválido. Por favor, inicia sesión de nuevo."]);
            } else {
                setErrors(["No se pudieron cargar las tareas."]);
            }
        }
    };

    const generateReportpdf = async (filters, selectedColumns) => {
        try {
            await reportePDFRequest(filters, selectedColumns);
        } catch (error) {
            console.error("Error al generar el reporte:", error);
        }
    };

    const generateReportxlsx = async (filters, selectedColumns) => {
        try {
            await reporteExcelRequest(filters, selectedColumns);
        } catch (error) {
            console.error("Error al generar el reporte:", error);
        }
    };

    const createTask = async (task) => {
        const res = await createTasksRequest(task);
        return res.data;
    };

    const createTasksPublic = async (task) => {
        const res = await createTasksPublicRequest(task);
        return res.data;
    };

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

    const getTask = async (id) => {
        const res = await getTaskRequest(id);
        return res.data;
    };

    const updateTask = async (id, task) => {
        await updateTasksRequest(id, task);
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const res = await updateTaskStatusRequest(taskId, newStatus);
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
            const res = await updateTasksRequest(id, { pago: pagoStatus });
            if (res.status === 200) {
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
            const res = await getPagoRequest();
            setPago({
                unidaduf: res.data.unidaduf,
                valoruf: res.data.valoruf,
                valortotal: res.data.valortotal,
            });
        } catch (error) {
            console.error("Error al obtener el pago:", error);
        }
    };

    const updatePago = async (newPagoValue) => {
        try {
            const res = await updatePagoRequest(newPagoValue);
            setPago({
                unidaduf: res.data.unidaduf,
                valoruf: res.data.valoruf,
                valortotal: res.data.valortotal,
            });
        } catch (error) {
            if (error.response) {
                console.error("Error al actualizar el valor de Pago:", error.response.data);
                console.error("Código de estado:", error.response.status);
            } else {
                console.error("Error al actualizar el valor de Pago:", error.message);
            }
        }
    };

    // Este useEffect se encargará de obtener las tareas solo cuando el usuario se haya autenticado y el loading sea falso
    useEffect(() => {
        if (!loading && isAuthenticated) {
            // Se agrega un pequeño retraso para asegurar que el token se ha adjuntado a la solicitud
            const timer = setTimeout(() => {
                getTasks();
            }, 300); // 300ms de retraso
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, loading]);

    return (
        <TaskContext.Provider value={{
            tasks,
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
            updatePago,
            generateReportpdf,
            generateReportxlsx,
            errors, // Añadido para que los componentes puedan acceder a los errores
        }}>
            {children}
        </TaskContext.Provider>
    );
}
