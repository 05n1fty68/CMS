/**
 * Dashboard Routes
 * Provides summary statistics and data for the dashboard
 * 
 * TODO: Add more comprehensive analytics
 * TODO: Add charts data endpoints
 * TODO: Add activity feed
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Get total clients count
    const clientsResult = await pool.query(
      'SELECT COUNT(*) as count FROM clients WHERE deleted_at IS NULL'
    );
    const totalClients = parseInt(clientsResult.rows[0].count);

    // Get total users count (admin only)
    let totalUsers = null;
    if (req.user.role === 'admin') {
      const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
      totalUsers = parseInt(usersResult.rows[0].count);
    }

    // TODO: Get interactions count
    // TODO: Get recent activity
    // TODO: Get client growth over time

    res.json({
      stats: {
        totalClients,
        totalUsers,
        // Placeholder for future stats
        totalInteractions: 0,
        recentActivity: [],
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics.' });
  }
});

module.exports = router;

