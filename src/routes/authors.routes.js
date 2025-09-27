const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');

const {
    authorCreateSchema,
    authorUpdateSchema,
} = require('../schemas/author.schema');

const {
    createAuthor,
    getAuthors,
    getAuthorById,
    updateAuthorById,
    deleteAuthorById,
} = require('../controllers/author.controller');

const router = express.Router();

/**
 * Middleware for handling :id param
 */
router.param('id', (req, res, next, id) => {
    req.authorId = id;
    next();
});

// ==========================
// 🌍 Public Routes
// ==========================
router.get('/', getAuthors);
router.get('/:id', getAuthorById);

// ==========================
// 👮 Admin-Only Routes
// ==========================
router.post('/', protect, isAdmin, validate(authorCreateSchema), createAuthor);
router.put('/:id', protect, isAdmin, validate(authorUpdateSchema), updateAuthorById);
router.delete('/:id', protect, isAdmin, deleteAuthorById);

module.exports = router;
