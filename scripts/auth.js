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
        const userType = document.getElementById('login-user-type').value || "normal";

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    userType
                })
            });
            
            const data = await response.json();
            console.log("Login response:", data);
            
            if (response.ok) {
                // Store token in sessionStorage
                sessionStorage.setItem('token', data.token);
                
                // Store user data too
                sessionStorage.setItem('user', JSON.stringify(data.user));
                
                // Show dashboard
                authSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                
                // Update user name in dashboard
                document.querySelector('.user-name').textContent = data.user.fullName || data.user.name;
            } else {
                showError(data.message || 'Invalid credentials');
            }
        } catch (error) {
            showError('An error occurred during login');
            console.error('Login error:', error);
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const userType = document.getElementById('signup-user-type').value || "normal";
        
        // Check if all address fields exist before accessing
        let phone = '';
        let pincode = '';
        let state = '';
        let city = '';
        let addressLine = '';
        
        
        // Check if fields exist before accessing them
        if (document.getElementById('signup-phone')) {
            phone = document.getElementById('signup-phone').value;
        }
        if (document.getElementById('signup-pincode')) {
            pincode = document.getElementById('signup-pincode').value;
        }
        if (document.getElementById('signup-state')) {
            state = document.getElementById('signup-state').value;
        }
        if (document.getElementById('signup-city')) {
            city = document.getElementById('signup-city').value;
        }
        if (document.getElementById('signup-address-line')) {
            addressLine = document.getElementById('signup-address-line').value;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        const reqbody = {
            fullName,
            email,
            password,
            userType,
            phone
        };
        
        console.log("Sending signup request:", reqbody);
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqbody)
            });
            
            const data = await response.json();
            console.log("Signup response:", data);
            
            if (response.ok) {
                // Store token in sessionStorage
                sessionStorage.setItem('token', data.token);
                
                // Store user data too
                sessionStorage.setItem('user', JSON.stringify(data.user));
                
                // Show dashboard
                authSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                
                // Update user name in dashboard
                document.querySelector('.user-name').textContent = data.user.fullName || data.user.name;
            } else {
                showError(data.message || 'Signup failed');
            }
        } catch (error) {
            showError('An error occurred during signup');
            console.error('Signup error:', error);
        }
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        
        // Show auth section
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        
        // Reset forms
        loginForm.reset();
        signupForm.reset();
    });

    // Check if user is already logged in - use sessionStorage consistently
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    
    if (user && token) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        try {
            const userData = JSON.parse(user);
            document.querySelector('.user-name').textContent = userData.fullName || userData.name;
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
    }
});

// Utility function to show error messages
function showError(message) {
    // Create or select error message container
    let errorContainer = document.querySelector('.error-message');
    
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        
        // Try to find a parent container (more robust approach)
        const authContainer = document.querySelector('.auth-container');
        if (authContainer) {
            authContainer.appendChild(errorContainer);
        } else {
            // Fallback - append to the active form
            const activeForm = document.querySelector('.auth-form.active');
            if (activeForm) {
                activeForm.appendChild(errorContainer);
            } else {
                // Last resort - append to auth section
                document.getElementById('auth-section').appendChild(errorContainer);
            }
        }
    }
    
    // Set the error message
    errorContainer.textContent = message;
    errorContainer.style.color = 'red';
    errorContainer.style.marginTop = '10px';
    errorContainer.style.padding = '8px';
    errorContainer.style.textAlign = 'center';
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorContainer.textContent = '';
    }, 5000);
}