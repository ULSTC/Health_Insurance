document.addEventListener('DOMContentLoaded', function () {
    const sameAddressCheckbox = document.getElementById('sameAsComm');

    // Fields from Communication Address
    const commLineOfAddress = document.getElementById('commLineOfAddress');
    const commPinCode = document.getElementById('commPinCode');
    const commCountry = document.getElementById('commCountry');
    const commState = document.getElementById('commState');
    const commCity = document.getElementById('commCity');

    // Fields from Present Address
    const presentLineOfAddress = document.getElementById('presentLineOfAddress');
    const presentPinCode = document.getElementById('presentPinCode');
    const presentCountry = document.getElementById('presentCountry');
    const presentState = document.getElementById('presentState');
    const presentCity = document.getElementById('presentCity');

    // Setup country-state mappings
    setupCountryStateMappings();

    // Setup PIN code dropdowns
    setupPinCodeDropdowns();

    populateStates('pol');

    // Add change event listeners to country dropdowns
    commCountry.addEventListener('change', function () {
        populateStates('comm');
    });

    presentCountry.addEventListener('change', function () {
        populateStates('present');
    });

    // Autopopulate present address fields when checkbox is checked
    sameAddressCheckbox.addEventListener('change', function () {
        if (this.checked) {
            // Copy values from Communication Address to Present Address
            copyCommToPresentAddress();

            // Disable the present address fields
            document.querySelectorAll('#presentAddressFields input, #presentAddressFields select').forEach(input => {
                input.disabled = true;
            });
        } else {
            // Enable the present address fields
            document.querySelectorAll('#presentAddressFields input, #presentAddressFields select').forEach(input => {
                input.disabled = false;
            });
        }
    });

    // Update present address fields in real-time if checkbox is checked and comm address changes
    [commLineOfAddress, commPinCode, commCountry, commState, commCity].forEach(element => {
        element.addEventListener('input', function () {
            if (sameAddressCheckbox.checked) {
                copyCommToPresentAddress();
            }
        });

        element.addEventListener('change', function () {
            if (sameAddressCheckbox.checked) {
                copyCommToPresentAddress();
            }
        });
    });

    // Add click event listeners to document to close dropdowns when clicking outside
    document.addEventListener('click', function (event) {
        const commDropdown = document.getElementById('commPinCodeDropdown');
        const presentDropdown = document.getElementById('presentPinCodeDropdown');

        if (commDropdown && !event.target.closest('#commPinCode') && !event.target.closest('#commPinCodeDropdown')) {
            commDropdown.style.display = 'none';
        }

        if (presentDropdown && !event.target.closest('#presentPinCode') && !event.target.closest('#presentPinCodeDropdown')) {
            presentDropdown.style.display = 'none';
        }
    });

    function copyCommToPresentAddress() {
        presentLineOfAddress.value = commLineOfAddress.value;
        presentPinCode.value = commPinCode.value;
        presentCountry.value = commCountry.value;
        populateStates('present');
        presentState.value = commState.value;
        presentCity.value = commCity.value;
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
                saveButton.addEventListener('click', function () {
                    if (!validateFormSection(addressInfoForm)) {
                        return; // Stop if validation fails
                    }

                    var token = function generateUniqueToken(length = 16) {
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        let token = '';
                        for (let i = 0; i < length; i++) {
                            token += chars.charAt(Math.floor(Math.random() * chars.length));
                        }
                        return token;
                    }

                    const sumInsured = parseFloat(document.getElementById('sumInusred').value);
                    const tenure = parseFloat(document.getElementById('plicyTenure').value) || 1;
                    const coverType = document.getElementById('coverType').value;

                    // Calculate a dummy monthly premium (simple formula for demo)
                    const basePremium = sumInsured * 0.02 / 12; // 2% of sum insured annually, divided by 12 for monthly
                    const tenureFactor = 1 - (tenure > 1 ? 0.05 * (tenure - 1) : 0); // 5% discount per additional year

                    // For family floater, add additional premium based on number of members
                    let memberCount = 1; // Primary member
                    if (coverType === 'family') {
                        const familyMembers = document.querySelectorAll('.member-form');
                        memberCount += familyMembers.length;
                    }

                    const memberFactor = coverType === 'family' ? (1 + (memberCount - 1) * 0.15) : 1; // 15% additional premium per extra member
                    const premium = Math.round(basePremium * tenureFactor * memberFactor);

                    console.log('Calculated Premium:', premium, "tenureFactor", tenureFactor, "basePremium", basePremium, "sumInsured", sumInsured, "tenure", tenure, "memberCount", memberCount);

                    // Function to get personal info based on cover type
                    function getPersonalInfo() {
                        if (coverType === 'family') {
                            // For family floater, get all members data using the function from family floater script
                            if (typeof getPersonalInfoArray === 'function') {
                                return getPersonalInfoArray();
                            } else {
                                // Fallback: manually collect family member data
                                const personalInfoArray = [];

                                // Add primary member
                                personalInfoArray.push({
                                    fullName: document.getElementById('fullName').value,
                                    dateOfBirth: document.getElementById('dateOfBirth').value + "T00:00:00.000Z",
                                    age: parseInt(document.getElementById('age').value),
                                    gender: document.getElementById('gender').value,
                                    relationship: 'self',
                                    email: document.getElementById('email').value,
                                    phone: document.getElementById('phone').value,
                                    memberType: 'primary'
                                });

                                // Add family members
                                const memberForms = document.querySelectorAll('.member-form');
                                memberForms.forEach((form, index) => {
                                    const memberNumber = index + 2;
                                    personalInfoArray.push({
                                        fullName: document.getElementById(`fullName_${memberNumber}`)?.value || '',
                                        dateOfBirth: document.getElementById(`dateOfBirth_${memberNumber}`)?.value + "T00:00:00.000Z",
                                        age: parseInt(document.getElementById(`age_${memberNumber}`)?.value) || 0,
                                        gender: document.getElementById(`gender_${memberNumber}`)?.value || '',
                                        relationship: document.getElementById(`relationship_${memberNumber}`)?.value || '',
                                        email: document.getElementById(`email_${memberNumber}`)?.value || '',
                                        phone: document.getElementById(`phone_${memberNumber}`)?.value || '',
                                        memberType: 'family'
                                    });
                                });

                                return personalInfoArray;
                            }
                        } else {
                            // For individual cover, return single object in array format
                            return [{
                                fullName: document.getElementById('fullName').value,
                                dateOfBirth: document.getElementById('dateOfBirth').value + "T00:00:00.000Z",
                                age: parseInt(document.getElementById('age').value),
                                gender: document.getElementById('gender').value,
                                relationship: 'self',
                                email: document.getElementById('email').value,
                                phone: document.getElementById('phone').value,
                                memberType: 'primary'
                            }];
                        }
                    }

                    // Validate personal info before proceeding
                    const personalInfoData = getPersonalInfo();
                    let hasValidationErrors = false;

                    // Basic validation for personal info
                    personalInfoData.forEach((member, index) => {
                        if (!member.fullName || !member.dateOfBirth || !member.gender || !member.email || !member.phone) {
                            console.error(`Missing required fields for member ${index + 1}`);
                            hasValidationErrors = true;
                        }

                        // Validate email format
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (member.email && !emailRegex.test(member.email)) {
                            console.error(`Invalid email format for member ${index + 1}: ${member.email}`);
                            hasValidationErrors = true;
                        }
                    });

                    // Check for primary member (self relationship)
                    const primaryMembers = personalInfoData.filter(member => member.relationship === 'self');
                    if (primaryMembers.length !== 1) {
                        console.error('Exactly one primary member (self) is required');
                        hasValidationErrors = true;
                    }

                    if (hasValidationErrors) {
                        alert('Please fill in all required fields correctly for all members.');
                        return;
                    }

                    // Create payload for API
                    const payload = {
                        token: token(),
                        businessInfo: {
                            country: document.getElementById('polCountry').value,
                            state: document.getElementById('polState').value,
                            city: document.getElementById('polCity').value,
                            lineOfBusiness: document.getElementById('lineOfBusiness').value,
                            typeOfBusiness: document.getElementById('typeOfBusiness').value,
                            policyStartDate: document.getElementById('policystartDate').value + "T00:00:00.000Z",
                            policyEndDate: document.getElementById('policyEndDate').value + "T00:00:00.000Z",
                            intermediaryCode: document.getElementById('IntermediaryCode').value,
                            intermediaryName: document.getElementById('IntermediaryName').value,
                            intermediaryEmail: document.getElementById('Intermediaryemail').value
                        },
                        policyInfo: {
                            premiumType: document.getElementById('premiumType').value,
                            coverType: coverType,
                            policyPlan: document.getElementById('ploicyPlan').value,
                            sumInsured: sumInsured,
                            policyTenure: tenure
                        },
                        personalInfo: personalInfoData, // Now this is always an array
                        addressInfo: {
                            communicationAddress: {
                                lineOfAddress: document.getElementById('commLineOfAddress').value,
                                pinCode: document.getElementById('commPinCode').value,
                                country: document.getElementById('commCountry').value,
                                state: document.getElementById('commState').value,
                                city: document.getElementById('commCity').value
                            },
                            permanentAddress: {
                                sameAsCommunication: document.getElementById('sameAsComm').checked,
                                lineOfAddress: document.getElementById('sameAsComm').checked ?
                                    document.getElementById('commLineOfAddress').value :
                                    document.getElementById('presentLineOfAddress').value,
                                pinCode: document.getElementById('sameAsComm').checked ?
                                    document.getElementById('commPinCode').value :
                                    document.getElementById('presentPinCode').value,
                                country: document.getElementById('sameAsComm').checked ?
                                    document.getElementById('commCountry').value :
                                    document.getElementById('presentCountry').value,
                                state: document.getElementById('sameAsComm').checked ?
                                    document.getElementById('commState').value :
                                    document.getElementById('presentState').value,
                                city: document.getElementById('sameAsComm').checked ?
                                    document.getElementById('commCity').value :
                                    document.getElementById('presentCity').value
                            }
                        },
                        status: "draft",
                        premiumAmount: premium,
                        memberCount: memberCount // Adding member count for reference
                    };

                    console.log('Payload:', payload);
                    console.log('Personal Info Array:', personalInfoData);

                    // Show loading state
                    saveButton.disabled = true;
                    saveButton.textContent = 'Submitting...';

                    // Make API request
                    fetch('http://localhost:5000/api/quote/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Response:', data);
                            console.log("aa raha hai response to bhai");
                            // Reset button state
                            saveButton.disabled = false;
                            saveButton.textContent = 'Save and Finalize';

                            if (data.success) {
                                // Store quote code in session storage for reference in the data capture page
                                sessionStorage.setItem('quoteCode', data.data.quoteCode);
                                sessionStorage.setItem('premiumAmount', data.data.premiumAmount);
                                sessionStorage.setItem('quoteData', JSON.stringify(data.data));
                                sessionStorage.setItem('memberCount', memberCount.toString());
                                const quoteCode = data.data.quoteCode;

                                // Show brief success message before redirecting
                                const successMessage = document.createElement('div');
                                successMessage.className = 'success-message';
                                successMessage.innerHTML = `
                    <h3>Your application has been submitted successfully!</h3>
                    <p>Reference number: <strong>${quoteCode}</strong></p>
                    <p>Members covered: <strong>${memberCount}</strong></p>
                    <p>Premium amount: <strong>₹${premium.toLocaleString()}</strong></p>
                `;

                                // Remove existing success message if any
                                const existingMessage = addressInfoForm.querySelector('.success-message');
                                if (existingMessage) {
                                    existingMessage.remove();
                                }

                                // Add success message before form actions
                                addressInfoForm.insertBefore(successMessage, existingButtons);

                                // Redirect after a short delay (1.5 seconds)

                            } else {
                                // Show error message
                                const errorMessage = document.createElement('div');
                                errorMessage.className = 'error-message';
                                errorMessage.textContent = data.message || 'An error occurred while submitting your application';

                                // Remove existing error message if any
                                const existingError = addressInfoForm.querySelector('.error-message');
                                if (existingError) {
                                    existingError.remove();
                                }

                                // Add error message before form actions
                                addressInfoForm.insertBefore(errorMessage, existingButtons);
                            }
                        })
                        .catch(error => {
                            // Reset button state
                            saveButton.disabled = false;
                            saveButton.textContent = 'Save and Finalize';

                            // Show error message
                            const errorMessage = document.createElement('div');
                            errorMessage.className = 'error-message';
                            errorMessage.textContent = 'Network error occurred. Please try again.';

                            // Remove existing error message if any
                            const existingError = addressInfoForm.querySelector('.error-message');
                            if (existingError) {
                                existingError.remove();
                            }

                            // Add error message before form actions
                            addressInfoForm.insertBefore(errorMessage, existingButtons);

                            console.error('Error:', error);
                        });
                });
            }
        }
    }
});

// Map of country to states
const countryStates = {
    'India': ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'],
    'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    'United Kingdom': ['England', 'Northern Ireland', 'Scotland', 'Wales'],
    'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
    'Australia': ['Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia']
};

// PIN code database with extended information
const pinCodeDatabase = {
    // Indian PIN codes
    '110001': { country: 'India', state: 'Delhi', city: 'New Delhi', area: 'Connaught Place' },
    '110002': { country: 'India', state: 'Delhi', city: 'New Delhi', area: 'Darya Ganj' },
    '110003': { country: 'India', state: 'Delhi', city: 'New Delhi', area: 'Adarsh Nagar' },
    '400001': { country: 'India', state: 'Maharashtra', city: 'Mumbai', area: 'Fort' },
    '400002': { country: 'India', state: 'Maharashtra', city: 'Mumbai', area: 'Mandvi' },
    '400003': { country: 'India', state: 'Maharashtra', city: 'Mumbai', area: 'Colaba' },
    '560001': { country: 'India', state: 'Karnataka', city: 'Bangalore', area: 'MG Road' },
    '560002': { country: 'India', state: 'Karnataka', city: 'Bangalore', area: 'Commercial Street' },
    '600001': { country: 'India', state: 'Tamil Nadu', city: 'Chennai', area: 'Parrys' },
    '700001': { country: 'India', state: 'West Bengal', city: 'Kolkata', area: 'BBD Bagh' },

    // US ZIP codes
    '10001': { country: 'United States', state: 'New York', city: 'New York', area: 'Manhattan' },
    '10002': { country: 'United States', state: 'New York', city: 'New York', area: 'Lower East Side' },
    '90001': { country: 'United States', state: 'California', city: 'Los Angeles', area: 'Florence' },
    '90002': { country: 'United States', state: 'California', city: 'Los Angeles', area: 'Watts' },
    '60601': { country: 'United States', state: 'Illinois', city: 'Chicago', area: 'Loop' },
    '77001': { country: 'United States', state: 'Texas', city: 'Houston', area: 'Downtown' },

    // UK postcodes
    'SW1A': { country: 'United Kingdom', state: 'England', city: 'London', area: 'Westminster' },
    'SW1B': { country: 'United Kingdom', state: 'England', city: 'London', area: 'Buckingham Palace' },
    'M1': { country: 'United Kingdom', state: 'England', city: 'Manchester', area: 'City Centre' },
    'B1': { country: 'United Kingdom', state: 'England', city: 'Birmingham', area: 'City Centre' },
    'EH1': { country: 'United Kingdom', state: 'Scotland', city: 'Edinburgh', area: 'Old Town' }
};

function setupCountryStateMappings() {
    // Initial population of states for default country selection
    populateStates('comm');
    populateStates('present');
}

function setupPinCodeDropdowns() {
    // Make sure the HTML structure includes dropdown containers
    createDropdownContainers();

    // Set up input event listeners for PIN code fields
    const commPinCode = document.getElementById('commPinCode');
    const presentPinCode = document.getElementById('presentPinCode');

    if (commPinCode) {
        commPinCode.setAttribute('autocomplete', 'off');
        commPinCode.addEventListener('input', function () {
            filterPinCodes('comm');
        });
    }

    if (presentPinCode) {
        presentPinCode.setAttribute('autocomplete', 'off');
        presentPinCode.addEventListener('input', function () {
            filterPinCodes('present');
        });
    }

    // Set up keyboard navigation
    setupKeyboardNavigation('comm');
    setupKeyboardNavigation('present');
}

function createDropdownContainers() {
    // Create dropdown container for Communication Address PIN code
    const commPinCode = document.getElementById('commPinCode');
    if (commPinCode && !document.getElementById('commPinCodeDropdown')) {
        const container = document.createElement('div');
        container.id = 'commPinCodeDropdown';
        container.className = 'dropdown-list';

        // Insert the dropdown after the PIN code input
        commPinCode.parentNode.appendChild(container);

        // Wrap the input and dropdown in a container if not already
        if (!commPinCode.parentNode.classList.contains('dropdown-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'dropdown-container';
            commPinCode.parentNode.insertBefore(wrapper, commPinCode);
            wrapper.appendChild(commPinCode);
            wrapper.appendChild(container);
        }
    }

    // Create dropdown container for Present Address PIN code
    const presentPinCode = document.getElementById('presentPinCode');
    if (presentPinCode && !document.getElementById('presentPinCodeDropdown')) {
        const container = document.createElement('div');
        container.id = 'presentPinCodeDropdown';
        container.className = 'dropdown-list';

        // Insert the dropdown after the PIN code input
        presentPinCode.parentNode.appendChild(container);

        // Wrap the input and dropdown in a container if not already
        if (!presentPinCode.parentNode.classList.contains('dropdown-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'dropdown-container';
            presentPinCode.parentNode.insertBefore(wrapper, presentPinCode);
            wrapper.appendChild(presentPinCode);
            wrapper.appendChild(container);
        }
    }

    // Add required CSS if not already present
    if (!document.getElementById('pincode-dropdown-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'pincode-dropdown-styles';
        styleElement.textContent = `
            .dropdown-container {
                position: relative;
                width: 100%;
            }
            .dropdown-list {
                position: absolute;
                width: 100%;
                max-height: 200px;
                overflow-y: auto;
                background-color: white;
                border: 1px solid #ddd;
                border-top: none;
                z-index: 100;
                display: none;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .dropdown-item {
                padding: 8px 12px;
                cursor: pointer;
            }
            .dropdown-item:hover {
                background-color: #f1f1f1;
            }
            .dropdown-item.highlighted {
                background-color: #e9e9e9;
            }
            .success-message {
                background-color: #d4edda;
                color: #155724;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 4px;
                text-align: center;
            }
            .error-message {
                background-color: #f8d7da;
                color: #721c24;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 4px;
                text-align: center;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

function setupKeyboardNavigation(prefix) {
    const input = document.getElementById(prefix + 'PinCode');
    const dropdown = document.getElementById(prefix + 'PinCodeDropdown');

    if (!input || !dropdown) return;

    input.addEventListener('keydown', function (e) {
        if (dropdown.style.display === 'none') return;

        const items = dropdown.querySelectorAll('.dropdown-item');
        const highlightedItem = dropdown.querySelector('.highlighted');
        let highlightedIndex = -1;

        if (highlightedItem) {
            highlightedIndex = Array.from(items).indexOf(highlightedItem);
        }

        // Arrow down
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (highlightedIndex < items.length - 1) {
                if (highlightedItem) highlightedItem.classList.remove('highlighted');
                items[highlightedIndex + 1].classList.add('highlighted');
                ensureVisible(items[highlightedIndex + 1], dropdown);
            }
        }
        // Arrow up
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (highlightedIndex > 0) {
                if (highlightedItem) highlightedItem.classList.remove('highlighted');
                items[highlightedIndex - 1].classList.add('highlighted');
                ensureVisible(items[highlightedIndex - 1], dropdown);
            }
        }
        // Enter
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedItem) {
                selectPinCode(prefix, highlightedItem.textContent);
            }
        }
        // Escape
        else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
        }
    });
}

function ensureVisible(element, container) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (elementRect.top < containerRect.top) {
        container.scrollTop = container.scrollTop - (containerRect.top - elementRect.top);
    } else if (elementRect.bottom > containerRect.bottom) {
        container.scrollTop = container.scrollTop + (elementRect.bottom - containerRect.bottom);
    }
}

function filterPinCodes(prefix) {
    const input = document.getElementById(prefix + 'PinCode');
    const dropdown = document.getElementById(prefix + 'PinCodeDropdown');

    if (!input || !dropdown) return;

    const query = input.value.trim().toUpperCase();

    // Clear previous dropdown items
    dropdown.innerHTML = '';

    if (query.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    // Filter PIN codes based on input
    const matches = Object.keys(pinCodeDatabase).filter(pincode =>
        pincode.startsWith(query)
    );

    if (matches.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    // Create dropdown items
    matches.forEach(pincode => {
        const data = pinCodeDatabase[pincode];
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = pincode;
        item.title = `${data.area}, ${data.city}, ${data.state}, ${data.country}`;

        item.addEventListener('click', function () {
            selectPinCode(prefix, pincode);
        });

        dropdown.appendChild(item);
    });

    // Display dropdown
    dropdown.style.display = 'block';
}

function selectPinCode(prefix, pincode) {
    const pinCodeInput = document.getElementById(prefix + 'PinCode');
    const countrySelect = document.getElementById(prefix + 'Country');
    const stateSelect = document.getElementById(prefix + 'State');
    const cityInput = document.getElementById(prefix + 'City');
    const dropdown = document.getElementById(prefix + 'PinCodeDropdown');

    if (!pinCodeInput || !dropdown) return;

    // Set PIN code
    pinCodeInput.value = pincode;

    // Get address data
    const addressData = pinCodeDatabase[pincode];

    if (addressData) {
        // Set country
        if (countrySelect) countrySelect.value = addressData.country;

        // Update states dropdown based on selected country
        populateStates(prefix);

        // Set state
        if (stateSelect) stateSelect.value = addressData.state;

        // Set city
        if (cityInput) cityInput.value = addressData.city;
    }

    // Hide dropdown
    dropdown.style.display = 'none';
}

function populateStates(prefix) {
    const countrySelect = document.getElementById(prefix + 'Country');
    const stateSelect = document.getElementById(prefix + 'State');

    if (!countrySelect || !stateSelect) return;

    // Clear current options
    stateSelect.innerHTML = '<option value="">Select State</option>';

    // Get selected country
    const selectedCountry = countrySelect.value;

    // If country is selected, populate states
    if (selectedCountry && countryStates[selectedCountry]) {
        countryStates[selectedCountry].forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }
}

function validateFormSection(formElement) {
    // Get all required inputs
    const requiredInputs = formElement.querySelectorAll('[required]');
    let isValid = true;

    // Check each required input
    requiredInputs.forEach(input => {
        if (input.value.trim() === '') {
            isValid = false;

            // Add error class
            input.classList.add('error');

            // Add error message if it doesn't exist
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-text')) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-text';
                errorMsg.textContent = 'This field is required';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
        } else {
            // Remove error class
            input.classList.remove('error');

            // Remove error message if it exists
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-text')) {
                errorMsg.remove();
            }
        }
    });

    return isValid;
}

function autofillAddressDetails(prefix) {
    const pinCodeInput = document.getElementById(prefix + 'PinCode');
    const countrySelect = document.getElementById(prefix + 'Country');
    const stateSelect = document.getElementById(prefix + 'State');
    const cityInput = document.getElementById(prefix + 'City');

    if (!pinCodeInput || !countrySelect || !stateSelect || !cityInput) return;

    const pinCode = pinCodeInput.value.trim();

    // Check if PIN code exists in our database
    if (pinCode && pinCodeDatabase[pinCode]) {
        const addressData = pinCodeDatabase[pinCode];

        // Set country
        countrySelect.value = addressData.country;

        // Update states dropdown based on selected country
        populateStates(prefix);

        // Set state
        stateSelect.value = addressData.state;

        // Set city
        cityInput.value = addressData.city;
    }
}

//business info


// State/Province data for different countries
const stateData = {
    'India': [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ],
    'United States': [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
    ],
    'United Kingdom': [
        'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    'Canada': [
        'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
        'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
        'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
    ],
    'Australia': [
        'Australian Capital Territory', 'New South Wales', 'Northern Territory',
        'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
    ]
};

const countrySelect = document.getElementById('polCountry');
const stateSelect = document.getElementById('polState');
const appc = document.getElementById('app-polCountry')
const apps = document.getElementById('app-polState')

// Function to populate states based on country
function populateStates1(country) {
    // Clear state dropdown
    stateSelect.innerHTML = '';
    apps.innerHTML = '';

    if (country === '') {
        // No country selected
        stateSelect.disabled = true;
        stateSelect.innerHTML = '<option value="">First select a country</option>';
        // No country selected
        apps.disabled = true;
        apps.innerHTML = '<option value="">First select a country</option>';
    } else {
        // Country selected, populate states
        stateSelect.disabled = false;
        stateSelect.innerHTML = '<option value="">Select State/Province</option>';
        apps.disabled = false;
        apps.innerHTML = '<option value="">Select State/Province</option>';

        // Get states for selected country
        const states = stateData[country] || [];

        // Add state options
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
            const option1 = document.createElement('option');
            option1.value = state;
            option1.textContent = state;
            apps.appendChild(option1);
        });
    }
}

// Set India as default and populate Indian states on page load
document.addEventListener('DOMContentLoaded', function () {
    countrySelect.value = 'India';
    populateStates1('India');
    appc.value = 'India';
    populateStates1('India');
});

// Handle country selection change
countrySelect.addEventListener('change', function () {
    const selectedCountry = this.value;
    populateStates1(selectedCountry);
});
appc.addEventListener('change', function () {
    const selectedCountry = this.value;
    populateStates1(selectedCountry);
});





