const {
  getBusinessById,
  getOwnBusiness,
  updateOwnBusiness,
} = require('../services/business.service');
const { success, error } = require('../utils/apiResponse');

// GET /api/businesses/:id — public, no auth required for now, but may require auth in the future if we want to show more details to the business owner
const getById = async (req, res, next) => {
  try {
    const business = await getBusinessById(req.params.id);
    if (!business) return error(res, 'Business not found.', 404);
    return success(res, { business });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const business = await getOwnBusiness(req.user.id);
    if (!business) return error(res, 'Business profile not found.', 404);
    return success(res, { business });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const business = await updateOwnBusiness(req.user.id, req.body);
    return success(res, { business }, 'Business profile updated successfully.');
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { getById, getMe, updateMe };
