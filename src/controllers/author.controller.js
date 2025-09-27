const asyncHandler = require('express-async-handler');
const Author = require('../models/author.model');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Create a new author
 * @route   POST /api/authors
 * @access  Private/Admin
 */
exports.createAuthor = asyncHandler(async (req, res) => {
    const author = await Author.create(req.body);
    res.status(201).json({ success: true, data: author });
});

/**
 * @desc    Get all authors
 * @route   GET /api/authors
 * @access  Public
 */
exports.getAuthors = asyncHandler(async (req, res) => {
    const authors = await Author.find().populate('books');
    res.json({ success: true, data: authors });
});

/**
 * @desc    Get author by ID
 * @route   GET /api/authors/:id
 * @access  Public
 */
exports.getAuthorById = asyncHandler(async (req, res) => {
    const author = await Author.findById(req.authorId).populate('books');
    if (!author) throw new ApiError(404, 'Author not found');
    res.json({ success: true, data: author });
});

/**
 * @desc    Update author by ID
 * @route   PUT /api/authors/:id
 * @access  Private/Admin
 */
exports.updateAuthorById = asyncHandler(async (req, res) => {
    const author = await Author.findByIdAndUpdate(
        req.authorId,
        req.body,
        { new: true, runValidators: true }
    ).populate('books');

    if (!author) throw new ApiError(404, 'Author not found');
    res.json({ success: true, data: author });
});

/**
 * @desc    Delete author by ID
 * @route   DELETE /api/authors/:id
 * @access  Private/Admin
 */
exports.deleteAuthorById = asyncHandler(async (req, res) => {
    const author = await Author.findByIdAndDelete(req.authorId);
    if (!author) throw new ApiError(404, 'Author not found');
    res.json({ success: true, message: 'Author deleted' });
});
