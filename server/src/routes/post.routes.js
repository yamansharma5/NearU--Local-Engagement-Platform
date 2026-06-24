const { Router } = require('express');
const { nearby, create, mine, update, remove } = require('../controllers/post.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const {
  nearbyQuerySchema,
  createPostSchema,
  updatePostSchema,
  validateQuery,
  validateBody,
} = require('../validators/post.validator');

const router = Router();

router.get('/nearby', validateQuery(nearbyQuerySchema), nearby);
router.post('/', authenticateToken, requireRole('BUSINESS'), validateBody(createPostSchema), create);
router.get('/me', authenticateToken, requireRole('BUSINESS'), mine);
router.put('/:id', authenticateToken, requireRole('BUSINESS'), validateBody(updatePostSchema), update);
router.delete('/:id', authenticateToken, requireRole('BUSINESS'), remove);

module.exports = router;
