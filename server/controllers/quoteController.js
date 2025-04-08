const Quote = require('../models/Quote');
const crypto = require('crypto');

// Generate unique token
const generateToken = () => {
    return crypto.randomBytes(16).toString('hex');
};

// Create new quote
exports.createQuote = async (req, res) => {
    try {
        const { personalInfo, healthInfo, contactInfo, insuranceDetails } = req.body;

        // Generate unique token
        const token = generateToken();

        // Create new quote
        const quote = new Quote({
            user: req.user._id,
            personalInfo,
            healthInfo,
            contactInfo,
            insuranceDetails,
            token
        });

        await quote.save();

        res.status(201).json({
            message: 'Quote created successfully',
            token: quote.token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating quote', error: error.message });
    }
};

// Get quote by token
exports.getQuoteByToken = async (req, res) => {
    try {
        const { token } = req.params;

        const quote = await Quote.findOne({ token });
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        res.json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quote', error: error.message });
    }
};

// Get user's quotes
exports.getUserQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find({ user: req.user._id })
            .select('-user')
            .sort({ createdAt: -1 });

        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quotes', error: error.message });
    }
}; 