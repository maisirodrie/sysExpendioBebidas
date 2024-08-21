import Task from "../models/task.model.js";

// export const getTasks = async (req,res) => {
//     try {
//         const tasks = await Task.find({ user : req.user.id }).populate("user");
//         res.json(tasks);
//       } catch (error) {
//         return res.status(500).json({ message: error.message });
//       }

// };

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

    // Verificar si ya existe una tarea con los mismos datos
    const existingTask = await Task.findOne({
      expe: expe,
      correlativo: correlativo,
      anio: anio,
    });

    if (existingTask) {
      return res.status(400).json({ message: "El expediente ya ha sido cargado." });
    }

    // Crear un objeto file si existe en la solicitud
    const file = req.file ? {
      filename: req.file.filename,
      bucketName: req.file.bucketName,
      mimetype: req.file.mimetype,
      encoding: req.file.encoding,
      id: req.file.id
    } : [];

    // Crear una nueva tarea
    const newTask = new Task({
      expe,
      correlativo,
      anio,
      cuerpo,
      fecha,
      iniciador,
      asunto,
      file: [file], // Asegúrate de pasar un array de archivos si es necesario
      user: req.user.id,
    });

    // Guardar la nueva tarea en la base de datos
    await newTask.save();

    // Retornar la nueva tarea
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
    const {
      expe,
      correlativo,
      anio,
      cuerpo,
      fecha,
      iniciador,
      asunto,
    } = req.body;

    // Extraer el archivo de la solicitud, si existe
    const file = req.file ? {
      filename: req.file.filename,
      bucketName: req.file.bucketName,
      mimetype: req.file.mimetype,
      encoding: req.file.encoding,
      id: req.file.id
    } : undefined;

    // Buscar si ya existe una tarea con los mismos datos excluyendo el documento actual
    const existingTask = await Task.findOne({
      _id: { $ne: req.params.id }, // Excluir el documento actual
      expe: expe,
      correlativo: correlativo,
      anio: anio,
    });

    if (existingTask) {
      return res.status(400).json({ message: "El expediente ya ha sido cargado." });
    }

    // Actualizar la tarea
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        expe,
        correlativo,
        anio,
        cuerpo,
        fecha,
        iniciador,
        asunto,
        file: [file], // Actualizar el archivo si existe
      },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteTasks = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Tarea no encontrada" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

