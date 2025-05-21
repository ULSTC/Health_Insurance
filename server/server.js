const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const claimsUploadsDir = path.join(uploadsDir, 'claims');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(claimsUploadsDir)) {
    fs.mkdirSync(claimsUploadsDir);
}

// Import routes
const authRoutes = require('./routes/auth');
const quoteRoutes = require('./routes/quote');
const applicationRoutes = require('./routes/application');
const uploadRoutes = require('./routes/upload');
const pdfRoutes = require('./routes/pdf');
const intermediaryRoutes = require('./routes/Intermediary.route'); // Assuming you have this route
const claimRoutes = require('./routes/claim');
const hospitalRoutes = require('./routes/hospitalRoutes'); // Assuming you have this route
const adminRoutes = require('./routes/admin');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/claims', express.static(path.join(__dirname, 'uploads', 'claims')));

// Connect to MongoDB
console.log(process.env.MONGODB_URI," aa raha hai kya")
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));
  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/intermediary', intermediaryRoutes); 
app.use('/api/claims', claimRoutes);
app.use('/api/hospitals', hospitalRoutes); // Assuming you have this route
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
