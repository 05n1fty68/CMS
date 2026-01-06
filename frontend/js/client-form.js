// Client form functionality (add/edit)

let clientId = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) {
        return;
    }

    // Check if we're in edit mode
    const pathParts = window.location.pathname.split('/');
    const editIndex = pathParts.indexOf('edit');
    
    if (editIndex !== -1 && pathParts[editIndex + 1]) {
        clientId = pathParts[editIndex + 1];
        isEditMode = true;
        await loadClientData(clientId);
    }

    // Update form title
    const formTitle = document.getElementById('formTitle');
    if (formTitle) {
        formTitle.textContent = isEditMode ? 'Edit Client' : 'Add New Client';
    }

    // Update submit button text
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.textContent = isEditMode ? 'Update Client' : 'Save Client';
    }

    // Setup form submission
    const clientForm = document.getElementById('clientForm');
    if (clientForm) {
        clientForm.addEventListener('submit', handleFormSubmit);
    }
});

// Load client data for editing
async function loadClientData(id) {
    try {
        const response = await apiRequest(`/clients/${id}`);
        
        if (!response) return;

        const data = await response.json();

        if (data.success && data.client) {
            const client = data.client;
            
            // Populate form fields
            document.getElementById('name').value = client.name || '';
            document.getElementById('email').value = client.email || '';
            document.getElementById('phone').value = client.phone || '';
            document.getElementById('notes').value = client.notes || '';
        } else {
            showError('Failed to load client data');
        }
    } catch (error) {
        console.error('Error loading client data:', error);
        showError('An error occurred while loading client data');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const notes = document.getElementById('notes').value.trim();

    // Validate required fields
    if (!name || !email) {
        showError('Name and email are required fields');
        return;
    }

    const clientData = {
        name,
        email,
        phone: phone || null,
        notes: notes || null
    };

    try {
        const url = isEditMode ? `/clients/${clientId}` : '/clients';
        const method = isEditMode ? 'PUT' : 'POST';

        const response = await apiRequest(url, {
            method,
            body: JSON.stringify(clientData)
        });

        if (!response) return;

        const data = await response.json();

        if (data.success) {
            showSuccess(isEditMode ? 'Client updated successfully!' : 'Client created successfully!');
            
            // Redirect to clients list after a short delay
            setTimeout(() => {
                window.location.href = '/clients.html';
            }, 1500);
        } else {
            showError(data.message || 'Failed to save client');
        }
    } catch (error) {
        console.error('Error saving client:', error);
        showError('An error occurred while saving the client');
    }
}

// Show error message
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    const successEl = document.getElementById('successMessage');
    
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    
    if (successEl) {
        successEl.style.display = 'none';
    }
}

// Show success message
function showSuccess(message) {
    const errorEl = document.getElementById('errorMessage');
    const successEl = document.getElementById('successMessage');
    
    if (successEl) {
        successEl.textContent = message;
        successEl.style.display = 'block';
    }
    
    if (errorEl) {
        errorEl.style.display = 'none';
    }
}

