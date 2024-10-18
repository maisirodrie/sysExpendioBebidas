// src/api/taskApi.js

import axios from "./axios";

// Funciones para manejar tareas
export const getTasksRequest = () => axios.get("/tasks");

export const getTaskRequest = (id) => axios.get(`/tasks/${id}`);

export const createTasksRequest = (task) => axios.post("/tasks", task);

export const updateTasksRequest = (id, task) => axios.put(`/tasks/${id}`, task);

export const deleteTasksRequest = (id) => axios.delete(`/tasks/${id}`);

// Agrega la función para crear tareas públicas
// En src/api/tasks.js
export const createTasksPublicRequest = (task) => axios.post("/taskspublico", task);

