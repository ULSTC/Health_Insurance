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
    unique: true,
    default: () => generateApplicationCode(),
    uppercase: true,
    index: true
  },
  easyQuote: {
    type: String,
    required: true,
    trim: true
  },
  
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Business Information
  businessInfo: {
    country: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    lineOfBusiness: {
      type: String,
      required: true,
      enum: ['accident', 'health', 'fire']
    },
    typeOfBusiness: {
      type: String,
      required: true,
      enum: ['new', 'renewal', 'portability']
    },
    policyStartDate: {
      type: Date,
      required: true
    },
    policyEndDate: {
      type: Date,
      required: true
    },
    intermediaryCode: {
      type: String,
      required: true
    },
    intermediaryName: {
      type: String,
      required: true
    },
    intermediaryEmail: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    }
  },
  
  // Policy Information
  policyInfo: {
    premiumType: {
      type: String,
      required: true,
      enum: ['annual', 'single', 'monthly']
    },
    coverType: {
      type: String,
      required: true,
      enum: ['single', 'family']
    },
    policyPlan: {
      type: String,
      required: true,
      enum: ['gold', 'silver', 'platinum']
    },
    sumInsured: {
      type: Number,
      required: true
    },
    policyTenure: {
      type: Number,
      required: true
    }
  },
  
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
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
      required: true,
      enum: ['male', 'female', 'other']
    },
    relationship: {
      type: String,
      required: true,
      enum: ['self', 'spouse', 'child', 'parent']
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  
  // Health Information
  healthInfo: {
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
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    preExistingConditions: [{
      type: String,
      enum: ['diabetes', 'hypertension', 'heart-disease', 'asthma', 'other']
    }]
  },
  
  // Address Information
  addressInfo: {
    communicationAddress: {
      lineOfAddress: {
        type: String,
        required: true,
        trim: true
      },
      pinCode: {
        type: String,
        required: true,
        trim: true
      },
      country: {
        type: String,
        required: true,
        trim: true
      },
      state: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      }
    },
    permanentAddress: {
      sameAsCommunication: {
        type: Boolean,
        default: false
      },
      lineOfAddress: {
        type: String,
        trim: true
      },
      pinCode: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      }
    }
  },
  
  // Questionnaire
  questionnaire: {
    healthConditions: [{
      type: String,
      enum: ['heart', 'diabetes', 'cancer', 'respiratory']
    }],
    medicalHistory: {
      type: String,
      trim: true
    }
  },
  
  // Premium Calculation
  premium: {
    basePremium: {
      type: String,
      
    },
    tax: {
      type: String,
      
    },
    totalPremium: {
      type: String,
      
    }
  },
  
  // PDF Document
  policyDocument: {
    contentType: String,
  },
  
  // Application status
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'active'],
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