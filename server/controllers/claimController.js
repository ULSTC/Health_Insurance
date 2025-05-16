const Claim = require('../models/Claim');
const Application = require('../models/Application');

// Submit a new claim
exports.submitClaim = async (req, res) => {
    try {
        const { applicationId, claimType, claimSubType, requestType, hospitalInfo, treatmentInfo, expenseInfo } = req.body;

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
            hospitalInfo,
            treatmentInfo,
            expenseInfo
        });

        // Save claim
        await claim.save();

        res.status(201).json({
            success: true,
            message: 'Claim submitted successfully',
            data: {
                claimId: claim.claimId,
                status: claim.status
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

// Get claim by ID
exports.getClaimById = async (req, res) => {
    try {
        const claim = await Claim.findOne({ claimId: req.params.id })
            .populate('applicationId', 'applicationCode');

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        res.status(200).json({
            success: true,
            data: claim
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving claim'
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