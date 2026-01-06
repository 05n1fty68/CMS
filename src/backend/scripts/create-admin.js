/**
 * Create Admin User Script
 * Utility script to create or update admin user
 * 
 * Usage: node scripts/create-admin.js <email> <password>
 * Example: node scripts/create-admin.js admin@cms.local admin123
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function createAdmin() {
  const email = process.argv[2] || 'admin@cms.local';
  const password = process.argv[3] || 'admin123';

  try {
    console.log(`Creating admin user: ${email}`);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user
      await pool.query(
        'UPDATE users SET password_hash = $1, role = $2, updated_at = NOW() WHERE email = $3',
        [passwordHash, 'admin', email]
      );
      console.log(`Admin user updated: ${email}`);
    } else {
      // Create new user
      await pool.query(
        'INSERT INTO users (email, password_hash, role, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [email, passwordHash, 'admin']
      );
      console.log(`Admin user created: ${email}`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdmin().then(() => {
  pool.end();
});

