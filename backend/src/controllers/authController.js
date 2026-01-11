import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassowrd = bcrypt.hashSync(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassowrd,
        })

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
            token,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login an existing user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: 'Invalid email or password' }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: 'Invalid email or password' }); }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN },
        )

        res.json({
            user: { id: user._id, name: user.name, email: user.email },
            token,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}