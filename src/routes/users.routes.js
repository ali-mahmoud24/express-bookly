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

// ==========================
// 👤 User's Own Profile
// ==========================
router.get('/me', protect, getMyProfile);
router.put('/me', protect, validate(userSelfUpdateSchema), updateMyProfile);

// ==========================
// 👮 Admin-Only Routes
// ==========================
router.post('/', protect, isAdmin, validate(userRegisterSchema), createUser);
router.get('/', protect, isAdmin, getUsers);
router.get('/:id', protect, isAdmin, getUserById);
router.put(
  '/:id',
  protect,
  isAdmin,
  validate(userUpdateSchema),
  updateUserById
);
router.delete('/:id', protect, isAdmin, deleteUserById);

module.exports = router;
