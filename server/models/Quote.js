// models/Quote.model.js
const mongoose = require('mongoose');

// Function to generate a random alphanumeric quote code
function generateQuoteCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return 'QT-' + code;
}

const quoteSchema = new mongoose.Schema({
  // Quote identification
  quoteCode: {
    type: String,
    unique: true,
    default: () => generateQuoteCode(),
    uppercase: true,
    index: true
  },
  token: {
    type: String,
    unique: false,
    required: true // optional, but helps
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
      required: true,
      ref: 'Intermediary'
    },
    intermediaryName: {
      type: String,
      required: true
    },
    intermediaryEmail: {
      type: String,
      required: true
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
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  
  // Health Information
  // healthInfo: {
  //   height: {
  //     type: Number,
  //     required: false
  //   },
  //   weight: {
  //     type: Number,
  //     required: false
  //   },
  //   bmi: {
  //     type: Number,
  //     required: false
  //   },
  //   bloodGroup: {
  //     type: String,
  //     required: false,
  //     enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  //   },
  //   preExistingConditions: [{
  //     type: String,
  //     enum: ['diabetes', 'hypertension', 'heart-disease', 'asthma', 'other']
  //   }]
  // },
  
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
  
  // Quote status
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft'
  },
  
  // Premium amount (to be calculated)
  premiumAmount: {
    type: Number,
    default: 0
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

// Pre-save hook to ensure quoteCode is unique
quoteSchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    // Check if code already exists
    let codeExists = true;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (codeExists && attempts < maxAttempts) {
      attempts++;
      const existingQuote = await mongoose.models.Quote.findOne({ 
        quoteCode: doc.quoteCode 
      });
      
      if (!existingQuote) {
        codeExists = false;
      } else {
        // Generate a new code if the current one exists
        doc.quoteCode = generateQuoteCode();
      }
    }
    
    if (attempts >= maxAttempts) {
      return next(new Error('Could not generate a unique quote code after multiple attempts'));
    }
  }
  next();
});

// Validate permanent address fields if sameAsCommunication is false
quoteSchema.pre('validate', function(next) {
  if (!this.addressInfo.permanentAddress.sameAsCommunication) {
    const permanentAddress = this.addressInfo.permanentAddress;
    
    if (!permanentAddress.lineOfAddress || !permanentAddress.pinCode || 
        !permanentAddress.country || !permanentAddress.state || !permanentAddress.city) {
      return next(new Error('All permanent address fields are required when not same as communication address'));
    }
  }
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;