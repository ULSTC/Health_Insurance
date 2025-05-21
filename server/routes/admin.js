const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get dashboard statistics
router.get('/stats', adminController.getDashboardStats);

// Get claims with filters
router.get('/claims', adminController.getClaims);

// Get single claim by ID
router.get('/claims/:claimId', adminController.getClaimById);

// Update claim status
router.put('/claims/:claimId/status', adminController.updateClaimStatus);

module.exports = router; 