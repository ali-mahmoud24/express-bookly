const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  userRegisterSchema,
  userUpdateSchema,
  userSelfUpdateSchema,
} = require('../schemas/user.schema');

const router = express.Router();

// ==========================
// 👤 User's Own Profile
// ==========================

/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, data: user });
  })
);

/**
 * @route   PUT /api/users/me
 * @desc    Update logged-in user's profile (including password)
 * @access  Private
 */
router.put(
  '/me',
  protect,
  validate(userSelfUpdateSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, 'User not found');

    Object.assign(user, req.body); // password will be hashed by pre('save')
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ success: true, data: safeUser });
  })
);

// ==========================
// 👮 Admin-Only Routes
// ==========================

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  isAdmin,
  validate(userRegisterSchema),
  asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json({ success: true, data: safeUser });
  })
);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get(
  '/',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  })
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by id
 * @access  Private/Admin
 */
router.get(
  '/:id',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, data: user });
  })
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by id
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  isAdmin,
  validate(userUpdateSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, data: user });
  })
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by id
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, message: 'User deleted' });
  })
);

module.exports = router;
