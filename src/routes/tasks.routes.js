// src/routes/tasks.routes.js

import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { getTask, createTasks, deleteTasks, getTasks, updateTasks, downloadFile  } from '../controllers/tasks.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { creatTaskSchema } from '../schemas/task.schema.js';
import { upload, streamUpload } from '../multerConfig.js'; // Asegúrate de que esta ruta es correcta

const router = Router();

router.get('/tasks', authRequired, getTasks);
router.get('/tasks/:id', authRequired, getTask);
router.post('/tasks', authRequired, upload.single('file'), streamUpload, validateSchema(creatTaskSchema), createTasks);
router.delete('/tasks/:id', authRequired, deleteTasks);
router.put('/tasks/:id', authRequired, upload.single('file'), streamUpload, updateTasks);
router.get('/tasks/file/:filename', authRequired, downloadFile);

export default router;