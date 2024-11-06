import { createContext, useContext, useState } from "react";
import { createTasksRequest,createTasksPublicRequest, deleteTasksRequest, getTaskRequest, getTasksRequest, updateTasksRequest } from "../api/tasks";
import { trusted } from "mongoose";

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
    }

    const createTasksPublic  = async (task) => {
        const res = await createTasksPublicRequest(task)
        console.log(task)
    }

    
    const deleteTask = async (id) => {
        try {
            const res = await deleteTasksRequest(id);
            if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.log(error);
        }
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
        // Aquí llamarías a la API para actualizar el estado de la tarea
        await updateTasksRequest(taskId, { estado: newStatus });

        // Si la tarea se actualiza correctamente, puedes actualizar el estado en el cliente:
        setTasks(tasks.map((task) => 
            task._id === taskId ? { ...task, estado: newStatus } : task
        ));
    } catch (error) {
        console.error("Error al actualizar el estado de la tarea:", error);
    }
};





return (
    <TaskContext.Provider value={{ tasks, createTask, createTasksPublic, getTasks, deleteTask, getTask, updateTask, updateTaskStatus }}>
        {children}
    </TaskContext.Provider>
)

}