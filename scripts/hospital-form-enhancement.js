// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get references to form elements
  const hospitalIdInput = document.getElementById('hospitalId');
  const networkHospitalNameInput = document.getElementById('networkHospitalName');
  const hospitalCityInput = document.getElementById('hospitalCity');
  const hospitalStateInput = document.getElementById('hospitalState');
  const hospitalAddressInput = document.getElementById('hospitalAddress-cl');
  
  // Create a dropdown to replace the hospital ID input
  const hospitalIdDropdown = document.createElement('select');
  hospitalIdDropdown.id = 'hospitalIdDropdown';
  hospitalIdDropdown.classList.add('form-control');
  
  // Add a default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select Hospital ID --';
  hospitalIdDropdown.appendChild(defaultOption);
  
  // Store fetched hospital data
  let hospitalsData = [];
  
  // Replace the hospital ID input with the dropdown
  hospitalIdInput.parentNode.replaceChild(hospitalIdDropdown, hospitalIdInput);
  
  // Function to fetch hospital data from the API
  function fetchHospitalData() {
    // Show loading state
    hospitalIdDropdown.disabled = true;
    const loadingOption = document.createElement('option');
    loadingOption.textContent = 'Loading hospitals...';
    hospitalIdDropdown.appendChild(loadingOption);
    
    fetch('http://localhost:5000/api/hospitals/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Remove loading option
        hospitalIdDropdown.removeChild(loadingOption);
        hospitalIdDropdown.disabled = false;
        
        if (data.success && data.data) {
          hospitalsData = data.data;
          
          // Populate dropdown with hospital IDs
          hospitalsData.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.hospitalId;
            option.textContent = `${hospital.hospitalId} - ${hospital.networkHospitalName}`;
            hospitalIdDropdown.appendChild(option);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching hospital data:', error);
        hospitalIdDropdown.innerHTML = '';
        const errorOption = document.createElement('option');
        errorOption.textContent = 'Error loading hospitals. Please try again.';
        hospitalIdDropdown.appendChild(errorOption);
        hospitalIdDropdown.disabled = true;
      });
  }
  
  // Function to autofill hospital details based on selected ID
 function autofillHospitalDetails(selectedHospitalId) {
    const selectedHospital = hospitalsData.find(hospital => hospital.hospitalId === selectedHospitalId);
    
    if (selectedHospital) {
      networkHospitalNameInput.value = selectedHospital.networkHospitalName;
      hospitalCityInput.value = selectedHospital.city;
      hospitalStateInput.value = selectedHospital.state;
      hospitalAddressInput.value = selectedHospital.completeAddress;
      console.log(selectedHospital.completeAddress, " ",hospitalAddressInput.value); // Using completeAddress from API response
    } else {
      // Clear the form if no hospital is selected
      networkHospitalNameInput.value = '';
      hospitalCityInput.value = '';
      hospitalStateInput.value = '';
      hospitalAddressInput.value = '';
    }
  }
  
  // Add event listener to the dropdown
  hospitalIdDropdown.addEventListener('change', function() {
    const selectedHospitalId = this.value;
    autofillHospitalDetails(selectedHospitalId);
  });
  
  // Fetch hospital data when the page loads
  fetchHospitalData();
});