/**
 * Authentication Module
 * Handles user login, registration, and session management
 */

class Auth {
  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  /**
   * Get current user info from localStorage
   * @returns {Object|null}
   */
  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Save authentication data
   * @param {string} token - JWT token
   * @param {Object} user - User object
   */
  static saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear authentication data
   */
  static clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>}
   */
  static async login(email, password) {
    try {
      const response = await API.login(email, password);
      this.saveAuth(response.token, response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>}
   */
  static async register(email, password) {
    try {
      const response = await API.register(email, password);
      this.saveAuth(response.token, response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout() {
    const confirmed = await Utils.confirm(
      'Are you sure you want to logout?',
      'Logout',
      'Logout'
    );

    if (confirmed) {
      this.clearAuth();
      Utils.showInfo('You have been logged out successfully.');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  /**
   * Verify token and get current user
   * @returns {Promise<Object>}
   */
  static async verifyToken() {
    try {
      const response = await API.getCurrentUser();
      return response.user;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }
}

