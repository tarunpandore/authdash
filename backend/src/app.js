import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js'

import taskRoutes from './routes/taskRoutes.js'

dotenv.config();

const app = express();


// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


// Auth routes
app.use('/api/auth', authRoutes);

// CRUD routes
app.use('/api/tasks', taskRoutes)

app.get('/api/debug', (req, res) => {
    res.json({ ok: true, headers: req.headers })
})

// Health check route
app.get("/", (req, res) => {
    res.send("API is running...");
});

export default app;