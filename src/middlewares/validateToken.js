import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    // 1. Intentar obtener el token del encabezado 'Authorization'
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];

    // 2. Si no está en el encabezado, intentar obtenerlo de las cookies
    const token = tokenFromHeader || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verificar el token
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    });
};