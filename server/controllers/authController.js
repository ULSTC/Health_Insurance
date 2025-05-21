const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Signup controller
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password, userType, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            fullName,
            email,
            password,
            userType,
            phone,
            address
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Login controller
exports.login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check user type
        if (user.userType !== userType) {
            return res.status(401).json({ message: 'Invalid user type' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging in', 
            error: error.message 
        });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
}; 