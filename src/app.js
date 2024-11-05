import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';



const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
// }));

app.use(cors({
    origin: 'https://www.expendiobebidas.misiones.gov.ar',
    credentials: true,
})); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define la ruta a tus documentos
const documentsPath = path.join(__dirname, '../documentos'); // Ajusta según la estructura de directorios
 // Ajusta según la estructura de directorios
// Asegúrate de que esta ruta sea correcta

// Sirve archivos estáticos desde la carpeta de documentos
app.use('/documentos', express.static(documentsPath));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Rutas de la API
app.use('/api', authRoutes);
app.use('/api', tasksRoutes);

export default app;
