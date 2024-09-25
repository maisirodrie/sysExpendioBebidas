// activity.model.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
