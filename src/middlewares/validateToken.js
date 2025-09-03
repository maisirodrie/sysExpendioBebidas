import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    // 1. Intentar obtener el token del encabezado 'Authorization'
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1]; // El token es la segunda parte después de 'Bearer'

    // 2. Si no está en el encabezado, intentar obtenerlo de las cookies
    const token = tokenFromHeader || req.cookies.token;

    // Si todavía no hay token, denegar el acceso
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verificar el token
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Error al verificar el token:", err);
            return res.status(403).json({ message: "Invalid token" });
        }

        // Si la verificación es exitosa, adjuntar el objeto de usuario a la solicitud
        req.user = user;
        next();
    });
};