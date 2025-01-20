import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User';

dotenv.config();
const router = express.Router();

// Register User
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

        res.status(200).json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Logged-in User (Protected)
router.get('/me', async (req: Request, res: Response) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = await User.findById((decoded as any).id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default router;
