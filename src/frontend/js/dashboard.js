/**
 * Dashboard Module
 * Handles dashboard statistics and data loading
 */

class Dashboard {
  /**
   * Load and display dashboard statistics
   */
  static async loadStats() {
    try {
      const response = await API.getDashboardStats();
      const stats = response.stats;

      // Update stat cards
      document.getElementById('stat-clients').textContent = stats.totalClients || 0;
      
      // Only show users count if user is admin
      const user = Auth.getCurrentUser();
      if (user && user.role === 'admin') {
        document.getElementById('stat-users').textContent = stats.totalUsers || 0;
      } else {
        document.getElementById('stat-users').textContent = '-';
      }

      // TODO: Load and display interactions count
      // TODO: Load and display recent activity
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set default values on error
      document.getElementById('stat-clients').textContent = '-';
      document.getElementById('stat-users').textContent = '-';
    }
  }
}

