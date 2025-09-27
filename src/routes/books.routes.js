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

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the book
 *         title:
 *           type: string
 *           description: Book title
 *           example: Harry Potter and the Philosopher's Stone
 *         author:
 *           type: string
 *           description: ID of the author (ObjectId)
 *         category:
 *           type: string
 *           description: Category or genre of the book
 *           example: Fantasy
 *         publishedYear:
 *           type: integer
 *           description: Year the book was published
 *           example: 1997
 *         description:
 *           type: string
 *           description: Short summary of the book
 *           example: The first novel in the Harry Potter series.
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// ==========================
// 📚 Public Routes
// ==========================

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Public - Anyone can access this endpoint. Supports query filtering by `author` and `category`.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter books by author ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter books by category
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', getBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     description: Public - Anyone can access this endpoint.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get('/:id', getBookById);

// ==========================
// 👮 Admin-Only Routes
// ==========================

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     description: Admin only - Requires authentication and admin role.
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: A Game of Thrones
 *               author:
 *                 type: string
 *                 example: 652d19f61c8b3b72b89a42e1
 *               category:
 *                 type: string
 *                 example: Fantasy
 *               publishedYear:
 *                 type: integer
 *                 example: 1996
 *               description:
 *                 type: string
 *                 example: First book of A Song of Ice and Fire series.
 *     responses:
 *       201:
 *         description: Book created successfully
 */
router.post('/', protect, isAdmin, validate(bookCreateSchema), createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update book by ID
 *     description: Admin only - Requires authentication and admin role.
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Book Title
 *               category:
 *                 type: string
 *                 example: Updated Category
 *               publishedYear:
 *                 type: integer
 *                 example: 2000
 *               description:
 *                 type: string
 *                 example: Updated book description.
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 */
router.put(
  '/:id',
  protect,
  isAdmin,
  validate(bookUpdateSchema),
  updateBookById
);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete book by ID
 *     description: Admin only - Requires authentication and admin role.
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete('/:id', protect, isAdmin, deleteBookById);

module.exports = router;
