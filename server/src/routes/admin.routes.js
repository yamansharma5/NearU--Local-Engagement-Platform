const { Router } = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { stats } = require('../controllers/admin.controller');
const { list: listUsers, toggleStatus: toggleUserStatus } = require('../controllers/user.controller');
const {
  adminList: adminListBusinesses,
  adminToggleStatus: adminToggleBusinessStatus,
} = require('../controllers/business.controller');
const {
  adminList: adminListPosts,
  adminToggleStatus: adminTogglePostStatus,
} = require('../controllers/post.controller');
const {
  create: createCategory,
  update: updateCategory,
  remove: removeCategory,
} = require('../controllers/category.controller');
const { categorySchema, validate } = require('../validators/category.validator');

const router = Router();
router.use(authenticateToken, requireRole('ADMIN'));

router.get('/stats', stats);

router.get('/users', listUsers);
router.put('/users/:id/status', toggleUserStatus);

router.get('/businesses', adminListBusinesses);
router.put('/businesses/:id/status', adminToggleBusinessStatus);

router.get('/posts', adminListPosts);
router.put('/posts/:id/status', adminTogglePostStatus);

router.post('/categories', validate(categorySchema), createCategory);
router.put('/categories/:id', validate(categorySchema), updateCategory);
router.delete('/categories/:id', removeCategory);

module.exports = router;
