import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { config } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { AppDataSource } from './config/typeorm.config.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/event.routes.js';
import { authenticate } from './middleware/auth.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Error handling
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    // Initialize TypeORM connection
    await AppDataSource.initialize();
    console.log('Database connection initialized');
    
    // Connect to MySQL
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