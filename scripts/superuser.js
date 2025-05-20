document.addEventListener('DOMContentLoaded', () => {
    // Check if user is superuser
    const checkSuperUserAccess = () => {
        try {
            const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
            const token = sessionStorage.getItem('token');
            
            if (!token || !userData || userData.userType !== 'superuser') {
                // Redirect to login page if not superuser
                window.location.href = 'index.html';
            } else {
                // Update admin name if available
                const adminNameElement = document.querySelector('.user-name');
                if (adminNameElement && userData.fullName) {
                    adminNameElement.textContent = userData.fullName;
                }
            }
        } catch (error) {
            console.error("Error checking superuser access:", error);
            window.location.href = 'index.html';
        }
    };
    
    // Check access on page load
    checkSuperUserAccess();
    
    // Admin Tabs functionality
    const adminTabs = document.querySelectorAll('.admin-tab');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            adminTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding section
            const sections = document.querySelectorAll('.admin-section');
            sections.forEach(section => section.classList.remove('active'));
            
            const targetSection = document.getElementById(tab.dataset.tab);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Handle different sections if needed
            const section = link.dataset.section;
            // For now we just focus on the dashboard
        });
    });
    
    // Claim Review Modal functionality
    window.openClaimReview = (claimId) => {
        const modal = document.getElementById('claim-review-modal');
        const modalClaimId = document.getElementById('modal-claim-id');
        
        if (modal && modalClaimId) {
            modalClaimId.textContent = claimId;
            modal.style.display = 'block';
            
            // You would typically fetch claim details by ID here
            // and populate the modal with that data
        }
    };
    
    window.closeClaimReview = () => {
        const modal = document.getElementById('claim-review-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    // Document viewing functionality
    window.viewDocument = (docId) => {
        // Placeholder for document viewing functionality
        console.log(`Viewing document: ${docId}`);
        alert(`Viewing document: ${docId}`);
    };
    
    window.verifyDocument = (docId) => {
        // Placeholder for document verification functionality
        console.log(`Verifying document: ${docId}`);
        alert(`Document ${docId} has been verified`);
    };
    
    // Close modal when clicking outside
    window.onclick = (event) => {
        const modal = document.getElementById('claim-review-modal');
        if (event.target === modal) {
            closeClaimReview();
        }
    };
    
    // Logout functionality - FIXED
    const logoutBtn = document.getElementById('logout-btn');
    
    // Debug: Log if logout button is found
    console.log('Logout button found:', !!logoutBtn);
    
    if (logoutBtn) {
        // Add direct click handler
        logoutBtn.onclick = function() {
            console.log('Logout button clicked');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            window.location.href = 'index.html';
        };
        
        // Also add event listener as backup
        logoutBtn.addEventListener('click', function() {
            console.log('Logout event listener triggered');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    } else {
        // If button not found in initial load, try again after a short delay
        setTimeout(() => {
            const delayedLogoutBtn = document.getElementById('logout-btn');
            if (delayedLogoutBtn) {
                console.log('Logout button found after delay');
                delayedLogoutBtn.onclick = function() {
                    console.log('Delayed logout button clicked');
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('token');
                    window.location.href = 'index.html';
                };
            } else {
                console.error('Logout button not found even after delay');
            }
        }, 500);
    }
});