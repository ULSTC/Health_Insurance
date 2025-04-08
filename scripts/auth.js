document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login');
    const signupForm = document.getElementById('signup');
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');

    // Tab switching functionality
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            // TODO: Replace with actual API call
            const response = await mockLogin(email, password);
            
            if (response.success) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
                
                // Show dashboard
                authSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                
                // Update user name in dashboard
                document.querySelector('.user-name').textContent = response.user.name;
            } else {
                showError('Invalid credentials');
            }
        } catch (error) {
            showError('An error occurred during login');
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        try {
            // TODO: Replace with actual API call
            const response = await mockSignup(name, email, password);
            
            if (response.success) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
                
                // Show dashboard
                authSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                
                // Update user name in dashboard
                document.querySelector('.user-name').textContent = response.user.name;
            } else {
                showError(response.message || 'Signup failed');
            }
        } catch (error) {
            showError('An error occurred during signup');
        }
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Show auth section
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        
        // Reset forms
        loginForm.reset();
        signupForm.reset();
    });

    // Check if user is already logged in
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        document.querySelector('.user-name').textContent = JSON.parse(user).name;
    }
});

// Mock API functions (to be replaced with actual API calls)
async function mockLogin(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    return {
        success: true,
        user: {
            id: '1',
            name: 'John Doe',
            email: email
        },
        token: 'mock-jwt-token'
    };
}

async function mockSignup(name, email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful signup
    return {
        success: true,
        user: {
            id: '1',
            name: name,
            email: email
        },
        token: 'mock-jwt-token'
    };
}

// Utility function to show error messages
function showError(message) {
    // TODO: Implement proper error message display
    alert(message);
} 