import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToke } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import Activity from '../models/activity.model.js';

// Registrar nuevo usuario
export const register = async (req, res) => {
    const { username, email, password, role, nombre, apellido } = req.body;

    try {
        const userFoundByUsername = await User.findOne({ username });
        if (userFoundByUsername) return res.status(400).json(["El usuario ya existe"]);

        const userFoundByEmail = await User.findOne({ email });
        if (userFoundByEmail) return res.status(400).json(["El correo ya existe"]);

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            role,
            nombre,
            apellido
        });

        const userSaved = await newUser.save();
        const token = await createAccessToke({ id: userSaved._id, role: userSaved.role });
        res.cookie('token', token);
        res.json({
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

        res.cookie('token', token);
        res.json({
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
        const userId = req.user.id; // Obtén el ID del usuario autenticado
        const { nombre, apellido, email } = req.body; // Obtén los datos a actualizar

        // Opcional: Aquí podrías agregar validaciones para los campos

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { nombre, apellido, email },
            { new: true, runValidators: true } // Devuelve el nuevo documento y valida
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
    const { id } = req.params; // ID del usuario
    const { username, email, role, nombre, apellido } = req.body; // No se incluye el campo password

    try {
        const userFound = await User.findById(id);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        // Actualizar los campos que no sean la contraseña
        userFound.username = username || userFound.username;
        userFound.email = email || userFound.email;
        userFound.role = role || userFound.role;
        userFound.nombre = nombre || userFound.nombre;
        userFound.apellido = apellido || userFound.apellido;

        const updatedUser = await userFound.save();

        // Devolver la información actualizada del usuario
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
    const { id } = req.params; // ID del usuario
    const { oldPassword, newPassword } = req.body;

    try {
        const userFound = await User.findById(id);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        // Comparar la contraseña antigua
        const isMatch = await bcrypt.compare(oldPassword, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña antigua incorrecta" });

        // Hashear y actualizar la nueva contraseña
        const passwordHash = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHash;

        await userFound.save();
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
  
      // Usar el método de eliminación
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
    const userId = req.user.id; // Obtener el ID del usuario autenticado

    try {
        const userFound = await User.findById(userId);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        // Comparar la contraseña antigua
        const isMatch = await bcrypt.compare(oldPassword, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña antigua incorrecta" });

        // Hashear y actualizar la nueva contraseña
        const passwordHash = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHash;

        await userFound.save();
        res.json({ message: "Contraseña cambiada con éxito" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





// Cambiar contraseña de un usuario por parte de un administrador
export const adminChangeUserPassword = async (req, res) => {
    const { userId } = req.params; // ID del usuario a modificar
    const { newPassword } = req.body;

    try {
        const userFound = await User.findById(userId);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        // Hashear y actualizar la nueva contraseña
        const passwordHash = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHash;

        await userFound.save();
        res.json({ message: "Contraseña restablecida con éxito" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getUserActivities = async (req, res) => {
    const { userId } = req.params; // Obtener userId de los parámetros de la solicitud
    try {
        const activities = await Activity.find({ userId }) // Filtrar actividades por userId
            .populate('userId', 'nombre apellido'); // Solo incluye nombre y apellido
        if (activities.length === 0) {
            return res.status(404).json({ message: "No se encontraron actividades para este usuario." });
        }
        res.json(activities);
    } catch (error) {
        console.error("Error al obtener actividades del usuario:", error); // Para ver más detalles del error
        return res.status(500).json({ message: error.message });
    }
};


// Obtener actividades de todos los usuarios
export const getAllUserActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate('userId', 'username email nombre apellido'); // Cambia 'user' a 'userId'
        res.json(activities);
    } catch (error) {
        console.error("Error al obtener actividades:", error); // Para ver más detalles del error
        return res.status(500).json({ message: error.message });
    }
};




  
