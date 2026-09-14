// activity.model.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, trim: true },
    userRole: { type: String, trim: true },
    userEmail: { type: String, trim: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    nroexpediente: { type: String, trim: true },
    nombreTitular: { type: String, trim: true },
    dniTitular: { type: String, trim: true },
    action: { type: String, required: true },
    detalles: { type: String, trim: true },
    entity: { type: String, required: true, default: 'tarea' },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
