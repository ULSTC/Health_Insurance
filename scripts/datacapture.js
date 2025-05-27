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
    // populateHealthInfo(data.healthInfo);
    
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
// Populate Personal Information section
function populatePersonalInfo(personalInfo) {
    // Clear existing personal info section
    const personalInfoContainer = document.getElementById('personal-info-container') || document.querySelector('.personal-info-section');
    
    if (!personalInfoContainer) {
        console.error('Personal info container not found');
        return;
    }
    
    // Clear existing content
    personalInfoContainer.innerHTML = '';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Personal Information';
    header.className = 'section-header';
    personalInfoContainer.appendChild(header);
    
    // Loop through each person in personalInfo array
    personalInfo.forEach((person, index) => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'family-member-section';
        memberDiv.style.cssText = `
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
            position: relative;
        `;
        
        // Determine member title
        const memberTitle = index === 0 ? 'Personal Information - Primary Member' : `Family Member ${index + 1}`;
        
        // Create member HTML structure
        memberDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h4 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">${memberTitle}</h4>
                ${index > 0 ? '<button type="button" class="remove-member-btn" style="background-color: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">Remove Member</button>' : ''}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Full Name</label>
                    <input type="text" value="${person.fullName || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f8f9fa;"
                           readonly>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Date of Birth</label>
                    <input type="date" value="${formatDateForInput(person.dateOfBirth)}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f8f9fa;"
                           readonly>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Age</label>
                    <input type="number" value="${person.age || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f8f9fa;"
                           readonly>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Gender</label>
                    <select style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f8f9fa;" disabled>
                        <option value="">Select Gender</option>
                        <option value="male" ${person.gender === 'male' ? 'selected' : ''}>Male</option>
                        <option value="female" ${person.gender === 'female' ? 'selected' : ''}>Female</option>
                        <option value="other" ${person.gender === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Relationship</label>
                    <select style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f8f9fa;" disabled>
                        <option value="">Select Relationship</option>
                        <option value="self" ${person.relationship === 'self' ? 'selected' : ''}>Self</option>
                        <option value="spouse" ${person.relationship === 'spouse' ? 'selected' : ''}>Spouse</option>
                        <option value="parent" ${person.relationship === 'parent' ? 'selected' : ''}>Parent</option>
                        <option value="child" ${person.relationship === 'child' ? 'selected' : ''}>Child</option>
                        <option value="sibling" ${person.relationship === 'sibling' ? 'selected' : ''}>Sibling</option>
                    </select>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Email</label>
                    <input type="email" value="${person.email || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f8f9fa;"
                           readonly>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Phone Number</label>
                    <input type="tel" value="${person.phone || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f8f9fa;"
                           readonly>
                </div>
            </div>
        `;
        
        personalInfoContainer.appendChild(memberDiv);
        
        // Add event listener for remove button (if it exists)
        if (index > 0) {
            const removeBtn = memberDiv.querySelector('.remove-member-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    memberDiv.remove();
                });
            }
        }
    });
}

// Alternative version if you want to populate existing form fields instead of creating new ones
function populatePersonalInfoAlternative(personalInfo) {
    // Find the primary member (relationship === 'self' or first member)
    const primaryMember = personalInfo.find(person => person.relationship === 'self') || personalInfo[0];
    
    if (primaryMember) {
        // Populate existing form fields for primary member
        if (document.getElementById('app-fullName')) {
            document.getElementById('app-fullName').value = primaryMember.fullName || '';
        }
        
        if (document.getElementById('app-dateOfBirth') && primaryMember.dateOfBirth) {
            document.getElementById('app-dateOfBirth').value = formatDateForInput(primaryMember.dateOfBirth);
        }
        
        if (document.getElementById('app-age')) {
            document.getElementById('app-age').value = primaryMember.age || '';
        }
        
        if (document.getElementById('app-gender')) {
            document.getElementById('app-gender').value = primaryMember.gender || '';
        }
        
        if (document.getElementById('app-relationship')) {
            document.getElementById('app-relationship').value = primaryMember.relationship || '';
        }
        
        if (document.getElementById('app-email')) {
            document.getElementById('app-email').value = primaryMember.email || '';
        }
        
        if (document.getElementById('app-phone')) {
            document.getElementById('app-phone').value = primaryMember.phone || '';
        }
    }
    
    // Display all family members including primary
    displayAllFamilyMembers(personalInfo);
}

function displayAllFamilyMembers(personalInfo) {
    // Find or create a container for all family members
    let familyMembersContainer = document.getElementById('family-members-display');
    
    if (!familyMembersContainer) {
        // Create container after the existing personal info form
        const personalInfoSection = document.querySelector('.personal-info-form') || document.querySelector('[data-section="personal"]');
        if (personalInfoSection) {
            familyMembersContainer = document.createElement('div');
            familyMembersContainer.id = 'family-members-display';
            familyMembersContainer.style.cssText = 'margin-top: 30px; padding: 20px; border-top: 2px solid #e0e0e0;';
            personalInfoSection.appendChild(familyMembersContainer);
        } else {
            console.error('Could not find personal info section to append family members');
            return;
        }
    }
    
    // Clear existing content
    familyMembersContainer.innerHTML = '';
    
    // Add header
    const header = document.createElement('h3');
    header.textContent = 'Family Members Overview';
    header.style.cssText = 'margin-bottom: 20px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
    familyMembersContainer.appendChild(header);
    
    // Display each family member
    personalInfo.forEach((person, index) => {
        const memberCard = document.createElement('div');
        memberCard.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            background: linear-gradient(145deg, #ffffff, #f8f9fa);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        const memberTitle = person.relationship === 'self' ? 'Primary Member' : `Family Member ${index}`;
        
        memberCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0; color: #007bff; font-size: 16px;">${memberTitle}</h4>
                <span style="background-color: #007bff; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: capitalize;">
                    ${person.relationship}
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div>
                    <strong style="color: #555;">Name:</strong><br>
                    <span style="color: #333;">${person.fullName || 'N/A'}</span>
                </div>
                <div>
                    <strong style="color: #555;">Date of Birth:</strong><br>
                    <span style="color: #333;">${formatDate(person.dateOfBirth) || 'N/A'}</span>
                </div>
                <div>
                    <strong style="color: #555;">Age:</strong><br>
                    <span style="color: #333;">${person.age || 'N/A'}</span>
                </div>
                <div>
                    <strong style="color: #555;">Gender:</strong><br>
                    <span style="color: #333; text-transform: capitalize;">${person.gender || 'N/A'}</span>
                </div>
                <div>
                    <strong style="color: #555;">Email:</strong><br>
                    <span style="color: #333;">${person.email || 'N/A'}</span>
                </div>
                <div>
                    <strong style="color: #555;">Phone:</strong><br>
                    <span style="color: #333;">${person.phone || 'N/A'}</span>
                </div>
            </div>
        `;
        
        familyMembersContainer.appendChild(memberCard);
    });
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
        
        // Always display permanent address fields, regardless of checkbox status
        document.getElementById('app-presentAddressFields').style.display = 'flex';
        
        if (permAddress.sameAsCommunication) {
            // Copy values from communication address to permanent address
            document.getElementById('app-presentLineOfAddress').value = commAddress.lineOfAddress || '';
            document.getElementById('app-presentPinCode').value = commAddress.pinCode || '';
            document.getElementById('app-presentCountry').value = commAddress.country || '';
            
            // Need to populate state dropdown first
            populateStateDropdown('app-presentCountry', 'app-presentState', commAddress.state);
            document.getElementById('app-presentCity').value = commAddress.city || '';
        } else {
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
    // Always keep the permanent address fields visible
    const permanentAddressFields = document.getElementById('app-presentAddressFields');
    permanentAddressFields.style.display = 'flex';
    
    if (this.checked) {
        // Copy values from communication address to permanent address
        document.getElementById('app-presentLineOfAddress').value = document.getElementById('app-commLineOfAddress').value;
        document.getElementById('app-presentPinCode').value = document.getElementById('app-commPinCode').value;
        document.getElementById('app-presentCountry').value = document.getElementById('app-commCountry').value;
        
        // Populate state dropdown for permanent address based on communication country
        populateStateDropdown('app-commCountry', 'app-presentState', document.getElementById('app-commState').value);
        document.getElementById('app-presentCity').value = document.getElementById('app-commCity').value;
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