const { Router } = require('express');
const { getAll } = require('../controllers/category.controller');

const router = Router();

// Public — categories are needed before login (e.g. business registration form)
router.get('/', getAll);

module.exports = router;
