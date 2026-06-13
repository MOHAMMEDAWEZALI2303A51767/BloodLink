const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Donor = require('../models/Donor');
const { protect, adminOnly } = require('../middleware/auth');

// @route  GET /api/donors
// @desc   Get all donors with optional filters
// @access Public
router.get('/', async (req, res) => {
  try {
    const { bloodGroup, city, available, page = 1, limit = 12 } = req.query;
    const query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (available === 'true') query.isAvailable = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Donor.countDocuments(query);
    const donors = await Donor.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: donors.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      donors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  GET /api/donors/my
// @desc   Get current user's donor profile
// @access Private
router.get('/my', protect, async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }
    res.json({ success: true, donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  GET /api/donors/:id
// @desc   Get single donor
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('user', 'name');
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }
    res.json({ success: true, donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  POST /api/donors
// @desc   Create donor profile
// @access Private
router.post('/', protect, [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('age').isInt({ min: 18, max: 65 }).withMessage('Age must be between 18 and 65'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  body('phone').matches(/^[0-9]{10,15}$/).withMessage('Enter a valid phone number'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('city').trim().notEmpty().withMessage('City is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const existing = await Donor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Donor profile already exists. Please update it instead.' });
    }

    const donor = await Donor.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, message: 'Donor profile created successfully', donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  PUT /api/donors/:id
// @desc   Update donor profile
// @access Private
router.put('/:id', protect, async (req, res) => {
  try {
    let donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    // Only owner or admin can update
    if (donor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Donor profile updated successfully', donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  DELETE /api/donors/:id
// @desc   Delete donor profile
// @access Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    // Only owner or admin can delete
    if (donor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this profile' });
    }

    await Donor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donor profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
