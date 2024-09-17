// src/controllers/tasks.controller.js
import mongoose from 'mongoose';
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
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



// export const deleteTasks = async (req, res) => {
//   try {
//     // Buscar la tarea por su ID
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

//     // Eliminar archivos asociados a la tarea desde GridFS
//     if (task.file && task.file.length > 0) {
//       for (const file of task.file) {
//         gfs.delete(new mongoose.Types.ObjectId(file.id), (err) => {
//           if (err) {
//             if (err.code === 'FileNotFound') {
//               console.error('File not found:', err);
//               return res.status(404).json({ message: 'Archivo no encontrado' });
//             }
//             console.error('Error deleting file:', err);
//             return res.status(500).json({ message: 'Error deleting file', error: err });
//           }
//           console.log(`File ${file.filename} deleted successfully.`);
//         });
//       }
//     }

//     // Eliminar el registro de la tarea
//     await Task.findByIdAndDelete(req.params.id);
//     res.sendStatus(204);
//   } catch (error) {
//     console.error('Error deleting task:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const deleteTasks = async (req, res) => {
  try {
    // Buscar la tarea por su ID
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // Eliminar archivos asociados a la tarea desde GridFS
    if (task.file && task.file.length > 0) {
      for (const file of task.file) {
        try {
          // Verifica si el archivo existe antes de intentar eliminarlo
          const fileExists = await gfs.find({ _id: new mongoose.Types.ObjectId(file.id) }).toArray();
          if (fileExists.length === 0) {
            console.warn(`El archivo con ID ${file.id} no fue encontrado en GridFS.`);
            continue; // Pasar al siguiente archivo
          }

          // Eliminar el archivo si existe
          await gfs.delete(new mongoose.Types.ObjectId(file.id));
          console.log(`Archivo ${file.filename} eliminado correctamente.`);
        } catch (err) {
          if (err.code === 'FileNotFound') {
            console.warn(`Archivo no encontrado para el ID ${file.id}`);
          } else {
            console.error('Error eliminando archivo:', err);
            return res.status(500).json({ message: 'Error eliminando archivo', error: err });
          }
        }
      }
    }

    // Eliminar el registro de la tarea
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error eliminando tarea:', error);
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


// Controlador para obtener una tarea con el perfil del usuario asociado
// Obtener el perfil del usuario con las tareas asociadas
export const getUserProfileWithTask = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Busca las tareas que están asociadas al usuario
    const tasks = await Task.find({ user: userId })
      .populate('user', 'username email nombre apellido'); // Opcional: para incluir detalles del usuario en las tareas

    if (!tasks) {
      return res.status(404).json({ message: "Tareas no encontradas." });
    }

    // Busca el usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

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
      tasks: tasks.map(task => ({
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

    // Encuentra la tarea por ID y también incluye el perfil del usuario asociado
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
