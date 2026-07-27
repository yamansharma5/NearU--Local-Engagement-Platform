const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const prisma = require('../../lib/prisma');
const { error } = require('../utils/apiResponse');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.slice(7);

  if (!token) {
    return error(res, 'Access denied. No token provided.', 401);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        isActive: true,
        role: true,
        business: { select: { isActive: true } },
      },
    });

    if (!user) {
      return error(res, 'Invalid token.', 401);
    }

    if (!user.isActive || (user.role === 'BUSINESS' && user.business?.isActive === false)) {
      return error(res, 'This account has been suspended.', 403);
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token has expired.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token.', 401);
    }
    next(err);
  }
};

module.exports = { authenticateToken };
