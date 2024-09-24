import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    timestamp: { type: Date, default: Date.now },
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
