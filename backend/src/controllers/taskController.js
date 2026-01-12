import Task from '../models/Task.js';

// GET all tasks for the logged in user
export async function getTasks(req, res) {
    try {
        const tasks = await Task.find({ owner: req.user._id })

        // sort by newest first
        tasks.sort((a, b) => b.createdAt - a.createdAt)
        
        res.json(tasks)
    } catch (error) { res.status(500).json({ message: error.message }); }
}

// CREATE a new task
export async function createTask(req, res) {
    try {
        const { title, description } = req.body;
        if (!title) { return res.status(400).json({ message: 'Title is required' }); }
        const newTask = await Task.create({
            title,
            description,
            owner: req.user._id,
        })

        res.status(201).json(newTask);

    } catch (error) { res.status(500).json({ message: error.message }); }
}

// UPDATE a task
export async function updateTask(req, res) {
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            req.body,
            { new: true },
        )

        if (!updated) { return res.status(404).json({ message: 'Task not found' }); }

        res.json(updated);
    } catch (error) { res.status(500).json({ message: error.message }); }
}

// DELETE a task
export async function deleteTask(req, res) {
    try {
        const deleted = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        })

        if(!deleted) { return res.status(404).json({ message: 'Task not found' }); }

        res.json({ message: 'Task deleted' });

    } catch (error) { res.status(500).json({ message: error.message }); }
}