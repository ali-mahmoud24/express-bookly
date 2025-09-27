const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');

const {
  userRegisterSchema,
  userUpdateSchema,
  userSelfUpdateSchema,
} = require('../schemas/user.schema');

const {
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
} = require('../controllers/user.controller');

const router = express.Router();

/**
 * Middleware for handling :id param
 */
router.param('id', (req, res, next, id) => {
  req.userId = id;
  next();
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         isAdmin:
 *           type: boolean
 *           example: false
 *         borrowedBooks:
 *           type: array
 *           description: List of books borrowed by the user
 *           items:
 *             $ref: '#/components/schemas/Book'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
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
 *           example: "The Great Gatsby"
 *         author:
 *           type: string
 *           description: Author ID (or populated author object)
 *         description:
 *           type: string
 *           example: "A classic novel set in the 1920s."
 *         category:
 *           type: string
 *           example: "Fiction"
 *         copiesAvailable:
 *           type: number
 *           example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// ==========================
// 👤 User's Own Profile
// ==========================

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/me', protect, getMyProfile);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */
router.put('/me', protect, validate(userSelfUpdateSchema), updateMyProfile);

/**
 * @swagger
 * /users/me/borrow/{bookId}:
 *   post:
 *     summary: Borrow a book
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to borrow
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Already borrowed or no copies available
 *       404:
 *         description: User or book not found
 */
router.post('/me/borrow/:bookId', protect, borrowBook);

/**
 * @swagger
 * /users/me/return/{bookId}:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to return
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Book was not borrowed by this user
 *       404:
 *         description: User or book not found
 */
router.post('/me/return/:bookId', protect, returnBook);

/**
 * @swagger
 * /users/me/books:
 *   get:
 *     summary: Get all books borrowed by the logged-in user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of borrowed books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: User not found
 */
router.get('/me/books', protect, getMyBooks);

// ==========================
// 👮 Admin-Only Routes
// ==========================

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', protect, isAdmin, validate(userRegisterSchema), createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 */
router.get('/', protect, isAdmin, getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', protect, isAdmin, getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  protect,
  isAdmin,
  validate(userUpdateSchema),
  updateUserById
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', protect, isAdmin, deleteUserById);

module.exports = router;
