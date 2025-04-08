const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware, quoteController.createQuote);
router.get('/:token', authMiddleware, quoteController.getQuoteByToken);
router.get('/', authMiddleware, quoteController.getUserQuotes);

module.exports = router; 