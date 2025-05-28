const Claim = require('../models/Claim');
const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads', 'claims'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'));
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Submit a new claim
exports.submitClaim = async (req, res) => {
    try {
        const { 
            applicationId, 
            claimType, 
            claimSubType, 
            requestType, 
            personalInfo,
            hospitalInfo, 
            treatmentInfo, 
            expenseInfo 
        } = req.body;

        // Check if application exists
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Create new claim
        const claim = new Claim({
            applicationId,
            claimType,
            claimSubType,
            requestType,
            personalInfo,
            hospitalInfo,
            treatmentInfo,
            expenseInfo
        });

        // Save claim
        await claim.save();

        // Log the claim creation for debugging
        console.log('Claim created:', {
            claimId: claim.claimId,
            status: claim.status,
            applicationId: claim.applicationId,
            personalInfo: claim.personalInfo,
            hospitalInfo: claim.hospitalInfo,
            treatmentInfo: claim.treatmentInfo
        });

        res.status(201).json({
            success: true,
            message: 'Claim submitted successfully',
            data: {
                claimId: claim.claimId,
                status: claim.status,
                applicationId: claim.applicationId,
                personalInfo: claim.personalInfo,
                hospitalInfo: claim.hospitalInfo,
                treatmentInfo: claim.treatmentInfo
            }
        });
    } catch (error) {
        console.error('Error submitting claim:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error submitting claim'
        });
    }
};

// Upload claim documents
exports.uploadClaimDocuments = [
    upload.array('documents', 5),
    async (req, res) => {
        try {
            const { claimId } = req.params;
            const { documentType } = req.body;
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            // Find the claim
            const claim = await Claim.findOne({ claimId });
            if (!claim) {
                return res.status(404).json({ message: 'Claim not found' });
            }

            // Map files to document objects with absolute URLs
            const documents = files.map(file => {
                // Get the relative path from the uploads directory
                const relativePath = path.relative(
                    path.join(__dirname, '..', 'uploads'),
                    file.path
                ).replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes

                return {
                    url: `http://localhost:5000/uploads/${relativePath}`,
                    filename: file.originalname,
                    uploadedAt: new Date()
                };
            });

            // Update the claim with the new documents
            const updateField = `documents.${documentType}`;
            await Claim.findOneAndUpdate(
                { claimId },
                { $push: { [updateField]: { $each: documents } } }
            );

            res.json({
                success: true,
                message: 'Documents uploaded successfully',
                documents: documents
            });
        } catch (error) {
            console.error('Error uploading documents:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error uploading documents'
            });
        }
    }
];

// Get claim by ID
exports.getClaimById = async (req, res) => {
    try {
        const claim = await Claim.findOne({ claimId: req.params.id })
            .populate({
                path: 'applicationId',
                select: 'applicationCode policyNumber status personalInfo businessInfo policyInfo user',
                populate: {
                    path: 'user',
                    select: 'fullName email phone'
                }
            })
            .exec();

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        res.json({
            success: true,
            data: claim
        });
    } catch (error) {
        console.error('Error fetching claim:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching claim'
        });
    }
};

// Get claims by application ID
exports.getClaimsByApplicationId = async (req, res) => {
    try {
        const claims = await Claim.find({ applicationId: req.params.applicationId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: claims
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving claims'
        });
    }
}; 