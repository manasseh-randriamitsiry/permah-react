import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { config } from './config/env';
import { errorHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';

import 'reflect-metadata';
import { AppDataSource } from './config/typeorm.config';
import { authenticateToken } from './middleware/auth.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', authenticateToken, eventRoutes);

// Error handling
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start(); 