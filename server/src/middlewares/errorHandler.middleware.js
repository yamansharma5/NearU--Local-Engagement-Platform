const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json({
        success: false,
        message: `A record with this ${field} already exists.`,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  // Zod errors (if thrown manually)
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Express body-parser errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON body.' });
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message;

  return res.status(statusCode).json({ success: false, message });
};

module.exports = { errorHandler };
