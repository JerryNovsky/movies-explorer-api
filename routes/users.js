const express = require('express');
const { getCurrentUser, updateUserInfo } = require('../controllers/user');
const { updateUserInfoValidation } = require('../validators/user');

const userRoutes = express.Router();

userRoutes.get('/users/me', getCurrentUser);
userRoutes.patch('/users/me', updateUserInfoValidation, updateUserInfo);

module.exports = { userRoutes };
