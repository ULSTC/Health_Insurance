const Application = require('../models/Application');
const Quote = require('../models/Quote');

// Create new application
exports.createApplication = async (req, res) => {
    try {
        const { quoteToken, personalInfo, healthInfo, contactInfo, nomineeInfo } = req.body;

        // Find quote
        const quote = await Quote.findOne({ token: quoteToken });
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        // Create new application
        const application = new Application({
            user: req.user._id,
            quote: quote._id,
            personalInfo,
            healthInfo,
            contactInfo,
            nomineeInfo
        });

        await application.save();

        res.status(201).json({
            message: 'Application created successfully',
            applicationId: application._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating application', error: error.message });
    }
};

// Update application
exports.updateApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const updateData = req.body;

        const application = await Application.findOneAndUpdate(
            { _id: applicationId, user: req.user._id },
            { $set: updateData },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({
            message: 'Application updated successfully',
            application
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating application', error: error.message });
    }
};

// Get application by ID
exports.getApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findOne({
            _id: applicationId,
            user: req.user._id
        }).populate('quote');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching application', error: error.message });
    }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id })
            .populate('quote')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
};

// Submit application
exports.submitApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findOneAndUpdate(
            { _id: applicationId, user: req.user._id },
            { $set: { status: 'submitted' } },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting application', error: error.message });
    }
}; 