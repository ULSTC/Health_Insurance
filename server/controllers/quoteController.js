// controllers/quoteController.js
const Quote = require('../models/Quote');
const Intermediary = require('../models/Intermediary.model'); // Fixed path to match your file structure

// Create a new quote
exports.createQuote = async (req, res) => {
  try {
    // Check if the intermediary exists
    const intermediary = await Intermediary.findOne({ 
      intermediaryCode: req.body.businessInfo.intermediaryCode 
    });
    
    if (!intermediary) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid intermediary code' 
      });
    }
    
    // Create a new quote
    const quote = new Quote(req.body);
    
    // Calculate BMI if height and weight are provided
    if (req.body.healthInfo && req.body.healthInfo.height && req.body.healthInfo.weight) {
      const heightInMeters = req.body.healthInfo.height / 100;
      const bmi = req.body.healthInfo.weight / (heightInMeters * heightInMeters);
      quote.healthInfo.bmi = parseFloat(bmi.toFixed(2));
    }
    
    // If permanentAddress.sameAsCommunication is true, copy communication address
    if (req.body.addressInfo && 
        req.body.addressInfo.permanentAddress && 
        req.body.addressInfo.permanentAddress.sameAsCommunication) {
      
      quote.addressInfo.permanentAddress = {
        ...req.body.addressInfo.communicationAddress,
        sameAsCommunication: true
      };
    }
    
    // Save the quote
    await quote.save();
    
    res.status(201).json({
      success: true,
      data: quote,
      message: 'Quote created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all quotes
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    
    res.status(200).json({
      success: true,
      count: quotes.length,
      data: quotes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single quote by ID
exports.getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single quote by quote code
exports.getQuoteByCode = async (req, res) => {
  try {
    const quote = await Quote.findOne({ quoteCode: req.params.code });
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update a quote
exports.updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      quote[key] = req.body[key];
    });
    
    // Recalculate BMI if height and weight are provided
    if (req.body.healthInfo && req.body.healthInfo.height && req.body.healthInfo.weight) {
      const heightInMeters = req.body.healthInfo.height / 100;
      const bmi = req.body.healthInfo.weight / (heightInMeters * heightInMeters);
      quote.healthInfo.bmi = parseFloat(bmi.toFixed(2));
    }
    
    // If permanentAddress.sameAsCommunication is true, copy communication address
    if (req.body.addressInfo && 
        req.body.addressInfo.permanentAddress && 
        req.body.addressInfo.permanentAddress.sameAsCommunication) {
      
      quote.addressInfo.permanentAddress = {
        ...req.body.addressInfo.communicationAddress,
        sameAsCommunication: true
      };
    }
    
    await quote.save();
    
    res.status(200).json({
      success: true,
      data: quote,
      message: 'Quote updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a quote
exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }
    
    await quote.deleteOne(); // Changed from remove() to deleteOne() as remove() is deprecated
    
    res.status(200).json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Generate a premium calculation
exports.calculatePremium = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }
    
    // Basic premium calculation logic (this is just an example)
    let basePremium = 5000; // Base premium amount
    
    // Adjust based on policy plan
    const planMultipliers = {
      'gold': 1.5,
      'silver': 1.0,
      'platinum': 2.0
    };
    
    // Adjust based on cover type
    const coverTypeMultipliers = {
      'single': 1.0,
      'family': 1.8
    };
    
    // Adjust based on age
    const age = quote.personalInfo.age;
    let ageMultiplier = 1.0;
    
    if (age < 30) {
      ageMultiplier = 0.8;
    } else if (age >= 30 && age < 45) {
      ageMultiplier = 1.0;
    } else if (age >= 45 && age < 60) {
      ageMultiplier = 1.5;
    } else {
      ageMultiplier = 2.0;
    }
    
    // Adjust based on pre-existing conditions
    const conditionCount = quote.healthInfo.preExistingConditions.length;
    const conditionMultiplier = 1.0 + (conditionCount * 0.1);
    
    // Calculate the premium
    const premium = basePremium * 
                   planMultipliers[quote.policyInfo.policyPlan] * 
                   coverTypeMultipliers[quote.policyInfo.coverType] * 
                   ageMultiplier * 
                   conditionMultiplier;
    
    // Update the quote with the calculated premium
    quote.premiumAmount = Math.round(premium);
    await quote.save();
    
    res.status(200).json({
      success: true,
      data: {
        quoteCode: quote.quoteCode,
        premiumAmount: quote.premiumAmount
      },
      message: 'Premium calculated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};