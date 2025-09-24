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
  getTaskByDni,
  generateTasksPDF,
  generateTasksExcel,
} from "../controllers/tasks.controller.js";
import { getPago, updatePago } from "../controllers/pago.controller.js";
import { updatePagoSchema } from "../schemas/pago.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { creatTaskSchema } from "../schemas/task.schema.js";
import { upload, streamUpload } from "../multerConfig.js";
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
  changePassword,
  forgotPassword, 
  deleteUser,
  adminChangeUserPassword,
  getAllUserActivities,
  getUserActivities,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

// --- Rutas de Autenticación y Perfil ---
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-token", verifyToken);
router.get("/profile", authRequired, profile);
router.put("/profile", authRequired, updateProfile);
router.put('/change-password', authRequired, changePassword);
// Rutas para "Olvidé mi Contraseña" (NO protegidas por authMiddleware, ya que el usuario no está logueado)
router.post('/forgot-password', forgotPassword); // 🚨 Agrega esta ruta
router.post('/reset-password', resetPassword);

// --- Rutas de Tareas (Públicas y Privadas) ---
router.get("/tasks", authRequired, getTasks);
router.get("/tasks/:id", authRequired, getTask);
router.put('/tasks/estado/:id', authRequired, taskEstados);
router.get("/user/tasks/:taskId", authRequired, getTaskWithUser);
router.get("/tasks/file/:filename", authRequired, downloadFile);
router.post('/taskspublico', upload.array('files', 15), streamUpload, validateSchema(creatTaskSchema), createTasksPublic);
router.post("/tasks", authRequired, upload.array('files', 15), streamUpload, validateSchema(creatTaskSchema), createTasks);
router.put("/tasks/:id", authRequired, upload.array('files', 15), streamUpload, updateTasks);
router.delete("/tasks/:id", authRequired, deleteTasks);

// --- Rutas de Reportes ---
router.get("/tasks/reporte", authRequired, generateTasksPDF);
router.post("/tasks/reporte", authRequired, generateTasksExcel);

// --- Rutas de Búsqueda ---
router.get("/tasks/search/:dni", getTaskByDni);

// --- Rutas de Administración ---
// Usuarios
router.get("/admin/users", authRequired, getUsers);
router.get("/admin/users/:id", authRequired, getUser);
router.post("/admin/register", authRequired, register);
router.put("/admin/users/:id", authRequired, editUser);
router.get("/admin/users/profile/:userId", authRequired, getUserProfileWithTask);
router.delete('/admin/users/:id', authRequired, deleteUser);
// Contraseñas (Administrador)
router.put('/admin/users/blanquear-password/:userId', authRequired, adminChangeUserPassword);
// Pagos (Administrador)
router.get("/admin/pago", getPago);
router.put("/admin/pago", authRequired, validateSchema(updatePagoSchema), updatePago);
// Actividades (Administrador)
router.get('/admin/activities', authRequired, getAllUserActivities);
router.get('/admin/activities/user/:userId', authRequired, getUserActivities);

export default router;
