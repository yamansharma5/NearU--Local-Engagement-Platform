const { Router } = require('express');
const { uploadImage } = require('../controllers/upload.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { uploadSingleImage } = require('../middlewares/upload.middleware');

const router = Router();
router.post('/', authenticateToken, requireRole('BUSINESS'), uploadSingleImage, uploadImage);

module.exports = router;
