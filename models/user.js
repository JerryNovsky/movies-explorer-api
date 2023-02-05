const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { UnauthorizedError, authorizationErrorMessage } = require('../utils/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Введите email',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((info) => {
      if (!info) {
        return Promise.reject(new UnauthorizedError(authorizationErrorMessage));
      }

      return bcrypt.compare(password, info.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(authorizationErrorMessage));
          }

          const user = info.toObject();
          delete user.password;
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
