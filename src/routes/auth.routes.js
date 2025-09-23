const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validation.middleware');
const {
  userRegisterSchema,
  userLoginSchema,
} = require('../schemas/user.schema');

const router = express.Router();

// ===============================
// 🔹 Helpers
// ===============================

/**
 * Generate JWT token
 * @param {string} id - User ID
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });
};

/**
 * Send JWT via HTTP-only cookie
 * @param {object} user - User document
 * @param {number} statusCode - HTTP status
 * @param {object} res - Express response
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    })
    .json({
      success: true,
      id: user._id,
      name: user.name,
      email: user.email,
    });
};

// ===============================
// 🔹 Routes
// ===============================

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  validate(userRegisterSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(400, 'User already exists');

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user
 * @access  Public
 */
router.post(
  '/login',
  validate(userLoginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) throw new ApiError(401, 'Invalid credentials');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');

    sendTokenResponse(user, 200, res);
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear cookie)
 * @access  Public
 */
router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
    });

    res.json({ success: true, message: 'Logged out successfully' });
  })
);

module.exports = router;
