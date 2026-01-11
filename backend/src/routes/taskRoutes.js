import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router()

// Protect all routes
router.use(authMiddleware)

// CRUD
router.get('/', getTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router