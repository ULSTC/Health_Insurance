// Fetch intermediary data from the API
async function fetchIntermediaries() {
    try {
        const response = await fetch('http://localhost:5000/api/intermediary/');
        if (!response.ok) {
            throw new Error('Failed to fetch intermediary data');
        }
        console.log("Response from intermediary API: ", response);
        return await response.json();
    } catch (error) {
        console.error('Error fetching intermediary data:', error);
        return [];
    }
}

// Initialize dropdown for the intermediary code field
async function initializeAppIntermediaryDropdown() {
    const intermediaries = await fetchIntermediaries();
    
    if (!intermediaries || !intermediaries.length) {
        console.error('No intermediary data available');
        return;
    }
    
    console.log(intermediaries);
    
    // Get the input fields
    const codeInputContainer = document.getElementById('app-IntermediaryCode').parentNode;
    const nameInput = document.getElementById('app-IntermediaryName');
    const emailInput = document.getElementById('app-Intermediaryemail');
    
    // Remove the original input field
    const originalInput = document.getElementById('app-IntermediaryCode');
    codeInputContainer.removeChild(originalInput);
    
    // Create a select dropdown instead
    const selectDropdown = document.createElement('select');
    selectDropdown.id = 'app-IntermediaryCode';
    selectDropdown.style.width = '100%';
    selectDropdown.required = true;
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Intermediary';
    defaultOption.selected = true;
    selectDropdown.appendChild(defaultOption);
    
    // Add all intermediaries to the dropdown
    intermediaries.forEach(item => {
        const option = document.createElement('option');
        option.value = item.intermediaryCode;
        option.textContent = `${item.intermediaryCode} - ${item.name}`;
        option.dataset.name = item.name;
        option.dataset.email = item.email;
        selectDropdown.appendChild(option);
    });
    
    // Add event listener for selection change
    selectDropdown.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        
        if (this.value) {
            nameInput.value = selectedOption.dataset.name;
            emailInput.value = selectedOption.dataset.email;
        } else {
            nameInput.value = '';
            emailInput.value = '';
        }
    });
    
    // Add the dropdown to the container
    codeInputContainer.appendChild(selectDropdown);
    
    // Make the other fields read-only
    nameInput.readOnly = true;
    emailInput.readOnly = true;
}

// Initialize the page when it's loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAppIntermediaryDropdown();
});