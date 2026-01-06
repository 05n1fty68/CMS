/**
 * Client Model
 * Handles client-related database operations
 */

const pool = require('../config/database');

class Client {
  /**
   * Create a new client
   * @param {Object} clientData - Client data object
   * @param {string} clientData.name - Client name
   * @param {string} clientData.email - Client email
   * @param {string} clientData.phone - Client phone
   * @param {string} clientData.notes - Client notes
   * @param {number} userId - ID of user creating the client
   * @returns {Promise<Object>} Created client object
   */
  static async create(clientData, userId) {
    const { name, email, phone, notes } = clientData;

    const result = await pool.query(
      `INSERT INTO clients (name, email, phone, notes, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [name, email, phone, notes || '', userId]
    );

    return result.rows[0];
  }

  /**
   * Find client by ID
   * @param {number} id - Client ID
   * @returns {Promise<Object|null>} Client object or null
   */
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Get all clients (with soft delete filter)
   * TODO: Add pagination, filtering, and search
   * @returns {Promise<Array>} Array of client objects
   */
  static async findAll() {
    const result = await pool.query(
      `SELECT * FROM clients 
       WHERE deleted_at IS NULL 
       ORDER BY created_at DESC`
    );

    return result.rows;
  }

  /**
   * Update client by ID
   * @param {number} id - Client ID
   * @param {Object} clientData - Updated client data
   * @returns {Promise<Object|null>} Updated client object or null
   */
  static async update(id, clientData) {
    const { name, email, phone, notes } = clientData;

    const result = await pool.query(
      `UPDATE clients 
       SET name = $1, email = $2, phone = $3, notes = $4, updated_at = NOW()
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING *`,
      [name, email, phone, notes || '', id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Soft delete client by ID
   * @param {number} id - Client ID
   * @returns {Promise<boolean>} True if client was deleted
   */
  static async softDelete(id) {
    const result = await pool.query(
      `UPDATE clients 
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    return result.rows.length > 0;
  }

  /**
   * Search clients by name or email
   * TODO: Implement full-text search
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching clients
   */
  static async search(searchTerm) {
    const result = await pool.query(
      `SELECT * FROM clients 
       WHERE deleted_at IS NULL 
       AND (name ILIKE $1 OR email ILIKE $1)
       ORDER BY created_at DESC`,
      [`%${searchTerm}%`]
    );

    return result.rows;
  }
}

module.exports = Client;

