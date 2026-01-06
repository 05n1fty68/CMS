/**
 * Clients Module
 * Handles client list, create, update, and delete operations
 */

class Clients {
  /**
   * Load and display clients list
   */
  static async loadClients(searchTerm = '') {
    const clientsList = document.getElementById('clients-list');
    clientsList.innerHTML = '<p class="loading">Loading clients...</p>';

    try {
      const response = await API.getClients(searchTerm);
      this.renderClients(response.clients);
    } catch (error) {
      clientsList.innerHTML = `<p class="error-message show">Error loading clients: ${error.message}</p>`;
    }
  }

  /**
   * Render clients list
   * @param {Array} clients - Array of client objects
   */
  static renderClients(clients) {
    const clientsList = document.getElementById('clients-list');

    if (clients.length === 0) {
      clientsList.innerHTML = '<div class="empty-state">No clients found. Add your first client!</div>';
      return;
    }

    clientsList.innerHTML = clients.map(client => `
      <div class="client-item">
        <div class="client-info">
          <h3>${this.escapeHtml(client.name)}</h3>
          ${client.email ? `<p>📧 ${this.escapeHtml(client.email)}</p>` : ''}
          ${client.phone ? `<p>📞 ${this.escapeHtml(client.phone)}</p>` : ''}
          ${client.notes ? `<p>${this.escapeHtml(client.notes.substring(0, 100))}${client.notes.length > 100 ? '...' : ''}</p>` : ''}
        </div>
        <div class="client-actions">
          <button class="btn btn-secondary" onclick="Clients.editClient(${client.id})">Edit</button>
          <button class="btn btn-danger" onclick="Clients.deleteClient(${client.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Show client form modal
   * @param {number|null} clientId - Client ID for edit, null for new client
   */
  static async showClientForm(clientId = null) {
    const modal = document.getElementById('client-modal');
    const form = document.getElementById('client-form');
    const title = document.getElementById('modal-title');
    const clientIdInput = document.getElementById('client-id');

    // Reset form
    form.reset();
    clientIdInput.value = '';

    if (clientId) {
      // Edit mode
      title.textContent = 'Edit Client';
      clientIdInput.value = clientId;

      try {
        const response = await API.getClient(clientId);
        const client = response.client;

        document.getElementById('client-name').value = client.name || '';
        document.getElementById('client-email').value = client.email || '';
        document.getElementById('client-phone').value = client.phone || '';
        document.getElementById('client-notes').value = client.notes || '';
      } catch (error) {
        alert(`Error loading client: ${error.message}`);
        return;
      }
    } else {
      // Add mode
      title.textContent = 'Add Client';
    }

    modal.classList.add('active');
  }

  /**
   * Hide client form modal
   */
  static hideClientForm() {
    const modal = document.getElementById('client-modal');
    modal.classList.remove('active');
  }

  /**
   * Edit client
   * @param {number} clientId - Client ID
   */
  static async editClient(clientId) {
    await this.showClientForm(clientId);
  }

  /**
   * Delete client
   * @param {number} clientId - Client ID
   */
  static async deleteClient(clientId) {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      await API.deleteClient(clientId);
      await this.loadClients();
    } catch (error) {
      alert(`Error deleting client: ${error.message}`);
    }
  }

  /**
   * Save client (create or update)
   * @param {Event} event - Form submit event
   */
  static async saveClient(event) {
    event.preventDefault();

    const form = document.getElementById('client-form');
    const errorDiv = document.getElementById('client-form-error');
    const clientId = document.getElementById('client-id').value;

    const clientData = {
      name: document.getElementById('client-name').value.trim(),
      email: document.getElementById('client-email').value.trim(),
      phone: document.getElementById('client-phone').value.trim(),
      notes: document.getElementById('client-notes').value.trim(),
    };

    // Clear previous errors
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');

    try {
      if (clientId) {
        // Update existing client
        await API.updateClient(clientId, clientData);
      } else {
        // Create new client
        await API.createClient(clientData);
      }

      this.hideClientForm();
      await this.loadClients();
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.add('show');
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string}
   */
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

