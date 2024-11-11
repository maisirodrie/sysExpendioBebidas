import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Middleware de CORS
app.use(cors({
    origin: ['http://localhost:5173', 'https://www.expendiobebidas.misiones.gov.ar'],
    credentials: true,
}));


// Define la ruta de los documentos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta de documentos
const documentosPath = path.join(__dirname, 'documentos');

// Configurar Express para servir archivos estáticos desde esa carpeta en '/documentos'
app.use('/api/documentos', express.static(documentosPath));
// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Rutas de la API
app.use('/api', authRoutes);
app.use('/api', tasksRoutes);

export default app;
