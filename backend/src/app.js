import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js'

import taskRoutes from './routes/taskRoutes.js'

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://authdash-1ox4.onrender.com',
    'https://authdash-tau.vercel.app'
]

const corsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin like mobile apps or curl
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeader: ['Content-Type', 'Authorization'],
    credentials: true,
}

// Connect to database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.options(/(.*)/, cors(corsOptions))

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