document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const policyManagementCard = document.getElementById('policy-management-card');
    const claimsCard = document.getElementById('claims-card');
    const cardsSection = document.getElementById('cards-section');
    const dashboardSection = document.getElementById('dashboard-section');

    // Policy Management card click handler
    policyManagementCard.addEventListener('click', () => {
        // Hide cards section and show dashboard
        cardsSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        console.log('policy management card clicked');
        
        // Update user name in dashboard section
        updateUserNameInDashboard();
    });

    // Claims card click handler
    claimsCard.addEventListener('click', () => {
        // For now, show an alert that this feature is coming soon
        alert('Claims management feature coming soon!');
    });

    // Add back button to dashboard nav
    // const dashboardNav = document.querySelector('.dashboard-nav .nav-links');
    // const backButton = document.createElement('a');
    // backButton.href = '#';
    // backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Home';
    // backButton.classList.add('back-button');
    // backButton.style.marginRight = 'auto';
    
    // // Insert at the beginning of nav links
    // dashboardNav.insertBefore(backButton, dashboardNav.firstChild);

    // // Back button click handler
    // backButton.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     dashboardSection.classList.add('hidden');
    //     cardsSection.classList.remove('hidden');
    // });
});

// Function to update user name in dashboard
function updateUserNameInDashboard() {
    const user = sessionStorage.getItem('user');
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            // Update the user name in the dashboard nav
            const dashboardUserName = document.querySelector('#dashboard-section .user-name');
            if (dashboardUserName) {
                dashboardUserName.textContent = userData.fullName || userData.name;
            }
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
    }
}