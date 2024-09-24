import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { gfs } from "../multerConfig.js"; // Importa gfs desde multerConfig.js
import Activity from "../models/activity.model.js"; // Importa el modelo de actividad

// Función para registrar la actividad del usuario
const logActivity = async (userId, action, entity, entityId) => {
  try {
    const activity = new Activity({
      user: userId,
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

export const createTasks = async (req, res) => {
  try {
    const { expe, correlativo, anio, cuerpo, fecha, iniciador, asunto } =
      req.body;

    const existingTask = await Task.findOne({ expe, correlativo, anio });
    if (existingTask) {
      return res
        .status(400)
        .json({ message: "El expediente ya ha sido cargado." });
    }

    const file = req.file
      ? {
          filename: req.file.filename,
          bucketName: req.file.bucketName,
          mimetype: req.file.mimetype,
          encoding: req.file.encoding,
          id: req.file.id,
        }
      : [];

    const newTask = new Task({
      expe,
      correlativo,
      anio,
      cuerpo,
      fecha,
      iniciador,
      asunto,
      file: [file],
      user: req.user.id,
    });

    await newTask.save();
    await logActivity(req.user.id, "creó tarea", "tarea", newTask._id);
    // Registrar actividad
    res.json(newTask);
  } catch (error) {
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
    const { expe, correlativo, anio, cuerpo, fecha, iniciador, asunto } =
      req.body;

    let newFile = req.file
      ? {
          filename: req.file.filename,
          bucketName: req.file.bucketName,
          mimetype: req.file.mimetype,
          encoding: req.file.encoding,
          id: req.file.id,
        }
      : undefined;

    const existingTask = await Task.findOne({
      _id: { $ne: id },
      expe,
      correlativo,
      anio,
    });

    if (existingTask) {
      return res
        .status(400)
        .json({ message: "El expediente ya ha sido cargado." });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Eliminar el archivo anterior si existe y hay un nuevo archivo
    if (newFile) {
      if (task.file && task.file.length > 0) {
        for (const fileInfo of task.file) {
          if (fileInfo.id) {
            await gfs.delete(fileInfo.id);
          }
        }
      }
    } else {
      // Si no hay nuevo archivo, mantiene el archivo antiguo
      newFile = task.file;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        expe,
        correlativo,
        anio,
        cuerpo,
        fecha,
        iniciador,
        asunto,
        file: newFile ? [newFile] : task.file,
      },
      { new: true }
    );

    await logActivity(req.user.id, "actualizó tarea", "tarea", updatedTask._id); // Registrar actividad

    if (!updatedTask)
      return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    if (task.file && task.file.length > 0) {
      for (const file of task.file) {
        try {
          await gfs.delete(new mongoose.Types.ObjectId(file.id));
          console.log(`Archivo ${file.filename} eliminado correctamente.`);
        } catch (err) {
          console.error("Error eliminando archivo:", err);
        }
      }
    }

    await Task.findByIdAndDelete(req.params.id);
    await logActivity(req.user.id, "eliminó tarea", "tarea", task._id);
    // Registrar actividad

    res.sendStatus(204);
  } catch (error) {
    console.error("Error eliminando tarea:", error);
    res.status(500).json({ message: error.message });
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
