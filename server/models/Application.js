// models/Application.model.js
const mongoose = require('mongoose');

// Function to generate a random alphanumeric application code
function generateApplicationCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return 'APP-' + code;
}

const applicationSchema = new mongoose.Schema({
  // Application identification
  applicationCode: {
    type: String,
    required: true,
    unique: true
  },
  quoteReference: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected', 'active'],
    default: 'draft'
  },
  personalInfo: [{
    fullName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    relationship: {
      type: String,
      enum: ['self', 'spouse', 'father', 'mother', 'child', 'sibling'],
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  }],
  healthInfo: [{
    height: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    bmi: {
      type: Number,
      required: true
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', null],
        message: 'Invalid blood group value'
      },
      required: false,
      default: null
    },
    preExistingConditions: [{
      type: String,
      enum: ['diabetes', 'hypertension', 'heart-disease', 'asthma']
    }]
  }],
  businessInfo: {
    country: String,
    state: String,
    city: String,
    lineOfBusiness: String,
    typeOfBusiness: String,
    policyStartDate: Date,
    policyEndDate: Date,
    intermediaryCode: String,
    intermediaryName: String,
    intermediaryEmail: String
  },
  policyInfo: {
    premiumType: String,
    coverType: String,
    policyPlan: String,
    sumInsured: Number,
    policyTenure: Number
  },
  addressInfo: {
    communicationAddress: {
      lineOfAddress: String,
      pinCode: String,
      country: String,
      state: String,
      city: String
    },
    permanentAddress: {
      sameAsCommunication: Boolean,
      lineOfAddress: String,
      pinCode: String,
      country: String,
      state: String,
      city: String
    }
  },
  premiumDetails: {
    basePremium: Number,
    taxAmount: Number,
    totalPremium: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to ensure applicationCode is unique
applicationSchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    // Check if code already exists
    let codeExists = true;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (codeExists && attempts < maxAttempts) {
      attempts++;
      const existingApplication = await mongoose.models.Application.findOne({ 
        applicationCode: doc.applicationCode 
      });
      
      if (!existingApplication) {
        codeExists = false;
      } else {
        // Generate a new code if the current one exists
        doc.applicationCode = generateApplicationCode();
      }
    }
    
    if (attempts >= maxAttempts) {
      return next(new Error('Could not generate a unique application code after multiple attempts'));
    }
  }
  this.updatedAt = Date.now();
  next();
});

// Validate permanent address fields if sameAsCommunication is false
applicationSchema.pre('validate', function(next) {
  if (!this.addressInfo.permanentAddress.sameAsCommunication) {
    const permanentAddress = this.addressInfo.permanentAddress;
    
    if (!permanentAddress.lineOfAddress || !permanentAddress.pinCode || 
        !permanentAddress.country || !permanentAddress.state || !permanentAddress.city) {
      return next(new Error('All permanent address fields are required when not same as communication address'));
    }
  } else {
    // Copy communication address to permanent address
    this.addressInfo.permanentAddress.lineOfAddress = this.addressInfo.communicationAddress.lineOfAddress;
    this.addressInfo.permanentAddress.pinCode = this.addressInfo.communicationAddress.pinCode;
    this.addressInfo.permanentAddress.country = this.addressInfo.communicationAddress.country;
    this.addressInfo.permanentAddress.state = this.addressInfo.communicationAddress.state;
    this.addressInfo.permanentAddress.city = this.addressInfo.communicationAddress.city;
  }
  next();
});

// Method to calculate premium


const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;