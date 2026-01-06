/**
 * CMS Backend Server
 * Express.js REST API for Client Management System
 * 
 * Interim Version - Approximately 50-60% complete
 * Some features are intentionally incomplete or stubbed
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const interactionRoutes = require('./routes/interactions');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/interactions', interactionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CMS Backend API is running',
    version: '0.1.0-interim'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CMS Backend API',
    version: '0.1.0-interim',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      clients: '/api/clients',
      interactions: '/api/interactions'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database connection and start server
async function startServer() {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    console.log('Database connection established');
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CMS Backend API running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

