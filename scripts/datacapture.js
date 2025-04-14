// Function to fetch quote data when easyQuote input changes
document.getElementById('easyQuote').addEventListener('blur', async function() {
    const quoteCode = this.value.trim();
    if (quoteCode) {
        try {
            const response = await fetch(`http://localhost:5000/api/quote/code/${quoteCode}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                populateFormFields(result.data);
                console.log('Form populated successfully');
            } else {
                console.error('Failed to fetch quote data:', result);
                alert('Failed to fetch quote data. Please check the quote reference number.');
            }
        } catch (error) {
            console.error('Error fetching quote data:', error);
            alert('Error fetching quote data. Please try again.');
        }
    }
});

// Function to populate all form fields from API response
function populateFormFields(data) {
    // Populate Business Information
    populateBusinessInfo(data.businessInfo);
    
    // Populate Policy Information
    populatePolicyInfo(data.policyInfo);
    
    // Populate Personal Information
    populatePersonalInfo(data.personalInfo);
    
    // Populate Health Information
    populateHealthInfo(data.healthInfo);
    
    // Populate Address Information
    populateAddressInfo(data.addressInfo);
    
    // Populate Premium details
    populatePremiumDetails(data);
    
    // Generate summary
    //generateApplicationSummary(data);
}

// Populate Business Information section
function populateBusinessInfo(businessInfo) {
    document.getElementById('app-polCountry').value = businessInfo.country || '';
    document.getElementById('app-polState').value = businessInfo.state || '';
    document.getElementById('app-polCity').value = businessInfo.city || '';
    document.getElementById('app-lineOfBusiness').value = businessInfo.lineOfBusiness || '';
    document.getElementById('app-typeOfBusiness').value = businessInfo.typeOfBusiness || '';
    
    // Format dates for input fields (YYYY-MM-DD)
    if (businessInfo.policyStartDate) {
        document.getElementById('app-policystartDate').value = formatDateForInput(businessInfo.policyStartDate);
    }
    
    if (businessInfo.policyEndDate) {
        document.getElementById('app-policyEndDate').value = formatDateForInput(businessInfo.policyEndDate);
    }
    
    document.getElementById('app-IntermediaryCode').value = businessInfo.intermediaryCode || '';
    document.getElementById('app-IntermediaryName').value = businessInfo.intermediaryName || '';
    document.getElementById('app-Intermediaryemail').value = businessInfo.intermediaryEmail || '';
}

// Populate Policy Information section
function populatePolicyInfo(policyInfo) {
    document.getElementById('app-premiumType').value = policyInfo.premiumType || '';
    document.getElementById('app-coverType').value = policyInfo.coverType || '';
    document.getElementById('app-ploicyPlan').value = policyInfo.policyPlan || '';
    document.getElementById('app-sumInusred').value = policyInfo.sumInsured || '';
    document.getElementById('app-plicyTenure').value = policyInfo.policyTenure || '';
}

// Populate Personal Information section
function populatePersonalInfo(personalInfo) {
    document.getElementById('app-fullName').value = personalInfo.fullName || '';
    
    if (personalInfo.dateOfBirth) {
        document.getElementById('app-dateOfBirth').value = formatDateForInput(personalInfo.dateOfBirth);
    }
    
    document.getElementById('app-age').value = personalInfo.age || '';
    document.getElementById('app-gender').value = personalInfo.gender || '';
    document.getElementById('app-relationship').value = personalInfo.relationship || '';
    document.getElementById('app-email').value = personalInfo.email || '';
    document.getElementById('app-phone').value = personalInfo.phone || '';
}

// Populate Health Information section
function populateHealthInfo(healthInfo) {
    document.getElementById('app-height').value = healthInfo.height || '';
    document.getElementById('app-weight').value = healthInfo.weight || '';
    document.getElementById('app-bmi').value = healthInfo.bmi || '';
    document.getElementById('app-bloodGroup').value = healthInfo.bloodGroup || '';
    
    // Reset all checkboxes first
    const conditionCheckboxes = document.querySelectorAll('input[name="app-conditions"]');
    conditionCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Check the appropriate checkboxes based on preExistingConditions
    if (healthInfo.preExistingConditions && healthInfo.preExistingConditions.length > 0) {
        healthInfo.preExistingConditions.forEach(condition => {
            const checkbox = document.querySelector(`input[name="app-conditions"][value="${condition}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
}

// Populate Address Information section
function populateAddressInfo(addressInfo) {
    // Communication Address
    const commAddress = addressInfo.communicationAddress;
    if (commAddress) {
        document.getElementById('app-commLineOfAddress').value = commAddress.lineOfAddress || '';
        document.getElementById('app-commPinCode').value = commAddress.pinCode || '';
        document.getElementById('app-commCountry').value = commAddress.country || '';
        
        // Need to populate state dropdown first
        populateStateDropdown('app-commCountry', 'app-commState', commAddress.state);
        document.getElementById('app-commCity').value = commAddress.city || '';
    }
    
    // Permanent Address
    const permAddress = addressInfo.permanentAddress;
    if (permAddress) {
        // Check if same as communication address
        const sameAsCommCheckbox = document.getElementById('app-sameAsComm');
        sameAsCommCheckbox.checked = permAddress.sameAsCommunication || false;
        
        // If same as communication, hide the permanent address fields
        if (permAddress.sameAsCommunication) {
            document.getElementById('app-presentAddressFields').style.display = 'none';
        } else {
            document.getElementById('app-presentAddressFields').style.display = 'flex';
            document.getElementById('app-presentLineOfAddress').value = permAddress.lineOfAddress || '';
            document.getElementById('app-presentPinCode').value = permAddress.pinCode || '';
            document.getElementById('app-presentCountry').value = permAddress.country || '';
            
            // Need to populate state dropdown first
            populateStateDropdown('app-presentCountry', 'app-presentState', permAddress.state);
            document.getElementById('app-presentCity').value = permAddress.city || '';
        }
    }
}

// Helper function to populate state dropdown based on selected country
function populateStateDropdown(countryId, stateId, selectedState) {
    const country = document.getElementById(countryId).value;
    const stateDropdown = document.getElementById(stateId);
    
    // Clear existing options
    stateDropdown.innerHTML = '<option value="">Select State</option>';
    
    // This is a simplified example - in a real application, you'd have a more comprehensive list of states
    if (country === 'India') {
        const indianStates = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
            'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
            'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
            'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
        ];
        
        indianStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateDropdown.appendChild(option);
        });
    } else if (country === 'United States') {
        const usStates = [
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
            'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
            'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
            'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
            'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
            'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
            'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
            'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
            'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
            'West Virginia', 'Wisconsin', 'Wyoming'
        ];
        
        usStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateDropdown.appendChild(option);
        });
    }
    
    // Set the selected state if provided
    if (selectedState) {
        stateDropdown.value = selectedState;
    }
}

// Populate Premium details section
function populatePremiumDetails(data) {
    const basePremium = data.premiumAmount || 0;
    const taxRate = 0.18; // 18% GST
    const taxAmount = basePremium * taxRate;
    const totalPremium = basePremium + taxAmount;
    
    document.getElementById('base-premium').textContent = `₹${basePremium.toFixed(2)}`;
    document.getElementById('premium-tax').textContent = `₹${taxAmount.toFixed(2)}`;
    document.getElementById('total-premium').textContent = `₹${totalPremium.toFixed(2)}`;
}

// Generate application summary


// Helper function to format dates for display (DD/MM/YYYY)
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

// Helper function to format dates for input fields (YYYY-MM-DD)
function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
}

// Add event listener for "Same as Communication Address" checkbox
document.getElementById('app-sameAsComm').addEventListener('change', function() {
    const permanentAddressFields = document.getElementById('app-presentAddressFields');
    if (this.checked) {
        permanentAddressFields.style.display = 'none';
        
        // Copy values from communication address to permanent address
        document.getElementById('app-presentLineOfAddress').value = document.getElementById('app-commLineOfAddress').value;
        document.getElementById('app-presentPinCode').value = document.getElementById('app-commPinCode').value;
        document.getElementById('app-presentCountry').value = document.getElementById('app-commCountry').value;
        document.getElementById('app-presentState').value = document.getElementById('app-commState').value;
        document.getElementById('app-presentCity').value = document.getElementById('app-commCity').value;
    } else {
        permanentAddressFields.style.display = 'flex';
    }
});

// Add event listener for Calculate Premium button
document.getElementById('calculate-premium-btn').addEventListener('click', function() {
    // This would normally involve an API call to calculate the premium
    // For demo purposes, we'll just display the premium from the data
    alert('Premium calculation complete. See premium details below.');
});

// Calculate BMI when height or weight changes
document.getElementById('app-height').addEventListener('input', calculateBMI);
document.getElementById('app-weight').addEventListener('input', calculateBMI);

function calculateBMI() {
    const height = parseFloat(document.getElementById('app-height').value) / 100; // Convert cm to m
    const weight = parseFloat(document.getElementById('app-weight').value);
    
    if (height && weight) {
        const bmi = weight / (height * height);
        document.getElementById('app-bmi').value = bmi.toFixed(2);
    } else {
        document.getElementById('app-bmi').value = '';
    }
}

// Calculate age when date of birth changes
document.getElementById('app-dateOfBirth').addEventListener('change', calculateAge);

function calculateAge() {
    const dobInput = document.getElementById('app-dateOfBirth').value;
    if (dobInput) {
        const dob = new Date(dobInput);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        
        // Adjust age if birthday hasn't occurred yet this year
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        document.getElementById('app-age').value = age;
    } else {
        document.getElementById('app-age').value = '';
    }
}

// Initialize form navigation
initializeFormNavigation();

function initializeFormNavigation() {
    const saveButtons = document.querySelectorAll('.app-save-continue');
    const formSections = document.querySelectorAll('.application-form');
    
    saveButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Hide current form
            formSections[index].classList.remove('active');
            
            // Show next form (if not the last one)
            if (index < formSections.length - 1) {
                formSections[index + 1].classList.add('active');
            }
        });
    });
}