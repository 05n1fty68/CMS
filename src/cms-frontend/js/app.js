/**
 * Main Application Controller
 * Handles page navigation and event listeners
 */

// Show a specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }
}

// Show a specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication
    initAuth();

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            
            try {
                await login(email, password);
                showPage('dashboard-page');
                const user = getCurrentUser();
                if (user) {
                    document.getElementById('user-name').textContent = user.name;
                }
                errorDiv.classList.remove('active');
                errorDiv.textContent = '';
                
                // Load initial data
                await loadClients();
            } catch (error) {
                errorDiv.textContent = error.message || 'Login failed. Please check your credentials.';
                errorDiv.classList.add('active');
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding section
            const page = btn.getAttribute('data-page');
            if (page === 'clients') {
                showSection('clients-section');
                loadClients();
            } else if (page === 'interactions') {
                showSection('interactions-section');
                // TODO: Load interactions when fully implemented
            } else if (page === 'dashboard') {
                showSection('dashboard-section');
                loadClients(); // Update stats
            }
        });
    });

    // Add client button
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) {
        addClientBtn.addEventListener('click', () => {
            openAddClientModal();
        });
    }

    // Client form handler
    const clientForm = document.getElementById('client-form');
    if (clientForm) {
        clientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const clientData = {
                name: document.getElementById('client-name').value,
                email: document.getElementById('client-email').value,
                phone: document.getElementById('client-phone').value,
                notes: document.getElementById('client-notes').value
            };
            
            await saveClient(clientData);
        });
    }

    // Close modal handlers
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-client-btn');
    const clientModal = document.getElementById('client-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            clientModal.classList.remove('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            clientModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    if (clientModal) {
        clientModal.addEventListener('click', (e) => {
            if (e.target === clientModal) {
                clientModal.classList.remove('active');
            }
        });
    }
});

