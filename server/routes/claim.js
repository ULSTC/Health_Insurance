const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const jwt = require('jsonwebtoken');

// Auth middleware
const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token, access denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Submit a new claim
router.post('/', claimController.submitClaim);

// Get claim by ID
router.get('/:id', claimController.getClaimById);

// Get claims by application ID
router.get('/application/:applicationId', claimController.getClaimsByApplicationId);

module.exports = router; 