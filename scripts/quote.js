document.addEventListener('DOMContentLoaded', function() {
    // Handle logout functionality for both buttons
    const logoutButtons = document.querySelectorAll('#logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide dashboard and cards sections
            document.getElementById('dashboard-section').classList.add('hidden');
            document.getElementById('cards-section').classList.add('hidden');
            
            // Show auth section
            document.getElementById('auth-section').classList.remove('hidden');
            
            // Reset any active states
            document.querySelectorAll('.nav-item.active, .application-form.active').forEach(el => {
                el.classList.remove('active');
            });
        });
    });

    // Function to handle navigation and form display
    function setupNavigation(navItems, forms) {
        // Set first item as active by default
        if (navItems.length > 0 && forms.length > 0) {
            // Remove any existing active classes
            document.querySelectorAll('.nav-item.active, .application-form.active').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active class to first items
            navItems[0].classList.add('active');
            forms[0].classList.add('active');
            
            // If this is the Quick Quote section, trigger a click on the first nav item
            if (navItems[0].closest('#quick-quote')) {
                navItems[0].click();
            }
        }

        // Make other nav items inactive/disabled initially
        for (let i = 1; i < navItems.length; i++) {
            navItems[i].classList.add('disabled');
        }

        navItems.forEach(item => {
            item.addEventListener('click', function() {
                // Only allow clicking if not disabled
                if (this.classList.contains('disabled')) {
                    return;
                }

                const section = this.getAttribute('data-section');
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding form
                forms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${section}-form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }

    // Function to handle form validation and color change
    function setupFormValidation(formInputs, navItems) {
        formInputs.forEach(input => {
            input.addEventListener('change', function() {
                const formSection = this.closest('.application-form');
                const sectionId = formSection.id.replace('-form', '');
                const navItem = document.querySelector(`[data-section="${sectionId}"]`);
                
                // Check if all required fields in this section are filled
                const allFilled = Array.from(formSection.querySelectorAll('input[required], select[required]'))
                    .every(field => field.value.trim() !== '');
                
                if (allFilled) {
                    navItem.classList.add('completed');
                } else {
                    navItem.classList.remove('completed');
                }
            });
        });
    }

    // Setup Quick Quote section
    const quickQuoteNavItems = document.querySelectorAll('#quick-quote .nav-item');
    const quickQuoteForms = document.querySelectorAll('#quick-quote .application-form');
    const quickQuoteInputs = document.querySelectorAll('#quote-form input, #quote-form select');
    
    setupNavigation(quickQuoteNavItems, quickQuoteForms);
    setupFormValidation(quickQuoteInputs, quickQuoteNavItems);

    // Setup Applications section
    const applicationsNavItems = document.querySelectorAll('#applications .nav-item');
    const applicationsForms = document.querySelectorAll('#applications .application-form');
    const applicationsInputs = document.querySelectorAll('#applications input, #applications select');
    
    setupNavigation(applicationsNavItems, applicationsForms);
    setupFormValidation(applicationsInputs, applicationsNavItems);

    // Initially hide all dashboard sections except the active one
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    dashboardSections.forEach(section => {
        if (!section.classList.contains('active')) {
            section.classList.add('hidden');
        }
    });

    // Set first nav link as active by default
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }

    // Function to validate form section
    function validateFormSection(formSection) {
        const requiredFields = formSection.querySelectorAll('input[required], select[required]');
        const emptyFields = Array.from(requiredFields).filter(field => !field.value.trim());
        
        if (emptyFields.length > 0) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Please fill in all required fields';
            
            // Remove any existing error message
            const existingError = formSection.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Add error message before form actions
            const formActions = formSection.querySelector('.form-actions');
            formSection.insertBefore(errorMessage, formActions);
            
            // Highlight empty fields
            emptyFields.forEach(field => {
                field.classList.add('error');
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                    if (this.value.trim()) {
                        const errorMessage = formSection.querySelector('.error-message');
                        if (errorMessage) {
                            errorMessage.remove();
                        }
                    }
                });
            });
            
            return false;
        }
        
        return true;
    }

    // Handle Save & Continue buttons in Quick Quote section
    document.querySelectorAll('#quick-quote .save-continue').forEach(button => {
        button.addEventListener('click', function() {
            const currentForm = this.closest('.application-form');
            
            // Validate the form section
            if (!validateFormSection(currentForm)) {
                return; // Stop if validation fails
            }
            
            const currentSectionId = currentForm.id.replace('-form', '');
            const currentNavItem = document.querySelector(`[data-section="${currentSectionId}"]`);
            const navItems = Array.from(document.querySelectorAll('#quick-quote .nav-item'));
            const currentIndex = navItems.indexOf(currentNavItem);
            
            // Mark current section as completed
            currentNavItem.classList.add('completed');
            
            // If there's a next nav item, enable and click it
            if (currentIndex < navItems.length - 1) {
                const nextNavItem = navItems[currentIndex + 1];
                nextNavItem.classList.remove('disabled');
                nextNavItem.click();
            }
        });
    });

    // Calculate BMI when height and weight change
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiInput = document.getElementById('bmi');
    
    if (heightInput && weightInput && bmiInput) {
        function calculateBMI() {
            const height = parseFloat(heightInput.value) / 100; // convert cm to m
            const weight = parseFloat(weightInput.value);
            
            if (height > 0 && weight > 0) {
                const bmi = (weight / (height * height)).toFixed(1);
                bmiInput.value = bmi;
            }
        }
        
        heightInput.addEventListener('input', calculateBMI);
        weightInput.addEventListener('input', calculateBMI);
    }
    
    // Calculate age when date of birth changes
    const dobInput = document.getElementById('dateOfBirth');
    const ageInput = document.getElementById('age');
    
    if (dobInput && ageInput) {
        dobInput.addEventListener('change', function() {
            const dob = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            ageInput.value = age;
        });
    }

    // Add Get Quick Quote button to health info section
    const healthInfoForm = document.getElementById('health-info-form');
    if (healthInfoForm) {
        const existingButtons = healthInfoForm.querySelector('.form-actions');
        if (existingButtons) {
            // Remove reset button if it exists
            const resetButton = existingButtons.querySelector('.btn-secondary');
            if (resetButton) {
                resetButton.remove();
            }
            
            // Add Get Quick Quote button
            const quoteButton = document.createElement('button');
            quoteButton.type = 'button';
            quoteButton.className = 'btn-primary';
            quoteButton.textContent = 'Get Easy Quote';
            quoteButton.addEventListener('click', function() {
                if (!validateFormSection(healthInfoForm)) {
                    return; // Stop if validation fails
                }
                
                // Get sum insured and tenure values
                const sumInsured = parseFloat(document.getElementById('sumInusred').value) || 500000;
                const tenure = parseFloat(document.getElementById('plicyTenure').value) || 1;
                
                // Calculate a dummy monthly premium (simple formula for demo)
                const basePremium = sumInsured * 0.02 / 12; // 2% of sum insured annually, divided by 12 for monthly
                const tenureFactor = 1 - (tenure > 1 ? 0.05 * (tenure - 1) : 0); // 5% discount per additional year
                const premium = Math.round(basePremium * tenureFactor);
                
                // Display the quote
                const quoteResult = document.createElement('div');
                quoteResult.className = 'quote-result';
                quoteResult.innerHTML = `
                    <h3>Your Premium Quote</h3>
                    <div class="premium-amount">₹${premium} <span>per month</span></div>
                    <div class="premium-details">
                        <p>Based on:</p>
                        <ul>
                            <li>Sum Insured: ₹${sumInsured.toLocaleString()}</li>
                            <li>Policy Tenure: ${tenure} year${tenure > 1 ? 's' : ''}</li>
                        </ul>
                    </div>
                `;
                
                // Remove existing quote result if any
                const existingQuote = healthInfoForm.querySelector('.quote-result');
                if (existingQuote) {
                    existingQuote.remove();
                }
                
                // Add quote result before form actions
                healthInfoForm.insertBefore(quoteResult, existingButtons);
                
                // Enable next section
                const currentNavItem = document.querySelector('[data-section="health-info"]');
                const navItems = Array.from(document.querySelectorAll('#quick-quote .nav-item'));
                const currentIndex = navItems.indexOf(currentNavItem);
                
                if (currentIndex < navItems.length - 1) {
                    const nextNavItem = navItems[currentIndex + 1];
                    nextNavItem.classList.remove('disabled');
                }
                
                // Mark current section as completed
                currentNavItem.classList.add('completed');
            });
            
            existingButtons.appendChild(quoteButton);
        }
    }

    // Add Save and Finalize button to the last section (address-info)
    const addressInfoForm = document.getElementById('address-info-form');
    if (addressInfoForm) {
        const existingButtons = addressInfoForm.querySelector('.form-actions');
        if (existingButtons) {
            // Remove reset button if it exists
            const resetButton = existingButtons.querySelector('.btn-secondary');
            if (resetButton) {
                resetButton.remove();
            }
            
            // Change Save & Continue to Save and Finalize
            const saveButton = existingButtons.querySelector('.save-continue');
            if (saveButton) {
                saveButton.textContent = 'Save and Finalize';
                saveButton.addEventListener('click', function() {
                    if (!validateFormSection(addressInfoForm)) {
                        return; // Stop if validation fails
                    }
                    
                    // Show success message
                    // const successMessage = document.createElement('div');
                    // successMessage.className = 'success-message';
                    // successMessage.innerHTML = `
                    //     <h3>Your application has been submitted successfully!</h3>
                    //     <p>Your policy ID: QP-${Math.floor(100000 + Math.random() * 900000)}</p>
                    //     <p>Our team will review your application and get back to you shortly.</p>
                    // `;
                    
                    // // Remove existing success message if any
                    const existingMessage = addressInfoForm.querySelector('.success-message');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                    
                    // // Add success message before form actions
                    // addressInfoForm.insertBefore(successMessage, existingButtons);
                });
            }
        }
    }

    // Document Management Functions - keeping the same as provided
    window.uploadPolicyDocument = function() {
        const fileInput = document.getElementById('policy-document-upload');
        const files = fileInput.files;
        
        if (files.length === 0) {
            alert('Please select at least one document to upload');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('documents', files[i]);
        }
        formData.append('type', 'policy');

        simulateDocumentUpload(formData, 'policy-documents');
    };

    window.uploadIDDocument = function() {
        const fileInput = document.getElementById('id-document-upload');
        const files = fileInput.files;
        
        if (files.length === 0) {
            alert('Please select at least one document to upload');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('documents', files[i]);
        }
        formData.append('type', 'id');

        simulateDocumentUpload(formData, 'id-documents');
    };

    window.uploadMedicalDocument = function() {
        const fileInput = document.getElementById('medical-document-upload');
        const files = fileInput.files;
        
        if (files.length === 0) {
            alert('Please select at least one document to upload');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('documents', files[i]);
        }
        formData.append('type', 'medical');

        simulateDocumentUpload(formData, 'medical-documents');
    };

    function simulateDocumentUpload(formData, targetListId) {
        const fileInput = document.getElementById(formData.get('type') + '-document-upload');
        const files = fileInput.files;
        const documentList = document.getElementById(targetListId);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const documentItem = document.createElement('div');
            documentItem.className = 'document-item';
            documentItem.innerHTML = `
                <div class="document-info">
                    <span class="document-name">${file.name}</span>
                    <span class="document-size">${formatFileSize(file.size)}</span>
                    <span class="document-type">${getFileType(file.name)}</span>
                </div>
                <div class="document-actions">
                    <button class="btn-secondary download-btn" onclick="downloadDocument('${file.name}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn-secondary delete-btn" onclick="deleteDocument(this)">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            documentList.appendChild(documentItem);
        }

        // Clear the file input
        fileInput.value = '';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFileType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const types = {
            'pdf': 'PDF Document',
            'doc': 'Word Document',
            'docx': 'Word Document',
            'jpg': 'Image',
            'jpeg': 'Image',
            'png': 'Image'
        };
        return types[extension] || 'Document';
    }

    window.downloadDocument = function(filename) {
        // Here you would typically make an API call to download the document
        alert(`Downloading ${filename}...`);
    };

    window.deleteDocument = function(button) {
        const documentItem = button.closest('.document-item');
        documentItem.remove();
    };
});