const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');

const {
    bookCreateSchema,
    bookUpdateSchema,
} = require('../schemas/book.schema');

const {
    createBook,
    getBooks,
    getBookById,
    updateBookById,
    deleteBookById,
} = require('../controllers/book.controller');

const router = express.Router();

/**
 * Middleware for handling :id param
 */
router.param('id', (req, res, next, id) => {
    req.bookId = id;
    next();
});

// ==========================
// 📚 Public Routes
// ==========================
router.get('/', getBooks);
router.get('/:id', getBookById);

// ==========================
// 👮 Admin-Only Routes
// ==========================
router.post('/', protect, isAdmin, validate(bookCreateSchema), createBook);
router.put('/:id', protect, isAdmin, validate(bookUpdateSchema), updateBookById);
router.delete('/:id', protect, isAdmin, deleteBookById);

module.exports = router;
