import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import tenantRoutes from './routes/tenantRoutes';
import authRoutes from './routes/authRoutes';

// app.use('/api/auth', authRoutes);
// app.use('/api/tenants', tenantRoutes);

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as mongoose.ConnectOptions)
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Basic Route
app.get('/', (_, res) => {
    res.send('🏨 Hostel Check-In API is running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
