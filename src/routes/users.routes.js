const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required' });

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create user
    const user = new User({ name, email, password });
    const savedUser = await user.save();

    res.status(201).json({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      message: 'Login successful',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
