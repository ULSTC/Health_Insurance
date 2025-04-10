// models/Intermediary.js
const mongoose = require('mongoose');

// Function to generate a random alphanumeric code
function generateIntermediaryCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const intermediarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  intermediaryCode: {
    type: String,
    unique: true,
    default: () => generateIntermediaryCode(),
    uppercase: true,
    index: true
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
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

// Pre-save hook to ensure intermediaryCode is unique
intermediarySchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    // Check if code already exists
    let codeExists = true;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (codeExists && attempts < maxAttempts) {
      attempts++;
      const existingIntermediary = await mongoose.models.Intermediary.findOne({ 
        intermediaryCode: doc.intermediaryCode 
      });
      
      if (!existingIntermediary) {
        codeExists = false;
      } else {
        // Generate a new code if the current one exists
        doc.intermediaryCode = generateIntermediaryCode();
      }
    }
    
    if (attempts >= maxAttempts) {
      return next(new Error('Could not generate a unique intermediary code after multiple attempts'));
    }
  }
  next();
});

const Intermediary = mongoose.model('Intermediary', intermediarySchema);

module.exports = Intermediary;