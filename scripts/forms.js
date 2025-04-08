document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const quoteForm = document.getElementById('quote-form');
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    const ageInput = document.getElementById('age');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiInput = document.getElementById('bmi');

    // Calculate age from date of birth
    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    // Calculate BMI from height and weight
    function calculateBMI(heightCm, weightKg) {
        if (heightCm && weightKg) {
            const heightM = heightCm / 100;
            const bmi = (weightKg / (heightM * heightM)).toFixed(1);
            return bmi;
        }
        return '';
    }

    // Update age when date of birth changes
    dateOfBirthInput.addEventListener('change', (e) => {
        if (e.target.value) {
            const age = calculateAge(e.target.value);
            ageInput.value = age;
        } else {
            ageInput.value = '';
        }
    });

    // Update BMI when height or weight changes
    function updateBMI() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        bmiInput.value = calculateBMI(height, weight);
    }

    heightInput.addEventListener('input', updateBMI);
    weightInput.addEventListener('input', updateBMI);

    // Form Validation
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Quick Quote Form Submission
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm(quoteForm)) {
            showError('Please fill in all required fields');
            return;
        }

        // Collect form data
        const formData = {
            personalInfo: {
                fullName: document.getElementById('fullName').value,
                dateOfBirth: dateOfBirthInput.value,
                age: ageInput.value,
                gender: document.getElementById('gender').value,
                relationship: document.getElementById('relationship').value
            },
            healthInfo: {
                height: heightInput.value,
                weight: weightInput.value,
                bmi: bmiInput.value,
                bloodGroup: document.getElementById('bloodGroup').value,
                preExistingConditions: Array.from(document.querySelectorAll('input[name="conditions"]:checked'))
                    .map(checkbox => checkbox.value),
                lifestyle: Array.from(document.querySelectorAll('input[name="lifestyle"]:checked'))
                    .map(checkbox => checkbox.value)
            },
            contactInfo: {
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            }
        };

        // Here you would typically send this data to your backend
        console.log('Form Data:', formData);
        
        // Show success message (you can customize this based on your needs)
        alert('Thank you! Your quote request has been submitted successfully.');
        quoteForm.reset();
    });

    // Mock function to get quote
    async function mockGetQuote(formData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock quote calculation
        const basePremium = 1000;
        const bmiMultiplier = formData.bmi > 30 ? 1.2 : 1;
        const coverMultiplier = formData.covers.length * 0.1 + 1;
        
        const totalPremium = basePremium * bmiMultiplier * coverMultiplier;
        
        return {
            success: true,
            quote: {
                premium: totalPremium.toFixed(2),
                covers: formData.covers,
                plan: formData.plan,
                goGreen: formData.goGreen
            }
        };
    }

    // Utility functions for showing messages
    function showError(message) {
        // TODO: Implement proper error message display
        alert(message);
    }

    function showSuccess(message) {
        // TODO: Implement proper success message display
        alert(message);
    }

    // Form field validation
    function setupFormValidation() {
        const inputs = document.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
        });
    }

    setupFormValidation();

    // Application Section Functionality
    function initializeApplicationSection() {
        const navItems = document.querySelectorAll('.nav-item');
        const applicationForms = document.querySelectorAll('.application-form');
        const addMemberBtn = document.getElementById('add-member');
        const memberList = document.getElementById('member-list');

        // Handle navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Show corresponding form
                const targetSection = item.getAttribute('data-section');
                applicationForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${targetSection}-form`) {
                        form.classList.add('active');
                    }
                });
            });
        });

        // Handle adding new member
        if (addMemberBtn && memberList) {
            addMemberBtn.addEventListener('click', () => {
                const memberCard = document.createElement('div');
                memberCard.className = 'member-card';
                memberCard.innerHTML = `
                    <div class="form-row">
                        <div class="form-group">
                            <label for="member-name">Full Name</label>
                            <input type="text" id="member-name" required>
                        </div>
                        <div class="form-group">
                            <label for="member-relationship">Relationship</label>
                            <select id="member-relationship" required>
                                <option value="">Select Relationship</option>
                                <option value="self">Self</option>
                                <option value="spouse">Spouse</option>
                                <option value="child">Child</option>
                                <option value="parent">Parent</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="member-dob">Date of Birth</label>
                            <input type="date" id="member-dob" required>
                        </div>
                    </div>
                    <button type="button" class="btn-secondary remove-member">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                `;

                // Add remove functionality
                const removeBtn = memberCard.querySelector('.remove-member');
                removeBtn.addEventListener('click', () => {
                    memberCard.remove();
                });

                memberList.appendChild(memberCard);
            });
        }

        // Handle form submissions
        const forms = document.querySelectorAll('.application-form form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Here you would typically save the form data and proceed to the next section
                const formData = new FormData(form);
                console.log('Form Data:', Object.fromEntries(formData));
                
                // Find next section
                const currentNav = document.querySelector('.nav-item.active');
                const nextNav = currentNav.nextElementSibling;
                if (nextNav) {
                    nextNav.click();
                }
            });
        });
    }

    initializeApplicationSection();
}); 