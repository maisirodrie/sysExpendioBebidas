import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToke } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import Activity from '../models/activity.model.js';
import nodemailer from 'nodemailer';

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

    // Verificar que las variables de entorno estén cargadas
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT) {
        console.error('Error: Las variables de entorno para el host y puerto del correo no están definidas.');
        return res.status(500).json({ message: 'Error en la configuración del servidor de correo.' });
    }

    // Configuración del transportador de Nodemailer
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
            to: email, // El email del usuario que se está registrando
            subject: 'Credenciales de acceso para el Sistema de Expendio de Bebidas',
            html: `
                <p>Estimado/a ${apellido}, ${nombre}</p>
                <p>Le enviamos en el presente mail las credenciales para acceder al Sistema de Expendio de Bebidas.</p>
                <p>Deberá ingresar la primera vez con los siguientes datos:</p>
                <ul>
                    <li><strong>Usuario:</strong> ${username}</li>
                    <li><strong>Contraseña:</strong> ${tempPassword}</li>
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

        // Si la contraseña es correcta, crea un token de acceso independientemente
        // de si el usuario debe cambiar su contraseña o no.
        const token = await createAccessToke({ id: userFound._id, role: userFound.role });
        res.cookie('token', token, {
            httpOnly: true, // Esto es una buena práctica de seguridad
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Si mustChangePassword es true, la respuesta del servidor incluye este flag
        // para que la aplicación cliente sepa que debe redirigir al usuario.
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
        
        // Si mustChangePassword es false, el flujo continúa normal.
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

        // 🚨 Paso clave: Limpia la cookie del token después de un cambio exitoso
        res.cookie('token', '', { expires: new Date(0) });

        // Devuelve una respuesta JSON simple
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
