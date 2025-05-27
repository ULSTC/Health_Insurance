document.addEventListener("DOMContentLoaded", () => {
    const appSection = document.querySelector("#applications");
    if (!appSection) return;

    const navItems = appSection.querySelectorAll(".application-nav .nav-item");
    const forms = appSection.querySelectorAll(".application-content .application-form");

    // Show form and highlight nav
    function showForm(sectionId) {
        // Hide all forms and remove active from all nav items
        forms.forEach(f => f.classList.remove("active"));
        navItems.forEach(nav => nav.classList.remove("active"));

        // Activate current form and nav item
        const formToShow = document.getElementById(`${sectionId}-form`);
        if (formToShow) formToShow.classList.add("active");

        const navToActivate = [...navItems].find(nav => nav.dataset.section === sectionId);
        if (navToActivate) navToActivate.classList.add("active");
    }

    // Nav click listener
    navItems.forEach((navItem, index) => {
        navItem.addEventListener("click", () => {
            const sectionId = navItem.dataset.section;
            showForm(sectionId);
        });
    });

    // Handle save & continue
    const saveButtons = appSection.querySelectorAll(".app-save-continue");
    saveButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const currentForm = btn.closest(".application-form");
            if (!currentForm) return;

            const currentFormId = currentForm.id.replace("-form", "");
            const currentNavItem = [...navItems].find(nav => nav.dataset.section === currentFormId);
            if (currentNavItem) {
                currentNavItem.classList.remove("active");
                currentNavItem.classList.add("completed"); // You can style .completed to green in CSS
            }

            // Move to next nav item
            const currentIndex = [...navItems].indexOf(currentNavItem);
            const nextNavItem = navItems[currentIndex + 1];
            if (nextNavItem) {
                showForm(nextNavItem.dataset.section);
            }
        });
    });
    const activatePolicyBtn = document.getElementById('activate-policy-btn');
    if (activatePolicyBtn) {
        activatePolicyBtn.addEventListener("click", submitApplication);
    }
})



document.addEventListener("DOMContentLoaded", () => {
    const indiaStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
    ];

    function populateStateDropdown(stateId, countryId) {
        const stateDropdown = document.getElementById(stateId);
        const countryDropdown = document.getElementById(countryId);
        
        if (!stateDropdown || !countryDropdown) {
            console.error(`Elements not found: stateId=${stateId}, countryId=${countryId}`);
            return;
        }

        countryDropdown.addEventListener("change", () => {
            const selectedCountry = countryDropdown.value;
            stateDropdown.innerHTML = '<option value="">Select State</option>'; // Reset

            if (selectedCountry === "India") {
                indiaStates.forEach(state => {
                    const option = document.createElement("option");
                    option.value = state;
                    option.textContent = state;
                    stateDropdown.appendChild(option);
                });
            }
        });
    }

    // Apply to both Communication and Present Address
    populateStateDropdown("app-commState", "app-commCountry");
    populateStateDropdown("app-presentState", "app-presentCountry");
});

document.getElementById('generate-summary').addEventListener("click",()=>{
    generateApplicationSummary()
})

document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById('download-summary');
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function() {
            generateApplicationSummary();
            
            // Get container
            const summaryContainer = document.getElementById('final-summary');
            if (!summaryContainer) {
                alert("Summary container not found");
                return;
            }
            
            // Create a complete HTML document
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Application Summary</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        .summary-section {
                            margin-bottom: 20px;
                        }
                        .summary-section h4 {
                            margin-bottom: 10px;
                            border-bottom: 1px solid #ddd;
                            padding-bottom: 5px;
                        }
                        .detail-row {
                            display: flex;
                            margin-bottom: 5px;
                        }
                        .detail-label {
                            font-weight: bold;
                            width: 150px;
                        }
                    </style>
                </head>
                <body>
                    ${summaryContainer.innerHTML}
                </body>
                </html>
            `;
            
            // Create a download link for the HTML file
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Application_Summary.html';
            a.click();
            
            // Clean up
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
            
            alert("Download initiated. Please open the HTML file and use your browser's Print feature to save as PDF.");
        });
    }
});

// Your existing generateApplicationSummary function
function generateApplicationSummary() {
    const summaryContainer = document.getElementById('application-summary');
    
    if (!summaryContainer) {
        console.error("Summary container not found");
        return;
    }
    
    // Clear existing content
    summaryContainer.innerHTML = '';
    
    // Create summary sections 
    const sections = [
        {
            title: 'Business Information',
            data: [
                { label: 'Quote Reference', value: document.getElementById('easyQuote')?.value || '' },
                { label: 'Country', value: document.getElementById('app-polCountry')?.value || '' },
                { label: 'State', value: document.getElementById('app-polState')?.value || '' },
                { label: 'City', value: document.getElementById('app-polCity')?.value || '' },
                { label: 'Line of Business', value: document.getElementById('app-lineOfBusiness')?.value || '' },
                { label: 'Type of Business', value: document.getElementById('app-typeOfBusiness')?.value || '' },
                { label: 'Policy Start Date', value: formatDate(document.getElementById('app-policystartDate')?.value) },
                { label: 'Policy End Date', value: formatDate(document.getElementById('app-policyEndDate')?.value) }
            ]
        },
        {
            title: 'Policy Information',
            data: [
                { label: 'Payment Type', value: document.getElementById('app-premiumType')?.value || '' },
                { label: 'Cover Type', value: document.getElementById('app-coverType')?.value || '' },
                { label: 'Policy Plan', value: document.getElementById('app-ploicyPlan')?.value || '' },
                { label: 'Sum Insured', value: `₹${(+document.getElementById('app-sumInusred')?.value || 0).toLocaleString()}` },
                { label: 'Policy Tenure', value: `${document.getElementById('app-plicyTenure')?.value || 0} years` }
            ]
        },
        {
            title: 'Personal Information',
            data: [
                { label: 'Full Name', value: document.getElementById('app-fullName')?.value || '' },
                { label: 'Date of Birth', value: formatDate(document.getElementById('app-dateOfBirth')?.value) },
                { label: 'Age', value: document.getElementById('app-age')?.value || '' },
                { label: 'Gender', value: document.getElementById('app-gender')?.value || '' },
                { label: 'Relationship', value: document.getElementById('app-relationship')?.value || '' },
                { label: 'Email', value: document.getElementById('app-email')?.value || '' },
                { label: 'Phone', value: document.getElementById('app-phone')?.value || '' }
            ]
        },
        {
            title: 'Health Information',
            data: [
                { label: 'Height', value: `${document.getElementById('app-height')?.value || ''} cm` },
                { label: 'Weight', value: `${document.getElementById('app-weight')?.value || ''} kg` },
                { label: 'BMI', value: document.getElementById('app-bmi')?.value || '' },
                { label: 'Blood Group', value: document.getElementById('app-bloodGroup')?.value || '' }
            ]
        },
        {
            title: 'Communication Address',
            data: [
                { label: 'Address', value: document.getElementById('app-commLineOfAddress')?.value || '' },
                { label: 'PIN Code', value: document.getElementById('app-commPinCode')?.value || '' },
                { label: 'City', value: document.getElementById('app-commCity')?.value || '' },
                { label: 'State', value: document.getElementById('app-commState')?.value || '' },
                { label: 'Country', value: document.getElementById('app-commCountry')?.value || '' }
            ]
        },
        {
            title: 'Permanent Address',
            data: [
                { label: 'Address', value: document.getElementById('app-presentLineOfAddress')?.value || '' },
                { label: 'PIN Code', value: document.getElementById('app-presentPinCode')?.value || '' },
                { label: 'City', value: document.getElementById('app-presentCity')?.value || '' },
                { label: 'State', value: document.getElementById('app-presentState')?.value || '' },
                { label: 'Country', value: document.getElementById('app-presentCountry')?.value || '' }
            ]
        }
    ];
    
    // Create and append summary sections
    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'summary-section';
        
        const sectionTitle = document.createElement('h4');
        sectionTitle.textContent = section.title;
        sectionDiv.appendChild(sectionTitle);
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'summary-details';
        
        section.data.forEach(item => {
            const detailDiv = document.createElement('div');
            detailDiv.className = 'detail-row';
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'detail-label';
            labelSpan.textContent = item.label + ':';
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'detail-value';
            valueSpan.textContent = item.value;
            
            detailDiv.appendChild(labelSpan);
            detailDiv.appendChild(valueSpan);
            detailsDiv.appendChild(detailDiv);
        });
        
        sectionDiv.appendChild(detailsDiv);
        summaryContainer.appendChild(sectionDiv);
    });
    
    // Ensure the container is visible
    summaryContainer.style.display = 'block';
}

// Helper function for date formatting (might be missing in your code)
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid
        
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        console.error("Date formatting error:", e);
        return dateString;
    }
}
function submitApplication() {
    // Get the quote reference from session storage
    const quoteData = JSON.parse(sessionStorage.getItem('quoteData') || '{}');
    
    // Gather all form data
    const applicationData = {
        quoteReference: document.getElementById('easyQuote')?.value || '',
        personalInfo: [],
        healthInfo: []
    };

    // Get all member sections
    const memberSections = document.querySelectorAll('.family-member-section');
    memberSections.forEach((section, index) => {
        // Add personal info
        applicationData.personalInfo.push({
            fullName: section.querySelector(`#app-fullName-${index}`)?.value || '',
            dateOfBirth: section.querySelector(`#app-dateOfBirth-${index}`)?.value || '',
            age: Number(section.querySelector(`#app-age-${index}`)?.value || 0),
            gender: section.querySelector(`#app-gender-${index}`)?.value || '',
            relationship: section.querySelector(`#app-relationship-${index}`)?.value || '',
            email: section.querySelector(`#app-email-${index}`)?.value || '',
            phone: section.querySelector(`#app-phone-${index}`)?.value || ''
        });

        // Get blood group value if available
        const bloodGroupSelect = section.querySelector(`#bloodGroup-${index + 1}`);
        let bloodGroup = null;
        if (bloodGroupSelect && bloodGroupSelect.value) {
            const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
            if (validBloodGroups.includes(bloodGroupSelect.value)) {
                bloodGroup = bloodGroupSelect.value;
            }
        }

        // Add health info
        applicationData.healthInfo.push({
            height: Number(section.querySelector(`#height-${index + 1}`)?.value || 0),
            weight: Number(section.querySelector(`#weight-${index + 1}`)?.value || 0),
            bmi: Number(section.querySelector(`#bmi-${index + 1}`)?.value || 0),
            bloodGroup: bloodGroup,
            preExistingConditions: Array.from(section.querySelectorAll(`input[name="conditions-${index + 1}"]:checked`)).map(cb => cb.value)
        });
    });

    // Submit the application
    fetch('http://localhost:5000/api/application/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Network response was not ok');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Show success message with application code
            showSuccessMessage(`Application submitted successfully! Application Code: ${data.data.applicationCode}`);
            
            // Generate and store PDF
            generateApplicationSummary();
            const summaryHTML = document.getElementById('application-summary').innerHTML;
            storePDF(data.data.applicationCode, summaryHTML);
        } else {
            throw new Error(data.message || 'Failed to submit application');
        }
    })
    .catch(error => {
        console.error('Error submitting application:', error);
        showErrorMessage(error.message || 'Error submitting application. Please try again.');
    });
}
function showSuccessMessage(message) {
    // You can implement this in various ways - alert, modal, or toast notification
    const notificationArea = document.createElement('div');
    notificationArea.className = 'notification success';
    notificationArea.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <button class="close-btn"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notificationArea);
    
    // Add event listener to close notification
    notificationArea.querySelector('.close-btn').addEventListener('click', () => {
        notificationArea.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notificationArea)) {
            notificationArea.remove();
        }
    }, 5000);
}

function showErrorMessage(message) {
    // Similar to success but with different styling
    const notificationArea = document.createElement('div');
    notificationArea.className = 'notification error';
    notificationArea.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="close-btn"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notificationArea);
    
    // Add event listener to close notification
    notificationArea.querySelector('.close-btn').addEventListener('click', () => {
        notificationArea.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notificationArea)) {
            notificationArea.remove();
        }
    }, 5000);
}
function storePDF(applicationCode, htmlContent) {
    // Convert the HTML to PDF using html2pdf library or similar
    // This is a placeholder - you'll need to implement actual PDF conversion
    
    // Example using html2pdf.js (you'll need to include this library)
    // html2pdf().from(htmlContent).save(`Application_${applicationCode}.pdf`);
    
    // If you want to send the PDF to the server for storage
    // You can create another endpoint for PDF upload and call it here
    
    console.log(`PDF for application ${applicationCode} would be stored here`);
    
    // If you want to store the PDF on the server, you can:
    /*
    const formData = new FormData();
    // Convert HTML to PDF blob here
    // formData.append('pdfFile', pdfBlob, `Application_${applicationCode}.pdf`);
    formData.append('applicationCode', applicationCode);
    
    fetch('http://localhost:5000/api/application/upload-pdf', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('PDF uploaded successfully:', data);
    })
    .catch(error => {
        console.error('Error uploading PDF:', error);
    });
    */
}





