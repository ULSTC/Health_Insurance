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
});
document.addEventListener("DOMContentLoaded", () => {
    const indiaStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
    ];

    function populateStateDropdown(stateId) {
        const stateDropdown = document.getElementById(stateId);

        

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
    populateStateDropdown("app-commState");
    populateStateDropdown("app-presentState");
});

// Update this event listener
document.getElementById('generate-summary').addEventListener("click", () => {
    generateApplicationSummary();
});
document.getElementById('download-summary').addEventListener("click", () => {
    generateApplicationSummary()
    const summaryContainer = document.getElementById('application-summary');

    const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5],
        filename:     'Application_Summary.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  {
            scale: 2,
            useCORS: true
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: {
            mode: ['avoid-all', 'css', 'legacy']
        }
    };

    // Ensure it's the latest summary DOM
    html2pdf().set(opt).from(summaryContainer).save();
});


function generateApplicationSummary() {
    const summaryContainer = document.getElementById('application-summary');
    
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
}





