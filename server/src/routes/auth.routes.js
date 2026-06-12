const { Router } = require('express');
const { register, login, me, businessRegister, businessLogin } =
  require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validate, registerSchema, loginSchema, businessRegisterSchema } =
  require('../validators/auth.validator');

const router = Router();

// User auth
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticateToken, me);// Get current user info for both users and businesses

// Business auth
router.post('/business/register', validate(businessRegisterSchema), businessRegister);
router.post('/business/login', validate(loginSchema), businessLogin);

module.exports = router;
