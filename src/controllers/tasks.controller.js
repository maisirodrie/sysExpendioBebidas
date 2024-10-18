import mongoose from "mongoose";
import fs from 'fs';
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { gfs } from "../multerConfig.js"; // Importa gfs desde multerConfig.js
import Activity from "../models/activity.model.js"; // Asegúrate de que esta ruta es correcta
import { PDFDocument } from 'pdf-lib';

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


// Controlador para crear tareas públicas
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
      horarioAtencion,
      habilitacionComercial,
    } = req.body;

    const existingTask = await Task.findOne({ dni });
    if (existingTask) {
      return res.status(400).json({ message: "El expediente ya ha sido cargado." });
    }

   // Si se subió un archivo combinado
   const files = req.files ? req.files.map(file => ({
    filename: file.filename,
    bucketName: file.bucketName,
    mimetype: file.mimetype,
    encoding: file.encoding,
    id: file.id,
  })) : [];

    // Crear la nueva tarea sin usuario asociado
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
      // Sin campo user
    });

    await newTask.save();
    res.status(201).json(newTask);
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
    } = req.body;

    const existingTask = await Task.findOne({ dni });
    if (existingTask) {
      return res
        .status(400)
        .json({ message: "El expediente ya ha sido cargado." });
    }

    // Si se subió un archivo combinado
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      bucketName: file.bucketName,
      mimetype: file.mimetype,
      encoding: file.encoding,
      id: file.id,
    })) : [];

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
      user: req.user.id,
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
    } = req.body;

    // Obtener los archivos enviados (manejo de múltiples archivos)
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      bucketName: file.bucketName,
      mimetype: file.mimetype,
      encoding: file.encoding,
      id: file.id, // Asegúrate de que se esté configurando correctamente en la carga
    })) : [];

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // Eliminar archivos existentes
    if (task.file.length > 0) {
      for (const fileInfo of task.file) {
        if (fileInfo.id) {
          try {
            await gfs.delete(new mongoose.Types.ObjectId(fileInfo.id));
          } catch (error) {
            return res.status(500).json({ message: "Error al eliminar el archivo anterior." });
          }
        }
      }
    }

    // Actualizar la tarea con los nuevos datos y archivos
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
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
        file: files, // Guardar los nuevos archivos
      },
      { new: true }
    );

    await logActivity(req.user.id, "actualizó tarea", "tarea", updatedTask._id);

    res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



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
