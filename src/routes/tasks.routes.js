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
  editUser,
  changePassword,
  verifyToken,
} from "../controllers/auth.controller.js";

const router = Router();

// Tareas (Tasks)
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

// Ruta para obtener una tarea con el perfil del usuario asociado
router.get("/users/:userId/profile", authRequired, getUserProfileWithTask);
router.get("/tasks/:taskId/user", authRequired, getTaskWithUser);

// Usuarios
router.get("/users", authRequired, getUsers); // Obtener todos los usuarios
router.get("/users/:id", authRequired, getUser); // Obtener un usuario por ID
router.post("/register", register); // Registrar nuevo usuario
router.post("/login", login); // Inicio de sesión
router.post("/logout", logout); // Cerrar sesión
router.get("/profile", authRequired, profile); // Ver perfil de usuario
router.put("/users/:id", authRequired, editUser); // Editar usuario
router.put("/users/:id/change-password", authRequired, changePassword); // Cambiar contraseña
router.get("/verify-token", verifyToken); // Verificar token de autenticación

export default router;
