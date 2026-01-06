/**
 * User Model
 * Handles user-related database operations
 */

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @param {string} role - User role (admin or user)
   * @returns {Promise<Object>} Created user object
   */
  static async create(email, password, role = 'user') {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, email, role, created_at, updated_at`,
      [email, hashedPassword, role]
    );

    return result.rows[0];
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Verify password
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if password matches
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Get all users (admin only)
   * TODO: Add pagination
   * @returns {Promise<Array>} Array of user objects
   */
  static async findAll() {
    const result = await pool.query(
      'SELECT id, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    return result.rows;
  }
}

module.exports = User;

