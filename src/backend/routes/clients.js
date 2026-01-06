/**
 * Client Routes
 * Handles CRUD operations for clients
 */

const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Client = require('../models/client');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/clients
 * Get all clients
 * TODO: Add pagination
 * TODO: Add filtering by status, date range, etc.
 */
router.get('/', async (req, res) => {
  try {
    // TODO: Implement search functionality
    const searchTerm = req.query.search;
    
    let clients;
    if (searchTerm) {
      clients = await Client.search(searchTerm);
    } else {
      clients = await Client.findAll();
    }

    res.json({ clients, count: clients.length });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to retrieve clients.' });
  }
});

/**
 * GET /api/clients/:id
 * Get a single client by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Invalid client ID.' });
    }

    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found.' });
    }

    res.json({ client });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to retrieve client.' });
  }
});

/**
 * POST /api/clients
 * Create a new client
 */
router.post(
  '/',
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('notes').optional().trim(),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const clientData = {
        name: req.body.name,
        email: req.body.email || '',
        phone: req.body.phone || '',
        notes: req.body.notes || '',
      };

      const client = await Client.create(clientData, req.user.id);

      res.status(201).json({
        message: 'Client created successfully',
        client,
      });
    } catch (error) {
      console.error('Create client error:', error);
      res.status(500).json({ error: 'Failed to create client.' });
    }
  }
);

/**
 * PUT /api/clients/:id
 * Update a client
 */
router.put(
  '/:id',
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('notes').optional().trim(),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const clientId = parseInt(req.params.id);
      
      if (isNaN(clientId)) {
        return res.status(400).json({ error: 'Invalid client ID.' });
      }

      // Check if client exists
      const existingClient = await Client.findById(clientId);
      if (!existingClient) {
        return res.status(404).json({ error: 'Client not found.' });
      }

      const clientData = {
        name: req.body.name,
        email: req.body.email || '',
        phone: req.body.phone || '',
        notes: req.body.notes || '',
      };

      const client = await Client.update(clientId, clientData);

      res.json({
        message: 'Client updated successfully',
        client,
      });
    } catch (error) {
      console.error('Update client error:', error);
      res.status(500).json({ error: 'Failed to update client.' });
    }
  }
);

/**
 * DELETE /api/clients/:id
 * Soft delete a client (admin only)
 * TODO: Allow users to delete their own clients
 */
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Invalid client ID.' });
    }

    // Check if client exists
    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found.' });
    }

    const deleted = await Client.softDelete(clientId);

    if (deleted) {
      res.json({ message: 'Client deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete client.' });
    }
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client.' });
  }
});

module.exports = router;

