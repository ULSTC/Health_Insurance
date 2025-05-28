// Family Floater Add Member Functionality
document.addEventListener('DOMContentLoaded', function() {
    const coverTypeSelect = document.getElementById('coverType');
    const personalInfoForm = document.getElementById('personal-info-form');
    let memberCount = 1; // Start with 1 for the primary member
    
    // Listen for changes in Premium Cover selection
    coverTypeSelect.addEventListener('change', function() {
        handleCoverTypeChange();
    });
    
    function handleCoverTypeChange() {
        const selectedValue = coverTypeSelect.value;
        const existingAddButton = document.getElementById('add-member-btn');
        const existingMembersContainer = document.getElementById('additional-members-container');
        
        if (selectedValue === 'family') {
            // Show Add Member button for Family Floater
            if (!existingAddButton) {
                createAddMemberButton();
            }
            // Create container for additional members if it doesn't exist
            if (!existingMembersContainer) {
                createAdditionalMembersContainer();
            }
        } else {
            // Hide Add Member button and remove additional members for Individual
            if (existingAddButton) {
                existingAddButton.remove();
            }
            if (existingMembersContainer) {
                existingMembersContainer.remove();
            }
            // Reset member count
            memberCount = 1;
            updateMemberLabels();
        }
    }
    
    function createAddMemberButton() {
        const formActions = personalInfoForm.querySelector('.form-actions');
        const addMemberBtn = document.createElement('button');
        addMemberBtn.type = 'button';
        addMemberBtn.id = 'add-member-btn';
        addMemberBtn.className = 'btn-secondary';
        addMemberBtn.textContent = 'Add Family Member';
        addMemberBtn.style.marginRight = '10px';
        
        addMemberBtn.addEventListener('click', addFamilyMember);
        
        // Insert before the Save & Continue button
        formActions.insertBefore(addMemberBtn, formActions.firstChild);
    }
    
    function createAdditionalMembersContainer() {
        const container = document.createElement('div');
        container.id = 'additional-members-container';
        container.style.marginTop = '20px';
        
        // Insert before form actions
        const formActions = personalInfoForm.querySelector('.form-actions');
        personalInfoForm.insertBefore(container, formActions);
    }
    
    function addFamilyMember() {
        memberCount++;
        const membersContainer = document.getElementById('additional-members-container');
        
        // Create new member form
        const memberForm = createMemberForm(memberCount);
        membersContainer.appendChild(memberForm);
        
        // Update the main form title to indicate it's for primary member
        updateMemberLabels();
        
        // Add remove functionality
        const removeBtn = memberForm.querySelector('.remove-member-btn');
        removeBtn.addEventListener('click', function() {
            removeFamilyMember(memberForm, memberCount);
        });
    }
    
    function createMemberForm(memberNumber) {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'member-form';
        memberDiv.id = `member-${memberNumber}`;
        memberDiv.style.border = '1px solid #ddd';
        memberDiv.style.padding = '20px';
        memberDiv.style.marginBottom = '20px';
        memberDiv.style.borderRadius = '5px';
        memberDiv.style.backgroundColor = '#f9f9f9';
        
        memberDiv.innerHTML = `
            <div class="member-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4>Family Member ${memberNumber}</h4>
                <button type="button" class="remove-member-btn btn-danger" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                    Remove Member
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="fullName_${memberNumber}">Full Name</label>
                    <input type="text" id="fullName_${memberNumber}" name="fullName_${memberNumber}" required />
                </div>
                <div class="form-group">
                    <label for="dateOfBirth_${memberNumber}">Date of Birth</label>
                    <input type="date" id="dateOfBirth_${memberNumber}" name="dateOfBirth_${memberNumber}" required />
                </div>
                <div class="form-group">
                    <label for="age_${memberNumber}">Age</label>
                    <input type="number" id="age_${memberNumber}" name="age_${memberNumber}" readonly />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="gender_${memberNumber}">Gender</label>
                    <select id="gender_${memberNumber}" name="gender_${memberNumber}" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="relationship_${memberNumber}">Relationship</label>
                    <select id="relationship_${memberNumber}" name="relationship_${memberNumber}" required>
                        <option value="">Select Relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="mother">Mother</option>
                        <option value="father">Father</option>
                        <option value="sibling">Sibling</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="email_${memberNumber}">Email (Optional)</label>
                    <input type="email" id="email_${memberNumber}" name="email_${memberNumber}" />
                </div>
                <div class="form-group">
                    <label for="phone_${memberNumber}">Phone Number (Optional)</label>
                    <input type="tel" id="phone_${memberNumber}" name="phone_${memberNumber}" />
                </div>
            </div>
        `;
        
        // Add age calculation functionality for the new member
        const dobInput = memberDiv.querySelector(`#dateOfBirth_${memberNumber}`);
        const ageInput = memberDiv.querySelector(`#age_${memberNumber}`);
        
        dobInput.addEventListener('change', function() {
            const birthDate = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            ageInput.value = age >= 0 ? age : '';
        });
        
        return memberDiv;
    }
    
    function removeFamilyMember(memberForm, memberNumber) {
        memberForm.remove();
        memberCount--;
        updateMemberLabels();
        renumberMembers();
    }
    
    function updateMemberLabels() {
        const mainTitle = personalInfoForm.querySelector('h3');
        if (memberCount > 1) {
            mainTitle.textContent = 'Personal Information - Primary Member';
        } else {
            mainTitle.textContent = 'Personal Information';
        }
    }
    
    function renumberMembers() {
        const memberForms = document.querySelectorAll('.member-form');
        memberForms.forEach((form, index) => {
            const newNumber = index + 2; // Start from 2 since primary is 1
            const oldId = form.id;
            const oldNumber = oldId.split('-')[1];
            
            // Update form ID
            form.id = `member-${newNumber}`;
            
            // Update header
            const header = form.querySelector('h4');
            header.textContent = `Family Member ${newNumber}`;
            
            // Update all input/select IDs and names
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                const oldInputId = input.id;
                const oldInputName = input.name;
                
                if (oldInputId) {
                    input.id = oldInputId.replace(`_${oldNumber}`, `_${newNumber}`);
                }
                if (oldInputName) {
                    input.name = oldInputName.replace(`_${oldNumber}`, `_${newNumber}`);
                }
            });
            
            // Update labels
            const labels = form.querySelectorAll('label');
            labels.forEach(label => {
                const forAttr = label.getAttribute('for');
                if (forAttr && forAttr.includes(`_${oldNumber}`)) {
                    label.setAttribute('for', forAttr.replace(`_${oldNumber}`, `_${newNumber}`));
                }
            });
        });
    }
    
    // Add age calculation for primary member (if not already present)
    const primaryDob = document.getElementById('dateOfBirth');
    const primaryAge = document.getElementById('age');
    
    if (primaryDob && primaryAge) {
        primaryDob.addEventListener('change', function() {
            const birthDate = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            primaryAge.value = age >= 0 ? age : '';
        });
    }
    
    // Function to collect all member data
    window.getAllMemberData = function() {
        const allMembers = [];
        
        // Get primary member data
        const primaryData = {
            memberType: 'primary',
            fullName: document.getElementById('fullName')?.value || '',
            dateOfBirth: document.getElementById('dateOfBirth')?.value || '',
            age: document.getElementById('age')?.value || '',
            gender: document.getElementById('gender')?.value || '',
            relationship: 'self',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || ''
        };
        allMembers.push(primaryData);
        
        // Get additional family members data
        const memberForms = document.querySelectorAll('.member-form');
        memberForms.forEach((form, index) => {
            const memberNumber = index + 2;
            const memberData = {
                memberType: 'family',
                fullName: document.getElementById(`fullName_${memberNumber}`)?.value || '',
                dateOfBirth: document.getElementById(`dateOfBirth_${memberNumber}`)?.value || '',
                age: document.getElementById(`age_${memberNumber}`)?.value || '',
                gender: document.getElementById(`gender_${memberNumber}`)?.value || '',
                relationship: document.getElementById(`relationship_${memberNumber}`)?.value || '',
                email: document.getElementById(`email_${memberNumber}`)?.value || '',
                phone: document.getElementById(`phone_${memberNumber}`)?.value || ''
            };
            allMembers.push(memberData);
        });
        
        return allMembers;
    };
    
    // Initialize on page load
    handleCoverTypeChange();
});

// Add some basic CSS styles if not already present
const style = document.createElement('style');
style.textContent = `
    .btn-secondary {
        background: #6c757d;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }
    
    .btn-secondary:hover {
        background: #5a6268;
    }
    
    .btn-danger {
        background: #dc3545;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .btn-danger:hover {
        background: #c82333;
    }
    
    .member-form {
        animation: slideIn 0.3s ease-in-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);