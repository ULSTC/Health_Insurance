document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-links a');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const applicationTabs = document.querySelectorAll('.application-tabs .tab-btn');

    // Navigation functionality
    // navLinks.forEach(link => {
    //     link.addEventListener('click', (e) => {
    //         e.preventDefault();
            
    //         const targetSection = link.dataset.section;
            
    //         // Update active nav link
    //         navLinks.forEach(l => l.classList.remove('active'));
    //         link.classList.add('active');
            
    //         // Show corresponding section
    //         dashboardSections.forEach(section => {
    //             section.classList.remove('active');
    //             if (section.id === targetSection) {
    //                 section.classList.add('active');
    //             }
    //         });
    //     });
    // });

    // Application tabs functionality
    applicationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            applicationTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // TODO: Load corresponding tab content
            loadApplicationTabContent(targetTab);
        });
    });

    // Function to load application tab content
    async function loadApplicationTabContent(tabName) {
        // TODO: Implement actual content loading
        console.log(`Loading content for tab: ${tabName}`);
        
        // Mock content loading
        const content = await mockLoadTabContent(tabName);
        const tabContentContainer = document.querySelector('#applications .dashboard-section');
        
        // TODO: Update the content container with the loaded content
        tabContentContainer.innerHTML = `<h3>${content.title}</h3><p>${content.description}</p>`;
    }

    // Mock function to load tab content
    async function mockLoadTabContent(tabName) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const contentMap = {
            'member-details': {
                title: 'Member Details',
                description: 'Enter member information here'
            },
            'questionnaire': {
                title: 'Health Questionnaire',
                description: 'Answer health-related questions'
            },
            'basic-info': {
                title: 'Basic Information',
                description: 'Provide your basic details'
            },
            'kyc': {
                title: 'KYC Details',
                description: 'Upload your KYC documents'
            }
        };
        
        return contentMap[tabName] || {
            title: 'Unknown Tab',
            description: 'Content not available'
        };
    }

    // Initialize the first section as active
    if (dashboardSections.length > 0) {
        dashboardSections[0].classList.add('active');
    }
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
            
            // Hide endorsement section if it exists
            const endorsementSection = document.getElementById('endorsement-section');
            if (endorsementSection) {
                endorsementSection.classList.remove('active');
            }
        });
    });
    const searchButton = document.getElementById('search-btn');
    
    // Add click event listener to the search button
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            // Remove active class from all navigation links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
        });
    }
}); 
// Add to the existing dashboard section handlers
