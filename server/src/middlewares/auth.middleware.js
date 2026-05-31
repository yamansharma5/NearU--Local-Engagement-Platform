const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { error } = require('../utils/apiResponse');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.slice(7);

  if (!token) {
    return error(res, 'Access denied. No token provided.', 401);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token has expired.', 401);
    }
    return error(res, 'Invalid token.', 401);
  }
};

module.exports = { authenticateToken };
