const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

taskSchema.index({ createdBy: 1 });
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ status: 1, createdBy: 1 });

module.exports = mongoose.model('Task', taskSchema);
