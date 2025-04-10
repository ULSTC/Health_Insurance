// routes/quote.js
const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

// Create a new quote
router.post('/', quoteController.createQuote);

// Get all quotes
router.get('/', quoteController.getAllQuotes);

// Get a single quote by ID
router.get('/id/:id', quoteController.getQuoteById);

// Get a single quote by code
router.get('/code/:code', quoteController.getQuoteByCode);

// Update a quote
router.put('/:id', quoteController.updateQuote);

// Delete a quote
router.delete('/:id', quoteController.deleteQuote);

// Calculate premium for a quote
router.post('/:id/calculate-premium', quoteController.calculatePremium);

module.exports = router;