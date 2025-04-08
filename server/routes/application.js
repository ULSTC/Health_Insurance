const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware, applicationController.createApplication);
router.put('/:applicationId', authMiddleware, applicationController.updateApplication);
router.get('/:applicationId', authMiddleware, applicationController.getApplication);
router.get('/', authMiddleware, applicationController.getUserApplications);
router.post('/:applicationId/submit', authMiddleware, applicationController.submitApplication);

module.exports = router; 