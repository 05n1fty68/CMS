require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./backend/routes/authRoutes');
const clientRoutes = require('./backend/routes/clientRoutes');
const interactionRoutes = require('./backend/routes/interactionRoutes');
const dashboardRoutes = require('./backend/routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
});

app.get('/clients', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'clients.html'));
});

app.get('/clients/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'client-form.html'));
});

app.get('/clients/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'client-form.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

