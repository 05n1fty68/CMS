const pool = require('../config/database');

/**
 * Get dashboard statistics
 * Interim implementation: Only returns client count
 * TODO: Add more statistics (recent clients, interactions count, etc.)
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get total client count
    const clientCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM clients WHERE deleted_at IS NULL'
    );
    const clientCount = parseInt(clientCountResult.rows[0].count);

    // TODO: Add more statistics for final submission
    // - Recent clients (last 7 days)
    // - Total interactions count
    // - Active clients vs inactive
    // - Client growth over time

    res.json({
      success: true,
      stats: {
        totalClients: clientCount,
        // Placeholder for future stats
        totalInteractions: 0,
        recentClients: []
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

module.exports = {
  getDashboardStats
};

