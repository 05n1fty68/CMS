/**
 * Clients Module
 * Handles client CRUD operations
 */

// Load all clients
async function loadClients() {
    try {
        const response = await api.get('/clients');
        displayClients(response.clients);
        updateClientCount(response.count);
    } catch (error) {
        console.error('Error loading clients:', error);
        document.getElementById('clients-list').innerHTML = 
            '<div class="error-message active">Failed to load clients. Please try again.</div>';
    }
}

// Display clients in the list
function displayClients(clients) {
    const clientsList = document.getElementById('clients-list');
    
    if (clients.length === 0) {
        clientsList.innerHTML = '<div class="info-message">No clients found. Click "Add Client" to create one.</div>';
        return;
    }

    clientsList.innerHTML = clients.map(client => `
        <div class="client-card">
            <div class="client-info">
                <h3>${escapeHtml(client.name)}</h3>
                ${client.email ? `<p>Email: ${escapeHtml(client.email)}</p>` : ''}
                ${client.phone ? `<p>Phone: ${escapeHtml(client.phone)}</p>` : ''}
                ${client.notes ? `<p>${escapeHtml(client.notes)}</p>` : ''}
            </div>
            <div class="client-actions">
                <button class="btn btn-primary btn-small" onclick="editClient(${client.id})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteClient(${client.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Open modal to add new client
function openAddClientModal() {
    document.getElementById('modal-title').textContent = 'Add Client';
    document.getElementById('client-form').reset();
    document.getElementById('client-id').value = '';
    document.getElementById('client-modal').classList.add('active');
}

// Edit client
async function editClient(clientId) {
    try {
        const response = await api.get(`/clients/${clientId}`);
        const client = response.client;
        
        document.getElementById('modal-title').textContent = 'Edit Client';
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-name').value = client.name || '';
        document.getElementById('client-email').value = client.email || '';
        document.getElementById('client-phone').value = client.phone || '';
        document.getElementById('client-notes').value = client.notes || '';
        
        document.getElementById('client-modal').classList.add('active');
    } catch (error) {
        console.error('Error loading client:', error);
        alert('Failed to load client details');
    }
}

// Save client (create or update)
async function saveClient(clientData) {
    const clientId = document.getElementById('client-id').value;
    
    try {
        if (clientId) {
            // Update existing client
            await api.put(`/clients/${clientId}`, clientData);
        } else {
            // Create new client
            await api.post('/clients', clientData);
        }
        
        // Close modal and reload clients
        document.getElementById('client-modal').classList.remove('active');
        await loadClients();
    } catch (error) {
        console.error('Error saving client:', error);
        alert('Failed to save client: ' + error.message);
    }
}

// Delete client
async function deleteClient(clientId) {
    if (!confirm('Are you sure you want to delete this client?')) {
        return;
    }

    try {
        await api.delete(`/clients/${clientId}`);
        await loadClients();
    } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client: ' + error.message);
    }
}

// Update client count in dashboard
function updateClientCount(count) {
    const totalClientsEl = document.getElementById('total-clients');
    if (totalClientsEl) {
        totalClientsEl.textContent = count;
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

