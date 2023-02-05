const jwt = require('jsonwebtoken');
const { UnauthorizedError, authorizationErrorMessage } = require('../utils/UnauthorizedError');
const { JWT_SECRET } = require('../utils/config');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(authorizationErrorMessage));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'strong-key');
  } catch (err) {
    return next(new UnauthorizedError(authorizationErrorMessage));
  }

  req.user = payload;
  return next();
};
