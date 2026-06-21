const { Router } = require('express');
const { create } = require('../controllers/enquiry.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { createEnquirySchema, validate } = require('../validators/enquiry.validator');

const router = Router();

// All enquiry routes require a valid JWT — userId is read from req.user, never from the body
router.use(authenticateToken);

router.post('/', validate(createEnquirySchema), create);

module.exports = router;
