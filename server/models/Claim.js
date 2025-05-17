const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimId: {
    type: String,
    unique: true,
    uppercase: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  claimType: {
    type: String,
    required: true,
    enum: ['reimbursement', 'cashless']
  },
  claimSubType: {
    type: String,
    enum: ['preAuthorization', 'interim', 'postDischarge'],
    required: function() {
      return this.claimType === 'reimbursement';
    }
  },
  requestType: {
    type: String,
    enum: ['planned', 'emergency'],
    required: function() {
      return this.claimType === 'cashless';
    }
  },
  hospitalInfo: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    },
    city: String,
    state: String
  },
  treatmentInfo: {
    admissionDate: {
      type: Date,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    },
    dischargeDate: {
      type: Date,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    },
    expectedAdmissionDate: {
      type: Date,
      required: function() {
        return this.claimType === 'cashless';
      }
    },
    expectedStayDuration: {
      type: Number,
      required: function() {
        return this.claimType === 'cashless';
      }
    },
    diagnosisDetails: {
      type: String,
      required: true
    },
    treatmentType: {
      type: String,
      enum: ['medical', 'surgical', 'maternity', 'accident'],
      required: function() {
        return this.claimType === 'cashless';
      }
    },
    doctorName: {
      type: String,
      required: function() {
        return this.claimType === 'cashless';
      }
    }
  },
  expenseInfo: {
    roomCharges: {
      type: Number,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    },
    doctorFees: {
      type: Number,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    },
    medicineCost: {
      type: Number,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    },
    investigationCost: {
      type: Number,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    },
    otherCharges: {
      type: Number,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    },
    totalAmount: {
      type: Number,
      required: function() {
        return this.claimType === 'reimbursement';
      }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique claim ID before saving
claimSchema.pre('save', async function(next) {
  try {
    if (!this.claimId) {
      const count = await mongoose.model('Claim').countDocuments();
      const prefix = this.claimType === 'reimbursement' ? 'R' : 'C';
      const timestamp = Date.now().toString().slice(-4);
      this.claimId = `${prefix}${timestamp}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Claim', claimSchema); 