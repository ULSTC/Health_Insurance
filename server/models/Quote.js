const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalInfo: {
        fullName: String,
        dateOfBirth: Date,
        age: Number,
        gender: String,
        relationship: String
    },
    healthInfo: {
        height: Number,
        weight: Number,
        bmi: Number,
        bloodGroup: String,
        preExistingConditions: [String],
        lifestyle: [String]
    },
    contactInfo: {
        email: String,
        phone: String,
        address: {
            pincode: String,
            state: String,
            city: String,
            addressLine: String
        }
    },
    insuranceDetails: {
        country: String,
        planType: String,
        subPlan: String,
        sumInsured: Number,
        goGreen: Boolean,
        covers: [String]
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quote', quoteSchema); 