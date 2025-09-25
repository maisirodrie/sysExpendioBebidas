import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToke } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import Activity from '../models/activity.model.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto'; // Añadido para generar tokens de restablecimiento

// Función para generar una contraseña temporal
const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Registrar nuevo usuario
export const register = async (req, res) => {
    const { username, email, role, nombre, apellido } = req.body;

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT) {
        console.error('Error: Las variables de entorno para el host y puerto del correo no están definidas.');
        return res.status(500).json({ message: 'Error en la configuración del servidor de correo.' });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    console.log("Configuración de Nodemailer:", {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER
    });

    try {
        const userFoundByUsername = await User.findOne({ username });
        if (userFoundByUsername) return res.status(400).json(["El usuario ya existe"]);

        const userFoundByEmail = await User.findOne({ email });
        if (userFoundByEmail) return res.status(400).json(["El correo ya existe"]);

        const tempPassword = generateRandomPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            role,
            nombre,
            apellido,
            mustChangePassword: true,
        });

        const userSaved = await newUser.save();

        const mailOptions = {
            from: `"Centro de Cómputos Misiones" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Credenciales de acceso para el Sistema de Expendio de Bebidas',
            html: `
                <p>Estimado/a ${apellido}, ${nombre}</p>
                <p>Le enviamos en el presente mail las credenciales para acceder al Sistema de Expendio de Bebidas.</p>
                <p>Deberá ingresar la primera vez con los siguientes datos:</p>
                <ul>
                    <li><strong>Usuario:</strong>${username}</li>
                    <li><strong>Contraseña:</strong>${tempPassword}</li>
                </ul>
                <p>Tenga en cuenta que la contraseña proporcionada es provisoria, deberá cambiarla al ingresar.</p>
                <p>Link para ingresar: <a href="${process.env.VITE_FRONTEND_URL}/login">${process.env.VITE_FRONTEND_URL}/login</a></p>
                <br>
                <p>Centro de Cómputos de la Provincia de Misiones</p>
                <p>25 de Mayo 1460 - CP 3300</p>
                <p>Teléfono: 4447479 Centrex 7479</p>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log("Correo de credenciales enviado a: ", email);

        const token = await createAccessToke({ id: userSaved._id, role: userSaved.role });
        res.cookie('token', token);
        res.status(201).json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            role: userSaved.role,
            nombre: userSaved.nombre,
            apellido: userSaved.apellido,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });

    } catch (error) {
        console.error('Error al registrar usuario o enviar correo:', error);
        res.status(500).json({ message: error.message });
    }
};

// Inicio de sesión
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userFound = await User.findOne({ username });
        if (!userFound) return res.status(400).json({ message: "Usuario incorrecto" });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña Incorrecta" });

        const token = await createAccessToke({ id: userFound._id, role: userFound.role });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        if (userFound.mustChangePassword) {
            return res.status(200).json({
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                role: userFound.role,
                mustChangePassword: true,
                message: "Por favor, cambia tu contraseña por seguridad."
            });
        }
        
        res.status(200).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role,
            nombre: userFound.nombre,
            apellido: userFound.apellido,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cerrar sesión
export const logout = async (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
}

// Ver perfil de usuario
export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id);

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        role: userFound.role,
        nombre: userFound.nombre,
        apellido: userFound.apellido,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    });
}

// Actualizar perfil de usuario
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nombre, apellido, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { nombre, apellido, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            nombre: updatedUser.nombre,
            apellido: updatedUser.apellido,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        });
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "username email role nombre apellido createdAt updatedAt");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario por ID
export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const userFound = await User.findById(id, "username email role nombre apellido createdAt updatedAt");
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(userFound);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Editar usuario (sin cambiar contraseña)
export const editUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, role, nombre, apellido } = req.body;

    try {
        const userFound = await User.findById(id);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        userFound.username = username || userFound.username;
        userFound.email = email || userFound.email;
        userFound.role = role || userFound.role;
        userFound.nombre = nombre || userFound.nombre;
        userFound.apellido = apellido || userFound.apellido;

        const updatedUser = await userFound.save();

        res.json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            nombre: updatedUser.nombre,
            apellido: updatedUser.apellido,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const userFound = await User.findById(userId);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(oldPassword, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña antigua incorrecta" });

        const passwordHash = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHash;
        userFound.mustChangePassword = false;

        await userFound.save();

        res.cookie('token', '', { expires: new Date(0) });

        res.json({ message: "Contraseña cambiada con éxito" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Verificar token de autenticación
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.send(false);

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
        if (error) return res.sendStatus(401);

        const userFound = await User.findById(user.id);
        if (!userFound) return res.sendStatus(401);

        return res.json({
            id: userFound._id,
            username: userFound.username,
            nombre: userFound.nombre,
            apellido: userFound.apellido,
        });
    });
};


export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const userFound = await User.findById(id);
      if (!userFound) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      await User.findByIdAndDelete(id);

      res.json({ message: "Usuario eliminado correctamente." });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      return res.status(500).json({ message: error.message });
    }
  };


// Cambiar contraseña del usuario autenticado
export const changeUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const userFound = await User.findById(userId);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(oldPassword, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña antigua incorrecta" });

        const passwordHash = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHash;
        
        userFound.mustChangePassword = false;

        await userFound.save();
        res.json({ message: "Contraseña cambiada con éxito" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Cambiar contraseña de un usuario por parte de un administrador
export const adminChangeUserPassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    try {
        const userFound = await User.findById(userId);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        const passwordHash = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHash;

        await userFound.save();
        res.json({ message: "Contraseña restablecida con éxito" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getUserActivities = async (req, res) => {
    const { userId } = req.params;
    try {
        const activities = await Activity.find({ userId })
            .populate('userId', 'nombre apellido');
        if (activities.length === 0) {
            return res.status(404).json({ message: "No se encontraron actividades para este usuario." });
        }
        res.json(activities);
    } catch (error) {
        console.error("Error al obtener actividades del usuario:", error);
        return res.status(500).json({ message: error.message });
    }
};


// Obtener actividades de todos los usuarios
export const getAllUserActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate('userId', 'username email nombre apellido');
        res.json(activities);
    } catch (error) {
        console.error("Error al obtener actividades:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const forgotPassword = async (req, res) => {
    const { identifier } = req.body;

    try {
        // Buscar usuario por 'username' o 'email' usando la sintaxis de Mongoose
        const userFound = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        });

        // Si no se encuentra el usuario, devuelve un mensaje genérico por seguridad
        if (!userFound) {
            return res.status(404).json({ message: ["Si el usuario existe, se ha enviado un enlace de restablecimiento."] });
        }

        if (!userFound.email) {
            return res.status(400).json({ message: ["Este usuario no tiene un correo electrónico registrado para restablecer la contraseña."] });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // Expira en 1 hora

        userFound.resetPasswordToken = resetToken;
        userFound.resetPasswordExpires = resetExpires;
        await userFound.save();

        // Asegurarse de que las variables de entorno para el correo estén disponibles
        if (!process.env.EMAIL_USER || !process.env.VITE_FRONTEND_URL) {
            console.error('Error: Las variables de entorno para el correo y la URL del frontend no están definidas.');
            return res.status(500).json({ message: 'Error en la configuración del servidor de correo.' });
        }

        const resetUrl = `${process.env.VITE_FRONTEND_URL}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

const mailOptions = {
    from: `"Centro de Cómputos Misiones" <${process.env.EMAIL_USER}>`,
    to: userFound.email,
    subject: 'Restablecimiento de Contraseña para el Sistema de Expendio de Bebidas',
    html: `
        <p>Estimado/a ${userFound.nombre || userFound.username} ${userFound.apellido || ''},</p>
        <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para completar el proceso:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste esto, por favor ignora este correo.</p>
        <p>Saludos,</p>
        <br>
        <p>Centro de Cómputos de la Provincia de Misiones</p>
        <p>25 de Mayo 1460 - CP 3300</p>
        <p>Teléfono: 4447479 Centrex 7479</p>
    `,
};

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de restablecimiento enviado a ${userFound.email}`);
        res.status(200).json({
            message: ["Se ha enviado un enlace de restablecimiento a tu correo electrónico."]
        });

    } catch (error) {
        console.error('❌ Error al solicitar restablecimiento de contraseña:', error.message);
        res.status(500).json({ message: ["Error interno del servidor al solicitar restablecimiento."] });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    console.log('Token recibido:', token); // 🚨 Agrega esta línea
    console.log('Nueva contraseña recibida:', newPassword);

    try {
        // Buscar el usuario por el token y verificar que no haya expirado usando Mongoose
        const userFound = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!userFound) {
            return res.status(400).json({ message: ["Token de restablecimiento inválido o expirado."] });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHash;
        userFound.resetPasswordToken = undefined; // Eliminar el token
        userFound.resetPasswordExpires = undefined; // Eliminar la fecha de expiración
        userFound.mustChangePassword = false; // Desactivar la obligación de cambiar la contraseña
        
        await userFound.save();

        res.status(200).json({ message: ["Contraseña restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña."] });

    } catch (error) {
        console.error('❌ Error al restablecer contraseña:', error.message);
        res.status(500).json({ message: ["Error interno del servidor al restablecer la contraseña."] });
    }
};