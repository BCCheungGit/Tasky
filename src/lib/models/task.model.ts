import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    viewable: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    title: {type: String, required: true},
    description: {type: String},
    createdAt: {type: Date},
    dueDate: {type: Date},
    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'medium'},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization'},
    completed: {type: Boolean, default: false},
})


const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;