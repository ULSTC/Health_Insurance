const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote',
        required: true
    },
    personalInfo: {
        fullName: String,
        dateOfBirth: Date,
        age: Number,
        gender: String,
        relationship: String,
        maritalStatus: String,
        occupation: String,
        annualIncome: Number
    },
    healthInfo: {
        height: Number,
        weight: Number,
        bmi: Number,
        bloodGroup: String,
        preExistingConditions: [{
            condition: String,
            diagnosedDate: Date,
            treatment: String,
            currentStatus: String
        }],
        lifestyle: [{
            habit: String,
            frequency: String,
            duration: String
        }],
        familyHistory: [{
            relation: String,
            condition: String,
            ageAtDiagnosis: Number
        }]
    },
    contactInfo: {
        email: String,
        phone: String,
        alternatePhone: String,
        address: {
            pincode: String,
            state: String,
            city: String,
            addressLine: String
        }
    },
    nomineeInfo: {
        name: String,
        relationship: String,
        dateOfBirth: Date,
        contactNumber: String,
        address: {
            pincode: String,
            state: String,
            city: String,
            addressLine: String
        }
    },
    documents: {
        kyc: [{
            type: String,
            url: String,
            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending'
            }
        }],
        medicalReports: [{
            type: String,
            url: String,
            date: Date
        }]
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'under-review', 'approved', 'rejected'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
applicationSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Application', applicationSchema); 