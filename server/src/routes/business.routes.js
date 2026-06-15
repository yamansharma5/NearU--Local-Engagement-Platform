const { Router } = require('express');
const { getById } = require('../controllers/business.controller');

const router = Router();

// Public — business profiles are visible to unauthenticated users (discovery flow)
router.get('/:id', getById);

module.exports = router;
