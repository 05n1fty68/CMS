// Clients list functionality

let allClients = [];
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) {
        return;
    }

    currentUser = getCurrentUser();
    await loadClients();

    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
});

// Load all clients
async function loadClients(searchTerm = '') {
    try {
        const url = searchTerm ? `/clients?search=${encodeURIComponent(searchTerm)}` : '/clients';
        const response = await apiRequest(url);
        
        if (!response) return;

        const data = await response.json();

        if (data.success) {
            allClients = data.clients || [];
            renderClients(allClients);
        } else {
            showError('Failed to load clients');
        }
    } catch (error) {
        console.error('Error loading clients:', error);
        showError('An error occurred while loading clients');
    }
}

// Render clients list
function renderClients(clients) {
    const clientsListEl = document.getElementById('clientsList');

    if (!clientsListEl) return;

    if (clients.length === 0) {
        clientsListEl.innerHTML = `
            <div class="empty-state">
                <h3>No clients found</h3>
                <p>Get started by adding your first client.</p>
                <a href="clients/add" class="btn btn-primary" style="margin-top: 15px;">Add New Client</a>
            </div>
        `;
        return;
    }

    clientsListEl.innerHTML = clients.map(client => `
        <div class="client-item">
            <div class="client-info">
                <h3>${escapeHtml(client.name)}</h3>
                <p>Email: ${escapeHtml(client.email)}</p>
                ${client.phone ? `<p>Phone: ${escapeHtml(client.phone)}</p>` : ''}
                ${client.notes ? `<p>Notes: ${escapeHtml(client.notes.substring(0, 50))}${client.notes.length > 50 ? '...' : ''}</p>` : ''}
            </div>
            <div class="client-actions">
                <a href="clients/edit/${client.id}" class="btn btn-secondary">Edit</a>
                ${currentUser && currentUser.role === 'admin' ? `
                    <button onclick="deleteClient(${client.id})" class="btn btn-danger">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    loadClients(searchTerm);
}

// Delete client
async function deleteClient(clientId) {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await apiRequest(`/clients/${clientId}`, {
            method: 'DELETE'
        });

        if (!response) return;

        const data = await response.json();

        if (data.success) {
            // Reload clients list
            await loadClients();
        } else {
            alert(data.message || 'Failed to delete client');
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        alert('An error occurred while deleting the client');
    }
}

// Show error message
function showError(message) {
    const clientsListEl = document.getElementById('clientsList');
    if (clientsListEl) {
        clientsListEl.innerHTML = `
            <div class="empty-state">
                <h3>Error</h3>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make deleteClient available globally
window.deleteClient = deleteClient;

