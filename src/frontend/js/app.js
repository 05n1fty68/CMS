/**
 * Main Application Controller
 * Handles page navigation and initialization
 */

class App {
  /**
   * Initialize the application
   */
  static init() {
    // Check authentication status
    if (Auth.isAuthenticated()) {
      // Verify token is still valid
      Auth.verifyToken()
        .then(() => {
          this.showPage('dashboard');
          this.setupAuthenticatedApp();
        })
        .catch(() => {
          this.showPage('login');
          this.setupUnauthenticatedApp();
        });
    } else {
      this.showPage('login');
      this.setupUnauthenticatedApp();
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup app for authenticated users
   */
  static setupAuthenticatedApp() {
    const user = Auth.getCurrentUser();
    if (user) {
      // Update user email in navbars
      const navUserElements = document.querySelectorAll('.nav-user');
      navUserElements.forEach(el => {
        el.textContent = user.email;
      });
    }

    // Load dashboard stats if on dashboard page
    if (document.getElementById('dashboard-page').classList.contains('active')) {
      Dashboard.loadStats();
    }

    // Load clients if on clients page
    if (document.getElementById('clients-page').classList.contains('active')) {
      Clients.loadClients();
    }
  }

  /**
   * Setup app for unauthenticated users
   */
  static setupUnauthenticatedApp() {
    // Nothing special needed for now
  }

  /**
   * Show a specific page
   * @param {string} pageName - Name of the page to show
   */
  static showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Show requested page
    const page = document.getElementById(`${pageName}-page`);
    if (page) {
      page.classList.add('active');

      // Load page-specific data
      if (pageName === 'dashboard') {
        Dashboard.loadStats();
      } else if (pageName === 'clients') {
        Clients.loadClients();
      }
    }
  }

  /**
   * Setup all event listeners
   */
  static setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', this.handleRegister.bind(this));
    }

    // Show register page
    const showRegister = document.getElementById('show-register');
    if (showRegister) {
      showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        this.showPage('register');
      });
    }

    // Show login page
    const showLogin = document.getElementById('show-login');
    if (showLogin) {
      showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        this.showPage('login');
      });
    }

    // Logout buttons
    document.querySelectorAll('#logout-btn, #logout-btn-2').forEach(btn => {
      btn.addEventListener('click', () => {
        Auth.logout();
      });
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page) {
          this.showPage(page);
          
          // Update active nav link
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Add client button
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) {
      addClientBtn.addEventListener('click', () => {
        Clients.showClientForm();
      });
    }

    // Client form
    const clientForm = document.getElementById('client-form');
    if (clientForm) {
      clientForm.addEventListener('submit', Clients.saveClient.bind(Clients));
    }

    // Close modal buttons
    document.querySelectorAll('.close, #cancel-client-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Clients.hideClientForm();
      });
    });

    // Click outside modal to close
    const modal = document.getElementById('client-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          Clients.hideClientForm();
        }
      });
    }

    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('client-search');
    
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        Clients.loadClients(searchTerm);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const searchTerm = searchInput.value.trim();
          Clients.loadClients(searchTerm);
        }
      });
    }
  }

  /**
   * Handle login form submission
   * @param {Event} event - Form submit event
   */
  static async handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    errorDiv.textContent = '';
    errorDiv.classList.remove('show');

    try {
      await Auth.login(email, password);
      this.showPage('dashboard');
      this.setupAuthenticatedApp();
    } catch (error) {
      errorDiv.textContent = error.message || 'Login failed. Please try again.';
      errorDiv.classList.add('show');
    }
  }

  /**
   * Handle register form submission
   * @param {Event} event - Form submit event
   */
  static async handleRegister(event) {
    event.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');

    errorDiv.textContent = '';
    errorDiv.classList.remove('show');

    try {
      await Auth.register(email, password);
      this.showPage('dashboard');
      this.setupAuthenticatedApp();
    } catch (error) {
      errorDiv.textContent = error.message || 'Registration failed. Please try again.';
      errorDiv.classList.add('show');
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

