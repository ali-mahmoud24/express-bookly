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

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: API for managing authors
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the author
 *         name:
 *           type: string
 *           description: Author's full name
 *           example: J.K. Rowling
 *         bio:
 *           type: string
 *           description: Short biography of the author
 *           example: British author, best known for the Harry Potter series.
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Birth date of the author
 *           example: 1965-07-31
 *         books:
 *           type: array
 *           description: List of book IDs written by the author
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// ==========================
// 🌍 Public Routes
// ==========================

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     description: Public - Anyone can access this endpoint.
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of all authors
 */
router.get('/', getAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get author by ID
 *     description: Public - Anyone can access this endpoint.
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author details
 *       404:
 *         description: Author not found
 */
router.get('/:id', getAuthorById);

// ==========================
// 👮 Admin-Only Routes
// ==========================

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author (Admin only)
 *     description: Admin only - Requires authentication and admin role.
 *     tags: [Authors]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: George R.R. Martin
 *               bio:
 *                 type: string
 *                 example: American novelist and short story writer in fantasy, horror, and science fiction.
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1948-09-20
 *     responses:
 *       201:
 *         description: Author created successfully
 */
router.post('/', protect, isAdmin, validate(authorCreateSchema), createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update author by ID (Admin only)
 *     description: Admin only - Requires authentication and admin role.
 *     tags: [Authors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Author Name
 *               bio:
 *                 type: string
 *                 example: Updated biography text
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1970-01-01
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       404:
 *         description: Author not found
 */
router.put(
  '/:id',
  protect,
  isAdmin,
  validate(authorUpdateSchema),
  updateAuthorById
);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete author by ID (Admin only)
 *     description: Admin only - Requires authentication and admin role.
 *     tags: [Authors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 */
router.delete('/:id', protect, isAdmin, deleteAuthorById);

module.exports = router;
