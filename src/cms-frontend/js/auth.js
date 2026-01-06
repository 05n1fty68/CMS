/**
 * Authentication Module
 * Handles user login, logout, and session management
 */

// Login function
async function login(email, password) {
    try {
        const response = await api.post('/auth/login', { email, password });
        
        // Store token
        api.setToken(response.token);
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Logout function
function logout() {
    api.setToken(null);
    localStorage.removeItem('user');
    showPage('login-page');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!api.token && !!localStorage.getItem('user');
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Initialize auth on page load
function initAuth() {
    if (isAuthenticated()) {
        showPage('dashboard-page');
        const user = getCurrentUser();
        if (user) {
            document.getElementById('user-name').textContent = user.name;
        }
    } else {
        showPage('login-page');
    }
}

