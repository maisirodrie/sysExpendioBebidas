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

// Función para cambiar el estado de una tarea
export const updateTaskStatusRequest = (id, newState) => 
  axios.put(`/tasks/estado/${id}`, { newState });

// src/api/taskApi.js
export const getPagoRequest = () => axios.get("/admin/pago");

export const updatePagoRequest = (newPagoValue) => {
    return axios.put('/admin/pago', {
      unidaduf: newPagoValue.unidaduf, 
      valoruf: newPagoValue.valoruf, 
      valortotal: newPagoValue.valortotal // Incluir este campo
    });
  };

  export const getEstadoDniRequest = (dni) => axios.get(`/tasks/search/${dni}`);

  export const reportePDFRequest = async (filters, selectedColumns) => {
    const response = await axios.post("/tasks/reporte", {
      filters,
      selectedColumns,
    }, {
      responseType: "blob", // Importante para manejar archivos
    });
  
    // Descarga automática del PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reporte_tareas_filtrado.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  export const reporteExcelRequest = async (filters, selectedColumns) => {
    const response = await axios.post(
      "/tasks/reporte",
      { filters, selectedColumns },
      { responseType: "blob" } // Necesario para manejar archivos
    );
  
    // Descarga automática del Excel
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reporte_tareas_filtrado.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  