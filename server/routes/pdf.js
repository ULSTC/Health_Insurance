const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware');

// Generate PDF for an application
router.get('/:applicationId', authMiddleware, pdfController.generatePDF);

module.exports = router; 