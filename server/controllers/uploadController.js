const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/uploads/');
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

// Upload KYC documents
exports.uploadKYC = [
    upload.array('kyc', 5),
    async (req, res) => {
        try {
            const { applicationId } = req.params;
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            const kycDocuments = files.map(file => ({
                type: req.body.type || 'other',
                url: `/uploads/${file.filename}`,
                status: 'pending'
            }));

            const application = await Application.findOneAndUpdate(
                { _id: applicationId, user: req.user._id },
                { $push: { 'documents.kyc': { $each: kycDocuments } } },
                { new: true }
            );

            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            res.json({
                message: 'KYC documents uploaded successfully',
                documents: kycDocuments
            });
        } catch (error) {
            res.status(500).json({ message: 'Error uploading documents', error: error.message });
        }
    }
];

// Upload medical reports
exports.uploadMedicalReports = [
    upload.array('medical', 5),
    async (req, res) => {
        try {
            const { applicationId } = req.params;
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            const medicalReports = files.map(file => ({
                type: req.body.type || 'other',
                url: `/uploads/${file.filename}`,
                date: new Date()
            }));

            const application = await Application.findOneAndUpdate(
                { _id: applicationId, user: req.user._id },
                { $push: { 'documents.medicalReports': { $each: medicalReports } } },
                { new: true }
            );

            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            res.json({
                message: 'Medical reports uploaded successfully',
                documents: medicalReports
            });
        } catch (error) {
            res.status(500).json({ message: 'Error uploading documents', error: error.message });
        }
    }
]; 