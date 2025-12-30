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
import { processFileMerge } from "../utils/pdfMerger.js"; // ⬅️ NUEVO: Importar utilidad de fusión



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
    const task = await Task.findOne({ dni }).select("estado dni nroexpediente nombre apellido motivoRechazo");
    if (!task) {
      return res.status(404).json({ message: "No se encontraron datos para este DNI." });
    }

    // Si el número de expediente no está asignado, lo reemplaza con "No asignado"
    const nroExpedienteFinal = task.nroexpediente || "No asignado";

    // Devuelve el estado y otros detalles de la tarea
    res.json({
      success: true,
      dni: task.dni,
      nombre: task.nombre,
      apellido: task.apellido,
      nroexpediente: nroExpedienteFinal, // Usa el valor final aquí
      estado: task.estado,
      motivoRechazo: task.motivoRechazo,
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



// Versión CORREGIDA de createTasksPublic para manejar cargas individuales (fields)

// tasks.controller.js (Versión simplificada)

export const createTasksPublic = async (req, res) => {
    try {
        const {
            // ... (desestructuración de req.body) ...
            expendio, persona, dni, apellido, nombre, localidad, domicilio, lugar, dias, horarios,
            tipoevento, email, contacto, nroHabilitacion, domicilioLocalComercial, rubro, estado,
            horarioAtencion, habilitacionComercial,
            ...documentFieldsFromForm 
        } = req.body;

        // ⬅️ VALIDACIÓN DESHABILITADA: Permitir múltiples registros con el mismo DNI
        // const existingTask = await Task.findOne({ dni });
        // if (existingTask) {
        //     return res.status(400).json({ message: "El DNI ya ha sido registrado." });
        // }
        
        // 🚀 LÓGICA SIMPLIFICADA (Funciona si multerConfig.js reasigna req.files a un array limpio)
        // Mapea directamente el array de metadatos de archivos que viene de Multer/GridFS.
        const allFiles = req.files ? req.files.map(file => ({
            filename: file.filename,
            bucketName: file.bucketName,
            mimetype: file.mimetype,
            encoding: file.encoding,
            id: file.id,
        })) : [];
        // ---------------------------------------------------------------------------------

        // Crear la nueva tarea sin nroexpediente
        const newTask = new Task({
            expendio, persona, dni, apellido, nombre, localidad, domicilio, lugar, dias, horarios,
            tipoevento, email, contacto, nroHabilitacion, domicilioLocalComercial, rubro, estado,
            horarioAtencion, habilitacionComercial,
            file: allFiles, // Usamos el array de archivos directamente
            pago: false, 
        });

        // Guardar la nueva tarea en la base de datos
        await newTask.save();

        res.json({
            success: true,
            message: 'Tarea creada exitosamente. El número de expediente será asignado por mesa de entrada.'
        });
    } catch (error) {
        console.error("Error en createTasksPublic:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Asegúrate de que logActivity esté definida o importada en este archivo.

// Asegúrate de que Task y logActivity estén importados

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
            nroexpediente, 
            ...documentFieldsFromForm // Captura el resto de campos (incluyendo nombres de archivos vacíos)
        } = req.body;

        // ⬅️ VALIDACIÓN DESHABILITADA: Permitir múltiples registros con el mismo DNI
        // const existingTask = await Task.findOne({ dni });
        // if (existingTask) {
        //     return res.status(400).json({ message: "El DNI ya ha sido cargado en un expediente." });
        // }

        let finalNroExpediente = nroexpediente;

        // --- LÓGICA DE ASIGNACIÓN DE EXPEDIENTE (NO SE MODIFICA) ---
        if (!finalNroExpediente || finalNroExpediente === '') {
            const codigoOrganismo = "2000";
            const lastTask = await Task.findOne({
                nroexpediente: new RegExp(`/${codigoOrganismo}$`),
            }).sort({
                createdAt: -1,
            });
            const nextNumber = lastTask 
                ? parseInt(lastTask.nroexpediente.split("/")[0]) + 1 
                : 1;
            finalNroExpediente = `${nextNumber}/${codigoOrganismo}`;
            console.log("Número de expediente generado:", finalNroExpediente);
        } else {
            const userRole = req.user.role;
            if (userRole !== 'mesa' && userRole !== 'admin') {
                return res.status(403).json({ message: "No tienes permiso para asignar el número de expediente manualmente." });
            }
            const existingExpediente = await Task.findOne({ nroexpediente: finalNroExpediente });
            if (existingExpediente) {
                 return res.status(400).json({ message: "El número de expediente ingresado ya existe." });
            }
        }
        // --- FIN LÓGICA DE ASIGNACIÓN DE EXPEDIENTE ---


        // 📢 CORRECCIÓN CLAVE: Unificar archivos individuales en un solo array
        let allFiles = [];

        if (req.files && typeof req.files === 'object') {
            // req.files es un objeto donde las claves son los nombres de campo (ej: { notaSolicitud: [...] })
            for (const fieldName in req.files) {
                // Cada valor es un array de archivos subidos para ese campo
                const filesArray = req.files[fieldName]; 

                const mappedFiles = filesArray.map(file => ({
                    filename: file.filename,
                    bucketName: file.bucketName,
                    mimetype: file.mimetype,
                    encoding: file.encoding,
                    id: file.id,
                }));
                
                // Concatenamos todos los arrays de archivos en allFiles
                allFiles = allFiles.concat(mappedFiles); 
            }
        }

        // Crear la nueva tarea usando el array de archivos unificado (allFiles)
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
            file: allFiles, // Usar el array unificado
            estado,
            user: req.user.id,
            nroexpediente: finalNroExpediente,
        });

        await newTask.save();
        
        // Registrar actividad
        await logActivity(req.user.id, 'creó tarea', 'tarea', newTask._id);

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error en createTasks:", error);
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

// CONTROLADOR DE TAREAS (Backend)
// CONTROLADOR DE TAREAS (Backend)
export const updateTasks = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 🔑 1. Desestructuración de datos: El resto de campos va a 'updateData'
        let { filesToRemove, existingFilesToKeep, ...updateData } = req.body;
        const userRole = req.user.role.toLowerCase();

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        // --- Lógica de validación de estado y permisos (Se mantiene) ---
        const finalStates = ['aprobado', 'finalizado', 'rechazado'];
        if (finalStates.includes(task.estado) && userRole !== 'admin' && userRole !== 'juridicos' && userRole !== 'editor') {
            return res.status(403).json({
                message: "El expediente no puede ser editado, por favor contactar al administrador del sistema."
            });
        }
        if (updateData.nroexpediente && userRole !== 'mesa' && userRole !== 'admin') {
            return res.status(403).json({ message: "No tienes permiso para actualizar el número de expediente." });
        }
        
        // --- LÓGICA de VALIDACIÓN de nroexpediente (Se mantiene) ---
        if (updateData.nroexpediente && updateData.nroexpediente !== task.nroexpediente) {
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

        // 🎯 2. LÓGICA DE ARCHIVOS: Inicializar con los archivos existentes
        let finalFiles = task.file; 

        // Solo ejecutar la lógica compleja si el frontend envió datos de manejo de archivos o archivos nuevos
        if (filesToRemove || existingFilesToKeep || (req.files && req.files.length > 0)) {
            
            // 2a. Deserializar los arrays del frontend
            let idsToRemove = []; // Archivos a eliminar manualmente por el usuario
            if (filesToRemove) {
                try {
                    idsToRemove = JSON.parse(filesToRemove);
                } catch (e) { /* Manejo de error si la data es inválida */ }
            }

            let filesToKeepFromFront = []; // Archivos existentes que el frontend quiere mantener
            if (existingFilesToKeep) {
                try {
                    filesToKeepFromFront = JSON.parse(existingFilesToKeep);
                } catch (e) { /* Manejo de error si la data es inválida */ }
            }
            
            // ⮅️ NUEVO: Parsear lista de campos que necesitan fusión de PDFs
            let fieldsToMerge = [];
            if (req.body.fieldsToMerge) {
                try {
                    fieldsToMerge = JSON.parse(req.body.fieldsToMerge);
                    console.log('🔀 Campos a fusionar:', fieldsToMerge);
                } catch (e) {
                    console.error('Error parseando fieldsToMerge:', e);
                }
            }
            
            // 2b. Manejo de nuevos archivos subidos
            // multerConfig.js siempre proporciona req.files como array con fieldname preservado
            let newFiles = req.files ? req.files.map(file => ({
                filename: file.filename,
                bucketName: file.bucketName,
                mimetype: file.mimetype,
                encoding: file.encoding,
                id: file.id,
                fieldname: file.fieldname, 
                originalname: file.originalname 
            })) : [];
            
            // ⮅️ 2c. PROCESAR FUSIONES DE PDF
            // Para cada campo en fieldsToMerge, fusionar el archivo existente con el nuevo
            for (const fieldToMerge of fieldsToMerge) {
                console.log(`\n🔀 Fusionando campo: ${fieldToMerge}`);
                console.log(`  📋 task.file tiene ${task.file.length} archivos:`, task.file.map(f => `${f.fieldname || 'NO-FIELDNAME'}: ${f.filename}`));
                
                // ⬅️ CORRECCIÓN: Encontrar TODOS los archivos existentes de este campo
                // IMPORTANTE: task.file puede no tener fieldname, debemos inferirlo del filename
                const existingFilesForField = task.file.filter(f => {
                    const inferredFieldname = f.fieldname || f.filename.split('-')[0];
                    return inferredFieldname === fieldToMerge;
                });
                
                if (existingFilesForField.length === 0) {
                    console.log(`  ⚠️ No hay archivo existente para ${fieldToMerge}, saltando fusión`);
                    continue;
                }
                
                console.log(`  📚 Encontrados ${existingFilesForField.length} archivos existentes para fusionar`);
                
                // Encontrar archivos nuevos de este campo
                const newFilesForField = newFiles.filter(f => f.fieldname === fieldToMerge);
                
                if (newFilesForField.length === 0) {
                    console.log(`  ⚠️ No hay archivos nuevos para fusionar en ${fieldToMerge}`);
                    continue;
                }
                
                
                try {
                    // ⬅️ FUSIONAR TODOS LOS ARCHIVOS EXISTENTES PRIMERO
                    let mergedBuffer = null;
                    let mergedMimetype = null;
                    
                    // Fusionar todos los archivos existentes secuencialmente
                    for (const [index, existingFile] of existingFilesForField.entries()) {
                        console.log(`  📥 Descargando archivo existente ${index + 1}/${existingFilesForField.length}: ${existingFile.filename}`);
                        
                        const chunks = [];
                        const downloadStream = gfs.openDownloadStreamByName(existingFile.filename);
                        
                        await new Promise((resolve, reject) => {
                            downloadStream.on('data', (chunk) => chunks.push(chunk));
                            downloadStream.on('end', () => resolve());
                            downloadStream.on('error', reject);
                        });
                        
                        const fileBuffer = Buffer.concat(chunks);
                        
                        if (index === 0) {
                            // Primer archivo - inicializar merged buffer
                            mergedBuffer = fileBuffer;
                            mergedMimetype = existingFile.mimetype;
                        } else {
                            // Fusionar con el buffer acumulado
                            console.log(`  🔗 Fusionando archivo ${index + 1} con los anteriores...`);
                            mergedBuffer = await processFileMerge(
                                { buffer: mergedBuffer, mimetype: mergedMimetype },
                                { buffer: fileBuffer, mimetype: existingFile.mimetype }
                            );
                            mergedMimetype = 'application/pdf';
                        }
                    }
                    
                    // Ahora fusionar con cada archivo nuevo
                    for (const newFile of newFilesForField) {
                        console.log(`  ➕ Fusionando con archivo nuevo: ${newFile.filename}`);
                        
                        // Descargar nuevo archivo de GridFS (porque ya fue subido por multer)
                        const newChunks = [];
                        const newDownloadStream = gfs.openDownloadStreamByName(newFile.filename);
                        
                        await new Promise((resolve, reject) => {
                            newDownloadStream.on('data', (chunk) => newChunks.push(chunk));
                            newDownloadStream.on('end', () => resolve());
                            newDownloadStream.on('error', reject);
                        });
                        
                        const newFileBuffer = Buffer.concat(newChunks);
                        
                        // Fusionar archivos
                        mergedBuffer = await processFileMerge(
                            { buffer: mergedBuffer, mimetype: mergedMimetype },
                            { buffer: newFileBuffer, mimetype: newFile.mimetype }
                        );
                        
                        mergedMimetype = 'application/pdf'; // Después de fusionar siempre es PDF
                        
                        // Eliminar el archivo nuevo temporal de GridFS
                        await gfs.delete(new mongoose.Types.ObjectId(newFile.id));
                    }
                    
                    // Subir el PDF fusionado a GridFS
                    const mergedFilename = `${fieldToMerge}-${Date.now()}-merged.pdf`;
                    console.log(`  📤 Subiendo PDF fusionado: ${mergedFilename}`);
                    
                    const uploadStream = gfs.openUploadStream(mergedFilename, {
                        contentType: 'application/pdf'
                    });
                    
                    const mergedFileId = await new Promise((resolve, reject) => {
                        uploadStream.write(mergedBuffer);
                        uploadStream.end();
                        uploadStream.on('finish', () => resolve(uploadStream.id));
                        uploadStream.on('error', reject);
                    });
                    
                    // Actualizar la lista de archivos nuevos para reemplazar el existente
                    newFiles = newFiles.filter(f => f.fieldname !== fieldToMerge);
                    newFiles.push({
                        filename: mergedFilename,
                        bucketName: 'uploads',
                        mimetype: 'application/pdf',
                        encoding: '7bit',
                        id: mergedFileId,
                        fieldname: fieldToMerge,
                        originalname: `${fieldToMerge}_merged.pdf`
                    });
                    
                    
                    // ⬅️ Eliminar TODOS los archivos existentes de GridFS
                    for (const existingFile of existingFilesForField) {
                        console.log(`  🗑️ Eliminando archivo antiguo: ${existingFile.filename}`);
                        await gfs.delete(new mongoose.Types.ObjectId(existingFile.id));
                    }
                    
                    // Remover TODOS los archivos existentes de la lista de archivos a mantener
                    filesToKeepFromFront = filesToKeepFromFront.filter(
                        f => !existingFilesForField.some(ef => ef.id.toString() === f.id.toString())
                    );
                    
                    console.log(`  ✅ Fusión completada para ${fieldToMerge}`);
                    
                } catch (error) {
                    console.error(`  ❌ Error fusionando ${fieldToMerge}:`, error);
                    // Continuar con otros campos aunque falle uno
                }
            }

            // 2c. Filtrado de archivos: los que NO están en filesToKeepFromFront deben eliminarse (auto-remove)
            const filesToAutoRemove = task.file.filter(originalFile => {
                return !filesToKeepFromFront.some(keptFile => keptFile.id.toString() === originalFile.id.toString());
            });

            // 2d. Obtener la data completa de los archivos a mantener
            const keptFilesData = task.file.filter(originalFile => 
                 filesToKeepFromFront.some(keptFile => keptFile.id.toString() === originalFile.id.toString())
            );
            
            // ⮅️ DEBUG: Mostrar qué archivos se están procesando
            console.log('📥 BACKEND - Procesando archivos:');
            console.log('  task.file (todos los existentes):', task.file.length);
            console.log('  filesToKeepFromFront:', filesToKeepFromFront.length);
            console.log('  keptFilesData:', keptFilesData.length, keptFilesData.map(f => f.filename));
            console.log('  newFiles:', newFiles.length, newFiles.map(f => f.filename));
            
            // 2e. Combinar archivos a mantener con los nuevos archivos
            finalFiles = [...keptFilesData, ...newFiles];
            
            console.log('  finalFiles (resultado):', finalFiles.length, finalFiles.map(f => f.filename)); 

            // 3. Eliminar archivos de GridFS (manual + automático)
            const autoRemoveIds = filesToAutoRemove.map(f => f.id.toString());
            const allFilesToRemove = [...idsToRemove, ...autoRemoveIds]; // Lista final de IDs a borrar
            
            
            for (const fileId of allFilesToRemove) {
                if (mongoose.Types.ObjectId.isValid(fileId)) {
                    try {
                        // Se asume que 'gfs' está disponible en el scope
                        await gfs.delete(new mongoose.Types.ObjectId(fileId)); 
                    } catch (deleteError) {
                        // ⬅️ Error esperado si el archivo ya fue eliminado en la fusión
                        if (deleteError.message && deleteError.message.includes('File not found')) {
                            console.log(`  ℹ️ Archivo ${fileId} ya fue eliminado (probablemente en fusión)`);
                        } else {
                            console.error(`Error al eliminar archivo ${fileId} de GridFS:`, deleteError);
                        }
                    }
                } else {
                    console.warn(`ID inválido para eliminación: ${fileId}`);
                }
            }
        } // FIN DEL BLOQUE DE LÓGICA DE ARCHIVOS
        
        // 4. 🚀 ACTUALIZACIÓN SEGURA DE MONGO
        // Si solo se actualizó el estado (y no hubo manejo de archivos), finalFiles = task.file.
        // Si hubo manejo de archivos, finalFiles contiene la lista nueva.
        const updateObject = {
            ...updateData, // Estado, motivoRechazo, nroexpediente, etc.
            file: finalFiles // La lista de archivos (existente o nueva)
        };

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            // 🔑 USAMOS $set para garantizar que solo se modifiquen los campos en updateObject
            { $set: updateObject }, 
            { new: true, runValidators: true } 
        );

        if (!updatedTask) return res.status(404).json({ message: "Tarea no encontrada durante la actualización." });

        // 5. ✅ Devolver la tarea final (poblada, si aplica)
        const finalUpdatedTask = await Task.findById(id).populate("user");
        
        if (!finalUpdatedTask) return res.status(404).json({ message: "Tarea no encontrada después de la actualización." });

        // 6. Registrar actividad y responder
        await logActivity(req.user.id, 'actualizó tarea', "tarea", finalUpdatedTask._id);
        res.json(finalUpdatedTask);
        
    } catch (error) {
        console.error("Error al guardar la tarea:", error);
        const statusCode = error.name === 'ValidationError' ? 400 : 500;
        return res.status(statusCode).json({ message: error.message });
    }
};
// En tu archivo tasks.controller.js
// tasks.controller.js

export const taskEstados = async (req, res) => {
    try {
        const { id } = req.params;
        // Obtenemos los datos del body, incluyendo el nuevo estado y el motivo (si aplica)
        const { newState, motivoRechazo } = req.body; 

        const userRole = req.user.role.toLowerCase();

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        const validStates = ['pendiente', 'controlado', 'aprobado', 'rechazado', 'finalizado', 'ingresado'];
        const newStateLower = newState.toLowerCase();
        
        if (!validStates.includes(newStateLower)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        // --- Lógica de Permisos y Transiciones (Se mantiene tu lógica) ---
        const canMesaChangeState = () => {
            return (
                (task.estado === 'ingresado' && (newStateLower === 'pendiente' || newStateLower === 'controlado')) ||
                (task.estado === 'pendiente' && newStateLower === 'controlado') ||
                (task.estado === 'rechazado' && (newStateLower === 'pendiente' || newStateLower === 'controlado' || newStateLower === 'finalizado')) ||
                ((task.estado === 'aprobado' || task.estado === 'rechazado') && newStateLower === 'finalizado')
            );
        };

        const canJuridicosChangeState = () => {
            return task.estado === 'controlado' && (newStateLower === 'aprobado' || newStateLower === 'rechazado');
        };

        let hasPermission = false;
        if (userRole === 'mesa' && canMesaChangeState()) {
            hasPermission = true;
        } else if (userRole === 'juridicos' && canJuridicosChangeState()) {
            hasPermission = true;
        } else if (userRole === 'admin' || userRole === 'editor') {
            hasPermission = true; 
        }

        if (!hasPermission) {
            return res.status(403).json({ message: "No tienes permiso para cambiar el estado en este momento." });
        }
        // --- Fin Lógica de Permisos ---

        
        // Definimos qué campos actualizar
        const updateFields = {
            estado: newStateLower,
        };

        // Manejo del Motivo de Rechazo (necesario para el estado RECHAZADO, como se ve en la captura)
        if (newStateLower === 'rechazado') {
            if (!motivoRechazo) {
                 return res.status(400).json({ message: "Debe proporcionar un motivo de rechazo." });
            }
            updateFields.motivoRechazo = motivoRechazo;
        } else {
            // Limpiamos el motivoRechazo si el estado cambia a uno no rechazado.
            if (task.motivoRechazo) {
                 updateFields.motivoRechazo = null; 
            }
        }
        
        // 1. Ejecutar la actualización (SOLO estado y motivo, manteniendo 'file' intacto)
        await Task.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true } 
        );

        // 2. 🔑 SOLUCIÓN CLAVE: Volver a buscar la tarea para obtener TODOS los campos (incluyendo 'file')
        // Esto asegura que el objeto devuelto al frontend contenga la lista completa de archivos.
        const finalUpdatedTask = await Task.findById(id).populate("user");
        
        if (!finalUpdatedTask) return res.status(404).json({ message: "Tarea no encontrada después de la actualización." });


        await logActivity(req.user.id, `cambió estado de tarea a ${newStateLower}`, "tarea", finalUpdatedTask._id);
        
        // 3. Devolver la tarea COMPLETA al frontend
        res.json(finalUpdatedTask); 

    } catch (error) {
        console.error("Error al cambiar el estado:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const taskPagos = async (req, res) => {
  // TODO: Implement payment functionality
  try {
    res.status(501).json({ message: "Funcionalidad de pagos pendiente de implementación" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
