// Function to fetch quote data when easyQuote input changes
document.getElementById('easyQuote').addEventListener('blur', async function() {
    const quoteCode = this.value.trim();
    if (quoteCode) {
        try {
            // Show loading state
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'loading-message';
            loadingMessage.textContent = 'Loading quote details...';
            this.parentNode.appendChild(loadingMessage);

            const response = await fetch(`http://localhost:5000/api/quote/code/${quoteCode}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Store the quote data in session storage for later use
                sessionStorage.setItem('quoteData', JSON.stringify(result.data));
                
                // Populate all form sections
                populateFormFields(result.data);
                
                // Enable the health info section in navigation
                const healthInfoNav = document.querySelector('[data-section="health-info"]');
                if (healthInfoNav) {
                    healthInfoNav.classList.remove('disabled');
                }
                
                console.log('Form populated successfully');
            } else {
                console.error('Failed to fetch quote data:', result);
                alert('Failed to fetch quote data. Please check the quote reference number.');
            }
        } catch (error) {
            console.error('Error fetching quote data:', error);
            alert('Error fetching quote data. Please try again.');
        } finally {
            // Remove loading message
            const loadingMessage = this.parentNode.querySelector('.loading-message');
            if (loadingMessage) {
                loadingMessage.remove();
            }
        }
    }
});

// Function to populate all form fields from API response
function populateFormFields(data) {
    // Store the data in session storage for later use
    sessionStorage.setItem('quoteData', JSON.stringify(data));
    
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
    // Get the personal info container
    const personalInfoContainer = document.getElementById('personal-info-app-form');
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

    // Create container for all members
    const membersContainer = document.createElement('div');
    membersContainer.className = 'members-container';
    membersContainer.style.cssText = 'margin-top: 20px;';
    personalInfoContainer.appendChild(membersContainer);
    
    // Loop through each person in personalInfo array
    personalInfo.forEach((person, index) => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'family-member-section';
        memberDiv.dataset.memberIndex = index; // Add data attribute for member index
        memberDiv.style.cssText = `
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
            position: relative;
        `;
        
        // Determine member title
        const memberTitle = index === 0 ? 'Primary Member' : `Family Member ${index + 1}`;
        
        // Create member HTML structure
        memberDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h4 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">${memberTitle}</h4>
                ${index > 0 ? '<button type="button" class="remove-member-btn" style="background-color: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">Remove Member</button>' : ''}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Full Name</label>
                    <input type="text" id="app-fullName-${index}" value="${person.fullName || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                           required>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Date of Birth</label>
                    <input type="date" id="app-dateOfBirth-${index}" value="${formatDateForInput(person.dateOfBirth)}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                           required>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Age</label>
                    <input type="number" id="app-age-${index}" value="${person.age || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                           readonly>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Gender</label>
                    <select id="app-gender-${index}" 
                            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                            required>
                        <option value="">Select Gender</option>
                        <option value="male" ${person.gender === 'male' ? 'selected' : ''}>Male</option>
                        <option value="female" ${person.gender === 'female' ? 'selected' : ''}>Female</option>
                        <option value="other" ${person.gender === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Relationship</label>
                    <select id="app-relationship-${index}" 
                            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                            required>
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
                    <input type="email" id="app-email-${index}" value="${person.email || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                           required>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Phone Number</label>
                    <input type="tel" id="app-phone-${index}" value="${person.phone || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                           required>
                </div>
            </div>
        `;
        
        membersContainer.appendChild(memberDiv);
        
        // Add event listeners for age calculation
        const dobInput = memberDiv.querySelector(`#app-dateOfBirth-${index}`);
        const ageInput = memberDiv.querySelector(`#app-age-${index}`);
        
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
        
        // Add event listener for remove button (if it exists)
        if (index > 0) {
            const removeBtn = memberDiv.querySelector('.remove-member-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    // Get the member index from the data attribute
                    const memberIndex = parseInt(memberDiv.dataset.memberIndex);
                    
                    // Remove the member section
                    memberDiv.remove();
                    
                    // Update the quote data in session storage
                    const quoteData = JSON.parse(sessionStorage.getItem('quoteData') || '{}');
                    
                    // Remove from personal info
                    if (quoteData.personalInfo) {
                        quoteData.personalInfo.splice(memberIndex, 1);
                    }
                    
                    // Remove from health info
                    if (quoteData.healthInfo) {
                        quoteData.healthInfo.splice(memberIndex, 1);
                    }
                    
                    // Update session storage
                    sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
                    
                    // Update member indices for remaining members
                    const remainingMembers = membersContainer.querySelectorAll('.family-member-section');
                    remainingMembers.forEach((member, newIndex) => {
                        member.dataset.memberIndex = newIndex;
                        // Update all input IDs to match new index
                        member.querySelectorAll('input, select').forEach(input => {
                            const oldId = input.id;
                            if (oldId) {
                                const newId = oldId.replace(/-\d+$/, `-${newIndex}`);
                                input.id = newId;
                            }
                        });
                    });
                    
                    // Refresh health info section
                    populateHealthInfo(quoteData.healthInfo || []);
                });
            }
        }
    });

    // Add form actions with Save and Continue button
    const formActions = document.createElement('div');
    formActions.className = 'form-actions';
    formActions.innerHTML = `
        <button type="button" class="btn-primary app-save-continue">Save & Continue</button>
    `;
    personalInfoContainer.appendChild(formActions);

    // Add event listener for Save and Continue button
    const saveButton = formActions.querySelector('.app-save-continue');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Save the current form data
            const formData = {
                personalInfo: []
            };

            // Get all member sections
            const memberSections = membersContainer.querySelectorAll('.family-member-section');
            memberSections.forEach((section, index) => {
                const memberData = {
                    fullName: section.querySelector(`#app-fullName-${index}`).value,
                    dateOfBirth: section.querySelector(`#app-dateOfBirth-${index}`).value,
                    age: section.querySelector(`#app-age-${index}`).value,
                    gender: section.querySelector(`#app-gender-${index}`).value,
                    relationship: section.querySelector(`#app-relationship-${index}`).value,
                    email: section.querySelector(`#app-email-${index}`).value,
                    phone: section.querySelector(`#app-phone-${index}`).value
                };
                formData.personalInfo.push(memberData);
            });

            // Update session storage
            const quoteData = JSON.parse(sessionStorage.getItem('quoteData') || '{}');
            quoteData.personalInfo = formData.personalInfo;
            sessionStorage.setItem('quoteData', JSON.stringify(quoteData));

            // Update section status in navigation
            const personalInfoNav = document.querySelector('[data-section="personal-info-app"]');
            if (personalInfoNav) {
                personalInfoNav.classList.remove('active');
                personalInfoNav.classList.add('completed');
            }

            // Navigate to next section
            const currentSection = document.querySelector('.application-form.active');
            if (currentSection) {
                currentSection.classList.remove('active');
                const nextSection = currentSection.nextElementSibling;
                if (nextSection && nextSection.classList.contains('application-form')) {
                    nextSection.classList.add('active');
                    // Update next section's nav item
                    const nextSectionId = nextSection.id;
                    const nextNavItem = document.querySelector(`[data-section="${nextSectionId.replace('-app-form', '')}"]`);
                    if (nextNavItem) {
                        nextNavItem.classList.add('active');
                    }
                }
            }
        });
    }
}

// Populate Health Information section
function populateHealthInfo(healthInfo) {
    // Get the health info container
    const healthInfoContainer = document.getElementById('health-info-app-form');
    if (!healthInfoContainer) {
        console.error('Health info container not found');
            return;
    }
    
    // Clear existing content
    healthInfoContainer.innerHTML = '';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Health Information';
    header.className = 'section-header';
    healthInfoContainer.appendChild(header);

    // Get personal info from session storage
    const quoteData = JSON.parse(sessionStorage.getItem('quoteData'));
    if (!quoteData || !quoteData.personalInfo) {
        console.error('No personal info found in session storage');
        return;
    }

    // Create health section for each family member
    quoteData.personalInfo.forEach((person, index) => {
        const memberHealthInfo = healthInfo?.[index] || {};
        const memberSection = createMemberHealthSection(index + 1, person, memberHealthInfo);
        healthInfoContainer.appendChild(memberSection);
    });

    // Add form actions with Save and Continue button
    const formActions = document.createElement('div');
    formActions.className = 'form-actions';
    formActions.innerHTML = `
        <button type="button" class="btn-primary app-save-continue">Save & Continue</button>
    `;
    healthInfoContainer.appendChild(formActions);

    // Add event listener for Save and Continue button
    const saveButton = formActions.querySelector('.app-save-continue');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Save the current form data
            const formData = {
                healthInfo: []
            };

            // Get all member sections
            const memberSections = healthInfoContainer.querySelectorAll('.member-health-section');
            memberSections.forEach((section, index) => {
                const memberData = {
                    height: section.querySelector(`#height-${index + 1}`).value,
                    weight: section.querySelector(`#weight-${index + 1}`).value,
                    bmi: section.querySelector(`#bmi-${index + 1}`).value,
                    bloodGroup: section.querySelector(`#bloodGroup-${index + 1}`).value,
                    preExistingConditions: Array.from(section.querySelectorAll(`input[name="conditions-${index + 1}"]:checked`))
                        .map(checkbox => checkbox.value)
                };
                formData.healthInfo.push(memberData);
            });

            // Update session storage
            const quoteData = JSON.parse(sessionStorage.getItem('quoteData') || '{}');
            quoteData.healthInfo = formData.healthInfo;
            sessionStorage.setItem('quoteData', JSON.stringify(quoteData));

            // Update section status in navigation
            const healthInfoNav = document.querySelector('[data-section="health-info-app"]');
            if (healthInfoNav) {
                healthInfoNav.classList.remove('active');
                healthInfoNav.classList.add('completed');
            }

            // Navigate to next section
            const currentSection = document.querySelector('.application-form.active');
            if (currentSection) {
                currentSection.classList.remove('active');
                const nextSection = currentSection.nextElementSibling;
                if (nextSection && nextSection.classList.contains('application-form')) {
                    nextSection.classList.add('active');
                    // Update next section's nav item
                    const nextSectionId = nextSection.id;
                    const nextNavItem = document.querySelector(`[data-section="${nextSectionId.replace('-app-form', '')}"]`);
                    if (nextNavItem) {
                        nextNavItem.classList.add('active');
                    }
                }
            }
        });
    }
}

function createMemberHealthSection(memberIndex, person, healthInfo) {
    const section = document.createElement('div');
    section.className = 'member-health-section';
    section.style.cssText = `
        border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
        margin-bottom: 20px;
        background-color: #f9f9f9;
    `;

    // Create member title
    const memberTitle = memberIndex === 1 ? 'Primary Member' : `Family Member ${memberIndex}`;
    
    section.innerHTML = `
        <h4 style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;">
            Health Information - ${person.fullName} (${memberTitle})
        </h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Height (cm)</label>
                <input type="number" id="height-${memberIndex}" value="${healthInfo.height || ''}" 
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                       required>
            </div>
                <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Weight (kg)</label>
                <input type="number" id="weight-${memberIndex}" value="${healthInfo.weight || ''}" 
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                       required>
                </div>
                <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">BMI</label>
                <input type="text" id="bmi-${memberIndex}" value="${healthInfo.bmi || ''}" 
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f8f9fa;"
                       readonly>
                </div>
                </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Blood Group</label>
                <select id="bloodGroup-${memberIndex}" 
                        style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                        required>
                    <option value="">Select Blood Group</option>
                    <option value="A+" ${healthInfo.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                    <option value="A-" ${healthInfo.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                    <option value="B+" ${healthInfo.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                    <option value="B-" ${healthInfo.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                    <option value="O+" ${healthInfo.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                    <option value="O-" ${healthInfo.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                    <option value="AB+" ${healthInfo.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                    <option value="AB-" ${healthInfo.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                </select>
                </div>
                <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Pre-existing Conditions</label>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" name="conditions-${memberIndex}" value="diabetes" 
                               ${(healthInfo.preExistingConditions || []).includes('diabetes') ? 'checked' : ''}>
                        Diabetes
                    </label>
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" name="conditions-${memberIndex}" value="hypertension"
                               ${(healthInfo.preExistingConditions || []).includes('hypertension') ? 'checked' : ''}>
                        Hypertension
                    </label>
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" name="conditions-${memberIndex}" value="heart-disease"
                               ${(healthInfo.preExistingConditions || []).includes('heart-disease') ? 'checked' : ''}>
                        Heart Disease
                    </label>
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" name="conditions-${memberIndex}" value="asthma"
                               ${(healthInfo.preExistingConditions || []).includes('asthma') ? 'checked' : ''}>
                        Asthma
                    </label>
                </div>
                </div>
            </div>
        `;
        
    // Add event listeners for BMI calculation
    const heightInput = section.querySelector(`#height-${memberIndex}`);
    const weightInput = section.querySelector(`#weight-${memberIndex}`);
    const bmiInput = section.querySelector(`#bmi-${memberIndex}`);

    function calculateBMI() {
        const height = parseFloat(heightInput.value) / 100; // Convert cm to m
        const weight = parseFloat(weightInput.value);
        
        if (height && weight) {
            const bmi = weight / (height * height);
            bmiInput.value = bmi.toFixed(2);
        }
    }

    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);

    return section;
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
            populateStateDropdown('app-commCountry', 'app-presentState', commAddress.state);
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
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
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
function initializeFormNavigation() {
    const formSections = document.querySelectorAll('.application-form');
    
    // Remove any existing event listeners
    const existingButtons = document.querySelectorAll('.app-save-continue');
    existingButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    
    // Add event listeners to all Save and Continue buttons
    document.querySelectorAll('.app-save-continue').forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.closest('.application-form');
            if (!currentSection) return;
            
            // Save the current section's data
            const sectionId = currentSection.id;
            if (sectionId === 'personal-info-app-form') {
                savePersonalInfo();
            } else if (sectionId === 'health-info-app-form') {
                saveHealthInfo();
            }
            
            // Update navigation
            const currentNav = document.querySelector(`[data-section="${sectionId.replace('-app-form', '')}"]`);
            if (currentNav) {
                currentNav.classList.remove('active');
                currentNav.classList.add('completed');
            }
            
            // Move to next section
            currentSection.classList.remove('active');
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && nextSection.classList.contains('application-form')) {
                nextSection.classList.add('active');
                const nextSectionId = nextSection.id;
                const nextNavItem = document.querySelector(`[data-section="${nextSectionId.replace('-app-form', '')}"]`);
                if (nextNavItem) {
                    nextNavItem.classList.add('active');
                }
            }
        });
    });
}

function savePersonalInfo() {
    const formData = {
        personalInfo: []
    };

    const memberSections = document.querySelectorAll('.family-member-section');
    memberSections.forEach((section, index) => {
        const memberData = {
            fullName: section.querySelector(`#app-fullName-${index}`).value,
            dateOfBirth: section.querySelector(`#app-dateOfBirth-${index}`).value,
            age: section.querySelector(`#app-age-${index}`).value,
            gender: section.querySelector(`#app-gender-${index}`).value,
            relationship: section.querySelector(`#app-relationship-${index}`).value,
            email: section.querySelector(`#app-email-${index}`).value,
            phone: section.querySelector(`#app-phone-${index}`).value
        };
        formData.personalInfo.push(memberData);
    });

    const quoteData = JSON.parse(sessionStorage.getItem('quoteData') || '{}');
    quoteData.personalInfo = formData.personalInfo;
    sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
}

function saveHealthInfo() {
    const formData = {
        healthInfo: []
    };

    const memberSections = document.querySelectorAll('.member-health-section');
    memberSections.forEach((section, index) => {
        const memberData = {
            height: section.querySelector(`#height-${index + 1}`).value,
            weight: section.querySelector(`#weight-${index + 1}`).value,
            bmi: section.querySelector(`#bmi-${index + 1}`).value,
            bloodGroup: section.querySelector(`#bloodGroup-${index + 1}`).value,
            preExistingConditions: Array.from(section.querySelectorAll(`input[name="conditions-${index + 1}"]:checked`))
                .map(checkbox => checkbox.value)
        };
        formData.healthInfo.push(memberData);
    });

    const quoteData = JSON.parse(sessionStorage.getItem('quoteData') || '{}');
    quoteData.healthInfo = formData.healthInfo;
    sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
}