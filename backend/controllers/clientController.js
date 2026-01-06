const pool = require('../config/database');

/**
 * Get all clients with optional search
 * Supports basic search by name (interim implementation)
 * TODO: Add advanced filtering, pagination, sorting
 */
const getAllClients = async (req, res) => {
  try {
    const { search } = req.query;
    let query, params;

    if (search) {
      // Basic search by name only (interim)
      query = `
        SELECT id, name, email, phone, notes, created_at, updated_at, deleted_at
        FROM clients
        WHERE deleted_at IS NULL 
        AND (name ILIKE $1 OR email ILIKE $1)
        ORDER BY created_at DESC
      `;
      params = [`%${search}%`];
    } else {
      query = `
        SELECT id, name, email, phone, notes, created_at, updated_at, deleted_at
        FROM clients
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
      `;
      params = [];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      clients: result.rows
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients'
    });
  }
};

/**
 * Get single client by ID
 */
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, name, email, phone, notes, created_at, updated_at, deleted_at
       FROM clients 
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching client'
    });
  }
};

/**
 * Create new client
 */
const createClient = async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Insert new client
    const result = await pool.query(
      `INSERT INTO clients (name, email, phone, notes, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, notes, created_at, updated_at`,
      [name, email, phone || null, notes || null, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Create client error:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating client'
    });
  }
};

/**
 * Update client
 */
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, notes } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if client exists
    const checkResult = await pool.query(
      'SELECT id FROM clients WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Update client
    const result = await pool.query(
      `UPDATE clients 
       SET name = $1, email = $2, phone = $3, notes = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING id, name, email, phone, notes, created_at, updated_at`,
      [name, email, phone || null, notes || null, id]
    );

    res.json({
      success: true,
      message: 'Client updated successfully',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Update client error:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating client'
    });
  }
};

/**
 * Delete client (soft delete)
 * Admin only for interim stage
 */
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete by setting deleted_at timestamp
    const result = await pool.query(
      `UPDATE clients 
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting client'
    });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};

