const User = require('../models/User');
const Claim = require('../models/Claim');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const pendingClaims = await Claim.countDocuments({ status: 'pending' });
        const approvedClaims = await Claim.countDocuments({ status: 'approved' });
        const rejectedClaims = await Claim.countDocuments({ status: 'rejected' });
        const totalUsers = await User.countDocuments({ userType: 'normal' });

        res.json({
            pendingClaims,
            approvedClaims,
            rejectedClaims,
            totalUsers
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
};

// Get claims with filters
exports.getClaims = async (req, res) => {
    try {
        const { status, claimType, startDate, endDate, search } = req.query;
        
        let query = {};
        
        // Apply filters
        if (status && status !== 'all') {
            query.status = status;
        }
        
        if (claimType && claimType !== 'all') {
            query.claimType = claimType;
        }
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        if (search) {
            query.$or = [
                { claimId: { $regex: search, $options: 'i' } },
                { 'hospitalInfo.name': { $regex: search, $options: 'i' } }
            ];
        }

        const claims = await Claim.find(query)
            .populate('applicationId', 'applicationCode')
            .sort({ createdAt: -1 });

        // Transform the data to match the frontend expectations
        const transformedClaims = claims.map(claim => ({
            _id: claim._id,
            claimId: claim.claimId,
            user: {
                fullName: claim.applicationId ? claim.applicationId.applicationCode : 'N/A'
            },
            claimType: claim.claimType,
            createdAt: claim.createdAt,
            amount: claim.expenseInfo ? claim.expenseInfo.totalAmount : 0,
            status: claim.status,
            hospitalInfo: claim.hospitalInfo,
            treatmentInfo: claim.treatmentInfo
        }));

        res.json(transformedClaims);
    } catch (error) {
        console.error('Error fetching claims:', error);
        res.status(500).json({ message: 'Error fetching claims', error: error.message });
    }
};

// Update claim status
exports.updateClaimStatus = async (req, res) => {
    try {
        const { claimId } = req.params;
        const { status, notes } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be either "approved" or "rejected"'
            });
        }

        const claim = await Claim.findById(claimId)
            .populate({
                path: 'applicationId',
                select: 'applicationCode policyNumber user personalInfo',
                populate: {
                    path: 'user',
                    select: 'fullName email phone'
                }
            });
        
        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        // Update claim status and notes
        claim.status = status;
        if (notes) {
            claim.notes = notes;
        }
        
        await claim.save();

        // Transform the data to match the frontend expectations
        const transformedClaim = {
            _id: claim._id,
            claimId: claim.claimId,
            claimType: claim.claimType,
            claimSubType: claim.claimSubType,
            requestType: claim.requestType,
            status: claim.status,
            createdAt: claim.createdAt,
            policyNumber: claim.applicationId?.applicationCode || 'N/A',
            user: {
                fullName: claim.applicationId?.personalInfo?.fullName || 'N/A',
                email: claim.applicationId?.personalInfo?.email || 'N/A',
                phone: claim.applicationId?.personalInfo?.phone || 'N/A',
                dateOfBirth: claim.applicationId?.personalInfo?.dateOfBirth ? new Date(claim.applicationId.personalInfo.dateOfBirth).toLocaleDateString() : 'N/A',
                gender: claim.applicationId?.personalInfo?.gender || 'N/A'
            },
            hospitalInfo: claim.hospitalInfo || {},
            treatmentInfo: claim.treatmentInfo || {},
            expenseInfo: claim.expenseInfo || {},
            documents: claim.documents || {},
            notes: claim.notes || ''
        };

        res.json({
            success: true,
            message: `Claim ${status} successfully`,
            data: transformedClaim
        });
    } catch (error) {
        console.error('Error updating claim status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating claim status',
            error: error.message
        });
    }
};

// Get claim by ID
exports.getClaimById = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.claimId)
            .populate({
                path: 'applicationId',
                select: 'applicationCode policyNumber personalInfo',
                populate: {
                    path: 'user',
                    select: 'fullName email phone dateOfBirth gender'
                }
            });

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        // Transform the response to include all necessary details
        const transformedClaim = {
            _id: claim._id,
            claimId: claim.claimId,
            claimType: claim.claimType,
            status: claim.status,
            notes: claim.notes,
            createdAt: claim.createdAt,
            policyNumber: claim.applicationId?.applicationCode,
            user: claim.applicationId?.user,
            hospitalInfo: claim.hospitalInfo,
            treatmentInfo: claim.treatmentInfo,
            expenseInfo: claim.expenseInfo,
            documents: claim.documents
        };

        res.json({
            success: true,
            data: transformedClaim
        });
    } catch (error) {
        console.error('Error fetching claim:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching claim details'
        });
    }
}; 
 