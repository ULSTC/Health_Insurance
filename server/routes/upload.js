const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Protected routes
router.post('/:applicationId/kyc', authMiddleware, uploadController.uploadKYC);
router.post('/:applicationId/medical', authMiddleware, uploadController.uploadMedicalReports);

module.exports = router; 