// controllers/application.controller.js
const Application = require('../models/Application');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');
const Quote = require('../models/Quote');

/**
 * Create a new application
 */
exports.createApplication = async (req, res) => {
  try {
    const { quoteReference, personalInfo, healthInfo } = req.body;

    // Validate quote reference
    const quote = await Quote.findOne({ quoteCode: quoteReference });
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote reference not found'
      });
    }

    // Generate application code
    const applicationCode = 'APP-' + Math.random().toString(36).substr(2, 8).toUpperCase();

    // Create new application
    const application = new Application({
      applicationCode,
      quoteReference,
      personalInfo,
      healthInfo,
      businessInfo: quote.businessInfo,
      policyInfo: quote.policyInfo,
      addressInfo: {
        communicationAddress: quote.addressInfo.communicationAddress,
        permanentAddress: {
          sameAsCommunication: true,
          lineOfAddress: quote.addressInfo.communicationAddress.lineOfAddress,
          pinCode: quote.addressInfo.communicationAddress.pinCode,
          country: quote.addressInfo.communicationAddress.country,
          state: quote.addressInfo.communicationAddress.state,
          city: quote.addressInfo.communicationAddress.city
        }
      },
      status: 'draft'
    });

    await application.save();

    res.status(201).json({
      success: true,
      data: {
        applicationCode: application.applicationCode,
        status: application.status
      }
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message
    });
  }
};

/**
 * Get application by ID
 */
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

/**
 * Get application by application code
 */
exports.getApplicationByCode = async (req, res) => {
  try {
    const application = await Application.findOne({ applicationCode: req.params.code });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

/**
 * Update application by ID
 */
exports.updateApplication = async (req, res) => {
  try {
    const { personalInfo, healthInfo } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update only allowed fields
    if (personalInfo) application.personalInfo = personalInfo;
    if (healthInfo) application.healthInfo = healthInfo;

    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

/**
 * Calculate premium for an application
 */
exports.calculatePremium = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Calculate premium based on health info and policy details
    const basePremium = calculateBasePremium(application);
    const taxAmount = basePremium * 0.18; // 18% GST
    const totalPremium = basePremium + taxAmount;

    application.premiumDetails = {
      basePremium,
      taxAmount,
      totalPremium
    };

    await application.save();

    res.json({
      success: true,
      data: application.premiumDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating premium',
      error: error.message
    });
  }
};

/**
 * Helper function to calculate base premium
 */
function calculateBasePremium(application) {
  let basePremium = 0;
  
  // Calculate premium for each member based on their health info
  application.healthInfo.forEach((health, index) => {
    let memberPremium = 0;
    
    // Base premium based on age
    const age = application.personalInfo[index].age;
    if (age < 18) memberPremium = 1000;
    else if (age < 30) memberPremium = 2000;
    else if (age < 45) memberPremium = 3000;
    else if (age < 60) memberPremium = 4000;
    else memberPremium = 5000;

    // Adjust for pre-existing conditions
    if (health.preExistingConditions && health.preExistingConditions.length > 0) {
      memberPremium *= 1.5; // 50% increase for pre-existing conditions
    }

    // Adjust for BMI
    if (health.bmi > 30) {
      memberPremium *= 1.2; // 20% increase for high BMI
    }

    basePremium += memberPremium;
  });

  // Adjust for policy type
  if (application.policyInfo.coverType === 'family') {
    basePremium *= 0.9; // 10% discount for family coverage
  }

  return basePremium;
}

/**
 * Generate PDF document for an application
 */
exports.generatePDF = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Create a temporary file path
    const tempFilePath = path.join(os.tmpdir(), `${application.applicationCode}.pdf`);
    
    // Generate the PDF
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(tempFilePath);
    
    doc.pipe(stream);
    
    // Add content to PDF
    generatePDFContent(doc, application);
    
    doc.end();
    
    // Wait for the PDF to be fully written
    stream.on('finish', async () => {
      try {
        // Read the file
        const fileData = fs.readFileSync(tempFilePath);
        
        // Add the PDF to the application
        application.policyDocument = {
          data: fileData,
          contentType: 'application/pdf',
          fileName: `${application.applicationCode}_policy.pdf`
        };
        
        // Save the application with the PDF
        await application.save();
        
        // Remove temp file
        fs.unlinkSync(tempFilePath);
        
        res.status(200).json({
          success: true,
          message: 'PDF generated and saved successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to save PDF',
          error: error.message
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};

/**
 * Download the generated PDF
 */
exports.downloadPDF = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application || !application.policyDocument || !application.policyDocument.data) {
      return res.status(404).json({
        success: false,
        message: 'PDF document not found for this application'
      });
    }
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${application.policyDocument.fileName}`);
    
    // Send the PDF data
    res.send(application.policyDocument.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to download PDF',
      error: error.message
    });
  }
};

/**
 * Activate policy
 */
exports.activatePolicy = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    if (!application.policyDocument || !application.policyDocument.data) {
      return res.status(400).json({
        success: false,
        message: 'Policy document must be generated before activation'
      });
    }
    
    if (application.premium.totalPremium <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Premium must be calculated before policy activation'
      });
    }
    
    // Update status to active
    application.status = 'active';
    await application.save();
    
    res.status(200).json({
      success: true,
      message: 'Policy activated successfully',
      data: { 
        applicationCode: application.applicationCode,
        status: application.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to activate policy',
      error: error.message
    });
  }
};

/**
 * Helper function to generate PDF content
 */
function generatePDFContent(doc, application) {
  // Add logo/header
  doc.fontSize(18).text('Insurance Policy Document', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Application Code: ${application.applicationCode}`, { align: 'center' });
  doc.moveDown();
  
  // Draw horizontal line
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
  
  // Business Info Section
  doc.fontSize(16).text('Business Information', { underline: true });
  doc.moveDown();
  doc.fontSize(10);
  doc.text(`Country: ${application.businessInfo.country}`);
  doc.text(`State: ${application.businessInfo.state}`);
  doc.text(`City: ${application.businessInfo.city}`);
  doc.text(`Line of Business: ${application.businessInfo.lineOfBusiness}`);
  doc.text(`Type of Business: ${application.businessInfo.typeOfBusiness}`);
  doc.text(`Policy Period: ${new Date(application.businessInfo.policyStartDate).toLocaleDateString()} to ${new Date(application.businessInfo.policyEndDate).toLocaleDateString()}`);
  doc.moveDown();
  
  // Policy Info Section
  doc.fontSize(16).text('Policy Information', { underline: true });
  doc.moveDown();
  doc.fontSize(10);
  doc.text(`Premium Type: ${application.policyInfo.premiumType}`);
  doc.text(`Cover Type: ${application.policyInfo.coverType}`);
  doc.text(`Policy Plan: ${application.policyInfo.policyPlan}`);
  doc.text(`Sum Insured: ₹${application.policyInfo.sumInsured.toLocaleString()}`);
  doc.text(`Policy Tenure: ${application.policyInfo.policyTenure} years`);
  doc.moveDown();
  
  // Personal Info Section
  doc.fontSize(16).text('Personal Information', { underline: true });
  doc.moveDown();
  doc.fontSize(10);
  doc.text(`Full Name: ${application.personalInfo.fullName}`);
  doc.text(`Date of Birth: ${new Date(application.personalInfo.dateOfBirth).toLocaleDateString()}`);
  doc.text(`Age: ${application.personalInfo.age} years`);
  doc.text(`Gender: ${application.personalInfo.gender}`);
  doc.text(`Relationship: ${application.personalInfo.relationship}`);
  doc.text(`Email: ${application.personalInfo.email}`);
  doc.text(`Phone: ${application.personalInfo.phone}`);
  doc.moveDown();
  
  // Health Info Section
  doc.fontSize(16).text('Health Information', { underline: true });
  doc.moveDown();
  doc.fontSize(10);
  doc.text(`Height: ${application.healthInfo.height} cm`);
  doc.text(`Weight: ${application.healthInfo.weight} kg`);
  doc.text(`BMI: ${application.healthInfo.bmi}`);
  doc.text(`Blood Group: ${application.healthInfo.bloodGroup}`);
  
  if (application.healthInfo.preExistingConditions && application.healthInfo.preExistingConditions.length > 0) {
    doc.text(`Pre-existing Conditions: ${application.healthInfo.preExistingConditions.join(', ')}`);
  } else {
    doc.text('Pre-existing Conditions: None');
  }
  doc.moveDown();
  
  // Address Info Section
  doc.fontSize(16).text('Address Information', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text('Communication Address', { underline: true });
  doc.fontSize(10);
  doc.text(`${application.addressInfo.communicationAddress.lineOfAddress}`);
  doc.text(`${application.addressInfo.communicationAddress.city}, ${application.addressInfo.communicationAddress.state}, ${application.addressInfo.communicationAddress.country}`);
  doc.text(`PIN: ${application.addressInfo.communicationAddress.pinCode}`);
  doc.moveDown();
  
  doc.fontSize(12).text('Permanent Address', { underline: true });
  
  if (application.addressInfo.permanentAddress.sameAsCommunication) {
    doc.fontSize(10).text('Same as Communication Address');
  } else {
    doc.fontSize(10);
    doc.text(`${application.addressInfo.permanentAddress.lineOfAddress}`);
    doc.text(`${application.addressInfo.permanentAddress.city}, ${application.addressInfo.permanentAddress.state}, ${application.addressInfo.permanentAddress.country}`);
    doc.text(`PIN: ${application.addressInfo.permanentAddress.pinCode}`);
  }
  doc.moveDown();
  
  // Premium Section
  doc.fontSize(16).text('Premium Details', { underline: true });
  doc.moveDown();
  doc.fontSize(10);
  doc.text(`Base Premium: ₹${application.premium.basePremium.toLocaleString()}`);
  doc.text(`Tax (18% GST): ₹${application.premium.tax.toLocaleString()}`);
  doc.text(`Total Premium: ₹${application.premium.totalPremium.toLocaleString()}`, { bold: true });
  
  // Footer
  doc.fontSize(8);
  doc.moveDown(5);
  doc.text('This is a computer generated document and does not require a signature.', { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
}

/**
 * Get all applications with pagination
 */
exports.getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const applications = await Application.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Application.countDocuments();
    
    res.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

/**
 * Delete application by ID
 */
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message
    });
  }
};