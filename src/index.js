import app from "./app.js";
import { connectDB } from "./db.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carga las variables de entorno desde el archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el archivo .env correcto según el entorno
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Archivo .env: ${envFile}`);

// Conexión a la base de datos
connectDB();

// Inicia el servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log('Server on port', PORT);
});
