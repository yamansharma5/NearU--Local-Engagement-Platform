const { getAllCategories } = require('../services/category.service');
const { success } = require('../utils/apiResponse');

// GET /api/categories — public, no auth required
const getAll = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    return success(res, { categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll };
