const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// All client routes require authentication
router.use(authenticateToken);

// Get all clients (with optional search)
router.get('/', clientController.getAllClients);

// Get single client by ID
router.get('/:id', clientController.getClientById);

// Create new client
router.post('/', clientController.createClient);

// Update client
router.put('/:id', clientController.updateClient);

// Delete client (soft delete - admin only for interim)
router.delete('/:id', requireAdmin, clientController.deleteClient);

module.exports = router;

