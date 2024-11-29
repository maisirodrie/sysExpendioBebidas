import mongoose from "mongoose";
import fs from 'fs';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { gfs } from "../multerConfig.js"; // Importa gfs desde multerConfig.js
import Activity from "../models/activity.model.js"; // Asegúrate de que esta ruta es correcta
import { PDFDocument } from 'pdf-lib';


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


export const getTaskByDni = async (req, res) => {
  const { dni } = req.params;

  try {
    // Busca la tarea asociada al DNI proporcionado
    const task = await Task.findOne({ dni }).select("estado dni nroexpediente nombre apellido");
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
    console.log(tasks); // Verifica si hay tareas antes de responder
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
      return res.status(400).json({ message: "El expediente ya ha sido cargado." });
    }

    // Si se subió un archivo
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      bucketName: file.bucketName,
      mimetype: file.mimetype,
      encoding: file.encoding,
      id: file.id,
    })) : [];

    // Definir el código del organismo
    const codigoOrganismo = "2000";

    // Buscar la última tarea con el mismo código de organismo
    const lastTask = await Task.findOne({ nroexpediente: new RegExp(`/${codigoOrganismo}$`) })
    .sort({ createdAt: -1 });
  const nextNumber = lastTask ? parseInt(lastTask.nroexpediente.split("/")[0]) + 1 : 1;
  const nroexpediente = `${nextNumber}/${codigoOrganismo}`;
  console.log("Número de expediente generado:", nroexpediente);

  

    // Crear la nueva tarea sin usuario asociado
    const newTask = new Task({
      nroexpediente,
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
    });

    // Guardar la nueva tarea en la base de datos
    await newTask.save();

    // Enviar la respuesta con el nroexpediente
    res.json({
      success: true,
      nroexpediente: nroexpediente, // Esto se asegura de que el número de expediente se envíe al frontend
      mensaje: 'Tarea creada/actualizada exitosamente'
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
      estado
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
      estado,
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
      filesToRemove, // Array de archivos a eliminar
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
      pago
    } = req.body;

    // Obtener los archivos nuevos subidos
    const newFiles = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          bucketName: file.bucketName,
          mimetype: file.mimetype,
          encoding: file.encoding,
          id: file.id
        }))
      : [];

    // Verificar si la tarea existe
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // Eliminar los archivos que se hayan especificado en filesToRemove
    if (filesToRemove && filesToRemove.length > 0) {
      console.log("Eliminando archivos: ", filesToRemove); // Log para verificar los archivos a eliminar

      // Iterar sobre los archivos a eliminar
      for (const fileId of filesToRemove) {
        // Verificar y convertir el ID a ObjectId
        if (mongoose.Types.ObjectId.isValid(fileId)) {
          const objectId = new mongoose.Types.ObjectId(fileId);

          // Remover archivo de la tarea
          await Task.updateOne({ _id: id }, { $pull: { file: { id: objectId } } });

          // Eliminar archivo de GridFS
          await gridfsBucket.delete(objectId);
          console.log(`Archivo con ID ${fileId} eliminado.`);
        } else {
          console.warn(`ID inválido en filesToRemove: ${fileId}`);
        }
      }
    }

    // Combinar archivos existentes con los nuevos
    const updatedFiles = [...task.file, ...newFiles];

    // Actualizar la tarea con los nuevos datos y archivos combinados
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
        estado,
        horarioAtencion,
        habilitacionComercial,
        pago,
        file: updatedFiles // Guardar los archivos combinados
      },
      { new: true }
    );

    // Registrar la actividad del usuario
    await logActivity(req.user.id, "actualizó tarea", "tarea", updatedTask._id);

    res.json(updatedTask);
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
    return res.status(500).json({ message: error.message });
  }
};




export const taskEstados = async (req, res) => {
  try {
    const { id } = req.params;
    const { newState } = req.body;
    const userRole = req.user.role;

    // Obtener la tarea de la base de datos
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // Definir los estados válidos y normalizar el nuevo estado
    const validStates = ['pendiente', 'controlado', 'aprobado', 'rechazado', 'finalizado', 'ingresado'];
    const newStateLower = newState.toLowerCase();
    if (!validStates.includes(newStateLower)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    // Funciones auxiliares para verificar las transiciones válidas por rol
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

    const canAdminChangeState = () => true;  // Admin puede cambiar a cualquier estado

    // Verificar permisos y actualizar estado según el rol
    if (userRole === 'mesa' && canMesaChangeState()) {
      task.estado = newStateLower;
    } else if (userRole === 'juridicos' && canJuridicosChangeState()) {
      task.estado = newStateLower;
    } else if (userRole === 'admin' && canAdminChangeState()) {
      task.estado = newStateLower; // Admin puede cambiar el estado a cualquiera
    } else {
      return res.status(403).json({ message: "No tienes permiso para cambiar el estado en este momento" });
    }

    // Guardar la tarea actualizada y responder
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
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
