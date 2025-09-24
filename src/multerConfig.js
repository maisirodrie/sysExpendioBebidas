// src/multerConfig.js

import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';
import { Readable } from 'stream';

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
  if (!req.files) return next(); // Cambiar de req.file a req.files

  const files = req.files; // Acceder a los archivos subidos
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname; // Usar solo el nombre original
      const uploadStream = gfs.openUploadStream(filename);
      
      const readableStream = Readable.from(file.buffer);
      readableStream.pipe(uploadStream);

      uploadStream.on('finish', () => {
        file.filename = filename; // Guardar el nombre del archivo
        file.id = uploadStream.id; // Guardar el ID del archivo en GridFS
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
      next(); // Continuar al siguiente middleware
    })
    .catch((err) => {
      return res.status(500).json({ message: 'Error al subir uno o más archivos', error: err.message });
    });
};

// Exportar upload y streamUpload
export { upload, streamUpload, gfs };
