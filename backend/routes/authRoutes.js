const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login endpoint
router.post('/login', authController.login);

// Registration endpoint (can be disabled/restricted for interim)
// TODO: Add admin-only restriction or disable for production
router.post('/register', authController.register);

module.exports = router;

