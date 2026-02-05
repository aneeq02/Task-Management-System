const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    const task = await Task.create({
      title: title.trim(),
      description: (description || '').trim(),
      status: status || 'Pending',
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create task.' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const status = req.query.status; // Pending | In Progress | Completed
    const search = (req.query.search || '').trim();

    const filter = { createdBy: req.user.id };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch tasks.' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch task.' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      task.status = status;
    }
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update task.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete task.' });
  }
};
