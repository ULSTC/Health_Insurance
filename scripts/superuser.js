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
    
    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch stats');
            
            const stats = await response.json();
            
            // Update stats in the UI
            document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = stats.pendingClaims;
            document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = stats.approvedClaims;
            document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = stats.rejectedClaims;
            document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = stats.totalUsers;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            showError('Failed to load dashboard statistics');
        }
    };

    // Fetch claims with filters
    const fetchClaims = async (section = 'pending-claims') => {
        try {
            const filters = {
                status: section === 'pending-claims' ? 'pending' : 'all',
                claimType: document.getElementById(`${section === 'pending-claims' ? '' : 'all-'}claim-type-filter`)?.value || 'all',
                startDate: document.getElementById(`${section === 'pending-claims' ? '' : 'all-'}date-from-filter`)?.value || '',
                endDate: document.getElementById(`${section === 'pending-claims' ? '' : 'all-'}date-to-filter`)?.value || '',
                search: document.getElementById(`${section === 'pending-claims' ? '' : 'all-'}search-filter`)?.value || ''
            };

            const queryString = new URLSearchParams(filters).toString();
            const response = await fetch(`http://localhost:5000/api/admin/claims?${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch claims');
            }
            
            const claims = await response.json();
            const claimsTable = document.querySelector(`#${section} table tbody`);
            
            if (!claimsTable) {
                console.error(`Claims table not found for section: ${section}`);
                return;
            }
            
            // Clear existing rows
            claimsTable.innerHTML = '';
            
            if (claims.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="7" class="text-center">No claims found</td>';
                claimsTable.appendChild(row);
                return;
            }
            
            // Add new rows
            claims.forEach(claim => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${claim.claimId || 'N/A'}</td>
                    <td>${claim.user?.fullName || 'N/A'}</td>
                    <td>${claim.claimType || 'N/A'}</td>
                    <td>${claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>${claim.amount ? `₹${claim.amount.toLocaleString()}` : 'N/A'}</td>
                    <td><span class="status-badge status-${claim.status}">${claim.status}</span></td>
                    <td>
                        <button class="action-btn view-btn view-details" data-claim-id="${claim._id}">View</button>
                        ${section === 'pending-claims' ? `
                            <button class="action-btn approve" data-claim-id="${claim._id}">Approve</button>
                            <button class="action-btn reject" data-claim-id="${claim._id}">Reject</button>
                        ` : ''}
                    </td>
                `;
                claimsTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching claims:', error);
            showError(error.message || 'Failed to load claims');
            
            // Show error in the table
            const claimsTable = document.querySelector(`#${section} table tbody`);
            if (claimsTable) {
                claimsTable.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-error">
                            Error loading claims. Please try again.
                        </td>
                    </tr>
                `;
            }
        }
    };

    // Update claim status
    const updateClaimStatus = async (claimId, status, notes = '') => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/claims/${claimId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ status, notes })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update claim status');
            }
            
            const result = await response.json();
            
            // Show success message
            showSuccess(result.message);
            
            // Refresh both pending and all claims sections
            fetchClaims('pending-claims');
            fetchClaims('all-claims');
            
            // Close the claim details modal if it's open
            const modal = document.getElementById('claim-details-modal');
            if (modal && modal.style.display === 'block') {
                closeClaimDetails();
            }
        } catch (error) {
            console.error('Error updating claim status:', error);
            showError(error.message || 'Failed to update claim status');
        }
    };

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
                fetchClaims(tab.dataset.tab);
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

    // Filter change event listeners
    const filterInputs = document.querySelectorAll('.filter-group select, .filter-group input');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            const activeTab = document.querySelector('.admin-tab.active');
            if (activeTab) {
                fetchClaims(activeTab.dataset.tab);
            }
        });
    });

    // Add notes modal HTML
    const notesModalHTML = `
        <div id="notes-modal" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 id="notes-modal-title">Enter Notes</h3>
                    <span class="close" onclick="closeNotesModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="notes-input">Notes:</label>
                        <textarea id="notes-input" class="form-control" rows="4" placeholder="Enter your notes here..."></textarea>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeNotesModal()">Cancel</button>
                        <button class="btn-primary" id="submit-notes">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add the modal to the document
    document.body.insertAdjacentHTML('beforeend', notesModalHTML);

    // Global variables for notes modal
    let currentClaimId = null;
    let currentAction = null;

    // Show notes modal
    window.showNotesModal = (claimId, action) => {
        currentClaimId = claimId;
        currentAction = action;
        const modal = document.getElementById('notes-modal');
        const title = document.getElementById('notes-modal-title');
        title.textContent = action === 'approve' ? 'Enter Approval Notes' : 'Enter Rejection Reason';
        modal.style.display = 'block';
    };

    // Close notes modal
    window.closeNotesModal = () => {
        const modal = document.getElementById('notes-modal');
        modal.style.display = 'none';
        document.getElementById('notes-input').value = '';
        currentClaimId = null;
        currentAction = null;
    };

    // Handle notes submission
    document.getElementById('submit-notes').addEventListener('click', async () => {
        const notes = document.getElementById('notes-input').value.trim();
        if (currentClaimId && currentAction) {
            await updateClaimStatus(currentClaimId, currentAction === 'approve' ? 'approved' : 'rejected', notes);
            closeNotesModal();
        }
    });

    // Update the claim action buttons event listener
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('approve')) {
            const claimId = e.target.dataset.claimId;
            showNotesModal(claimId, 'approve');
        } else if (e.target.classList.contains('reject')) {
            const claimId = e.target.dataset.claimId;
            showNotesModal(claimId, 'reject');
        }
    });

    // Add styles for the notes modal
    const style = document.createElement('style');
    style.textContent = `
        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }

        .form-control {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
        }

        .btn-primary {
            background-color: #1e88e5;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-secondary {
            background-color: #e0e0e0;
            color: #333;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-primary:hover {
            background-color: #1976d2;
        }

        .btn-secondary:hover {
            background-color: #d5d5d5;
        }
    `;
    document.head.appendChild(style);

    // View claim details
    const viewClaimDetails = async (claimId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/claims/${claimId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch claim details');
            }

            const { data: claim } = await response.json();
            
            // Populate basic information
            document.getElementById('modal-claim-id').textContent = claim.claimId || 'N/A';
            document.getElementById('modal-claim-type').textContent = claim.claimType || 'N/A';
            document.getElementById('modal-claim-status').textContent = claim.status || 'N/A';
            document.getElementById('modal-claim-date').textContent = claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A';
            document.getElementById('modal-policy-number').textContent = claim.policyNumber || 'N/A';

            // Populate user information
            document.getElementById('modal-user-name').textContent = claim.user?.fullName || 'N/A';
            document.getElementById('modal-user-email').textContent = claim.user?.email || 'N/A';
            document.getElementById('modal-user-phone').textContent = claim.user?.phone || 'N/A';
            document.getElementById('modal-user-dob').textContent = claim.user?.dateOfBirth || 'N/A';
            document.getElementById('modal-user-gender').textContent = claim.user?.gender || 'N/A';

            // Populate hospital information
            document.getElementById('modal-hospital-name').textContent = claim.hospitalInfo?.name || 'N/A';
            document.getElementById('modal-hospital-address').textContent = claim.hospitalInfo?.address || 'N/A';
            document.getElementById('modal-hospital-city').textContent = claim.hospitalInfo?.city || 'N/A';
            document.getElementById('modal-hospital-state').textContent = claim.hospitalInfo?.state || 'N/A';

            // Populate treatment information
            document.getElementById('modal-diagnosis').textContent = claim.treatmentInfo?.diagnosisDetails || 'N/A';
            document.getElementById('modal-admission-date').textContent = claim.treatmentInfo?.admissionDate ? new Date(claim.treatmentInfo.admissionDate).toLocaleDateString() : 'N/A';
            document.getElementById('modal-discharge-date').textContent = claim.treatmentInfo?.dischargeDate ? new Date(claim.treatmentInfo.dischargeDate).toLocaleDateString() : 'N/A';
            document.getElementById('modal-doctor-name').textContent = claim.treatmentInfo?.doctorName || 'N/A';
            document.getElementById('modal-treatment-type').textContent = claim.treatmentInfo?.treatmentType || 'N/A';

            // Populate expense information
            document.getElementById('modal-room-charges').textContent = claim.expenseInfo?.roomCharges ? `₹${claim.expenseInfo.roomCharges.toLocaleString()}` : 'N/A';
            document.getElementById('modal-doctor-fees').textContent = claim.expenseInfo?.doctorFees ? `₹${claim.expenseInfo.doctorFees.toLocaleString()}` : 'N/A';
            document.getElementById('modal-medicine-cost').textContent = claim.expenseInfo?.medicineCost ? `₹${claim.expenseInfo.medicineCost.toLocaleString()}` : 'N/A';
            document.getElementById('modal-investigation-cost').textContent = claim.expenseInfo?.investigationCost ? `₹${claim.expenseInfo.investigationCost.toLocaleString()}` : 'N/A';
            document.getElementById('modal-other-charges').textContent = claim.expenseInfo?.otherCharges ? `₹${claim.expenseInfo.otherCharges.toLocaleString()}` : 'N/A';
            document.getElementById('modal-total-amount').textContent = claim.expenseInfo?.totalAmount ? `₹${claim.expenseInfo.totalAmount.toLocaleString()}` : 'N/A';

            // Populate documents
            const documentsContainer = document.getElementById('modal-documents');
            documentsContainer.innerHTML = '';

            if (claim.documents && Object.keys(claim.documents).length > 0) {
                Object.entries(claim.documents).forEach(([docType, docs]) => {
                    if (docs && docs.length > 0) {
                        docs.forEach(doc => {
                            const docElement = document.createElement('div');
                            docElement.className = 'document-item';
                            docElement.innerHTML = `
                                <i class="fas fa-file-alt"></i>
                                <div class="document-name">${doc.filename}</div>
                                <div class="document-actions">
                                    <a href="${doc.url}" target="_blank" class="btn-action">View</a>
                                </div>
                            `;
                            documentsContainer.appendChild(docElement);
                        });
                    }
                });
            }

            if (documentsContainer.children.length === 0) {
                documentsContainer.innerHTML = '<div class="no-documents">No documents available</div>';
            }

            // Show the modal
            const modal = document.getElementById('claim-details-modal');
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching claim details:', error);
            showError(error.message || 'Failed to load claim details');
        }
    };

    // Close claim details modal
    window.closeClaimDetails = () => {
        document.getElementById('claim-details-modal').style.display = 'none';
    };

    // Add click event listener for view details buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details')) {
            const claimId = e.target.dataset.claimId;
            if (claimId) {
                viewClaimDetails(claimId);
            } else {
                showError('Invalid claim ID');
            }
        }
    });

    // Close modal when clicking outside
    window.onclick = (event) => {
        const modal = document.getElementById('claim-details-modal');
        if (event.target === modal) {
            closeClaimDetails();
        }
    };

    // Initial data load
    fetchDashboardStats();
    fetchClaims('pending-claims');

    // Utility functions
    function showError(message) {
        // Implementation of error message display
        alert(message); // Replace with better UI implementation
    }

    function showSuccess(message) {
        // Implementation of success message display
        alert(message); // Replace with better UI implementation
    }
});