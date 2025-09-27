const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Book = require('../models/Book.model');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});

/**
 * @desc    Update logged-in user's profile
 * @route   PUT /api/users/me
 * @access  Private
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  Object.assign(user, req.body); // password hashing handled by pre('save')
  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;

  res.json({ success: true, data: safeUser });
});

/**
 * @desc    Borrow a book
 * @route   POST /api/users/me/borrow/:bookId
 * @access  Private
 */
const borrowBook = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  const book = await Book.findById(req.params.bookId);
  if (!book) throw new ApiError(404, 'Book not found');
  if (book.copiesAvailable < 1) throw new ApiError(400, 'No copies available');

  // Check if already borrowed
  if (user.borrowedBooks?.some((b) => b.toString() === book._id.toString())) {
    throw new ApiError(400, 'Book already borrowed by this user');
  }

  // Update both sides
  user.borrowedBooks = user.borrowedBooks || [];
  user.borrowedBooks.push(book._id);
  book.copiesAvailable -= 1;

  await user.save();
  await book.save();

  res.status(200).json({
    success: true,
    message: `Book "${book.title}" borrowed successfully`,
  });
});

/**
 * @desc    Return a borrowed book
 * @route   POST /api/users/me/return/:bookId
 * @access  Private
 */
const returnBook = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  const book = await Book.findById(req.params.bookId);
  if (!book) throw new ApiError(404, 'Book not found');

  // Check if borrowed
  if (!user.borrowedBooks?.some((b) => b.toString() === book._id.toString())) {
    throw new ApiError(400, 'This book was not borrowed by the user');
  }

  // Update both sides
  user.borrowedBooks = user.borrowedBooks.filter(
    (b) => b.toString() !== book._id.toString()
  );
  book.copiesAvailable += 1;

  await user.save();
  await book.save();

  res.status(200).json({
    success: true,
    message: `Book "${book.title}" returned successfully`,
  });
});

/**
 * @desc    Get all books borrowed by the logged-in user
 * @route   GET /api/users/me/books
 * @access  Private
 */
const getMyBooks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('borrowedBooks');
  if (!user) throw new ApiError(404, 'User not found');

  res.status(200).json({
    success: true,
    data: user.borrowedBooks || [],
  });
});

/**
 * @desc    Create new user (Admin only)
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUser = asyncHandler(async (req, res) => {
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
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, data: users });
});

/**
 * @desc    Get user by ID (Admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});

/**
 * @desc    Update user by ID (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUserById = asyncHandler(async (req, res) => {
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
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.userId);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, message: 'User deleted' });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  borrowBook,
  returnBook,
  getMyBooks,
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
