// routes/application.routes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

/**
 * @route   POST /api/applications
 * @desc    Create a new application
 * @access  Private
 */
router.post('/', applicationController.createApplication);

/**
 * @route   GET /api/applications/:id
 * @desc    Get application by ID
 * @access  Private
 */
router.get('/:id', applicationController.getApplicationById);

/**
 * @route   GET /api/applications/code/:code
 * @desc    Get application by application code
 * @access  Private
 */
router.get('/code/:code', applicationController.getApplicationByCode);

/**
 * @route   PUT /api/applications/:id
 * @desc    Update application by ID
 * @access  Private
 */
router.put('/:id', applicationController.updateApplication);

/**
 * @route   POST /api/applications/:id/calculate-premium
 * @desc    Calculate premium for an application
 * @access  Private
 */
router.post('/:id/calculate-premium', applicationController.calculatePremium);

/**
 * @route   POST /api/applications/:id/generate-pdf
 * @desc    Generate PDF document for an application
 * @access  Private
 */
router.post('/:id/generate-pdf', applicationController.generatePDF);

/**
 * @route   GET /api/applications/:id/download-pdf
 * @desc    Download the generated PDF
 * @access  Private
 */
router.get('/:id/download-pdf', applicationController.downloadPDF);

/**
 * @route   POST /api/applications/:id/activate
 * @desc    Activate policy
 * @access  Private
 */
router.post('/:id/activate', applicationController.activatePolicy);

/**
 * @route   GET /api/applications
 * @desc    Get all applications with pagination
 * @access  Private
 */
router.get('/', applicationController.getAllApplications);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete application by ID
 * @access  Private
 */
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;