function initializeClaimsPage() {
    // Prevent multiple initializations
    if (window.claimsInitialized) return;
    window.claimsInitialized = true;
  
    console.log('Initializing claims page...');
  
    // Add submit claim button handlers
    const submitReimbursementButton = document.querySelector('.submit-reimbursement-claim');
    const submitCashlessButton = document.querySelector('.submit-cashless-claim');

    if (submitReimbursementButton) {
        submitReimbursementButton.addEventListener('click', async function() {
            try {
                // Show loading state
                submitReimbursementButton.disabled = true;
                submitReimbursementButton.textContent = 'Submitting...';

                // Collect form data
                const claimData = collectFormData();
                claimData.claimType = 'reimbursement';
                console.log('Submitting reimbursement claim data:', claimData);

                // Submit claim
                const response = await submitClaim(claimData);
                console.log('Claim submission response:', response);

                handleSuccessfulSubmission(response);

            } catch (error) {
                showNotification(error.message || 'Failed to submit reimbursement claim', 'error');
            } finally {
                // Reset button state
                submitReimbursementButton.disabled = false;
                submitReimbursementButton.textContent = 'Submit Reimbursement Claim';
            }
        });
    }

    if (submitCashlessButton) {
        submitCashlessButton.addEventListener('click', async function() {
            try {
                // Show loading state
                submitCashlessButton.disabled = true;
                submitCashlessButton.textContent = 'Submitting...';

                // Collect form data
                const claimData = collectFormData();
                claimData.claimType = 'cashless';
                console.log('Submitting cashless claim data:', claimData);

                // Submit claim
                const response = await submitClaim(claimData);
                console.log('Claim submission response:', response);

                handleSuccessfulSubmission(response);

            } catch (error) {
                showNotification(error.message || 'Failed to submit cashless claim', 'error');
            } finally {
                // Reset button state
                submitCashlessButton.disabled = false;
                submitCashlessButton.textContent = 'Submit Cashless Claim';
            }
        });
    }

    // Function to handle successful claim submission
    function handleSuccessfulSubmission(response) {
        // Show success message with claim ID
        const claimId = response.data.claimId;
        showNotification(`Claim submitted successfully! Your Claim ID is: ${claimId}`, 'success');

        // Create and show claim ID display
        const claimIdDisplay = document.createElement('div');
        claimIdDisplay.className = 'claim-id-display';
        claimIdDisplay.innerHTML = `
            <h3>Claim Submitted Successfully!</h3>
            <p>Your Claim ID: <strong>${claimId}</strong></p>
            <p>Status: <span class="status-badge">${response.data.status}</span></p>
            <p>Please save this Claim ID for future reference.</p>
        `;
        claimIdDisplay.style.cssText = `
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        `;

        // Reset form data
        document.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
            }
        });

        // Navigate to track claim section after 3 seconds
        setTimeout(() => {
            document.querySelector('.nav-links a[data-section="track-claim"]').click();
        }, 3000);
    }
  
    // Handle top navigation (Submit claim/Track claim)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(item => item.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.claim-section').forEach(section => {
          section.style.display = 'none';
        });
        
        // Show the selected section
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).style.display = 'block';
      });
    });
    
    // Store the selected claim type globally
    window.selectedClaimType = 'reimbursement'; // Default value
    
    // Handle claim type card selection (Reimbursement/Cashless)
    const claimTypeCards = document.querySelectorAll('.claim-type-card');
    claimTypeCards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove active class from all cards
        claimTypeCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        this.classList.add('active');
        
        // Get claim type and store it globally
        const claimType = this.getAttribute('data-claim-type');
        window.selectedClaimType = claimType;
        console.log('Selected claim type:', claimType);
        
        // Show the application forms container
        const applicationForms = document.getElementById('application-forms');
        applicationForms.classList.add('active');
        
        // Hide all navs
        document.querySelectorAll('.application-nav').forEach(nav => {
          nav.style.display = 'none';
        });
        
        // Show the appropriate nav based on claim type
        if (claimType === 'reimbursement') {
          document.getElementById('reimbursement-nav').style.display = 'block';
          document.getElementById('reimbursement-documents').style.display = 'block';
          document.getElementById('cashless-documents').style.display = 'none';
          
          // Reset and activate the first item in the reimbursement nav
          const firstNavItem = document.querySelector('#reimbursement-nav .nav-item');
          if (firstNavItem) {
            const allNavItems = document.querySelectorAll('#reimbursement-nav .nav-item');
            allNavItems.forEach(item => item.classList.remove('active'));
            firstNavItem.classList.add('active');
            showFormForNavItem(firstNavItem);
          }
        } else if (claimType === 'cashless') {
          document.getElementById('cashless-nav').style.display = 'block';
          document.getElementById('cashless-documents').style.display = 'block';
          document.getElementById('reimbursement-documents').style.display = 'none';
          
          // Reset and activate the first item in the cashless nav
          const firstNavItem = document.querySelector('#cashless-nav .nav-item');
          if (firstNavItem) {
            const allNavItems = document.querySelectorAll('#cashless-nav .nav-item');
            allNavItems.forEach(item => item.classList.remove('active'));
            firstNavItem.classList.add('active');
            showFormForNavItem(firstNavItem);
          }
        }
      });
    });
    
    // Helper function to show form for a nav item
    function showFormForNavItem(navItem) {
      // Hide all forms
      document.querySelectorAll('.application-form').forEach(form => {
        form.classList.remove('active');
      });
      
      // Show the form corresponding to the nav item
      const formId = navItem.getAttribute('data-section') + '-form';
      const selectedForm = document.getElementById(formId);
      if (selectedForm) {
        selectedForm.classList.add('active');
      } else {
        console.error(`Form with ID ${formId} not found`);
      }
    }
    
    // Handle side navigation in Submit claim section
    const navItems = document.querySelectorAll('.application-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        // Find the parent nav container
        const parentNav = this.closest('.application-nav');
        if (!parentNav) return;
        
        // Remove active class from all nav items in this nav
        const siblingItems = parentNav.querySelectorAll('.nav-item');
        siblingItems.forEach(navItem => navItem.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Hide all forms
        document.querySelectorAll('.application-form').forEach(form => {
          form.classList.remove('active');
        });
        
        // Show the selected form
        const formId = this.getAttribute('data-section') + '-form';
        const selectedForm = document.getElementById(formId);
        if (selectedForm) {
          selectedForm.classList.add('active');
        } else {
          console.error(`Form with ID ${formId} not found`);
        }
      });
    });
    
    // Handle continue buttons
    const continueButtons = document.querySelectorAll('.save-continue');
    continueButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Find the current active nav item within its container
        const activeNavItem = this.closest('.application-form').id.replace('-form', '');
        
        // Get the currently active navigation based on claim type
        const activeNavContainer = window.selectedClaimType === 'reimbursement' ? 
          document.getElementById('reimbursement-nav') : 
          document.getElementById('cashless-nav');
        
        // Find the current nav item within the correct navigation container
        const currentNavItem = activeNavContainer.querySelector(`.nav-item[data-section="${activeNavItem}"]`);
        
        if (currentNavItem) {
          // Mark it as completed
          currentNavItem.classList.add('completed');
          
          // Find the next nav item
          const nextNavItem = currentNavItem.nextElementSibling;
          
          if (nextNavItem) {
            // Remove active class from all nav items in this nav
            const siblingItems = activeNavContainer.querySelectorAll('.nav-item');
            siblingItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to next item
            nextNavItem.classList.add('active');
            
            // Hide all forms
            document.querySelectorAll('.application-form').forEach(form => {
              form.classList.remove('active');
            });
            
            // Show the next form
            const nextFormId = nextNavItem.getAttribute('data-section') + '-form';
            const nextForm = document.getElementById(nextFormId);
            if (nextForm) {
              nextForm.classList.add('active');
            } else {
              console.error(`Form with ID ${nextFormId} not found`);
            }
          }
        }
      });
    });
    
    // Handle back buttons
    const backButtons = document.querySelectorAll('.go-back');
    backButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Find the current active nav item within its container
        const activeNavItem = this.closest('.application-form').id.replace('-form', '');
        
        // Get the currently active navigation based on claim type
        const activeNavContainer = window.selectedClaimType === 'reimbursement' ? 
          document.getElementById('reimbursement-nav') : 
          document.getElementById('cashless-nav');
        
        // Find the current nav item within the correct navigation container
        const currentNavItem = activeNavContainer.querySelector(`.nav-item[data-section="${activeNavItem}"]`);
        
        if (currentNavItem) {
          // Find the previous nav item
          const prevNavItem = currentNavItem.previousElementSibling;
          
          if (prevNavItem) {
            // Remove active class from all nav items in this nav
            const siblingItems = activeNavContainer.querySelectorAll('.nav-item');
            siblingItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to previous item
            prevNavItem.classList.add('active');
            
            // Hide all forms
            document.querySelectorAll('.application-form').forEach(form => {
              form.classList.remove('active');
            });
            
            // Show the previous form
            const prevFormId = prevNavItem.getAttribute('data-section') + '-form';
            const prevForm = document.getElementById(prevFormId);
            if (prevForm) {
              prevForm.classList.add('active');
            } else {
              console.error(`Form with ID ${prevFormId} not found`);
            }
          }
        }
      });
    });
    
    // Calculate age from date of birth
    const dobInput = document.getElementById('dateOfBirth');
    const ageInput = document.getElementById('age');
    
    if (dobInput && ageInput) {
      dobInput.addEventListener('change', function() {
        const dob = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        
        ageInput.value = age;
      });
    }
    
    // Calculate total amount from expense inputs
    const expenseInputs = [
      document.getElementById('roomCharges'),
      document.getElementById('doctorFees'),
      document.getElementById('medicineCost'),
      document.getElementById('investigationCost'),
      document.getElementById('otherCharges')
    ];
    
    const totalAmountInput = document.getElementById('totalAmount');
    
    if (expenseInputs[0] && totalAmountInput) {
      expenseInputs.forEach(input => {
        if (input) {
          input.addEventListener('input', calculateTotal);
        }
      });
      
      function calculateTotal() {
        let total = 0;
        expenseInputs.forEach(input => {
          if (input && input.value) {
            total += parseFloat(input.value);
          }
        });
        totalAmountInput.value = total.toFixed(2);
      }
    }
  
    // Get username from localStorage if available
    const userNameElement = document.querySelector('.user-name');
    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    
    if (userNameElement && loggedInUser && loggedInUser.fullName) {
      console.log("Setting user name:", loggedInUser.fullName);
      userNameElement.textContent = loggedInUser.fullName;
    }
  
    // Add logout functionality
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
      logoutButton.addEventListener('click', function() {
        // Clear user data from localStorage
        sessionStorage.removeItem('user');
        
        // Store a flag to indicate we're coming from logout
        sessionStorage.setItem('comingFromLogout', 'true');
        
        // Redirect to index.html
        window.location.href = 'index.html';
      });
    }
  
    // Setup policy lookup functionality
    setupPolicyLookup();

    // Initialize diagnosis search
    initializeDiagnosisSearch();
}

// Function to debounce API calls
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
  
// Function to set up policy lookup events
function setupPolicyLookup() {
  console.log('Setting up policy lookup functionality...');
  
  // Handle both reimbursement and cashless policy inputs
  const policyInputs = [
    document.getElementById('policyNumber'),
    document.getElementById('cashlessPolicyNumber')
  ];

  policyInputs.forEach(policyInput => {
    if (policyInput) {
      // Create debounced version of fetchPolicyInfo
      const debouncedFetchPolicy = debounce((policyNumber) => {
        if (policyNumber) {
          console.log('Debounced fetch for policy number:', policyNumber);
          fetchPolicyInfo(policyNumber);
        }
      }, 300); // 300ms delay
      
      // Add an input event handler with debounce
      policyInput.addEventListener('input', function() {
        const policyNumber = this.value.trim();
        if (policyNumber && policyNumber.length >= 5) {
          debouncedFetchPolicy(policyNumber);
        }
      });
      
      // Add a blur event handler
      policyInput.addEventListener('blur', function() {
        const policyNumber = this.value.trim();
        if (policyNumber) {
          console.log('Blur event triggered with policy number:', policyNumber);
          fetchPolicyInfo(policyNumber);
        }
      });
    
      // Add a keypress event handler
      policyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const policyNumber = this.value.trim();
          if (policyNumber) {
            console.log('Enter key pressed with policy number:', policyNumber);
            fetchPolicyInfo(policyNumber);
          }
        }
      });
    }
  });
}
  
// Function to fetch policy information by policy number
async function fetchPolicyInfo(policyNumber) {
    console.log('Fetching policy info for:', policyNumber);
    
    // Show loading indicator
    const policyInput = document.getElementById(window.selectedClaimType === 'reimbursement' ? 'policyNumber' : 'cashlessPolicyNumber');
    const loadingIndicator = document.createElement('span');
    loadingIndicator.id = 'policy-loading';
    loadingIndicator.textContent = ' Loading...';
    loadingIndicator.style.marginLeft = '10px';
    loadingIndicator.style.color = '#666';
    
    // Remove any existing loading indicator
    const existingIndicator = document.getElementById('policy-loading');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    if (policyInput) {
        policyInput.setAttribute('disabled', true);
        policyInput.parentNode.appendChild(loadingIndicator);
    }
    
    // Build the URL
    const apiUrl = `http://localhost:5000/api/application/code/${policyNumber}`;
    console.log('API URL:', apiUrl);

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        console.log('API Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        
        // Handle successful response
        if (data.success) {
            // Check if data.data is an object or array
            if (Array.isArray(data.data) && data.data.length > 0) {
                // If it's an array, use the first policy
                const policy = data.data[0];
                processPolicy(policy);
            } else if (data.data && typeof data.data === 'object') {
                // If it's an object, use it directly
                const policy = data.data;
                processPolicy(policy);
            } else {
                throw new Error('No policy data found in response');
            }
        } else {
            throw new Error(data.message || 'Failed to retrieve policy information');
        }
    } catch (error) {
        console.error('Error fetching policy:', error);
        showNotification('Failed to load policy information. Please check the policy number.', 'error');
    } finally {
        // Enable the policy input field and remove loading indicator
        if (policyInput) {
            policyInput.removeAttribute('disabled');
            const loadingIndicator = document.getElementById('policy-loading');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }
    }
}

// Helper function to process policy data
function processPolicy(policy) {
    console.log('Processing policy:', policy);
    
    // Ensure personalInfo exists
    if (!policy.personalInfo) {
        throw new Error('Policy found but missing personal information');
    }
    
    // Store the application ID in session storage
    if (policy._id) {
        sessionStorage.setItem('currentApplicationId', policy._id);
        console.log('Stored application ID:', policy._id);
    } else {
        console.error('No application ID found in policy data');
        throw new Error('Invalid policy data: missing application ID');
    }
    
    // Store policy status
    sessionStorage.setItem('policyStatus', policy.status);
    
    // Populate the personal information fields based on claim type
    if (window.selectedClaimType === 'reimbursement') {
        populatePersonalInfo(policy.personalInfo);
    } else {
        populateCashlessInfo(policy);
    }
    
    // Show success notification
    showNotification('Policy information loaded successfully', 'success');
    
    // Navigate to the appropriate section
    if (window.selectedClaimType === 'reimbursement') {
        navigateToSection('personal-info');
    } else {
        navigateToSection('personal-info');
    }
}

// Function to populate cashless claim information
function populateCashlessInfo(policy) {
    try {
        // Safely get personal info, default to empty object if not exists
        const personalInfo = policy.personalInfo || {};
        
        // Populate personal information with fallbacks
        document.getElementById('fullName').value = personalInfo.fullName || '';
        
        // Handle date of birth
        if (personalInfo.dateOfBirth) {
            const dob = new Date(personalInfo.dateOfBirth);
            document.getElementById('dateOfBirth').value = dob.toISOString().split('T')[0];
            document.getElementById('dateOfBirth').dispatchEvent(new Event('change'));
        } else {
            document.getElementById('dateOfBirth').value = '';
        }
        
        // Handle gender with fallback
        const genderSelect = document.getElementById('gender');
        if (genderSelect) {
            genderSelect.value = (personalInfo.gender || '').toLowerCase();
        }
        
        // Handle relationship with fallback
        const relationshipSelect = document.getElementById('relationship');
        if (relationshipSelect) {
            relationshipSelect.value = (personalInfo.relationship || '').toLowerCase();
        }
        
        // Handle contact information
        document.getElementById('email').value = personalInfo.email || '';
        document.getElementById('phone').value = personalInfo.phone || '';

        // Handle business info
        const businessInfo = policy.businessInfo || {};
        sessionStorage.setItem('policyStartDate', businessInfo.policyStartDate || '');
        sessionStorage.setItem('policyEndDate', businessInfo.policyEndDate || '');
        
        // Handle hospital info if exists
        const hospitalInfo = policy.hospitalInfo || {};
        const hospitalNameInput = document.getElementById('networkHospitalName');
        if (hospitalNameInput) {
            hospitalNameInput.value = hospitalInfo.name || '';
        }
        
        const hospitalAddressInput = document.getElementById('hospitalAddress');
        if (hospitalAddressInput) {
            hospitalAddressInput.value = hospitalInfo.address || '';
        }
        
        const hospitalCityInput = document.getElementById('hospitalCity');
        if (hospitalCityInput) {
            hospitalCityInput.value = hospitalInfo.city || '';
        }
        
        const hospitalStateInput = document.getElementById('hospitalState');
        if (hospitalStateInput) {
            hospitalStateInput.value = hospitalInfo.state || '';
        }

        // Handle policy info
        const policyInfo = policy.policyInfo || {};
        sessionStorage.setItem('sumInsured', policyInfo.sumInsured || '0');
        sessionStorage.setItem('policyPlan', policyInfo.policyPlan || '');
        sessionStorage.setItem('coverType', policyInfo.coverType || '');

        // Handle treatment info if exists
        const treatmentInfo = policy.treatmentInfo || {};
        const diagnosisInput = document.getElementById('cashlessDiagnosisDetails');
        if (diagnosisInput) {
            diagnosisInput.value = treatmentInfo.diagnosisDetails || '';
        }

        const treatmentTypeSelect = document.getElementById('treatmentType');
        if (treatmentTypeSelect) {
            treatmentTypeSelect.value = treatmentInfo.treatmentType || '';
        }

        const doctorNameInput = document.getElementById('doctorName');
        if (doctorNameInput) {
            doctorNameInput.value = treatmentInfo.doctorName || '';
        }

        // Store additional information in session storage
        sessionStorage.setItem('currentApplicationId', policy._id || '');
        sessionStorage.setItem('policyStatus', policy.status || 'pending');
        sessionStorage.setItem('policyNumber', policy.policyNumber || '');

        console.log('Cashless information populated successfully');
    } catch (error) {
        console.error('Error populating cashless information:', error);
        showNotification('Some fields could not be populated automatically', 'warning');
    }
}

// Function to populate personal information fields
function populatePersonalInfo(personalInfo) {
  if (!personalInfo) {
    console.warn('No personal info data provided');
    return;
  }
  
  console.log('Populating personal info:', personalInfo);

  // Map personal info to form fields
  const fullNameField = document.getElementById('fullName');
  if (fullNameField) {
    fullNameField.value = personalInfo.fullName || '';
  }

  // Format date properly for date input (YYYY-MM-DD)
  const dobField = document.getElementById('dateOfBirth');
  if (dobField && personalInfo.dateOfBirth) {
    const dob = new Date(personalInfo.dateOfBirth);
    const formattedDate = dob.toISOString().split('T')[0];
    dobField.value = formattedDate;
    
    // Trigger the change event to update age
    const changeEvent = new Event('change');
    dobField.dispatchEvent(changeEvent);
  }

  const ageField = document.getElementById('age');
  if (ageField) {
    ageField.value = personalInfo.age || '';
  }

  // Set gender dropdown
  const genderSelect = document.getElementById('gender');
  if (genderSelect && personalInfo.gender) {
    Array.from(genderSelect.options).forEach(option => {
      if (option.value === personalInfo.gender.toLowerCase()) {
        option.selected = true;
      }
    });
  }

  // Set relationship dropdown
  const relationshipSelect = document.getElementById('relationship');
  if (relationshipSelect && personalInfo.relationship) {
    Array.from(relationshipSelect.options).forEach(option => {
      if (option.value === personalInfo.relationship.toLowerCase()) {
        option.selected = true;
      }
    });
  }

  const emailField = document.getElementById('email');
  if (emailField) {
    emailField.value = personalInfo.email || '';
  }
  
  const phoneField = document.getElementById('phone');
  if (phoneField) {
    phoneField.value = personalInfo.phone || '';
  }
  
  console.log('Personal info population complete');
}
  
// Function to navigate to a section
function navigateToSection(sectionId) {
  console.log('Navigating to section:', sectionId);
  
  // Get the correct navigation container based on the selected claim type
  const navContainer = window.selectedClaimType === 'reimbursement' ? 
    document.getElementById('reimbursement-nav') : 
    document.getElementById('cashless-nav');
  
  // Find the nav item in the correct container
  const navItem = navContainer.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (navItem) {
    // Trigger a click on the nav item
    navItem.click();
    console.log('Section navigation successful');
  } else {
    console.warn(`Navigation item for section ${sectionId} not found in ${window.selectedClaimType} flow`);
  }
}
  
// Function to show notification
function showNotification(message, type = 'info') {
  console.log(`Showing ${type} notification:`, message);
  
  // Create notification element if it doesn't exist
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
  }

  // Set notification style based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#4CAF50';
      notification.style.color = 'white';
      break;
    case 'error':
      notification.style.backgroundColor = '#F44336';
      notification.style.color = 'white';
      break;
    default:
      notification.style.backgroundColor = '#2196F3';
      notification.style.color = 'white';
      break;
  }

  // Set message
  notification.textContent = message;

  // Show notification
  notification.style.opacity = '1';

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}
  
// Function to collect form data
function collectFormData() {
  const claimType = window.selectedClaimType;
  const formData = {
    claimType,
    applicationId: sessionStorage.getItem('currentApplicationId')
  };

  if (claimType === 'reimbursement') {
    // Collect reimbursement claim data
    formData.claimSubType = document.getElementById('claimSubType').value;
    formData.hospitalInfo = {
      name: document.getElementById('hospitalName').value,
      address: document.getElementById('hospitalAddress').value,
      city: document.getElementById('hospitalCity')?.value || '',
      state: document.getElementById('hospitalState')?.value || ''
    };
    formData.treatmentInfo = {
      admissionDate: document.getElementById('dateOfAdmission').value,
      dischargeDate: document.getElementById('dateOfDischarge').value,
      diagnosisDetails: document.getElementById('diagnosisDetails').value
    };
    formData.expenseInfo = {
      roomCharges: parseFloat(document.getElementById('roomCharges').value) || 0,
      doctorFees: parseFloat(document.getElementById('doctorFees').value) || 0,
      medicineCost: parseFloat(document.getElementById('medicineCost').value) || 0,
      investigationCost: parseFloat(document.getElementById('investigationCost').value) || 0,
      otherCharges: parseFloat(document.getElementById('otherCharges').value) || 0,
      totalAmount: parseFloat(document.getElementById('totalAmount').value) || 0
    };
  } else {
    // Collect cashless claim data
    formData.requestType = document.getElementById('cashlessRequestType').value;
    formData.hospitalInfo = {
      name: document.getElementById('networkHospitalName').value,
      address: document.getElementById('hospitalAddress').value,
      city: document.getElementById('hospitalCity').value,
      state: document.getElementById('hospitalState').value
    };
    formData.treatmentInfo = {
      expectedAdmissionDate: document.getElementById('expectedAdmissionDate').value,
      expectedStayDuration: parseInt(document.getElementById('expectedStayDuration').value),
      diagnosisDetails: document.getElementById('cashlessDiagnosisDetails').value,
      treatmentType: document.getElementById('treatmentType').value,
      doctorName: document.getElementById('doctorName').value
    };
  }

  // Remove any document-related fields if they exist
  delete formData.documents;
  delete formData.documentInfo;
  delete formData.uploadedFiles;

  return formData;
}

// Function to submit claim
async function submitClaim(claimData) {
  try {
    const response = await fetch('http://localhost:5000/api/claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify(claimData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit claim');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting claim:', error);
    throw error;
  }
}

// Function to search claim by ID
async function searchClaim(claimId) {
    const resultsContainer = document.getElementById('claim-search-results');
    try {
        // Show loading state
        resultsContainer.innerHTML = '<div class="loading">Searching...</div>';

        const response = await fetch(`http://localhost:5000/api/claims/${claimId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch claim details');
        }

        const data = await response.json();
        displayClaimDetails(data.data);
    } catch (error) {
        console.error('Error searching claim:', error);
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message || 'Failed to fetch claim details'}</p>
            </div>
        `;
    }
}

// Function to display claim details
function displayClaimDetails(claim) {
    const resultsContainer = document.getElementById('claim-search-results');
    
    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'under_review': return '#17a2b8';
            case 'approved': return '#28a745';
            case 'rejected': return '#dc3545';
            default: return '#6c757d';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return amount ? `₹${parseFloat(amount).toLocaleString()}` : 'N/A';
    };

    const claimDetailsHtml = `
        <div class="claim-details">
            <div class="claim-header">
                <h3>Claim Details</h3>
                <span class="claim-status" style="background-color: ${getStatusColor(claim.status)}">
                    ${claim.status.replace('_', ' ').toUpperCase()}
                </span>
            </div>
            <div class="claim-info">
                <div class="info-row">
                    <span class="label">Claim ID:</span>
                    <span class="value">${claim.claimId}</span>
                </div>
                <div class="info-row">
                    <span class="label">Claim Type:</span>
                    <span class="value">${claim.claimType.charAt(0).toUpperCase() + claim.claimType.slice(1)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Policy Number:</span>
                    <span class="value">${claim.policyNumber || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Hospital:</span>
                    <span class="value">${claim.hospitalInfo.name}</span>
                </div>
                <div class="info-row">
                    <span class="label">Hospital Address:</span>
                    <span class="value">${claim.hospitalInfo.address}, ${claim.hospitalInfo.city}, ${claim.hospitalInfo.state}</span>
                </div>
                ${claim.claimType === 'cashless' ? `
                    <div class="info-row">
                        <span class="label">Request Type:</span>
                        <span class="value">${claim.requestType ? claim.requestType.charAt(0).toUpperCase() + claim.requestType.slice(1) : 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Expected Admission Date:</span>
                        <span class="value">${formatDate(claim.treatmentInfo.expectedAdmissionDate)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Expected Stay Duration:</span>
                        <span class="value">${claim.treatmentInfo.expectedStayDuration ? claim.treatmentInfo.expectedStayDuration + ' days' : 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Treatment Type:</span>
                        <span class="value">${claim.treatmentInfo.treatmentType ? claim.treatmentInfo.treatmentType.charAt(0).toUpperCase() + claim.treatmentInfo.treatmentType.slice(1) : 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Doctor Name:</span>
                        <span class="value">${claim.treatmentInfo.doctorName || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Diagnosis Details:</span>
                        <span class="value">${claim.treatmentInfo.diagnosisDetails || 'N/A'}</span>
                    </div>
                ` : `
                    <div class="info-row">
                        <span class="label">Admission Date:</span>
                        <span class="value">${formatDate(claim.treatmentInfo.admissionDate)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Discharge Date:</span>
                        <span class="value">${formatDate(claim.treatmentInfo.dischargeDate)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Total Amount:</span>
                        <span class="value">${formatCurrency(claim.expenseInfo?.totalAmount)}</span>
                    </div>
                `}
                <div class="info-row">
                    <span class="label">Submitted On:</span>
                    <span class="value">${formatDate(claim.createdAt)}</span>
                </div>
                ${claim.updatedAt ? `
                    <div class="info-row">
                        <span class="label">Last Updated:</span>
                        <span class="value">${formatDate(claim.updatedAt)}</span>
                    </div>
                ` : ''}
                ${claim.status === 'rejected' && claim.rejectionReason ? `
                    <div class="info-row">
                        <span class="label">Rejection Reason:</span>
                        <span class="value" style="color: #dc3545;">${claim.rejectionReason}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .claim-details {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 20px;
            margin-top: 20px;
        }
        .claim-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        .claim-header h3 {
            margin: 0;
            color: #333;
        }
        .claim-status {
            padding: 6px 12px;
            border-radius: 20px;
            color: white;
            font-size: 0.9em;
            font-weight: 500;
            text-transform: uppercase;
        }
        .claim-info {
            display: grid;
            gap: 15px;
        }
        .info-row {
            display: flex;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-row .label {
            font-weight: 500;
            width: 200px;
            color: #666;
        }
        .info-row .value {
            flex: 1;
            color: #333;
            line-height: 1.4;
        }
        .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        .error-message {
            background: #fff3f3;
            color: #dc3545;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
        }
        .error-message i {
            font-size: 20px;
        }
        .error-message p {
            margin: 0;
        }
    `;
    document.head.appendChild(style);

    // Update results container
    resultsContainer.innerHTML = claimDetailsHtml;
}

// Add event listeners for claim tracking
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.btn-search');
    const searchInput = document.getElementById('claim-id-search');

    if (searchButton && searchInput) {
        // Search on button click
        searchButton.addEventListener('click', () => {
            const claimId = searchInput.value.trim();
            if (!claimId) {
                showNotification('Please enter a claim ID', 'error');
                return;
            }
            searchClaim(claimId);
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const claimId = searchInput.value.trim();
                if (!claimId) {
                    showNotification('Please enter a claim ID', 'error');
                    return;
                }
                searchClaim(claimId);
            }
        });
    }
});

// Function to initialize diagnosis search
function initializeDiagnosisSearch() {
    const searchInputs = [
        { input: 'diagnosisSearch', results: 'diagnosisResults', textarea: 'diagnosisDetails' },
        { input: 'cashlessDiagnosisSearch', results: 'cashlessDiagnosisResults', textarea: 'cashlessDiagnosisDetails' }
    ];

    searchInputs.forEach(({ input, results, textarea }) => {
        const searchInput = document.getElementById(input);
        const resultsContainer = document.getElementById(results);
        const textareaElement = document.getElementById(textarea);

        if (searchInput && resultsContainer && textareaElement) {
            let debounceTimer;

            searchInput.addEventListener('input', function() {
                clearTimeout(debounceTimer);
                const searchTerm = this.value.trim();

                if (searchTerm.length < 2) {
                    resultsContainer.style.display = 'none';
                    return;
                }

                debounceTimer = setTimeout(() => {
                    searchDiagnosis(searchTerm, resultsContainer, textareaElement);
                }, 300);
            });

            // Close results when clicking outside
            document.addEventListener('click', function(e) {
                if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
                    resultsContainer.style.display = 'none';
                }
            });
        }
    });
}

// Function to search diagnosis using ICD-10-CM API
async function searchDiagnosis(term, resultsContainer, textareaElement) {
    try {
        const response = await fetch(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(term)}&maxList=10`);
        const data = await response.json();

        if (data && data[1] && data[3]) {
            const codes = data[1];
            const descriptions = data[3];
            
            resultsContainer.innerHTML = '';
            
            codes.forEach((code, index) => {
                const description = descriptions[index][1];
                const resultItem = document.createElement('div');
                resultItem.className = 'diagnosis-result-item';
                resultItem.innerHTML = `
                    <span class="code">${code}</span>
                    <span class="name">${description}</span>
                `;
                
                resultItem.addEventListener('click', () => {
                    const currentValue = textareaElement.value;
                    const newDiagnosis = `${code} - ${description}`;
                    
                    if (currentValue) {
                        textareaElement.value = currentValue + '\n' + newDiagnosis;
                    } else {
                        textareaElement.value = newDiagnosis;
                    }
                    
                    resultsContainer.style.display = 'none';
                });
                
                resultsContainer.appendChild(resultItem);
            });
            
            resultsContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error searching diagnosis:', error);
        showNotification('Failed to search diagnosis codes', 'error');
    }
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeClaimsPage);