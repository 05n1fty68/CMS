// Login functionality

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Save token and user info
                    saveToken(data.token);
                    saveUser(data.user);
                    
                    // Redirect to dashboard
                    window.location.href = '/dashboard.html';
                } else {
                    // Show error message
                    errorMessage.textContent = data.message || 'Login failed';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
            }
        });
    }

    // Handle register link (placeholder - can be implemented later)
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Registration feature can be enabled through API endpoint /api/auth/register');
        });
    }
});

