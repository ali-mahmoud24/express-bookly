const express = require('express');
const asyncHandler = require('express-async-handler');

const validate = require('../middlewares/validation.middleware');
const { userRegisterSchema, userLoginSchema } = require('../schemas/user.schema');
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(userRegisterSchema), asyncHandler(registerUser));
router.post('/login', validate(userLoginSchema), asyncHandler(loginUser));
router.post('/logout', asyncHandler(logoutUser));

module.exports = router;
