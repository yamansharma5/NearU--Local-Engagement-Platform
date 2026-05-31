const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../lib/prisma');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const { success, error } = require('../utils/apiResponse');

const SALT_ROUNDS = 12;

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

const safeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return error(res, 'Email already registered.', 409);

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone, role: 'USER' },
    });

    const token = signToken(user);
    return success(res, { token, user: safeUser(user) }, 'Registration successful.', 201);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return error(res, 'Invalid email or password.', 401);
    if (!user.isActive) return error(res, 'Account is deactivated.', 403);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error(res, 'Invalid email or password.', 401);

    const token = signToken(user);
    return success(res, { token, user: safeUser(user) }, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout  — stateless, client drops token
const logout = (_req, res) => {
  return success(res, null, 'Logged out successfully.');
};

// GET /api/auth/me
const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true,
        avatar: true, phone: true, isActive: true,
        createdAt: true, updatedAt: true,
      },
    });
    if (!user) return error(res, 'User not found.', 404);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/business/register
const businessRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, businessName, description, businessPhone, categoryId } =
      req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return error(res, 'Email already registered.', 409);

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user + business in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password: hashed, phone, role: 'BUSINESS' },
      });
      const business = await tx.business.create({
        data: {
          name: businessName,
          description,
          phone: businessPhone,
          ownerId: user.id,
          ...(categoryId && { categoryId }),
          verificationStatus: 'PENDING',
        },
      });
      return { user, business };
    });

    const token = signToken(result.user);
    return success(
      res,
      { token, user: safeUser(result.user), business: result.business },
      'Business registration successful.',
      201
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/business/login
const businessLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true },
    });
    if (!user || user.role !== 'BUSINESS') return error(res, 'Invalid email or password.', 401);
    if (!user.isActive) return error(res, 'Account is deactivated.', 403);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error(res, 'Invalid email or password.', 401);

    const token = signToken(user);
    return success(res, { token, user: safeUser(user), business: user.business }, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, me, businessRegister, businessLogin };
