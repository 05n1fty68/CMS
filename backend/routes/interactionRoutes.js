const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All interaction routes require authentication
router.use(authenticateToken);

// Get all interactions (placeholder for interim)
router.get('/', interactionController.getAllInteractions);

// Get interactions for a specific client
router.get('/client/:clientId', interactionController.getClientInteractions);

// Create new interaction (placeholder for interim)
router.post('/', interactionController.createInteraction);

module.exports = router;

