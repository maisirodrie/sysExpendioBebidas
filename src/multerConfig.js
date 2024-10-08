// src/multerConfig.js

import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';
import { Readable } from 'stream';

// Configura tu URI de MongoDB
const mongoURI = 'mongodb://127.0.0.1/sysexpendiobebidasdb';

// Configura la conexión a MongoDB
const conn = mongoose.createConnection(mongoURI, {
  // Las siguientes opciones ya no son necesarias en las versiones más recientes de Mongoose
  // useNewUrlParser: true,
  // useUnifiedTopology: true
});

// Manejo de la conexión a la base de datos
conn.on('error', (err) => {
  console.error('Error en la conexión a MongoDB:', err);
});

let gfs; // Declarar gfs con let para permitir la asignación

conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('Conexión a MongoDB y GridFS establecida correctamente');
});

// Configuración de multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para subir archivos a GridFS
const streamUpload = (req, res, next) => {
  if (!req.file) return next();

  const file = req.file;
  const filename = file.originalname; // Usar solo el nombre original
  const uploadStream = gfs.openUploadStream(filename);

  const readableStream = Readable.from(file.buffer);
  readableStream.pipe(uploadStream);

  uploadStream.on('finish', () => {
    req.file.filename = filename;
    req.file.id = uploadStream.id;
    next();
  });

  uploadStream.on('error', (err) => {
    console.error('Error al subir el archivo:', err);
    return res.status(500).json({ message: 'Error al subir el archivo', error: err.message });
  });
};

// Exportar upload, streamUpload y gfs
export { upload, streamUpload, gfs };
