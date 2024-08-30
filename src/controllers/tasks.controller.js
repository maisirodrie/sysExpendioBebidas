// src/controllers/tasks.controller.js
import mongoose from 'mongoose';
import Task from "../models/task.model.js";
import { gfs } from '../multerConfig.js'; // Importa gfs desde multerConfig.js

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
    const {
      expe,
      correlativo,
      anio,
      cuerpo,
      fecha,
      iniciador,
      asunto,
    } = req.body;

    const existingTask = await Task.findOne({
      expe: expe,
      correlativo: correlativo,
      anio: anio,
    });

    if (existingTask) {
      return res.status(400).json({ message: "El expediente ya ha sido cargado." });
    }

    const file = req.file ? {
      filename: req.file.filename,
      bucketName: req.file.bucketName,
      mimetype: req.file.mimetype,
      encoding: req.file.encoding,
      id: req.file.id
    } : [];

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
    const {
      expe,
      correlativo,
      anio,
      cuerpo,
      fecha,
      iniciador,
      asunto,
    } = req.body;

    console.log("Request file data:", req.file);

    // Verifica si se proporciona un archivo nuevo
    let newFile = req.file ? {
      filename: req.file.filename,
      bucketName: req.file.bucketName,
      mimetype: req.file.mimetype,
      encoding: req.file.encoding,
      id: req.file.id
    } : undefined;

    console.log("File data to be updated:", newFile);

    // Verifica si la tarea ya existe con los mismos datos, excluyendo el ID actual
    const existingTask = await Task.findOne({
      _id: { $ne: id },
      expe: expe,
      correlativo: correlativo,
      anio: anio,
    });

    if (existingTask) {
      return res.status(400).json({ message: "El expediente ya ha sido cargado." });
    }

    // Busca la tarea para obtener el archivo anterior
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Elimina el archivo anterior si existe y hay un nuevo archivo
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

    // Actualiza la tarea con los datos nuevos y el archivo nuevo (si lo hay)
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

    console.log("Updated task:", updatedTask);

    if (!updatedTask) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: error.message });
  }
};



export const deleteTasks = async (req, res) => {
  try {
    // Buscar la tarea por su ID
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // Eliminar archivos asociados a la tarea desde GridFS
    if (task.file && task.file.length > 0) {
      for (const file of task.file) {
        gfs.delete(new mongoose.Types.ObjectId(file.id), (err) => {
          if (err) {
            if (err.code === 'FileNotFound') {
              console.error('File not found:', err);
              return res.status(404).json({ message: 'Archivo no encontrado' });
            }
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file', error: err });
          }
          console.log(`File ${file.filename} deleted successfully.`);
        });
      }
    }

    // Eliminar el registro de la tarea
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message });
  }
};

export const downloadFile = (req, res) => {
  const { filename } = req.params;

  try {
    const readStream = gfs.openDownloadStreamByName(filename);

    readStream.on('error', (err) => {
      console.error('Error reading file stream:', err);
      res.status(404).json({ message: 'No such file' });
    });

    readStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: error.message });
  }
};
