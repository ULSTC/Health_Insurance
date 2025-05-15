function initializeClaimsPage() {
    // Prevent multiple initializations
    if (window.claimsInitialized) return;
    window.claimsInitialized = true;
  
    console.log('Initializing claims page...');
  
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
          
          // Reset and activate the first item in the reimbursement nav
          const firstNavItem = document.querySelector('#reimbursement-nav .nav-item');
          if (firstNavItem) {
            const allNavItems = document.querySelectorAll('#reimbursement-nav .nav-item');
            allNavItems.forEach(item => item.classList.remove('active'));
            firstNavItem.classList.add('active');
            
            // Show the corresponding form
            showFormForNavItem(firstNavItem);
          }
        } else if (claimType === 'cashless') {
          document.getElementById('cashless-nav').style.display = 'block';
          
          // Reset and activate the first item in the cashless nav
          const firstNavItem = document.querySelector('#cashless-nav .nav-item');
          if (firstNavItem) {
            const allNavItems = document.querySelectorAll('#cashless-nav .nav-item');
            allNavItems.forEach(item => item.classList.remove('active'));
            firstNavItem.classList.add('active');
            
            // Show the corresponding form
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
  
  const policyInput = document.getElementById('policyNumber');
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
    
    // Add a blur event handler to fetch policy when focus leaves the field
    policyInput.addEventListener('blur', function() {
      const policyNumber = this.value.trim();
      if (policyNumber) {
        console.log('Blur event triggered with policy number:', policyNumber);
        fetchPolicyInfo(policyNumber);
      }
    });
  
    // Add a keypress event handler to fetch policy when Enter key is pressed
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
  } else {
    console.warn('Policy input field not found');
  }

  // Add event listener to the continue button in claim info section
  const claimInfoContinueBtn = document.querySelector('#claim-info-form .save-continue');
  if (claimInfoContinueBtn) {
    claimInfoContinueBtn.addEventListener('click', function() {
      const policyNumber = document.getElementById('policyNumber').value.trim();
      if (policyNumber) {
        console.log('Continue button clicked with policy number:', policyNumber);
        fetchPolicyInfo(policyNumber);
      }
    });
  } else {
    console.warn('Claim info continue button not found');
  }
}
  
// Function to fetch policy information by policy number
function fetchPolicyInfo(policyNumber) {
  console.log('Fetching policy info for:', policyNumber);
  
  // Show loading indicator
  const policyInput = document.getElementById('policyNumber');
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

  // Make API call
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('API Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
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
  })
  .catch(error => {
    console.error('Error fetching policy:', error);
    showNotification('Failed to load policy information. Please check the policy number.', 'error');
  })
  .finally(() => {
    // Enable the policy input field and remove loading indicator
    if (policyInput) {
      policyInput.removeAttribute('disabled');
      const loadingIndicator = document.getElementById('policy-loading');
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
    }
  });
}

// Helper function to process policy data
function processPolicy(policy) {
  console.log('Processing policy:', policy);
  
  // Ensure personalInfo exists
  if (!policy.personalInfo) {
    throw new Error('Policy found but missing personal information');
  }
  
  // Populate the personal information fields
  populatePersonalInfo(policy.personalInfo);
  
  // Show success notification
  showNotification('Policy information loaded successfully', 'success');
  
  // Navigate to the personal info section using the correct navigation flow
  navigateToSection('personal-info');
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
  
// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeClaimsPage);