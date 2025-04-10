// controllers/intermediaryController.js
const Intermediary = require('../models/Intermediary.model');


// @desc    Get all intermediaries
// @route   GET /api/intermediaries
// @access  Public
const getIntermediaries = (async (req, res) => {
  const intermediaries = await Intermediary.find({});
  res.status(200).json(intermediaries);
});

// @desc    Get intermediary by ID
// @route   GET /api/intermediaries/:id
// @access  Public
const getIntermediaryById = (async (req, res) => {
  const intermediary = await Intermediary.findById(req.params.id);
  
  if (!intermediary) {
    res.status(404);
    throw new Error('Intermediary not found');
  }
  
  res.status(200).json(intermediary);
});

// @desc    Get intermediary by code
// @route   GET /api/intermediaries/code/:code
// @access  Public
const getIntermediaryByCode = (async (req, res) => {
  const intermediary = await Intermediary.findOne({ 
    intermediaryCode: req.params.code.toUpperCase() 
  });
  
  if (!intermediary) {
    res.status(404);
    throw new Error('Intermediary not found');
  }
  
  res.status(200).json(intermediary);
});

// @desc    Create a new intermediary
// @route   POST /api/intermediaries
// @access  Private
const createIntermediary = (async (req, res) => {
  const { name, email, phoneNumber, address, intermediaryCode } = req.body;
  
  // Check if intermediary with this email already exists
  const intermediaryExists = await Intermediary.findOne({ email });
  
  if (intermediaryExists) {
    res.status(400);
    throw new Error('Intermediary with this email already exists');
  }
  
  // Check if custom intermediaryCode is provided and if it's already in use
  if (intermediaryCode) {
    const codeExists = await Intermediary.findOne({ 
      intermediaryCode: intermediaryCode.toUpperCase() 
    });
    
    if (codeExists) {
      res.status(400);
      throw new Error('Intermediary code is already in use');
    }
  }
  
  const intermediary = await Intermediary.create({
    name,
    email,
    phoneNumber,
    address,
    ...(intermediaryCode && { intermediaryCode: intermediaryCode.toUpperCase() })
  });
  
  if (intermediary) {
    res.status(201).json(intermediary);
  } else {
    res.status(400);
    throw new Error('Invalid intermediary data');
  }
});

// @desc    Update an intermediary
// @route   PUT /api/intermediaries/:id
// @access  Private
const updateIntermediary = (async (req, res) => {
  const intermediary = await Intermediary.findById(req.params.id);
  
  if (!intermediary) {
    res.status(404);
    throw new Error('Intermediary not found');
  }
  
  // Check if trying to update intermediaryCode and if it's already in use
  if (req.body.intermediaryCode && req.body.intermediaryCode !== intermediary.intermediaryCode) {
    const codeExists = await Intermediary.findOne({ 
      intermediaryCode: req.body.intermediaryCode.toUpperCase() 
    });
    
    if (codeExists) {
      res.status(400);
      throw new Error('Intermediary code is already in use');
    }
    
    // Convert code to uppercase
    req.body.intermediaryCode = req.body.intermediaryCode.toUpperCase();
  }
  
  const updatedIntermediary = await Intermediary.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  );
  
  res.status(200).json(updatedIntermediary);
});

// @desc    Delete an intermediary
// @route   DELETE /api/intermediaries/:id
// @access  Private
const deleteIntermediary = (async (req, res) => {
  const intermediary = await Intermediary.findById(req.params.id);
  
  if (!intermediary) {
    res.status(404);
    throw new Error('Intermediary not found');
  }
  
  await intermediary.deleteOne();
  
  res.status(200).json({ message: 'Intermediary removed' });
});

module.exports = {
  getIntermediaries,
  getIntermediaryById,
  getIntermediaryByCode,
  createIntermediary,
  updateIntermediary,
  deleteIntermediary
};