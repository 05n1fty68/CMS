// Dashboard functionality

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) {
        return;
    }

    await loadDashboardStats();
});

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await apiRequest('/dashboard/stats');
        if (!response) return;

        const data = await response.json();

        if (data.success) {
            // Update total clients
            const totalClientsEl = document.getElementById('totalClients');
            if (totalClientsEl) {
                totalClientsEl.textContent = data.stats.totalClients || 0;
            }

            // Update total interactions (placeholder)
            const totalInteractionsEl = document.getElementById('totalInteractions');
            if (totalInteractionsEl) {
                totalInteractionsEl.textContent = data.stats.totalInteractions || 'Coming Soon';
            }
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

