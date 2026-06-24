const { Router } = require('express');
const { getById, getMe, updateMe } = require('../controllers/business.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { updateBusinessSchema, validate } = require('../validators/business.validator');

const router = Router();

router.get('/me', authenticateToken, requireRole('BUSINESS'), getMe);
router.put('/me', authenticateToken, requireRole('BUSINESS'), validate(updateBusinessSchema), updateMe);
router.get('/:id', getById);

module.exports = router;
