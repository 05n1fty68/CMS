/**
 * Client Management Routes
 * CRUD operations for client records
 * 
 * Interim Version: Basic CRUD implemented
 * TODO: Advanced search, filtering, pagination
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorize } = require('../middleware/auth');

// All client routes require authentication
router.use(authenticateToken);

// Get all clients
router.get('/', async (req, res) => {
  try {
    // TODO: Implement pagination
    // TODO: Implement search and filtering
    const result = await db.query(
      `SELECT id, name, email, phone, notes, created_at, updated_at, deleted_at
       FROM clients
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC`
    );

    res.json({
      clients: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to retrieve clients' });
  }
});

// Get single client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, name, email, phone, notes, created_at, updated_at, deleted_at
       FROM clients
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ client: result.rows[0] });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to retrieve client' });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    // TODO: Add email validation
    // TODO: Add phone number validation

    const result = await db.query(
      `INSERT INTO clients (name, email, phone, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, email, phone, notes, created_at, updated_at`,
      [name, email || null, phone || null, notes || null]
    );

    res.status(201).json({
      message: 'Client created successfully',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Create client error:', error);
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Client with this email already exists' });
    }

    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, notes } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    // Check if client exists
    const existingClient = await db.query(
      'SELECT id FROM clients WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (existingClient.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const result = await db.query(
      `UPDATE clients
       SET name = $1, email = $2, phone = $3, notes = $4, updated_at = NOW()
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING id, name, email, phone, notes, created_at, updated_at`,
      [name, email || null, phone || null, notes || null, id]
    );

    res.json({
      message: 'Client updated successfully',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Update client error:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Client with this email already exists' });
    }

    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Soft delete client (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if client exists
    const existingClient = await db.query(
      'SELECT id FROM clients WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (existingClient.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Soft delete
    await db.query(
      'UPDATE clients SET deleted_at = NOW() WHERE id = $1',
      [id]
    );

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;

