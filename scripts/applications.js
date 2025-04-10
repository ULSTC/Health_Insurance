// Application section functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize application lookups and form handling
    initApplicationLookup();
    
    // Reuse existing functions from paste.txt
    setupBMICalculation();
    setupAgeCalculation();
    setupSameAsAddressCheckbox();
    setupPremiumAndActivation();
});

function initApplicationLookup() {
    // Add event listener to lookup button
    const lookupBtn = document.getElementById('lookup-btn');
    if (lookupBtn) {
        lookupBtn.addEventListener('click', function() {
            const quickCode = document.getElementById('quick-code').value;
            if (quickCode) {
                lookupQuickQuote(quickCode);
            } else {
                alert('Please enter a Quick Quote Code');
            }
        });
    }
    
    // Initialize form navigation
    initApplicationNav();
    
    // Add validation to required fields
    addFieldValidation();
}

function initApplicationNav() {
    // Add event listeners to navigation items
    const navItems = document.querySelectorAll('.application-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchApplicationForm(section);
        });
    });

    // Add event listeners to Save & Continue buttons
    const saveContinueButtons = document.querySelectorAll('.app-save-continue');
    saveContinueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentForm = document.querySelector('.application-form.active');
            const currentNavItem = document.querySelector('.application-nav .nav-item.active');
            
            if (validateApplicationForm(currentForm.id)) {
                // Mark current nav item as completed
                currentNavItem.classList.add('completed');
                
                // Find the next form to display
                const nextNavItem = currentNavItem.nextElementSibling;
                if (nextNavItem) {
                    const nextSection = nextNavItem.getAttribute('data-section');
                    switchApplicationForm(nextSection);
                }
            }
        });
    });
}

function addFieldValidation() {
    // Add validation to all required fields
    const requiredFields = document.querySelectorAll('.application-form input[required], .application-form select[required]');
    requiredFields.forEach(field => {
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
                
                // Remove error message if it exists
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    });
}

function lookupQuickQuote(quickCode) {
    // In a real application, you might make an API call to fetch the quote
    // For this example, we'll retrieve the data from sessionStorage
    try {
        // Try to get the quote data from sessionStorage
        const quoteData = JSON.parse(sessionStorage.getItem('quoteData'));
        
        if (quoteData && quoteData.quickCode === quickCode) {
            populateApplicationForms(quoteData);
            alert('Quote data loaded successfully!');
        } else {
            // If no matching quote is found, check if there are any quotes
            const allQuotes = JSON.parse(sessionStorage.getItem('allQuotes')) || [];
            const matchingQuote = allQuotes.find(quote => quote.quickCode === quickCode);
            
            if (matchingQuote) {
                populateApplicationForms(matchingQuote);
                alert('Quote data loaded successfully!');
            } else {
                alert('No quote found with the provided code');
            }
        }
    } catch (error) {
        console.error('Error loading quote data:', error);
        alert('Error loading quote data. Please try again.');
    }
}

function populateApplicationForms(quoteData) {
    // Business Info
    if (quoteData.businessInfo) {
        document.getElementById('app-polCountry').value = quoteData.businessInfo.country || '';
        document.getElementById('app-polState').value = quoteData.businessInfo.state || '';
        document.getElementById('app-polCity').value = quoteData.businessInfo.city || '';
        document.getElementById('app-lineOfBusiness').value = quoteData.businessInfo.lineOfBusiness || '';
        document.getElementById('app-typeOfBusiness').value = quoteData.businessInfo.typeOfBusiness || '';
        document.getElementById('app-policystartDate').value = quoteData.businessInfo.startDate || '';
        document.getElementById('app-policyEndDate').value = quoteData.businessInfo.endDate || '';
        document.getElementById('app-IntermediaryCode').value = quoteData.businessInfo.intermediaryCode || '';
        document.getElementById('app-IntermediaryName').value = quoteData.businessInfo.intermediaryName || '';
        document.getElementById('app-Intermediaryemail').value = quoteData.businessInfo.intermediaryEmail || '';
    }
    
    // Policy Info
    if (quoteData.policyInfo) {
        document.getElementById('app-premiumType').value = quoteData.policyInfo.premiumType || '';
        document.getElementById('app-coverType').value = quoteData.policyInfo.coverType || '';
        document.getElementById('app-ploicyPlan').value = quoteData.policyInfo.policyPlan || '';
        document.getElementById('app-sumInusred').value = quoteData.policyInfo.sumInsured || '';
        document.getElementById('app-plicyTenure').value = quoteData.policyInfo.policyTenure || '';
    }
    
    // Personal Info
    if (quoteData.personalInfo) {
        document.getElementById('app-fullName').value = quoteData.personalInfo.fullName || '';
        document.getElementById('app-dateOfBirth').value = quoteData.personalInfo.dateOfBirth || '';
        document.getElementById('app-age').value = quoteData.personalInfo.age || '';
        document.getElementById('app-gender').value = quoteData.personalInfo.gender || '';
        document.getElementById('app-relationship').value = quoteData.personalInfo.relationship || '';
        document.getElementById('app-email').value = quoteData.personalInfo.email || '';
        document.getElementById('app-phone').value = quoteData.personalInfo.phone || '';
    }
    
    // Health Info
    if (quoteData.healthInfo) {
        document.getElementById('app-height').value = quoteData.healthInfo.height || '';
        document.getElementById('app-weight').value = quoteData.healthInfo.weight || '';
        document.getElementById('app-bmi').value = quoteData.healthInfo.bmi || '';
        document.getElementById('app-bloodGroup').value = quoteData.healthInfo.bloodGroup || '';
        
        // Set checkboxes for conditions
        if (quoteData.healthInfo.conditions) {
            const checkboxes = document.querySelectorAll('input[name="app-conditions"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = quoteData.healthInfo.conditions.includes(checkbox.value);
            });
        }
    }
    
    // Address Info
    if (quoteData.addressInfo) {
        // Communication Address
        document.getElementById('app-commLineOfAddress').value = quoteData.addressInfo.commAddress || '';
        document.getElementById('app-commPinCode').value = quoteData.addressInfo.commPinCode || '';
        document.getElementById('app-commCountry').value = quoteData.addressInfo.commCountry || '';
        document.getElementById('app-commState').value = quoteData.addressInfo.commState || '';
        document.getElementById('app-commCity').value = quoteData.addressInfo.commCity || '';
        
        // Permanent Address
        const sameAsCommCheckbox = document.getElementById('app-sameAsComm');
        sameAsCommCheckbox.checked = quoteData.addressInfo.sameAsComm || false;
        
        if (!quoteData.addressInfo.sameAsComm) {
            document.getElementById('app-presentLineOfAddress').value = quoteData.addressInfo.presentAddress || '';
            document.getElementById('app-presentPinCode').value = quoteData.addressInfo.presentPinCode || '';
            document.getElementById('app-presentCountry').value = quoteData.addressInfo.presentCountry || '';
            document.getElementById('app-presentState').value = quoteData.addressInfo.presentState || '';
            document.getElementById('app-presentCity').value = quoteData.addressInfo.presentCity || '';
            document.getElementById('app-presentAddressFields').style.display = 'flex';
        } else {
            document.getElementById('app-presentAddressFields').style.display = 'none';
        }
    }
    
    // Update navigation to mark completed sections
    updateNavigation(quoteData);
}

function updateNavigation(quoteData) {
    const navItems = document.querySelectorAll('.application-nav .nav-item');
    navItems.forEach(item => {
        const section = item.getAttribute('data-section');
        
        // Mark sections as completed if they have data
        if ((section === 'business-info-app' && quoteData.businessInfo) ||
            (section === 'policy-info-app' && quoteData.policyInfo) ||
            (section === 'personal-info-app' && quoteData.personalInfo) ||
            (section === 'health-info-app' && quoteData.healthInfo) ||
            (section === 'address-info-app' && quoteData.addressInfo)) {
            item.classList.add('completed');
        }
    });
    
    // Activate the first nav item by default
    const firstNavItem = document.querySelector('.application-nav .nav-item');
    if (firstNavItem) {
        const section = firstNavItem.getAttribute('data-section');
        switchApplicationForm(section);
    }
}

function switchApplicationForm(section) {
    // Hide all forms
    const forms = document.querySelectorAll('.application-form');
    forms.forEach(form => {
        form.classList.remove('active');
    });
    
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.application-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show the selected form
    const selectedForm = document.getElementById(section + '-form');
    if (selectedForm) {
        selectedForm.classList.add('active');
    }
    
    // Add active class to the selected nav item
    const selectedNavItem = document.querySelector(`.application-nav .nav-item[data-section="${section}"]`);
    if (selectedNavItem) {
        selectedNavItem.classList.add('active');
    }
}

function validateApplicationForm(formId) {
    // Get all required inputs in the current form
    const form = document.getElementById(formId);
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    
    // Check each required input
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Add error message if it doesn't exist
            let errorMsg = input.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                input.parentElement.appendChild(errorMsg);
            }
        } else {
            input.classList.remove('error');
            
            // Remove error message if it exists
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// Helper function to store the quote data for lookup
function saveQuickQuoteData(quoteData) {
    // Generate a unique quick code if not present
    if (!quoteData.quickCode) {
        quoteData.quickCode = generateQuickCode();
    }
    
    try {
        // Save the current quote
        sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
        
        // Also add it to the list of all quotes
        const allQuotes = JSON.parse(sessionStorage.getItem('allQuotes')) || [];
        allQuotes.push(quoteData);
        sessionStorage.setItem('allQuotes', JSON.stringify(allQuotes));
        
        return quoteData.quickCode;
    } catch (error) {
        console.error('Error saving quote data:', error);
        return null;
    }
}

function generateQuickCode() {
    // Generate a random 6-character alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

// The existing functions from paste.txt that we're reusing
function setupBMICalculation() {
    const heightInput = document.getElementById('app-height');
    const weightInput = document.getElementById('app-weight');
    const bmiOutput = document.getElementById('app-bmi');
    
    if (heightInput && weightInput && bmiOutput) {
        const calculateBMI = function() {
            const height = parseFloat(heightInput.value) / 100; // Convert cm to m
            const weight = parseFloat(weightInput.value);
            
            if (height > 0 && weight > 0) {
                const bmi = weight / (height * height);
                bmiOutput.value = bmi.toFixed(2);
            } else {
                bmiOutput.value = '';
            }
        };
        
        heightInput.addEventListener('input', calculateBMI);
        weightInput.addEventListener('input', calculateBMI);
    }
}

function setupAgeCalculation() {
    const dobInput = document.getElementById('app-dateOfBirth');
    const ageOutput = document.getElementById('app-age');
    
    if (dobInput && ageOutput) {
        dobInput.addEventListener('change', function() {
            const dob = new Date(this.value);
            const today = new Date();
            
            let age = today.getFullYear() - dob.getFullYear();
            
            // Adjust age if birthday hasn't occurred yet this year
            if (today.getMonth() < dob.getMonth() || 
                (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
                age--;
            }
            
            ageOutput.value = age;
        });
    }
}

function setupSameAsAddressCheckbox() {
    const sameAsCommCheckbox = document.getElementById('app-sameAsComm');
    const presentAddressFields = document.getElementById('app-presentAddressFields');
    
    if (sameAsCommCheckbox && presentAddressFields) {
        sameAsCommCheckbox.addEventListener('change', function() {
            if (this.checked) {
                presentAddressFields.style.display = 'none';
                
                // Copy values from communication address to permanent address
                document.getElementById('app-presentLineOfAddress').value = document.getElementById('app-commLineOfAddress').value;
                document.getElementById('app-presentPinCode').value = document.getElementById('app-commPinCode').value;
                document.getElementById('app-presentCountry').value = document.getElementById('app-commCountry').value;
                document.getElementById('app-presentState').value = document.getElementById('app-commState').value;
                document.getElementById('app-presentCity').value = document.getElementById('app-commCity').value;
            } else {
                presentAddressFields.style.display = 'flex';
                
                // Clear permanent address fields
                document.getElementById('app-presentLineOfAddress').value = '';
                document.getElementById('app-presentPinCode').value = '';
                document.getElementById('app-presentCountry').value = '';
                document.getElementById('app-presentState').value = '';
                document.getElementById('app-presentCity').value = '';
            }
        });
    }
}

function setupPremiumAndActivation() {
    const calculatePremiumBtn = document.getElementById('calculate-premium-btn');
    const activatePolicyBtn = document.getElementById('activate-policy-btn');
    
    if (calculatePremiumBtn) {
        calculatePremiumBtn.addEventListener('click', calculatePremium);
    }
    
    if (activatePolicyBtn) {
        activatePolicyBtn.addEventListener('click', activatePolicy);
    }
}

function calculatePremium() {
    // Get relevant form data
    const age = parseInt(document.getElementById('app-age').value) || 0;
    const sumInsured = parseFloat(document.getElementById('app-sumInusred').value) || 0;
    const policyTenure = parseInt(document.getElementById('app-plicyTenure').value) || 1;
    const policyPlan = document.getElementById('app-ploicyPlan').value;
    
    // Get pre-existing conditions
    const conditionsCheckboxes = document.querySelectorAll('input[name="app-conditions"]:checked');
    const conditions = Array.from(conditionsCheckboxes).map(cb => cb.value);
    
    // Calculate base premium
    let basePremium = calculateBasePremium(age, sumInsured, policyTenure, policyPlan, conditions);
    
    // Calculate tax (18% GST)
    const taxAmount = basePremium * 0.18;
    
    // Calculate total premium
    const totalPremium = basePremium + taxAmount;
    
    // Update premium display
    document.getElementById('base-premium').textContent = `₹${basePremium.toFixed(2)}`;
    document.getElementById('premium-tax').textContent = `₹${taxAmount.toFixed(2)}`;
    document.getElementById('total-premium').textContent = `₹${totalPremium.toFixed(2)}`;
    
    // Update application summary
    updateApplicationSummary();
    
    // Enable activate policy button
    document.getElementById('activate-policy-btn').disabled = false;
    
    return totalPremium;
}

function calculateBasePremium(age, sumInsured, policyTenure, policyPlan, conditions) {
    // Base rate per lakh of sum insured
    let baseRate = 1000;
    
    // Age factor
    let ageFactor = 1;
    if (age < 18) {
        ageFactor = 0.7;
    } else if (age >= 18 && age <= 35) {
        ageFactor = 0.9;
    } else if (age > 35 && age <= 45) {
        ageFactor = 1.2;
    } else if (age > 45 && age <= 60) {
        ageFactor = 1.5;
    } else {
        ageFactor = 2.0;
    }
    
    // Policy plan factor
    let planFactor = 1;
    switch (policyPlan) {
        case 'silver':
            planFactor = 0.9;
            break;
        case 'gold':
            planFactor = 1.2;
            break;
        case 'platinum':
            planFactor = 1.5;
            break;
    }
    
    // Tenure discount
    let tenureDiscount = 1;
    if (policyTenure >= 2) {
        tenureDiscount = 0.95; // 5% discount for 2+ years
    }
    if (policyTenure >= 3) {
        tenureDiscount = 0.9; // 10% discount for 3+ years
    }
    
    // Pre-existing conditions loading
    let conditionsLoading = 1;
    if (conditions.length > 0) {
        conditionsLoading = 1 + (conditions.length * 0.1); // 10% additional per condition
    }
    
    // Calculate premium
    const sumInsuredInLakhs = sumInsured / 100000;
    const basePremium = baseRate * sumInsuredInLakhs * ageFactor * planFactor * tenureDiscount * conditionsLoading;
    
    return Math.round(basePremium * 100) / 100; // Round to 2 decimal places
}

function updateApplicationSummary() {
    const summaryContainer = document.getElementById('application-summary');
    
    if (summaryContainer) {
        // Clear existing content
        summaryContainer.innerHTML = '';
        
        // Create summary sections
        const sections = [
            {
                title: 'Business Information',
                items: [
                    { label: 'Country', id: 'app-polCountry' },
                    { label: 'State', id: 'app-polState' },
                    { label: 'City', id: 'app-polCity' },
                    { label: 'Line of Business', id: 'app-lineOfBusiness' },
                    { label: 'Type of Business', id: 'app-typeOfBusiness' },
                    { label: 'Policy Start Date', id: 'app-policystartDate' },
                    { label: 'Policy End Date', id: 'app-policyEndDate' }
                ]
            },
            {
                title: 'Policy Information',
                items: [
                    { label: 'Payment Type', id: 'app-premiumType' },
                    { label: 'Premium Cover', id: 'app-coverType' },
                    { label: 'Policy Plan', id: 'app-ploicyPlan' },
                    { label: 'Sum Insured', id: 'app-sumInusred', prefix: '₹' },
                    { label: 'Policy Tenure', id: 'app-plicyTenure', suffix: ' year(s)' }
                ]
            },
            {
                title: 'Personal Information',
                items: [
                    { label: 'Full Name', id: 'app-fullName' },
                    { label: 'Date of Birth', id: 'app-dateOfBirth' },
                    { label: 'Age', id: 'app-age', suffix: ' years' },
                    { label: 'Gender', id: 'app-gender' },
                    { label: 'Email', id: 'app-email' },
                    { label: 'Phone', id: 'app-phone' }
                ]
            },
            {
                title: 'Health Information',
                items: [
                    { label: 'Height', id: 'app-height', suffix: ' cm' },
                    { label: 'Weight', id: 'app-weight', suffix: ' kg' },
                    { label: 'BMI', id: 'app-bmi' },
                    { label: 'Blood Group', id: 'app-bloodGroup' }
                ]
            }
        ];
        
        // Generate HTML for each section
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'summary-section';
            
            // Section title
            const title = document.createElement('h4');
            title.textContent = section.title;
            sectionDiv.appendChild(title);
            
            // Section items
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'summary-items';
            
            section.items.forEach(item => {
                const element = document.getElementById(item.id);
                if (element && element.value) {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'summary-item';
                    
                    const label = document.createElement('span');
                    label.className = 'summary-label';
                    label.textContent = item.label + ':';
                    
                    const value = document.createElement('span');
                    value.className = 'summary-value';
                    
                    // Format the value with prefix/suffix if provided
                    let displayValue = element.value;
                    
                    // Handle select elements
                    if (element.tagName === 'SELECT' && element.options[element.selectedIndex]) {
                        displayValue = element.options[element.selectedIndex].text;
                    }
                    
                    // Add prefix/suffix
                    if (item.prefix) displayValue = item.prefix + displayValue;
                    if (item.suffix) displayValue = displayValue + item.suffix;
                    
                    value.textContent = displayValue;
                    
                    itemDiv.appendChild(label);
                    itemDiv.appendChild(value);
                    itemsContainer.appendChild(itemDiv);
                }
            });
            
            sectionDiv.appendChild(itemsContainer);
            summaryContainer.appendChild(sectionDiv);
        });
        
        // Add pre-existing conditions section
        const conditionsCheckboxes = document.querySelectorAll('input[name="app-conditions"]:checked');
        if (conditionsCheckboxes.length > 0) {
            const conditionsSection = document.createElement('div');
            conditionsSection.className = 'summary-section';
            
            const conditionsTitle = document.createElement('h4');
            conditionsTitle.textContent = 'Pre-existing Conditions';
            conditionsSection.appendChild(conditionsTitle);
            
            const conditionsList = document.createElement('div');
            conditionsList.className = 'summary-items';
            
            conditionsCheckboxes.forEach(checkbox => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'summary-item';
                itemDiv.textContent = checkbox.parentElement.textContent.trim();
                conditionsList.appendChild(itemDiv);
            });
            
            conditionsSection.appendChild(conditionsList);
            summaryContainer.appendChild(conditionsSection);
        }
    }
}

function activatePolicy() {
    // Validate that premium has been calculated
    const totalPremium = document.getElementById('total-premium').textContent;
    if (totalPremium === '₹0.00') {
        alert('Please calculate premium before activating the policy.');
        return;
    }
    
    // Get policy data from form
    const policyData = collectPolicyData();
    
    // Generate policy number
    const policyNumber = generatePolicyNumber();
    
    // Add policy number and today's date to the data
    policyData.policyNumber = policyNumber;
    policyData.activationDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    
    // In a real application, you would submit this data to the server
    // For this example, we'll store it in sessionStorage
    savePolicy(policyData);
    
    // Show success message
    showActivationSuccess(policyNumber);
}

function collectPolicyData() {
    const policyData = {
        businessInfo: {
            country: document.getElementById('app-polCountry').value,
            state: document.getElementById('app-polState').value,
            city: document.getElementById('app-polCity').value,
            lineOfBusiness: document.getElementById('app-lineOfBusiness').value,
            typeOfBusiness: document.getElementById('app-typeOfBusiness').value,
            startDate: document.getElementById('app-policystartDate').value,
            endDate: document.getElementById('app-policyEndDate').value,
            intermediaryCode: document.getElementById('app-IntermediaryCode').value,
            intermediaryName: document.getElementById('app-IntermediaryName').value,
            intermediaryEmail: document.getElementById('app-Intermediaryemail').value
        },
        policyInfo: {
            premiumType: document.getElementById('app-premiumType').value,
            coverType: document.getElementById('app-coverType').value,
            policyPlan: document.getElementById('app-ploicyPlan').value,
            sumInsured: document.getElementById('app-sumInusred').value,
            policyTenure: document.getElementById('app-plicyTenure').value
        },
        personalInfo: {
            fullName: document.getElementById('app-fullName').value,
            dateOfBirth: document.getElementById('app-dateOfBirth').value,
            age: document.getElementById('app-age').value,
            gender: document.getElementById('app-gender').value,
            relationship: document.getElementById('app-relationship').value,
            email: document.getElementById('app-email').value,
            phone: document.getElementById('app-phone').value
        },
        healthInfo: {
            height: document.getElementById('app-height').value,
            weight: document.getElementById('app-weight').value,
            bmi: document.getElementById('app-bmi').value,
            bloodGroup: document.getElementById('app-bloodGroup').value,
            conditions: Array.from(document.querySelectorAll('input[name="app-conditions"]:checked')).map(cb => cb.value)
        },
        addressInfo: {
            commAddress: document.getElementById('app-commLineOfAddress').value,
            commPinCode: document.getElementById('app-commPinCode').value,
            commCountry: document.getElementById('app-commCountry').value,
            commState: document.getElementById('app-commState').value,
            commCity: document.getElementById('app-commCity').value,
            sameAsComm: document.getElementById('app-sameAsComm').checked,
            presentAddress: document.getElementById('app-presentLineOfAddress').value,
            presentPinCode: document.getElementById('app-presentPinCode').value,
            presentCountry: document.getElementById('app-presentCountry').value,
            presentState: document.getElementById('app-presentState').value,
            presentCity: document.getElementById('app-presentCity').value
        },
        premium: {
            basePremium: document.getElementById('base-premium').textContent,
            tax: document.getElementById('premium-tax').textContent,
            totalPremium: document.getElementById('total-premium').textContent
        }
    };
    
    return policyData;
}

function generatePolicyNumber() {
    // Format: POL-YYYYMMDD-XXXXX where XXXXX is a random 5-digit number
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const random = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    
    return `POL-${year}${month}${day}-${random}`;
}

function savePolicy(policyData) {
    try {
        // Get existing policies or initialize empty array
        const existingPolicies = JSON.parse(sessionStorage.getItem('policies')) || [];
        
        // Add new policy
        existingPolicies.push(policyData);
        
        // Save back to sessionStorage
        sessionStorage.setItem('policies', JSON.stringify(existingPolicies));
        
        // Also store the current policy for easy reference
        sessionStorage.setItem('currentPolicy', JSON.stringify(policyData));
        
        return true;
    } catch (error) {
        console.error('Error saving policy:', error);
        return false;
    }
}

function showActivationSuccess(policyNumber) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal-content success-modal';
    
    // Create success icon
    const successIcon = document.createElement('div');
    successIcon.className = 'success-icon';
    successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    
    // Create heading
    const heading = document.createElement('h3');
    heading.textContent = 'Policy Activated Successfully!';
    
    // Create policy number display
    const policyNumberDisplay = document.createElement('div');
    policyNumberDisplay.className = 'policy-number-display';
    policyNumberDisplay.innerHTML = `<span>Your Policy Number:</span> <strong>${policyNumber}</strong>`;
    
    // Create message
    const message = document.createElement('p');
    message.textContent = 'Your health insurance policy has been activated. A confirmation email with policy details has been sent to your registered email address.';
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'modal-buttons';
    
    // Create view policy button
    const viewPolicyButton = document.createElement('button');
    viewPolicyButton.className = 'btn btn-primary';
    viewPolicyButton.textContent = 'View Policy';
    viewPolicyButton.addEventListener('click', function() {
        // Redirect to policy details page
        window.location.href = `policy-details.html?policyNumber=${policyNumber}`;
    });
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'btn btn-secondary';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', function() {
        // Remove modal and overlay
        document.body.removeChild(overlay);
    });
    
    // Assemble modal
    buttonsContainer.appendChild(viewPolicyButton);
    buttonsContainer.appendChild(closeButton);
    
    modal.appendChild(successIcon);
    modal.appendChild(heading);
    modal.appendChild(policyNumberDisplay);
    modal.appendChild(message);
    modal.appendChild(buttonsContainer);
    
    overlay.appendChild(modal);
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Automatically redirect to dashboard after 10 seconds if modal is not closed
    const redirectTimeout = setTimeout(function() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
            window.location.href = 'dashboard.html';
        }
    }, 10000);
    
    // Clear timeout if modal is closed manually
    closeButton.addEventListener('click', function() {
        clearTimeout(redirectTimeout);
    });
}

// Add a function to handle policy download
function downloadPolicy(policyNumber) {
    // In a real application, this would generate and download a PDF
    // For this example, we'll create a sample text file with policy details
    
    // Get policy data from sessionStorage
    const policyData = JSON.parse(sessionStorage.getItem('currentPolicy'));
    
    if (policyData) {
        // Create policy text content
        let policyText = `HEALTH INSURANCE POLICY CERTIFICATE\n\n`;
        policyText += `Policy Number: ${policyNumber}\n`;
        policyText += `Activation Date: ${policyData.activationDate}\n\n`;
        
        policyText += `INSURED DETAILS:\n`;
        policyText += `Name: ${policyData.personalInfo.fullName}\n`;
        policyText += `Age: ${policyData.personalInfo.age} years\n`;
        policyText += `Gender: ${policyData.personalInfo.gender}\n`;
        policyText += `Email: ${policyData.personalInfo.email}\n`;
        policyText += `Phone: ${policyData.personalInfo.phone}\n\n`;
        
        policyText += `POLICY DETAILS:\n`;
        policyText += `Plan: ${policyData.policyInfo.policyPlan.toUpperCase()}\n`;
        policyText += `Sum Insured: ${policyData.policyInfo.sumInsured}\n`;
        policyText += `Tenure: ${policyData.policyInfo.policyTenure} year(s)\n`;
        policyText += `Start Date: ${policyData.businessInfo.startDate}\n`;
        policyText += `End Date: ${policyData.businessInfo.endDate}\n\n`;
        
        policyText += `PREMIUM DETAILS:\n`;
        policyText += `Base Premium: ${policyData.premium.basePremium}\n`;
        policyText += `Tax: ${policyData.premium.tax}\n`;
        policyText += `Total Premium: ${policyData.premium.totalPremium}\n`;
        
        // Create blob and download
        const blob = new Blob([policyText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Policy_${policyNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        alert('Policy data not found');
    }
}

// Add a function to retrieve policy details by policy number
function getPolicyByNumber(policyNumber) {
    try {
        // Get all policies from sessionStorage
        const policies = JSON.parse(sessionStorage.getItem('policies')) || [];
        
        // Find policy with matching policy number
        return policies.find(policy => policy.policyNumber === policyNumber);
    } catch (error) {
        console.error('Error retrieving policy:', error);
        return null;
    }
}

// Add a function to display policy details on the policy details page
function displayPolicyDetails() {
    // Get policy number from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const policyNumber = urlParams.get('policyNumber');
    
    if (policyNumber) {
        // Get policy data
        const policyData = getPolicyByNumber(policyNumber);
        
        if (policyData) {
            // Set policy number in header
            document.getElementById('policy-number-display').textContent = policyNumber;
            
            // Set policy status
            document.getElementById('policy-status').textContent = 'Active';
            document.getElementById('policy-status').className = 'status-active';
            
            // Fill in policy details sections
            populatePolicyDetails(policyData);
            
            // Enable download and print buttons
            document.getElementById('download-policy-btn').addEventListener('click', function() {
                downloadPolicy(policyNumber);
            });
            
            document.getElementById('print-policy-btn').addEventListener('click', function() {
                window.print();
            });
        } else {
            showErrorMessage('Policy not found');
        }
    } else {
        showErrorMessage('Invalid policy number');
    }
}

// Helper function to populate policy details on the policy details page
function populatePolicyDetails(policyData) {
    // Personal details
    document.getElementById('pd-name').textContent = policyData.personalInfo.fullName;
    document.getElementById('pd-dob').textContent = policyData.personalInfo.dateOfBirth;
    document.getElementById('pd-age').textContent = policyData.personalInfo.age + ' years';
    document.getElementById('pd-gender').textContent = policyData.personalInfo.gender;
    document.getElementById('pd-email').textContent = policyData.personalInfo.email;
    document.getElementById('pd-phone').textContent = policyData.personalInfo.phone;
    
    // Address details
    document.getElementById('pd-address').textContent = policyData.addressInfo.commAddress;
    document.getElementById('pd-pincode').textContent = policyData.addressInfo.commPinCode;
    document.getElementById('pd-city').textContent = policyData.addressInfo.commCity;
    document.getElementById('pd-state').textContent = policyData.addressInfo.commState;
    document.getElementById('pd-country').textContent = policyData.addressInfo.commCountry;
    
    // Policy details
    document.getElementById('pd-plan').textContent = policyData.policyInfo.policyPlan.charAt(0).toUpperCase() + policyData.policyInfo.policyPlan.slice(1);
    document.getElementById('pd-sum-insured').textContent = '₹' + policyData.policyInfo.sumInsured;
    document.getElementById('pd-tenure').textContent = policyData.policyInfo.policyTenure + ' year(s)';
    document.getElementById('pd-start-date').textContent = policyData.businessInfo.startDate;
    document.getElementById('pd-end-date').textContent = policyData.businessInfo.endDate;
    document.getElementById('pd-premium').textContent = policyData.premium.totalPremium;
    
    // Health details
    document.getElementById('pd-height').textContent = policyData.healthInfo.height + ' cm';
    document.getElementById('pd-weight').textContent = policyData.healthInfo.weight + ' kg';
    document.getElementById('pd-bmi').textContent = policyData.healthInfo.bmi;
    document.getElementById('pd-blood-group').textContent = policyData.healthInfo.bloodGroup;
    
    // Pre-existing conditions
    const conditionsContainer = document.getElementById('pd-conditions');
    conditionsContainer.innerHTML = '';
    
    if (policyData.healthInfo.conditions && policyData.healthInfo.conditions.length > 0) {
        policyData.healthInfo.conditions.forEach(condition => {
            const conditionItem = document.createElement('span');
            conditionItem.className = 'condition-tag';
            conditionItem.textContent = condition;
            conditionsContainer.appendChild(conditionItem);
        });
    } else {
        conditionsContainer.textContent = 'No pre-existing conditions';
    }
}

// Helper function to show error message
function showErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    
    const errorIcon = document.createElement('div');
    errorIcon.className = 'error-icon';
    errorIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-primary';
    backButton.textContent = 'Go to Dashboard';
    backButton.addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });
    
    errorContainer.appendChild(errorIcon);
    errorContainer.appendChild(errorMessage);
    errorContainer.appendChild(backButton);
    
    // Clear content and show error
    document.querySelector('.policy-details-container').innerHTML = '';
    document.querySelector('.policy-details-container').appendChild(errorContainer);
}

// Initialize policy details display if on the policy details page
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the policy details page
    if (document.querySelector('.policy-details-container')) {
        displayPolicyDetails();
    }
});