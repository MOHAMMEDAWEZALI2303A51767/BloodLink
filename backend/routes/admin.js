const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// @route  GET /api/admin/stats
// @desc   Get dashboard statistics
// @access Admin
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalDonors, totalRequests, availableDonors, pendingRequests, highUrgencyRequests] = await Promise.all([
      User.countDocuments(),
      Donor.countDocuments(),
      BloodRequest.countDocuments(),
      Donor.countDocuments({ isAvailable: true }),
      BloodRequest.countDocuments({ status: 'Pending' }),
      BloodRequest.countDocuments({ urgencyLevel: 'High', status: 'Pending' })
    ]);

    // Blood group distribution
    const bloodGroupStats = await Donor.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity
    const recentDonors = await Donor.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');
    const recentRequests = await BloodRequest.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalRequests,
        availableDonors,
        pendingRequests,
        highUrgencyRequests,
        bloodGroupStats,
        recentDonors,
        recentRequests
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  GET /api/admin/users
// @desc   Get all users
// @access Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  DELETE /api/admin/users/:id
// @desc   Delete a user
// @access Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Also delete associated donor profile
    await Donor.deleteOne({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User and associated data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  GET /api/admin/donors
// @desc   Get all donors (admin view)
// @access Admin
router.get('/donors', async (req, res) => {
  try {
    const donors = await Donor.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, donors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  GET /api/admin/requests
// @desc   Get all blood requests (admin view)
// @access Admin
router.get('/requests', async (req, res) => {
  try {
    const requests = await BloodRequest.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  PUT /api/admin/requests/:id/status
// @desc   Update blood request status
// @access Admin
router.put('/requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Fulfilled', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, message: 'Status updated', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
