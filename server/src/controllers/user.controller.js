const { listUsers, toggleUserStatus } = require('../services/user.service');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const users = await listUsers({ search: req.query.search });
    return success(res, { users, count: users.length });
  } catch (err) {
    next(err);
  }
};

const toggleStatus = async (req, res, next) => {
  try {
    const user = await toggleUserStatus(req.params.id);
    return success(res, { user }, 'User status updated.');
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { list, toggleStatus };
