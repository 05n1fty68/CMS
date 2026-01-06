// Authentication utilities and token management

const API_BASE_URL = '/api';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Save token to localStorage
function saveToken(token) {
    localStorage.setItem('token', token);
}

// Remove token from localStorage
function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Save user to localStorage
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Check if user is authenticated
function isAuthenticated() {
    return getToken() !== null;
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/';
        return false;
    }
    return true;
}

// Set up logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            removeToken();
            window.location.href = '/';
        });
    }
}

// Display user info in navbar
function displayUserInfo() {
    const userInfoEl = document.getElementById('userInfo');
    if (userInfoEl) {
        const user = getCurrentUser();
        if (user) {
            userInfoEl.textContent = `${user.name} (${user.role})`;
        }
    }
}

// Make authenticated API request
async function apiRequest(url, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });

    // If unauthorized, redirect to login
    if (response.status === 401 || response.status === 403) {
        removeToken();
        window.location.href = '/';
        return null;
    }

    return response;
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication on protected pages
    const currentPath = window.location.pathname;
    const protectedPaths = ['/dashboard.html', '/clients.html', '/client-form.html'];
    
    if (protectedPaths.some(path => currentPath.includes(path))) {
        if (!requireAuth()) {
            return;
        }
        setupLogout();
        displayUserInfo();
    }
});

