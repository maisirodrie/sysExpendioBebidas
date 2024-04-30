import { createContext, useContext, useState } from "react";
import { createTasksRequest, deleteTasksRequest, getTaskRequest, getTasksRequest, updateTasksRequest } from "../api/tasks";
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




    return (
        <TaskContext.Provider value={{ tasks, createTask, getTasks, deleteTask, getTask, updateTask }}>
            {children}
        </TaskContext.Provider>
    )
}