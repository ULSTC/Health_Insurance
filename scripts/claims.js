document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const submitClaimBtn = document.getElementById('submit-claim-btn');
    const trackClaimBtn = document.getElementById('track-claim-btn');
    const claimSearchBtn = document.getElementById('claim-search-btn');
    const claimFormContainer = document.getElementById('claim-form-container');
    const cancelClaimBtn = document.getElementById('cancel-claim');
    const claimSearchInput = document.getElementById('claim-search-input');
    const claimSearchResults = document.getElementById('claim-search-results');
    const newClaimForm = document.getElementById('new-claim-form');
    const claimsCard = document.getElementById('claims-card');
    
    // Claim step elements
    const claimTypeSelection = document.getElementById('claim-type-selection');
    const claimTermsAcceptance = document.getElementById('claim-terms-acceptance');
    const claimFormStep = document.getElementById('claim-form-step');
    
    // Buttons for navigation between steps
    const selectClaimTypeBtns = document.querySelectorAll('.select-claim-type');
    const backToClaimTypeBtn = document.getElementById('back-to-claim-type');
    const acceptTermsBtn = document.getElementById('accept-terms');
    const backToTermsBtn = document.getElementById('back-to-terms');
    const termsCheckbox = document.getElementById('terms-checkbox');
    const claimSubmissionType = document.getElementById('claim-submission-type');
    const claimTypeDescription = document.getElementById('claim-type-description');
    
    // Simulate claims data for demo purposes
    const sampleClaims = [
        { 
            id: 'CLM123456',
            policyNumber: 'POL987654',
            type: 'hospitalization',
            date: '2023-06-15',
            amount: 45000,
            status: 'approved',
            description: 'Emergency appendectomy surgery'
        },
        { 
            id: 'CLM123457',
            policyNumber: 'POL987654',
            type: 'medication',
            date: '2023-08-22',
            amount: 12500,
            status: 'pending',
            description: 'Monthly prescription medication'
        },
        { 
            id: 'CLM123458',
            policyNumber: 'POL987654',
            type: 'consultation',
            date: '2023-10-05',
            amount: 2500,
            status: 'processing',
            description: 'Specialist consultation'
        },
        { 
            id: 'CLM123459',
            policyNumber: 'POL987654',
            type: 'procedure',
            date: '2023-11-18',
            amount: 18000,
            status: 'rejected',
            description: 'Dental procedure - not covered under policy'
        }
    ];
    
    // Link claims card from main dashboard if it exists
    if (claimsCard) {
        claimsCard.addEventListener('click', () => {
            // Hide cards section and show dashboard with claims section active
            document.getElementById('cards-section').classList.add('hidden');
            document.getElementById('dashboard-section').classList.remove('hidden');
            
            // Activate claims tab
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('.nav-links a[data-section="claims"]').classList.add('active');
            
            // Show claims section
            document.querySelectorAll('.dashboard-section').forEach(section => section.classList.remove('active'));
            document.getElementById('claims').classList.add('active');
        });
    }
    
    // Function to switch between claim steps
    function showClaimStep(stepToShow) {
        // Hide all steps
        claimTypeSelection.classList.remove('active');
        claimTermsAcceptance.classList.remove('active');
        claimFormStep.classList.remove('active');
        
        claimTypeSelection.classList.add('hidden');
        claimTermsAcceptance.classList.add('hidden');
        claimFormStep.classList.add('hidden');
        
        // Show the specified step
        stepToShow.classList.remove('hidden');
        stepToShow.classList.add('active');
    }
    
    // Event Listeners
    if (submitClaimBtn) {
        submitClaimBtn.addEventListener('click', () => {
            // Reset the claim form steps to the beginning
            showClaimStep(claimTypeSelection);
            
            // Show the claim form container
            claimFormContainer.classList.remove('hidden');
            document.getElementById('claim-search').classList.add('hidden');
        });
    }
    
    // Claim type selection buttons
    selectClaimTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const claimType = btn.dataset.claimType;
            claimSubmissionType.value = claimType;
            
            // Update description text based on claim type
            if (claimType === 'cashless') {
                claimTypeDescription.textContent = 'Please provide details for your cashless claim. This process requires pre-authorization from a network hospital.';
            } else {
                claimTypeDescription.textContent = 'Please provide details for your reimbursement claim. Ensure you have all supporting documents ready to upload.';
            }
            
            // Move to terms and conditions step
            showClaimStep(claimTermsAcceptance);
        });
    });
    
    // Back button from terms to claim type selection
    if (backToClaimTypeBtn) {
        backToClaimTypeBtn.addEventListener('click', () => {
            showClaimStep(claimTypeSelection);
            termsCheckbox.checked = false;
        });
    }
    
    // Accept terms button
    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', () => {
            if (termsCheckbox.checked) {
                showClaimStep(claimFormStep);
            } else {
                alert('You must accept the terms and conditions to proceed.');
            }
        });
    }
    
    // Back button from form to terms
    if (backToTermsBtn) {
        backToTermsBtn.addEventListener('click', () => {
            showClaimStep(claimTermsAcceptance);
        });
    }
    
    if (trackClaimBtn) {
        trackClaimBtn.addEventListener('click', () => {
            // Show search and hide form
            claimFormContainer.classList.add('hidden');
            document.getElementById('claim-search').classList.remove('hidden');
            
            // Show all claims by default when clicking "Track Claims"
            displayClaimResults(sampleClaims);
        });
    }
    
    if (claimSearchBtn) {
        claimSearchBtn.addEventListener('click', () => {
            const searchTerm = claimSearchInput.value.trim().toLowerCase();
            
            if (searchTerm === '') {
                // Show all claims if search is empty
                displayClaimResults(sampleClaims);
            } else {
                // Filter claims by ID or policy number
                const filteredClaims = sampleClaims.filter(claim => 
                    claim.id.toLowerCase().includes(searchTerm) || 
                    claim.policyNumber.toLowerCase().includes(searchTerm)
                );
                
                if (filteredClaims.length > 0) {
                    displayClaimResults(filteredClaims);
                } else {
                    claimSearchResults.innerHTML = '<div class="no-results">No claims found matching your search.</div>';
                }
            }
        });
    }
    
    if (cancelClaimBtn) {
        cancelClaimBtn.addEventListener('click', () => {
            // Hide form and reset
            claimFormContainer.classList.add('hidden');
            document.getElementById('claim-search').classList.remove('hidden');
            newClaimForm.reset();
        });
    }
    
    if (newClaimForm) {
        newClaimForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                submissionType: document.getElementById('claim-submission-type').value,
                policyNumber: document.getElementById('policy-number').value,
                type: document.getElementById('claim-type').value,
                date: document.getElementById('incident-date').value,
                amount: document.getElementById('claim-amount').value,
                description: document.getElementById('claim-description').value
            };
            
            // Simulate form submission (would normally be an API call)
            console.log('Claim submitted:', formData);
            
            // Create container for both success message and application details
            const responseContainer = document.createElement('div');
            responseContainer.className = 'claim-response-container';
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Your ${formData.submissionType} claim has been submitted successfully. Your claim number is <strong>CLM${Math.floor(100000 + Math.random() * 900000)}</strong>.</p>
            `;
            
            responseContainer.appendChild(successMessage);
            
            // Create container for policy application details
            const applicationDetails = document.createElement('div');
            applicationDetails.className = 'application-details-container';
            applicationDetails.innerHTML = `
                <h3>Policy Details</h3>
                <div class="application-details-loading">
                    <i class="fas fa-spinner fa-spin"></i> Loading policy details...
                </div>
            `;
            
            responseContainer.appendChild(applicationDetails);
            
            // Add a button to go back
            const backButton = document.createElement('button');
            backButton.className = 'btn-primary';
            backButton.textContent = 'Back to Claims';
            backButton.addEventListener('click', () => {
                // Reload the page to reset everything
                window.location.reload();
            });
            
            // Replace form with response container
            claimFormContainer.innerHTML = '';
            claimFormContainer.appendChild(responseContainer);
            claimFormContainer.appendChild(backButton);
            
            // Simulate fetching application details from backend
            setTimeout(() => {
                // In a real application, this would be an API call to fetch the application details
                // using the policy number as a parameter
                fetchApplicationDetailsByPolicyNumber(formData.policyNumber)
                    .then(applicationData => {
                        // Remove loading spinner
                        applicationDetails.querySelector('.application-details-loading').remove();
                        
                        // Display application details
                        const detailsContent = document.createElement('div');
                        detailsContent.className = 'application-details-content';
                        detailsContent.innerHTML = generateApplicationDetailsHTML(applicationData);
                        applicationDetails.appendChild(detailsContent);
                    })
                    .catch(error => {
                        applicationDetails.querySelector('.application-details-loading').remove();
                        applicationDetails.innerHTML += `
                            <div class="error-message">
                                <i class="fas fa-exclamation-circle"></i>
                                <p>Unable to load policy details: ${error.message}</p>
                            </div>
                        `;
                    });
            }, 1500); // Simulate network delay
        });
    }
    
    // Simulate fetching application details from the backend
    async function fetchApplicationDetailsByPolicyNumber(policyNumber) {
        // In a real application, this would be an API call
        // For demo purposes, we'll return mock data based on the policy number
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demo
        if (policyNumber === "POL987654" || policyNumber === "POL123456") {
            return {
                policyNumber: policyNumber,
                policyStatus: "Active",
                policyType: "Health Insurance",
                policyCoverType: "Family Floater",
                policyPlan: "Gold",
                sumInsured: 500000,
                policyTenure: 1,
                startDate: "2023-01-15",
                endDate: "2024-01-14",
                premiumAmount: 12500,
                policyHolder: {
                    name: "John Doe",
                    age: 35,
                    gender: "Male",
                    email: "john.doe@example.com",
                    phone: "9876543210"
                },
                members: [
                    {
                        name: "Jane Doe",
                        relationship: "Spouse",
                        age: 32,
                        gender: "Female"
                    },
                    {
                        name: "Jimmy Doe",
                        relationship: "Child",
                        age: 10,
                        gender: "Male"
                    }
                ]
            };
        } else if (policyNumber.startsWith("POL")) {
            return {
                policyNumber: policyNumber,
                policyStatus: "Active",
                policyType: "Health Insurance",
                policyCoverType: "Individual",
                policyPlan: "Silver",
                sumInsured: 300000,
                policyTenure: 1,
                startDate: "2023-03-10",
                endDate: "2024-03-09",
                premiumAmount: 8500,
                policyHolder: {
                    name: "Sample User",
                    age: 28,
                    gender: "Female",
                    email: "user@example.com",
                    phone: "8765432109"
                },
                members: []
            };
        } else {
            throw new Error("Policy not found. Please check the policy number and try again.");
        }
    }
    
    // Helper function to generate HTML for application details
    function generateApplicationDetailsHTML(applicationData) {
        const startDate = new Date(applicationData.startDate).toLocaleDateString('en-IN');
        const endDate = new Date(applicationData.endDate).toLocaleDateString('en-IN');
        
        let membersHTML = '';
        if (applicationData.members && applicationData.members.length > 0) {
            membersHTML = `
                <div class="detail-section">
                    <h4>Insured Members</h4>
                    <table class="members-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Relationship</th>
                                <th>Age</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${applicationData.policyHolder.name}</td>
                                <td>Self</td>
                                <td>${applicationData.policyHolder.age}</td>
                                <td>${applicationData.policyHolder.gender}</td>
                            </tr>
                            ${applicationData.members.map(member => `
                                <tr>
                                    <td>${member.name}</td>
                                    <td>${member.relationship}</td>
                                    <td>${member.age}</td>
                                    <td>${member.gender}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        return `
            <div class="application-details">
                <div class="detail-section">
                    <h4>Policy Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Policy Number:</span>
                        <span class="detail-value">${applicationData.policyNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value"><span class="policy-status">${applicationData.policyStatus}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Policy Type:</span>
                        <span class="detail-value">${applicationData.policyType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Cover Type:</span>
                        <span class="detail-value">${applicationData.policyCoverType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Plan:</span>
                        <span class="detail-value">${applicationData.policyPlan}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Sum Insured:</span>
                        <span class="detail-value">₹${applicationData.sumInsured.toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tenure:</span>
                        <span class="detail-value">${applicationData.policyTenure} year(s)</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Start Date:</span>
                        <span class="detail-value">${startDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">End Date:</span>
                        <span class="detail-value">${endDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Premium:</span>
                        <span class="detail-value">₹${applicationData.premiumAmount.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Policyholder Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${applicationData.policyHolder.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Age:</span>
                        <span class="detail-value">${applicationData.policyHolder.age}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Gender:</span>
                        <span class="detail-value">${applicationData.policyHolder.gender}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${applicationData.policyHolder.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${applicationData.policyHolder.phone}</span>
                    </div>
                </div>
                
                ${membersHTML}
            </div>
        `;
    }
    
    // Helper function to display claim results
    function displayClaimResults(claims) {
        claimSearchResults.innerHTML = '';
        
        if (claims.length === 0) {
            claimSearchResults.innerHTML = '<div class="no-results">No claims found.</div>';
            return;
        }
        
        // Create table
        const table = document.createElement('table');
        table.className = 'claims-table';
        
        // Table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Claim ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Table body
        const tbody = document.createElement('tbody');
        claims.forEach(claim => {
            const tr = document.createElement('tr');
            
            // Format claim type to be more readable
            const formattedType = claim.type.charAt(0).toUpperCase() + claim.type.slice(1);
            
            // Format date
            const formattedDate = new Date(claim.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            tr.innerHTML = `
                <td>${claim.id}</td>
                <td>${formattedDate}</td>
                <td>${formattedType}</td>
                <td>₹${claim.amount.toLocaleString()}</td>
                <td><span class="claim-status status-${claim.status}">${claim.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn-view-claim" data-id="${claim.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        claimSearchResults.appendChild(table);
        
        // Add event listeners to view buttons
        document.querySelectorAll('.btn-view-claim').forEach(btn => {
            btn.addEventListener('click', () => {
                const claimId = btn.dataset.id;
                const claim = claims.find(c => c.id === claimId);
                
                if (claim) {
                    displayClaimDetails(claim);
                }
            });
        });
    }
    
    // Helper function to display claim details
    function displayClaimDetails(claim) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        // Format claim type to be more readable
        const formattedType = claim.type.charAt(0).toUpperCase() + claim.type.slice(1);
        
        // Format date
        const formattedDate = new Date(claim.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Claim Details: ${claim.id}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="claim-detail-row">
                        <span class="claim-detail-label">Policy Number:</span>
                        <span class="claim-detail-value">${claim.policyNumber}</span>
                    </div>
                    <div class="claim-detail-row">
                        <span class="claim-detail-label">Claim Type:</span>
                        <span class="claim-detail-value">${formattedType}</span>
                    </div>
                    <div class="claim-detail-row">
                        <span class="claim-detail-label">Incident Date:</span>
                        <span class="claim-detail-value">${formattedDate}</span>
                    </div>
                    <div class="claim-detail-row">
                        <span class="claim-detail-label">Claim Amount:</span>
                        <span class="claim-detail-value">₹${claim.amount.toLocaleString()}</span>
                    </div>
                    <div class="claim-detail-row">
                        <span class="claim-detail-label">Status:</span>
                        <span class="claim-detail-value">
                            <span class="claim-status status-${claim.status}">${claim.status.toUpperCase()}</span>
                        </span>
                    </div>
                    <div class="claim-detail-row">
                        <span class="claim-detail-label">Description:</span>
                        <span class="claim-detail-value">${claim.description}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-close">Close</button>
                    ${claim.status === 'rejected' ? '<button class="btn-primary">Appeal Decision</button>' : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking the close button or outside the modal
        const closeButtons = modal.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
        
        // Close when clicking outside the modal content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}); 