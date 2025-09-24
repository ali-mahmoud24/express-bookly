const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});

/**
 * @desc    Update logged-in user's profile
 * @route   PUT /api/users/me
 * @access  Private
 */
exports.updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  Object.assign(user, req.body); // password will be hashed by pre('save')
  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;

  res.json({ success: true, data: safeUser });
});

/**
 * @desc    Create new user (Admin only)
 * @route   POST /api/users
 * @access  Private/Admin
 */
exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  const safeUser = user.toObject();
  delete safeUser.password;
  res.status(201).json({ success: true, data: safeUser });
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, data: users });
});

/**
 * @desc    Get user by ID (Admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});

/**
 * @desc    Update user by ID (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, req.body, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});

/**
 * @desc    Delete user by ID (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.userId);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, message: 'User deleted' });
});
