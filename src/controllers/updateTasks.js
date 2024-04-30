import Task from "../models/task.model.js";



export const updateTasks = async (req, res) => {
  try {
    const { apellido, nombre, dni, fechanacimiento, genero, nacimiento, municipio, postal, residencia, nacionalidad, correo, telefono, roldirecto, disciplinadirecta, rolindirecto, disciplinaindirecta, publico, formacionpublica, disciplinapublica, privada, formacionprivada, disciplinaprivada, direccion, observaciones } = req.body;

    // Buscar si ya existe una tarea con el mismo DNI, excluyendo el documento actual
    const existingTask = await Task.findOne({ dni: dni, _id: { $ne: req.params.id } });

    if (existingTask) {
      // Si ya existe una tarea con el mismo DNI, devolver un mensaje de error
      return res.status(400).json({ message: "El DNI ya ha sido cargado." });
    }

    // Actualizar la tarea, incluyendo el valor actual del municipio
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { apellido, nombre, dni, fechanacimiento, genero, nacimiento, municipio, postal, residencia, nacionalidad, correo, telefono, roldirecto, disciplinadirecta, rolindirecto, disciplinaindirecta, publico, formacionpublica, disciplinapublica, privada, formacionprivada, disciplinaprivada, direccion, observaciones },
      { new: true }
    );

    return res.json(updatedTask);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    return res.status(500).json({ message: error.message });
  }
};
