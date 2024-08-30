import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import path from 'path';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos desde el directorio 'files'
const __dirname = path.resolve();
app.use('/files', express.static(path.join(__dirname, 'src', 'files')));

app.use('/api', authRoutes);
app.use('/api', tasksRoutes);



export default app;
