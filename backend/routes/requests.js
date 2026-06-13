const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BloodRequest = require('../models/BloodRequest');
const { protect, adminOnly } = require('../middleware/auth');

// @route  GET /api/requests
// @desc   Get all blood requests
// @access Public
router.get('/', async (req, res) => {
  try {
    const { status, bloodGroup, urgencyLevel, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BloodRequest.countDocuments(query);
    const requests = await BloodRequest.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: requests.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  GET /api/requests/my
// @desc   Get current user's blood requests
// @access Private
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  GET /api/requests/:id
// @desc   Get single blood request
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate('user', 'name');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  POST /api/requests
// @desc   Create blood request
// @access Private
router.post('/', protect, [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  body('unitsRequired').isInt({ min: 1, max: 20 }).withMessage('Units must be between 1 and 20'),
  body('hospitalName').trim().notEmpty().withMessage('Hospital name is required'),
  body('contactNumber').matches(/^[0-9]{10,15}$/).withMessage('Enter a valid contact number'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('urgencyLevel').isIn(['Low', 'Medium', 'High']).withMessage('Invalid urgency level')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const request = await BloodRequest.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, message: 'Blood request submitted successfully', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  PUT /api/requests/:id
// @desc   Update blood request
// @access Private
router.put('/:id', protect, async (req, res) => {
  try {
    let request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    // Only owner or admin can update
    if (request.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this request' });
    }

    request = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Blood request updated successfully', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  DELETE /api/requests/:id
// @desc   Delete blood request
// @access Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    if (request.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this request' });
    }

    await BloodRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blood request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
