// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

// Protect routes (require authentication)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw new ApiError(401, 'User not found');
      }

      next();
    } catch (err) {
      throw new ApiError(401, 'Not authorized, token failed');
    }
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token');
  }
});

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new ApiError(403, 'Not authorized as admin');
  }
};

module.exports = { protect, isAdmin };
