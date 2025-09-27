const asyncHandler = require('express-async-handler');
const Book = require('../models/Book.model');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Create a new book
 * @route   POST /api/books
 * @access  Private/Admin
 */
exports.createBook = asyncHandler(async (req, res) => {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
});

/**
 * @desc    Get all books
 * @route   GET /api/books
 * @access  Public
 */
exports.getBooks = asyncHandler(async (req, res) => {
    const { author, category } = req.query;

    const query = {};
    if (author) query.author = author;
    if (category) query.category = category;

    const books = await Book.find(query).populate('author');
    res.json({ success: true, data: books });
});

/**
 * @desc    Get book by ID
 * @route   GET /api/books/:id
 * @access  Public
 */
exports.getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) throw new ApiError(404, 'Book not found');
    res.json({ success: true, data: book });
});

/**
 * @desc    Update book by ID
 * @route   PUT /api/books/:id
 * @access  Private/Admin
 */
exports.updateBookById = asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('author');

    if (!book) throw new ApiError(404, 'Book not found');
    res.json({ success: true, data: book });
});

/**
 * @desc    Delete book by ID
 * @route   DELETE /api/books/:id
 * @access  Private/Admin
 */
exports.deleteBookById = asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) throw new ApiError(404, 'Book not found');
    res.json({ success: true, message: 'Book deleted' });
});
