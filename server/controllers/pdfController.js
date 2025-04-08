const PDFDocument = require('pdfkit');
const Application = require('../models/Application');
const fs = require('fs');
const path = require('path');

// Generate PDF for application
exports.generatePDF = async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Find the application
        const application = await Application.findById(applicationId)
            .populate('user')
            .populate('quote');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Create a new PDF document
        const doc = new PDFDocument();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=application-${applicationId}.pdf`);

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add content to the PDF
        doc.fontSize(20).text('Health Insurance Application', { align: 'center' });
        doc.moveDown();

        // Personal Information Section
        doc.fontSize(16).text('Personal Information');
        doc.fontSize(12);
        doc.text(`Name: ${application.personalInfo.fullName}`);
        doc.text(`Date of Birth: ${application.personalInfo.dateOfBirth}`);
        doc.text(`Age: ${application.personalInfo.age}`);
        doc.text(`Gender: ${application.personalInfo.gender}`);
        doc.text(`Marital Status: ${application.personalInfo.maritalStatus}`);
        doc.text(`Occupation: ${application.personalInfo.occupation}`);
        doc.text(`Annual Income: ${application.personalInfo.annualIncome}`);
        doc.moveDown();

        // Health Information Section
        doc.fontSize(16).text('Health Information');
        doc.fontSize(12);
        doc.text(`Height: ${application.healthInfo.height} cm`);
        doc.text(`Weight: ${application.healthInfo.weight} kg`);
        doc.text(`BMI: ${application.healthInfo.bmi}`);
        doc.text(`Blood Group: ${application.healthInfo.bloodGroup}`);
        doc.moveDown();

        // Pre-existing Conditions
        if (application.healthInfo.preExistingConditions.length > 0) {
            doc.fontSize(16).text('Pre-existing Conditions');
            doc.fontSize(12);
            application.healthInfo.preExistingConditions.forEach(condition => {
                doc.text(`- ${condition.condition}`);
                doc.text(`  Diagnosed: ${condition.diagnosedDate}`);
                doc.text(`  Treatment: ${condition.treatment}`);
                doc.text(`  Current Status: ${condition.currentStatus}`);
                doc.moveDown();
            });
        }

        // Contact Information Section
        doc.fontSize(16).text('Contact Information');
        doc.fontSize(12);
        doc.text(`Email: ${application.contactInfo.email}`);
        doc.text(`Phone: ${application.contactInfo.phone}`);
        doc.text(`Alternate Phone: ${application.contactInfo.alternatePhone}`);
        doc.text(`Address: ${application.contactInfo.address.addressLine}`);
        doc.text(`City: ${application.contactInfo.address.city}`);
        doc.text(`State: ${application.contactInfo.address.state}`);
        doc.text(`PIN Code: ${application.contactInfo.address.pincode}`);
        doc.moveDown();

        // Nominee Information Section
        doc.fontSize(16).text('Nominee Information');
        doc.fontSize(12);
        doc.text(`Name: ${application.nomineeInfo.name}`);
        doc.text(`Relationship: ${application.nomineeInfo.relationship}`);
        doc.text(`Date of Birth: ${application.nomineeInfo.dateOfBirth}`);
        doc.text(`Contact Number: ${application.nomineeInfo.contactNumber}`);
        doc.text(`Address: ${application.nomineeInfo.address.addressLine}`);
        doc.text(`City: ${application.nomineeInfo.address.city}`);
        doc.text(`State: ${application.nomineeInfo.address.state}`);
        doc.text(`PIN Code: ${application.nomineeInfo.address.pincode}`);
        doc.moveDown();

        // Insurance Details Section
        doc.fontSize(16).text('Insurance Details');
        doc.fontSize(12);
        doc.text(`Plan Type: ${application.quote.insuranceDetails.planType}`);
        doc.text(`Sub Plan: ${application.quote.insuranceDetails.subPlan}`);
        doc.text(`Sum Insured: ₹${application.quote.insuranceDetails.sumInsured}`);
        doc.text(`Go Green: ${application.quote.insuranceDetails.goGreen ? 'Yes' : 'No'}`);
        doc.text(`Covers: ${application.quote.insuranceDetails.covers.join(', ')}`);
        doc.moveDown();

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
}; 