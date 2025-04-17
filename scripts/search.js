// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('code-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchApplication);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchApplication();
            }
        });
    }
});

function searchApplication() {
    const codeInput = document.getElementById('code-search');
    const code = codeInput.value.trim();
    
    if (!code) {
        alert('Please enter an application code');
        return;
    }
    
    // Show loading state
    document.getElementById('search-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Make API request
    fetch(`http://localhost:5000/api/application/code/${code}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Application not found');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Show endorsement view with data
                displayEndorsementView(data.data);
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        })
        .finally(() => {
            // Reset button
            document.getElementById('search-btn').innerHTML = '<i class="fas fa-search"></i>';
        });
}

function displayEndorsementView(applicationData) {
    // Hide other sections and show endorsement section
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // If endorsement section doesn't exist yet, create it
    let endorsementSection = document.getElementById('endorsement-section');
    if (!endorsementSection) {
        endorsementSection = createEndorsementSection();
        document.querySelector('.dashboard-content').appendChild(endorsementSection);
    } else {
        endorsementSection.classList.add('active');
    }
    
    // Fill in the data
    populateEndorsementData(applicationData);
}

function createEndorsementSection() {
    const section = document.createElement('section');
    section.id = 'endorsement-section';
    section.className = 'dashboard-section active';
    
    section.innerHTML = `
        <h2>Application Details</h2>
        <div class="application-container">
            <!-- Side Navigation -->
            <div class="application-nav">
                <div class="nav-item active" data-section="end-business-info">
                    <i class="fas fa-building"></i>
                    <span>Business Info</span>
                </div>
                <div class="nav-item" data-section="end-policy-info">
                    <i class="fas fa-file-contract"></i>
                    <span>Policy Info</span>
                </div>
                <div class="nav-item" data-section="end-personal-info">
                    <i class="fas fa-user"></i>
                    <span>Personal Info</span>
                </div>
                <div class="nav-item" data-section="end-health-info">
                    <i class="fas fa-heartbeat"></i>
                    <span>Health Info</span>
                </div>
                <div class="nav-item" data-section="end-address-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Address Info</span>
                </div>
                <div class="nav-item" data-section="end-questionnaire">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Questionnaire</span>
                </div>
                <div class="nav-item" data-section="end-summary">
                    <i class="fas fa-check-circle"></i>
                    <span>Summary</span>
                </div>
            </div>

            <!-- Application Forms -->
            <div class="application-content">
                <form id="endorsement-form">
                    <!-- Business Info Form -->
                    <div id="end-business-info-form" class="application-form active">
                        <h3>Business Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="end-application-code">Application Code</label>
                                <input type="text" id="end-application-code" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-easy-quote">Quote Reference</label>
                                <input type="text" id="end-easy-quote" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-country">Country</label>
                                <input type="text" id="end-country" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-state">State</label>
                                <input type="text" id="end-state" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-city">City</label>
                                <input type="text" id="end-city" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-lob">LOB</label>
                                <input type="text" id="end-lob" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-business-type">Type Of Business</label>
                                <input type="text" id="end-business-type" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-start-date">Start Date</label>
                                <input type="text" id="end-start-date" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-end-date">End Date</label>
                                <input type="text" id="end-end-date" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-intermediary-code">Intermediary Code</label>
                                <input type="text" id="end-intermediary-code" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-intermediary-name">Intermediary Name</label>
                                <input type="text" id="end-intermediary-name" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-intermediary-email">Intermediary Email</label>
                                <input type="text" id="end-intermediary-email" readonly>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-primary end-nav-next">Next</button>
                        </div>
                    </div>

                    <!-- Policy Info Form -->
                    <div id="end-policy-info-form" class="application-form">
                        <h3>Policy Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="end-premium-type">Payment Type</label>
                                <input type="text" id="end-premium-type" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-cover-type">Premium Cover</label>
                                <input type="text" id="end-cover-type" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-policy-plan">Policy Plan</label>
                                <input type="text" id="end-policy-plan" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-sum-insured">Sum Insured INR</label>
                                <input type="text" id="end-sum-insured" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-policy-tenure">Policy Tenure (Yrs)</label>
                                <input type="text" id="end-policy-tenure" readonly>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary end-nav-prev">Previous</button>
                            <button type="button" class="btn-primary end-nav-next">Next</button>
                        </div>
                    </div>

                    <!-- Personal Info Form -->
                    <div id="end-personal-info-form" class="application-form">
                        <h3>Personal Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="end-full-name">Full Name</label>
                                <input type="text" id="end-full-name" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-dob">Date of Birth</label>
                                <input type="text" id="end-dob" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-age">Age</label>
                                <input type="text" id="end-age" readonly>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="end-gender">Gender</label>
                                <input type="text" id="end-gender" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-relationship">Relationship</label>
                                <input type="text" id="end-relationship" readonly>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="end-email">Email</label>
                                <input type="text" id="end-email" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-phone">Phone Number</label>
                                <input type="text" id="end-phone" readonly>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary end-nav-prev">Previous</button>
                            <button type="button" class="btn-primary end-nav-next">Next</button>
                        </div>
                    </div>

                    <!-- Health Info Form -->
                    <div id="end-health-info-form" class="application-form">
                        <h3>Health Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="end-height">Height (cm)</label>
                                <input type="text" id="end-height" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-weight">Weight (kg)</label>
                                <input type="text" id="end-weight" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-bmi">BMI</label>
                                <input type="text" id="end-bmi" readonly>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="end-blood-group">Blood Group</label>
                                <input type="text" id="end-blood-group" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-conditions">Pre-existing Conditions</label>
                                <input type="text" id="end-conditions" readonly>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary end-nav-prev">Previous</button>
                            <button type="button" class="btn-primary end-nav-next">Next</button>
                        </div>
                    </div>

                    <!-- Address Info Form -->
                    <div id="end-address-info-form" class="application-form">
                        <h3>Communication Address</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="end-comm-address">Line Of Address</label>
                                <input type="text" id="end-comm-address" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-comm-pincode">PIN Code</label>
                                <input type="text" id="end-comm-pincode" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-comm-country">Country</label>
                                <input type="text" id="end-comm-country" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-comm-state">State</label>
                                <input type="text" id="end-comm-state" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-comm-city">City</label>
                                <input type="text" id="end-comm-city" readonly>
                            </div>
                        </div>

                        <h3>Permanent Address</h3>
                        <div class="form-group checkbox-container">
                            <input type="checkbox" id="end-same-as-comm" disabled>
                            <label for="end-same-as-comm">Same as Communication Address</label>
                        </div>

                        <div class="form-row" id="end-permanent-address-fields">
                            <div class="form-group">
                                <label for="end-perm-address">Line Of Address</label>
                                <input type="text" id="end-perm-address" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-perm-pincode">PIN Code</label>
                                <input type="text" id="end-perm-pincode" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-perm-country">Country</label>
                                <input type="text" id="end-perm-country" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-perm-state">State</label>
                                <input type="text" id="end-perm-state" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-perm-city">City</label>
                                <input type="text" id="end-perm-city" readonly>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary end-nav-prev">Previous</button>
                            <button type="button" class="btn-primary end-nav-next">Next</button>
                        </div>
                    </div>

                    <!-- Questionnaire Form -->
                    <div id="end-questionnaire-form" class="application-form">
                        <h3>Health Questionnaire</h3>
                        <div class="form-section">
                            <div class="form-group">
                                <label>Health Conditions:</label>
                                <input type="text" id="end-health-conditions" readonly>
                            </div>
                            <div class="form-group">
                                <label for="end-medical-history">Medical History:</label>
                                <textarea id="end-medical-history" rows="4" readonly></textarea>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary end-nav-prev">Previous</button>
                            <button type="button" class="btn-primary end-nav-next">Next</button>
                        </div>
                    </div>

                    <!-- Summary Form -->
                    <div id="end-summary-form" class="application-form">
                        <h3>Application Summary</h3>
                        <div class="premium-section">
                            <h3>Premium Details</h3>
                            <div class="premium-details">
                                <div class="premium-row">
                                    <span>Base Premium:</span>
                                    <span id="end-base-premium">₹0.00</span>
                                </div>
                                <div class="premium-row">
                                    <span>Taxes (18% GST):</span>
                                    <span id="end-premium-tax">₹0.00</span>
                                </div>
                                <div class="premium-row total">
                                    <span>Total Premium:</span>
                                    <span id="end-total-premium">₹0.00</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary end-nav-prev">Previous</button>
                            <button type="button" id="make-endorsement-btn" class="btn-primary">Make Endorsement</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    return section;
}

function populateEndorsementData(data) {
    // Application code and quote
    document.getElementById('end-application-code').value = data.applicationCode || '';
    document.getElementById('end-easy-quote').value = data.easyQuote || '';
    
    // Business Info
    const business = data.businessInfo || {};
    document.getElementById('end-country').value = business.country || '';
    document.getElementById('end-state').value = business.state || '';
    document.getElementById('end-city').value = business.city || '';
    document.getElementById('end-lob').value = business.lineOfBusiness || '';
    document.getElementById('end-business-type').value = business.typeOfBusiness || '';
    document.getElementById('end-start-date').value = formatDate(business.policyStartDate) || '';
    document.getElementById('end-end-date').value = formatDate(business.policyEndDate) || '';
    document.getElementById('end-intermediary-code').value = business.intermediaryCode || '';
    document.getElementById('end-intermediary-name').value = business.intermediaryName || '';
    document.getElementById('end-intermediary-email').value = business.intermediaryEmail || '';
    
    // Policy Info
    const policy = data.policyInfo || {};
    document.getElementById('end-premium-type').value = policy.premiumType || '';
    document.getElementById('end-cover-type').value = policy.coverType || '';
    document.getElementById('end-policy-plan').value = policy.policyPlan || '';
    document.getElementById('end-sum-insured').value = policy.sumInsured || '';
    document.getElementById('end-policy-tenure').value = policy.policyTenure || '';
    
    // Personal Info
    const personal = data.personalInfo || {};
    document.getElementById('end-full-name').value = personal.fullName || '';
    document.getElementById('end-dob').value = formatDate(personal.dateOfBirth) || '';
    document.getElementById('end-age').value = personal.age || '';
    document.getElementById('end-gender').value = personal.gender || '';
    document.getElementById('end-relationship').value = personal.relationship || '';
    document.getElementById('end-email').value = personal.email || '';
    document.getElementById('end-phone').value = personal.phone || '';
    
    // Health Info
    const health = data.healthInfo || {};
    document.getElementById('end-height').value = health.height || '';
    document.getElementById('end-weight').value = health.weight || '';
    document.getElementById('end-bmi').value = health.bmi || '';
    document.getElementById('end-blood-group').value = health.bloodGroup || '';
    document.getElementById('end-conditions').value = (health.preExistingConditions || []).join(', ') || 'None';
    
    // Address Info
    const address = data.addressInfo || {};
    const comm = address.communicationAddress || {};
    document.getElementById('end-comm-address').value = comm.lineOfAddress || '';
    document.getElementById('end-comm-pincode').value = comm.pinCode || '';
    document.getElementById('end-comm-country').value = comm.country || '';
    document.getElementById('end-comm-state').value = comm.state || '';
    document.getElementById('end-comm-city').value = comm.city || '';
    
    const perm = address.permanentAddress || {};
    const sameAsComm = perm.sameAsCommunication || false;
    document.getElementById('end-same-as-comm').checked = sameAsComm;
    
    // If addresses are the same, hide permanent address fields
    const permFields = document.getElementById('end-permanent-address-fields');
    if (sameAsComm) {
        permFields.style.display = 'none';
    } else {
        permFields.style.display = 'flex';
        document.getElementById('end-perm-address').value = perm.lineOfAddress || '';
        document.getElementById('end-perm-pincode').value = perm.pinCode || '';
        document.getElementById('end-perm-country').value = perm.country || '';
        document.getElementById('end-perm-state').value = perm.state || '';
        document.getElementById('end-perm-city').value = perm.city || '';
    }
    
    // Questionnaire
    const questionnaire = data.questionnaire || {};
    document.getElementById('end-health-conditions').value = (questionnaire.healthConditions || []).join(', ') || 'None';
    document.getElementById('end-medical-history').value = questionnaire.medicalHistory || '';
    
    // Premium
    const premium = data.premium || {};
    document.getElementById('end-base-premium').textContent = premium.basePremium || '₹0.00';
    document.getElementById('end-premium-tax').textContent = premium.tax || '₹0.00';
    document.getElementById('end-total-premium').textContent = premium.totalPremium || '₹0.00';
    
    // Setup navigation between sections
    setupEndorsementNavigation();
    
    // Setup endorsement button
    setupEndorsementButton(data.applicationCode);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
}

function setupEndorsementNavigation() {
    // Setup navigation buttons
    const nextButtons = document.querySelectorAll('.end-nav-next');
    const prevButtons = document.querySelectorAll('.end-nav-prev');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find current active form
            const currentForm = document.querySelector('#endorsement-section .application-form.active');
            // Find the corresponding nav item
            const currentNavItem = document.querySelector('#endorsement-section .nav-item.active');
            
            // Find next nav item
            const nextNavItem = currentNavItem.nextElementSibling;
            if (nextNavItem) {
                // Get the section to show
                const nextSectionId = nextNavItem.getAttribute('data-section');
                const nextForm = document.getElementById(nextSectionId + '-form');
                
                // Hide current, show next
                currentForm.classList.remove('active');
                nextForm.classList.add('active');
                
                // Update nav
                currentNavItem.classList.remove('active');
                nextNavItem.classList.add('active');
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find current active form
            const currentForm = document.querySelector('#endorsement-section .application-form.active');
            // Find the corresponding nav item
            const currentNavItem = document.querySelector('#endorsement-section .nav-item.active');
            
            // Find prev nav item
            const prevNavItem = currentNavItem.previousElementSibling;
            if (prevNavItem) {
                // Get the section to show
                const prevSectionId = prevNavItem.getAttribute('data-section');
                const prevForm = document.getElementById(prevSectionId + '-form');
                
                // Hide current, show prev
                currentForm.classList.remove('active');
                prevForm.classList.add('active');
                
                // Update nav
                currentNavItem.classList.remove('active');
                prevNavItem.classList.add('active');
            }
        });
    });
    
    // Add click handlers for sidebar navigation
    const navItems = document.querySelectorAll('#endorsement-section .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Get section to show
            const sectionId = this.getAttribute('data-section');
            const sectionToShow = document.getElementById(sectionId + '-form');
            
            // Hide all forms and show the selected one
            document.querySelectorAll('#endorsement-section .application-form').forEach(form => {
                form.classList.remove('active');
            });
            sectionToShow.classList.add('active');
        });
    });
}

function setupEndorsementButton(applicationCode) {
    const endorsementBtn = document.getElementById('make-endorsement-btn');
    if (endorsementBtn) {
        endorsementBtn.addEventListener('click', function() {
            alert(`Endorsement request initiated for application ${applicationCode}. Redirecting to endorsement form...`);
            // Here you could redirect to a new endorsement form or open a modal, etc.
        });
    }
}