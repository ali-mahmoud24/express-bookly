const express = require('express');
const asyncHandler = require('express-async-handler');

const validate = require('../middlewares/validation.middleware');
const {
  userRegisterSchema,
  userLoginSchema,
} = require('../schemas/user.schema');
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAuth:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: StrongPass123
 */

// ==========================
// 🔑 Auth Routes (Public)
// ==========================

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Public - Create a new user account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAuth'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post(
  '/register',
  validate(userRegisterSchema),
  asyncHandler(registerUser)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Public - Authenticate user and return JWT token in an HTTP-only cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(userLoginSchema), asyncHandler(loginUser));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Public - Clears authentication token cookie and logs out the user.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', asyncHandler(logoutUser));

module.exports = router;
