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
      archivo,
      userRole, // Ensure nombreresp2 is included in the request body
    } = req.body;

    // Check if a task with the same dniresp1 already exists
    const existingTask = await Task.findOne({
      expe: expe,
      correlativo: correlativo,
      anio: anio,
    });

    if (existingTask) {
      // If a task with the same dniresp1 already exists, return an error message
      return res
        .status(400)
        .json({ message: "El expediente ya ha sido cargado." });
    }

    // Create a new task
    const newTask = new Task({
      expe,
      correlativo,
      anio,
      cuerpo,
      fecha,
      iniciador,
      asunto,
      archivo,
      userRole,
      user: req.user.id, // Assuming req.user.id contains the ID of the authenticated user
    });

    // Save the new task to the database
    await newTask.save();

    // Return the newly created task as a response
    res.json(newTask);
  } catch (error) {
    // Handle any error that occurs during the process
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("user");
    if (!task) return res.status(404).json({ message: "Task not found" });
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
      archivo,
    } = req.body;

    // Buscar si ya existe una tarea con el mismo N° de Expdiente, Correlativo y Año, excluyendo el documento actual
    const existingTask = await Task.findOne({
      _id: { $ne: id }, // Excluir el documento actual por ID
      expe: expe,
      correlativo: correlativo,
      anio: anio,
    });

    if (existingTask) {
      // Si ya existe una tarea con el mismo DNI, devolver un mensaje de error
      return res.status(400).json({ message: "El DNI ya ha sido cargado." });
    }

    // Actualizar la tarea, incluyendo el valor actual del municipio
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
        archivo,
      },
      { new: true }
    );

    return res.json(updatedTask);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
