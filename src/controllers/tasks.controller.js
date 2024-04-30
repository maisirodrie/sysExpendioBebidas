import Task from "../models/task.model.js";

// export const getTasks = async (req,res) => {
//     try {
//         const tasks = await Task.find({ user : req.user.id }).populate("user");
//         res.json(tasks);
//       } catch (error) {
//         return res.status(500).json({ message: error.message });
//       }
    
// };

export const getTasks = async (req,res) => {
  try {
      const tasks = await Task.find().populate("user");
      res.json(tasks);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

export const createTasks = async (req, res) => {
  try {
    const { apellido, nombre,dni,fechanacimiento,genero,nacimiento,municipio,postal,residencia,nacionalidad,correo,telefono,roldirecto,disciplinadirecta,rolindirecto,disciplinaindirecta,publico,formacionpublica,disciplinapublica,privada,formacionprivada,disciplinaprivada,direccion,observaciones,userRole } = req.body;

    // Verificar si ya existe una tarea con el mismo DNI
    const existingTask = await Task.findOne({ dni: dni });

    if (existingTask) {
      // Si ya existe una tarea con el mismo DNI, devolver un mensaje de error
      return res.status(400).json({ message: "El DNI ya ha sido cargado." });
    }

    // Crear una nueva tarea
    const newTask = new Task({
      apellido, nombre,dni,fechanacimiento,genero,nacimiento,municipio,postal,residencia,nacionalidad,correo,telefono,roldirecto,disciplinadirecta,rolindirecto,disciplinaindirecta,publico,formacionpublica,disciplinapublica,privada,formacionprivada,disciplinaprivada,direccion,observaciones,userRole,
      user: req.user.id,
    });

    // Guardar la nueva tarea en la base de datos
    await newTask.save();

    // Devolver la nueva tarea creada como respuesta
    res.json(newTask);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
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
      const { apellido, nombre,dni,fechanacimiento,genero,nacimiento,municipio,postal,residencia,nacionalidad,correo,telefono,roldirecto,disciplinadirecta,rolindirecto,disciplinaindirecta,publico,formacionpublica,disciplinapublica,privada,formacionprivada,disciplinaprivada,direccion,observaciones } = req.body;

      // Buscar si ya existe una tarea con el mismo DNI, excluyendo el documento actual
      const existingTask = await Task.findOne({ dni: dni, _id: { $ne: req.params.id } });

      if (existingTask) {
          // Si ya existe una tarea con el mismo DNI, devolver un mensaje de error
          return res.status(400).json({ message: "El DNI ya ha sido cargado." });
      }

      // Actualizar la tarea, incluyendo el valor actual del municipio
      const updatedTask = await Task.findByIdAndUpdate(
          req.params.id,
          { apellido, nombre,dni,fechanacimiento,genero,nacimiento,municipio,postal,residencia,nacionalidad,correo,telefono,roldirecto,disciplinadirecta,rolindirecto,disciplinaindirecta,publico,formacionpublica,disciplinapublica,privada,formacionprivada,disciplinaprivada,direccion,observaciones},
          { new: true }
      );

      return res.json(updatedTask);
  } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso
      return res.status(500).json({ message: error.message });
  }
};




export const deleteTasks = async (req,res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask)
          return res.status(404).json({ message: "Task not found" });
    
        return res.sendStatus(204);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }

};