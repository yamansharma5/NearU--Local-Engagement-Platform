const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../services/category.service');
const { success, error } = require('../utils/apiResponse');

// GET /api/categories — public, no auth required
const getAll = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    return success(res, { categories });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const category = await createCategory(req.body.name);
    return success(res, { category }, 'Category created.', 201);
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body.name);
    return success(res, { category }, 'Category updated.');
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    return success(res, null, 'Category deleted.');
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { getAll, create, update, remove };
