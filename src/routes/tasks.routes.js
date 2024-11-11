// src/routes/tasks.routes.js

import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getTask,
  createTasks,
  createTasksPublic,
  deleteTasks,
  getTasks,
  updateTasks,
  downloadFile,
  getUserProfileWithTask,
  getTaskWithUser,
  taskEstados,
} from "../controllers/tasks.controller.js";
import { getPago, updatePago } from "../controllers/pago.controller.js";
import { updatePagoSchema } from "../schemas/pago.schema.js";
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
  getUserActivities,
   
} from "../controllers/auth.controller.js";

const router = Router();

// Registros
// Ruta para cambiar el estado de la tarea (solo accesible por roles mesa y juridicos)
router.put('/tasks', authRequired, taskEstados);
router.get("/tasks", authRequired, getTasks);
router.get("/tasks/:id", authRequired, getTask);
// Ruta para tareas públicas
router.post('/taskspublico',
  upload.array('files', 15), // Permitir carga de múltiples archivos
  streamUpload, validateSchema(creatTaskSchema),createTasksPublic);
router.post(
  "/tasks",
  authRequired,
  upload.array('files', 15), // Permitir carga de múltiples archivos
  streamUpload,
  validateSchema(creatTaskSchema),
  createTasks
);
router.delete("/tasks/:id", authRequired, deleteTasks);
router.put(
  "/tasks/:id",
  authRequired,
  upload.array('files', 15), // Cambiar a múltiples archivos aquí también
  streamUpload,
  updateTasks
);
router.get("/tasks/file/:filename", authRequired, downloadFile);

// Autenticación
router.post("/login", login); // Inicio de sesión
router.post("/logout", logout); // Cerrar sesión

// Usuarios
router.get("/user/tasks/:taskId", authRequired, getTaskWithUser); // Ruta para obtener una tarea con el perfil del usuario asociado
router.get("/profile", authRequired, profile); // Ver perfil de usuario
router.put("/profile", authRequired, updateProfile); // Editar perfil de usuario
router.put('/users/change-password', authRequired, changeUserPassword); // Ruta para que un usuario cambie su propia contraseña
router.get("/verify-token", verifyToken); // Verificar token de autenticación

// Rutas de Pago para el administrador
router.get("/admin/pago", getPago); // Obtener valor de Pago
router.put("/admin/pago",validateSchema(updatePagoSchema), updatePago); // Actualizar valor de Pago


// Administrador
router.put('/admin/users/blanquear-password/:userId', authRequired, adminChangeUserPassword); // Ruta para que un administrador blanquee la contraseña de un usuario
router.get("/admin/users", authRequired, getUsers); // Obtener todos los usuarios
router.get("/admin/users/:id", authRequired, getUser); // Obtener un usuario por ID
router.post("/admin/register", register); // Registrar nuevo usuario
router.put("/admin/users/:id", authRequired, editUser); // Editar usuario
router.get("/admin/users/profile/:userId", authRequired, getUserProfileWithTask); // Ruta para obtener el perfil del usuario
router.get('/admin/activities/user/:userId', authRequired, getUserActivities); // Ruta para obtener todas las actividades de un usuario
router.get('/admin/activities', authRequired, getAllUserActivities); // Ruta para obtener todas las actividades de los usuarios
router.delete('/admin/users/:id', authRequired, deleteUser); // Eliminar usuario

export default router;
