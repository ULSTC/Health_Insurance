const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware');
const {generatePDF}=require('../controllers/pdfController');

// Generate PDF for an application
router.get('/:applicationId',generatePDF);

module.exports = router; 