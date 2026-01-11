import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: '', required: true },
        complete: { type: Boolean, default: false },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }, { timestamps: true });

export default mongoose.model('Task', TaskSchema)