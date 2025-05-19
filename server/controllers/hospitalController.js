// controllers/hospitalController.js
const Hospital = require('../models/hospitalModel'); // Assuming you have a Hospital model


// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
exports.getHospitals = async (req, res) => {
  const hospitals = await Hospital.find();
  res.status(200).json({ success: true, count: hospitals.length, data: hospitals });
};

// @desc    Get single hospital
// @route   GET /api/hospitals/:id
// @access  Public
exports.getHospital = async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }
  
  res.status(200).json({ success: true, data: hospital });
};

// @desc    Create new hospital
// @route   POST /api/hospitals
// @access  Private
exports.createHospital = async (req, res) => {
  const hospital = await Hospital.create(req.body);
  res.status(201).json({ success: true, data: hospital });
};

// @desc    Update hospital
// @route   PUT /api/hospitals/:id
// @access  Private
exports.updateHospital = async (req, res) => {
  let hospital = await Hospital.findById(req.params.id);
  
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }
  
  hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({ success: true, data: hospital });
};

// @desc    Delete hospital
// @route   DELETE /api/hospitals/:id
// @access  Private
exports.deleteHospital = async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }
  
  await hospital.deleteOne();
  
  res.status(200).json({ success: true, data: {} });
};
