const { getStats } = require('../services/admin.service');
const { success } = require('../utils/apiResponse');

const stats = async (req, res, next) => {
  try {
    const data = await getStats();
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { stats };
