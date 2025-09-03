import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export function createAccessToke(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, // Usa el objeto completo como payload
            TOKEN_SECRET,
            {
                expiresIn: "1d",
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
}