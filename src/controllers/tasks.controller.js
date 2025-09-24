import mongoose from "mongoose";
import fs from 'fs';
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
import autoTable from "jspdf-autotable";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { gfs } from "../multerConfig.js"; // Importa gfs desde multerConfig.js
import Activity from "../models/activity.model.js"; // Asegúrate de que esta ruta es correcta
import { PDFDocument } from 'pdf-lib';
import crypto from 'crypto'; // Importar el módulo crypto para generar UUIDs

export const generateTasksPDF = async (req, res) => {
  try {
    const { filters, selectedColumns } = req.body;

    // Construir la consulta basada en los filtros
    const query = {};
    if (filters) {
      if (filters.dni) query.dni = filters.dni;
      if (filters.nroexpediente) query.nroexpediente = filters.nroexpediente;
      if (filters.persona) query.persona = filters.persona;
      if (filters.localidad) query.localidad = filters.localidad;
    }

    const tasks = await Task.find(query);

    if (!tasks.length) {
      return res.status(404).json({ message: "No hay datos que coincidan con los filtros." });
    }

    const allColumns = {
      nroexpediente: "N° Expediente",
      apellido: "Apellido",
      nombre: "Nombre",
      dni: "DNI",
      localidad: "Localidad",
      persona: "Tipo de Persona",
      expendio: "Tipo de Expendio",
    };

    const tableColumn = selectedColumns.map((col) => allColumns[col]);
    const tableRows = tasks.map((task) =>
      selectedColumns.map((col) => task[col] || "N/A")
    );

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte Filtrado de Tareas", 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 10 },
    });

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_tareas_filtrado.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).json({ message: "Error al generar el PDF.", error });
  }
};

export const generateTasksExcel = async (req, res) => {
  try {
    const { filters, selectedColumns } = req.body;

    // Construir la consulta basada en los filtros
    const query = {};
    if (filters) {
      if (filters.dni) query.dni = filters.dni;
      if (filters.nroexpediente) query.nroexpediente = filters.nroexpediente;
      if (filters.persona) query.persona = filters.persona;
      if (filters.localidad) query.localidad = filters.localidad;
    }

    const tasks = await Task.find(query);

    if (!tasks.length) {
      return res.status(404).json({ message: "No hay datos que coincidan con los filtros." });
    }

    const allColumns = {
      nroexpediente: "N° Expediente",
      apellido: "Apellido",
      nombre: "Nombre",
      dni: "DNI",
      localidad: "Localidad",
      persona: "Tipo de Persona",
      expendio: "Tipo de Expendio",
    };

    const tableData = tasks.map((task) => {
      const row = {};
      selectedColumns.forEach((col) => {
        row[allColumns[col]] = task[col] || "N/A";
      });
      return row;
    });

    // Crear la hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    // Convertir a buffer y enviar al cliente
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_tareas_filtrado.xlsx"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error al generar el Excel:", error);
    res.status(500).json({ message: "Error al generar el Excel.", error });
  }
};


export const getTaskByDni = async (req, res) => {
  const { dni } = req.params;

  try {
    // Busca la tarea asociada al DNI proporcionado
    const task = await Task.findOne({ dni }).select("estado dni nroexpediente nombre apellido motivoRechazo"); // <-- Añadido
    if (!task) {
      return res.status(404).json({ message: "No se encontraron datos para este DNI." });
    }

    // Devuelve el estado y otros detalles de la tarea
    res.json({
      success: true,
      dni: task.dni,
      nombre: task.nombre,
      apellido: task.apellido,
      nroexpediente: task.nroexpediente,
      estado: task.estado,
      motivoRechazo: task.motivoRechazo, // <-- AñadidoF
    });
  } catch (error) {
    console.error("Error al buscar el estado de la tarea:", error);
    return res.status(500).json({ message: "Error al buscar el estado de la tarea.", error });
  }
};


// Función para registrar la actividad del usuario
const logActivity = async (userId, action, entity, entityId) => {
  try {
    const activity = new Activity({
      userId, // Asegúrate de pasar userId
      taskId: entityId, // Asegúrate de pasar taskId aquí
      action,
      entity,
      entityId,
    });
    await activity.save();
    console.log("Actividad registrada:", activity);
  } catch (error) {
    console.error("Error registrando la actividad:", error);
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user");
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const createTasksPublic = async (req, res) => {
  try {
    const {
      expendio,
      persona,
      dni,
      apellido,
      nombre,
      localidad,
      domicilio,
      lugar,
      dias,
      horarios,
      tipoevento,
      email,
      contacto,
      nroHabilitacion,
      domicilioLocalComercial,
      rubro,
      estado,
      horarioAtencion,
      habilitacionComercial,
    } = req.body;

    // Verificar si ya existe una tarea con el mismo DNI
    const existingTask = await Task.findOne({ dni });
    if (existingTask) {
      return res.status(400).json({ message: "El DNI ya ha sido registrado." });
    }

    // Si se subió un archivo
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      bucketName: file.bucketName,
      mimetype: file.mimetype,
      encoding: file.encoding,
      id: file.id,
    })) : [];

    // Generar un identificador único temporal para evitar el error de llave duplicada
    const tempNroExpediente = crypto.randomUUID();

    // Crear la nueva tarea sin nroexpediente
    const newTask = new Task({
      expendio,
      persona,
      dni,
      apellido,
      nombre,
      localidad,
      domicilio,
      lugar,
      dias,
      horarios,
      tipoevento,
      email,
      contacto,
      nroHabilitacion,
      domicilioLocalComercial,
      rubro,
      estado,
      horarioAtencion,
      habilitacionComercial,
      file: files,
      pago: false, // Campo de pago, inicialmente "no pagado"
      nroexpediente: tempNroExpediente, // Asignar el UUID temporal aquí
    });

    // Guardar la nueva tarea en la base de datos
    await newTask.save();

    // La respuesta no incluirá el nroexpediente, ya que se asignará después
   
res.json({
  success: true,
  message: 'Tarea creada exitosamente. El número de expediente será asignado por mesa de entrada.'
});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};



export const createTasks = async (req, res) => {
  try {
    const {
      expendio,
      persona,
      dni,
      apellido,
      nombre,
      localidad,
      domicilio,
      lugar,
      dias,
      horarios,
      tipoevento,
      email,
      contacto,
      nroHabilitacion,
      domicilioLocalComercial,
      rubro,
      horarioAtencion,
      habilitacionComercial,
      estado,
      nroexpediente, // <-- Campo opcional para los usuarios internos
    } = req.body;

    // Verificar si ya existe una tarea con el mismo DNI
    const existingTask = await Task.findOne({ dni });
    if (existingTask) {
      return res.status(400).json({ message: "El DNI ya ha sido cargado." });
    }

    let finalNroExpediente = nroexpediente;

    // Si no se proporcionó un nro de expediente, se genera automáticamente
    if (!finalNroExpediente) {
      const codigoOrganismo = "2000";
      const lastTask = await Task.findOne({
        nroexpediente: new RegExp(`/${codigoOrganismo}$`),
      }).sort({
        createdAt: -1,
      });
      const nextNumber = lastTask ? parseInt(lastTask.nroexpediente.split("/")[0]) + 1 : 1;
      finalNroExpediente = `${nextNumber}/${codigoOrganismo}`;
      console.log("Número de expediente generado:", finalNroExpediente);
    } else {
      // Si se proporcionó un nroexpediente, se verifica que el usuario tenga permiso para asignarlo.
      // Esta validación se agregó en la respuesta anterior, pero aquí está un recordatorio.
      const userRole = req.user.role;
      if (userRole !== 'mesa' && userRole !== 'admin') {
        return res.status(403).json({ message: "No tienes permiso para asignar el número de expediente." });
      }
    }

    // Manejar los archivos subidos, si los hay
    const files = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          bucketName: file.bucketName,
          mimetype: file.mimetype,
          encoding: file.encoding,
          id: file.id,
        }))
      : [];

    // Crear la nueva tarea usando el nro de expediente ya sea manual o automático
    const newTask = new Task({
      expendio,
      persona,
      dni,
      apellido,
      nombre,
      localidad,
      domicilio,
      lugar,
      dias,
      horarios,
      tipoevento,
      email,
      contacto,
      nroHabilitacion,
      domicilioLocalComercial,
      rubro,
      horarioAtencion,
      habilitacionComercial,
      file: files,
      estado,
      user: req.user.id,
      nroexpediente: finalNroExpediente,
    });

    await newTask.save();
    await logActivity(req.user.id, 'creó tarea', 'tarea', newTask._id);

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("user");
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTasks = async (req, res) => {
    try {
        const { id } = req.params;
        let { filesToRemove, ...updateData } = req.body;
        const userRole = req.user.role.toLowerCase();

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        const finalStates = ['aprobado', 'finalizado', 'rechazado'];
        if (finalStates.includes(task.estado) && userRole !== 'admin' && userRole !== 'juridicos') {
            return res.status(403).json({
                message: "El expediente no puede ser editado, por favor contactar al administrador del sistema."
            });
        }

        if (updateData.nroexpediente && userRole !== 'mesa' && userRole !== 'admin') {
            return res.status(403).json({ message: "No tienes permiso para actualizar el número de expediente." });
        }

        // --- INICIO DE LA LÓGICA DE VALIDACIÓN ---
        // Se valida que el nuevo nroexpediente, si es diferente al actual,
        // no exista ya en la base de datos.
        if (updateData.nroexpediente && updateData.nroexpediente !== task.nroexpediente) {
            // Busca si ya existe una tarea con el mismo número de expediente COMPLETO,
            // excluyendo la tarea actual para evitar conflictos de ID.
            const existingTask = await Task.findOne({
                nroexpediente: updateData.nroexpediente,
                _id: { $ne: id }
            });

            if (existingTask) {
                return res.status(400).json({ 
                    message: "El número de expediente ya existe. El correlativo debe ser único para el organismo y el año." 
                });
            }
        }
        // --- FIN DE LA LÓGICA DE VALIDACIÓN ---

        let idsToRemove = [];
        if (filesToRemove) {
            try {
                idsToRemove = JSON.parse(filesToRemove);
                if (!Array.isArray(idsToRemove)) {
                    idsToRemove = [];
                }
            } catch (parseError) {
                console.error("Error al analizar filesToRemove:", parseError);
                return res.status(400).json({ message: "Formato de archivos a eliminar inválido." });
            }
        }
        
        const newFiles = req.files ? req.files.map(file => ({
            filename: file.filename,
            bucketName: file.bucketName,
            mimetype: file.mimetype,
            encoding: file.encoding,
            id: file.id
        })) : [];

        const updatedFiles = task.file.filter(f => !idsToRemove.includes(f.id.toString()));

        const finalFiles = [...updatedFiles, ...newFiles];

        for (const fileId of idsToRemove) {
            if (mongoose.Types.ObjectId.isValid(fileId)) {
                await gfs.delete(new mongoose.Types.ObjectId(fileId));
            } else {
                console.warn(`ID inválido en filesToRemove: ${fileId}`);
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { ...updateData, file: finalFiles },
            { new: true }
        );

        await logActivity(req.user.id, "actualizó tarea", "tarea", updatedTask._id);
        res.json(updatedTask);

    } catch (error) {
        console.error("Error al guardar la tarea:", error);
        return res.status(500).json({ message: error.message });
    }
};

// En tu archivo tasks.controller.js
export const taskEstados = async (req, res) => {
    try {
        const { id } = req.params;
        const { newState } = req.body;

        const userRole = req.user.role.toLowerCase();

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        const validStates = ['pendiente', 'controlado', 'aprobado', 'rechazado', 'finalizado', 'ingresado'];
        const newStateLower = newState.toLowerCase();
        if (!validStates.includes(newStateLower)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        // Lógica de transiciones de estado
        const canMesaChangeState = () => {
            return (
                (task.estado === 'ingresado' && (newStateLower === 'pendiente' || newStateLower === 'controlado')) ||
                (task.estado === 'pendiente' && newStateLower === 'controlado') ||
                ((task.estado === 'aprobado' || task.estado === 'rechazado') && newStateLower === 'finalizado')
            );
        };

        const canJuridicosChangeState = () => {
            return task.estado === 'controlado' && (newStateLower === 'aprobado' || newStateLower === 'rechazado');
        };

        const canAdminChangeState = () => true;

        // Verificación de permisos
        if (userRole === 'mesa' && canMesaChangeState()) {
            task.estado = newStateLower;
        } else if (userRole === 'juridicos' && canJuridicosChangeState()) {
            task.estado = newStateLower;
        } else if (userRole === 'admin' || userRole === 'editor') {
    task.estado = newStateLower;
        } else {
            // Este es el mensaje de error que te ayudará a depurar
            console.log(`Intento fallido de cambio de estado. Usuario: ${userRole}, Estado actual: ${task.estado}, Nuevo estado: ${newStateLower}`);
            return res.status(403).json({ message: "No tienes permiso para cambiar el estado en este momento." });
        }

        const updatedTask = await task.save();
        await logActivity(req.user.id, "cambió estado de tarea", "tarea", updatedTask._id); // Añadir registro
        res.json(updatedTask);

    } catch (error) {
        console.error("Error al cambiar el estado:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const taskPagos = async (req, res) => {
}





export const deleteTasks = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    if (task.file && task.file.length > 0) {
      for (const file of task.file) {
        if (file.id) {
          try {
            await gfs.delete(new mongoose.Types.ObjectId(file.id));
          } catch (error) {
            return res
              .status(500)
              .json({ message: "Error eliminando el archivo." });
          }
        }
      }
    }

    await Task.findByIdAndDelete(req.params.id);
    await logActivity(req.user.id, "eliminó tarea", "tarea", task._id);

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
   }
};

export const downloadFile = (req, res) => {
  const { filename } = req.params;

  try {
    const readStream = gfs.openDownloadStreamByName(filename);

    readStream.on("error", (err) => {
      console.error("Error reading file stream:", err);
      res.status(404).json({ message: "No such file" });
    });

    readStream.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener el perfil del usuario con las tareas asociadas
export const getUserProfileWithTask = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const tasks = await Task.find({ user: userId }).populate(
      "user",
      "username email nombre apellido"
    );

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tasks: tasks.map((task) => ({
        _id: task._id,
        expe: task.expe,
        correlativo: task.correlativo,
        anio: task.anio,
        cuerpo: task.cuerpo,
        fecha: task.fecha,
        iniciador: task.iniciador,
        asunto: task.asunto,
        file: task.file,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTaskWithUser = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId).populate("user");
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    res.json({
      task: {
        expe: task.expe,
        correlativo: task.correlativo,
        anio: task.anio,
        cuerpo: task.cuerpo,
        fecha: task.fecha,
        iniciador: task.iniciador,
        asunto: task.asunto,
        file: task.file,
      },
      user: {
        _id: task.user._id,
        username: task.user.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
