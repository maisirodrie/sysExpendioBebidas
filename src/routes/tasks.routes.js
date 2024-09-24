// src/routes/tasks.routes.js

import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getTask,
  createTasks,
  deleteTasks,
  getTasks,
  updateTasks,
  downloadFile,
  getUserProfileWithTask,
  getTaskWithUser,
} from "../controllers/tasks.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { creatTaskSchema } from "../schemas/task.schema.js";
import { upload, streamUpload } from "../multerConfig.js"; // Asegúrate de que esta ruta es correcta
import {
  getUsers,
  getUser,
  register,
  login,
  logout,
  profile,
  updateProfile,
  editUser,
  verifyToken,
  changeUserPassword,
  deleteUser,
  adminChangeUserPassword,
  getAllUserActivities,
  getUserActivities
} from "../controllers/auth.controller.js";

const router = Router();

// Registros
router.get("/tasks", authRequired, getTasks);
router.get("/tasks/:id", authRequired, getTask);
router.post(
  "/tasks",
  authRequired,
  upload.single("file"),
  streamUpload,
  validateSchema(creatTaskSchema),
  createTasks
);
router.delete("/tasks/:id", authRequired, deleteTasks);
router.put(
  "/tasks/:id",
  authRequired,
  upload.single("file"),
  streamUpload,
  updateTasks
);
router.get("/tasks/file/:filename", authRequired, downloadFile);

//Autentificación
router.post("/login", login); // Inicio de sesión
router.post("/logout", logout); // Cerrar sesión



// Usuarios

router.get("/user/tasks/:taskId", authRequired, getTaskWithUser);// Ruta para obtener una tarea con el perfil del usuario asociado
router.get("/profile", authRequired, profile); // Ver perfil de usuario

router.put("/profile", authRequired, updateProfile);// Editar perfil de usuario
router.put('/users/change-password', authRequired, changeUserPassword); // Ruta para que un usuario cambie su propia contraseña
router.get("/verify-token", verifyToken); // Verificar token de autenticación


//Administrador

router.put('/admin/users/blanquear-password/:userId', authRequired, adminChangeUserPassword);// Ruta para que un administrador blanquee la contraseña de un usuario
router.get("/admin/users", authRequired, getUsers); // Obtener todos los usuarios
router.get("/admin/users/:id", authRequired, getUser); // Obtener un usuario por ID
router.post("/admin/register", register); // Registrar nuevo usuario
router.put("/admin/users/:id", authRequired, editUser); // Editar usuario
router.get("/admin/users/profile/:userId", authRequired, getUserProfileWithTask);// Ruta para obtener el perfil del usuario
router.get('/admin/activities/user/:userId', authRequired, getUserActivities);// Ruta para obtener todas las actividades de un usuario
router.get('/admin/activities', authRequired, getAllUserActivities);// Ruta para obtener todas las actividades de los usuarios
router.delete('/admin/users/:id', authRequired, deleteUser); // Eliminar usuario


export default router;
