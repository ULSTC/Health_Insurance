const mongoose = require('mongoose');
const crypto = require('crypto');

const HospitalSchema = new mongoose.Schema({
  networkHospitalName: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  hospitalId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  completeAddress: {
    type: String,
    required: [true, 'Complete address is required'],
    trim: true
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

// Update the timestamp before saving
HospitalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate a unique hospital ID if none exists
  if (!this.hospitalId) {
    this.hospitalId = generateHospitalId(this);
  }
  
  next();
});

/**
 * Generate a unique hospital ID based on hospital name, city, and a random string
 * Format: [First 3 chars of hospital name]-[First 2 chars of city]-[Random 4 chars]
 * @param {Object} hospital - The hospital document
 * @returns {String} - The generated hospital ID
 */
function generateHospitalId(hospital) {
  const namePrefix = hospital.networkHospitalName.replace(/\W/g, '').substring(0, 3).toUpperCase();
  const cityPrefix = hospital.city.replace(/\W/g, '').substring(0, 2).toUpperCase();
  const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
  
  return `${namePrefix}-${cityPrefix}-${randomStr}`;
}

module.exports = mongoose.model('Hospital', HospitalSchema);