// src/multerConfig.js

import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });


// Configura tu URI de MongoDB
const mongoURI = process.env.MONGO_URI;

// Configura la conexión a MongoDB
const conn = mongoose.createConnection(mongoURI);

// Manejo de la conexión a la base de datos
conn.on('error', (err) => {
  console.error('Error en la conexión a MongoDB:', err);
});

let gfs;

conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('Conexión a MongoDB y GridFS establecida correctamente');
});

// Configuración de multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para subir archivos a GridFS
const streamUpload = (req, res, next) => {
    // Si no hay archivos o req.files no existe, continúa
    if (!req.files) return next(); 

    // 1. APLANAR EL OBJETO req.files EN UN ÚNICO ARRAY (Maneja .fields() y .array())
    let filesToProcess = [];
    if (typeof req.files === 'object' && !Array.isArray(req.files)) {
        // req.files es un objeto de arrays (si se usó upload.fields())
        for (const fieldName in req.files) {
            filesToProcess = filesToProcess.concat(req.files[fieldName]);
        }
    } else if (Array.isArray(req.files)) {
        // req.files ya es un array (si se usó upload.array() o .any())
        filesToProcess = req.files;
    }

    if (filesToProcess.length === 0) return next();

    const finalFileMetadatas = []; 
    
    // 2. Procesar la subida a GridFS
    const uploadPromises = filesToProcess.map((file) => {
        return new Promise((resolve, reject) => {
            
            // Generar un nombre de archivo ÚNICO para GridFS (evita colisiones y el error FileNotFound)
            // Se usa el nombre del campo original (ej: notaSolicitud) + timestamp + nombre original
            const uniqueFilename = `${file.fieldname || 'file'}-${Date.now()}-${file.originalname}`; 

            const uploadStream = gfs.openUploadStream(uniqueFilename, {
                contentType: file.mimetype,
            });
            
            const readableStream = Readable.from(file.buffer);
            readableStream.pipe(uploadStream);

            uploadStream.on('finish', () => {
                // Capturamos los metadatos CLAVE, incluyendo el ID, fieldname y el nombre único
                finalFileMetadatas.push({
                    id: uploadStream.id, 
                    filename: uniqueFilename, // Este es el nombre que usarás para descargar
                    bucketName: 'uploads',
                    mimetype: file.mimetype,
                    encoding: file.encoding,
                    fieldname: file.fieldname, // ⬅️ AGREGADO: Preservar el fieldname original
                    originalname: file.originalname // ⬅️ AGREGADO: Preservar el nombre original
                });
                resolve();
            });

            uploadStream.on('error', (err) => {
                console.error('Error al subir el archivo:', err);
                reject(err);
            });
        });
    });

    Promise.all(uploadPromises)
        .then(() => {
             // 3. REASIGNAR req.files: Simplifica los controladores al garantizar un array lineal
             req.files = finalFileMetadatas; 
             next();
        })
        .catch((err) => {
            return res.status(500).json({ message: 'Error al subir uno o más archivos', error: err.message });
        });
};

// Exportar upload y streamUpload (Asegúrate que 'upload' esté definido arriba como const upload = multer({...}))
export { upload, streamUpload, gfs };
