const { Router } = require('express');
const { register, login, me, updateMe, businessRegister, businessLogin } =
  require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validate, registerSchema, loginSchema, businessRegisterSchema, updateProfileSchema } =
  require('../validators/auth.validator');

const router = Router();

// User auth
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticateToken, me);
router.put('/me', authenticateToken, validate(updateProfileSchema), updateMe);

// Business auth
router.post('/business/register', validate(businessRegisterSchema), businessRegister);
router.post('/business/login', validate(loginSchema), businessLogin);

module.exports = router;
