import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';


const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
// }));

app.use(cors({
    origin: 'https://www.expendiobebidas.misiones.gov.ar',
    credentials: true,
})); 

// Define la ruta a tus documentos en producción
const documentsPath = path.join(__dirname, 'documentos'); // Asegúrate de que esta ruta sea correcta
// Sirve archivos estáticos desde la carpeta de documentos
app.use('/documentos', express.static(documentsPath));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


app.use('/api', authRoutes);
app.use('/api', tasksRoutes);



export default app;
