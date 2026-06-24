const { Router } = require('express');
const { create, mine, markReplied } = require('../controllers/enquiry.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { createEnquirySchema, validate } = require('../validators/enquiry.validator');

const router = Router();
router.use(authenticateToken);

router.post('/', requireRole('USER'), validate(createEnquirySchema), create);
router.get('/me', requireRole('BUSINESS'), mine);
router.put('/:id/status', requireRole('BUSINESS'), markReplied);

module.exports = router;
