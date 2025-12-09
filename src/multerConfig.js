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

// Configura la conexiÃ³n a MongoDB
const conn = mongoose.createConnection(mongoURI);

// Manejo de la conexiÃ³n a la base de datos
conn.on('error', (err) => {
  console.error('Error en la conexiÃ³n a MongoDB:', err);
});

let gfs;

conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('ConexiÃ³n a MongoDB y GridFS establecida correctamente');
});

// ConfiguraciÃ³n de multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para subir archivos a GridFS
const streamUpload = (req, res, next) => {
    // Si no hay archivos o req.files no existe, continÃºa
    if (!req.files) return next(); 

    // 1. APLANAR EL OBJETO req.files EN UN ÃšNICO ARRAY (Maneja .fields() y .array())
    let filesToProcess = [];
    if (typeof req.files === 'object' && !Array.isArray(req.files)) {
        // req.files es un objeto de arrays (si se usÃ³ upload.fields())
        for (const fieldName in req.files) {
            filesToProcess = filesToProcess.concat(req.files[fieldName]);
        }
    } else if (Array.isArray(req.files)) {
        // req.files ya es un array (si se usÃ³ upload.array() o .any())
        filesToProcess = req.files;
    }

    if (filesToProcess.length === 0) return next();

    const finalFileMetadatas = []; 
    
    // 2. Procesar la subida a GridFS
    const uploadPromises = filesToProcess.map((file) => {
        return new Promise((resolve, reject) => {
            
            // Generar un nombre de archivo ÃšNICO para GridFS (evita colisiones y el error FileNotFound)
            // Se usa el nombre del campo original (ej: notaSolicitud) + timestamp + nombre original
            const uniqueFilename = `${file.fieldname || 'file'}-${Date.now()}-${file.originalname}`; 

            const uploadStream = gfs.openUploadStream(uniqueFilename, {
                contentType: file.mimetype,
            });
            
            const readableStream = Readable.from(file.buffer);
            readableStream.pipe(uploadStream);

            uploadStream.on('finish', () => {
                // Capturamos los metadatos CLAVE, incluyendo el ID y el nombre Ãºnico
                finalFileMetadatas.push({
                    id: uploadStream.id, 
                    filename: uniqueFilename, // Este es el nombre que usarÃ¡s para descargar
                    bucketName: 'uploads',
                    mimetype: file.mimetype,
                    encoding: file.encoding,
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
            return res.status(500).json({ message: 'Error al subir uno o mÃ¡s archivos', error: err.message });
        });
};

// Exportar upload y streamUpload (AsegÃºrate que 'upload' estÃ© definido arriba como const upload = multer({...}))
export { upload, streamUpload, gfs };
