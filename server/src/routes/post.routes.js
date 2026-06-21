const { Router } = require('express');
const { nearby } = require('../controllers/post.controller');
const { nearbyQuerySchema, validateQuery } = require('../validators/post.validator');

const router = Router();

// Public — no auth needed to browse the feed or map
router.get('/nearby', validateQuery(nearbyQuerySchema), nearby);

module.exports = router;
