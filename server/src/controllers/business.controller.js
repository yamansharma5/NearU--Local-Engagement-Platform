const { getBusinessById } = require('../services/business.service');
const { success, error } = require('../utils/apiResponse');

// GET /api/businesses/:id — public, no auth required
const getById = async (req, res, next) => {
  try {
    const business = await getBusinessById(req.params.id);
    if (!business) return error(res, 'Business not found.', 404);
    return success(res, { business });
  } catch (err) {
    next(err);
  }
};

module.exports = { getById };
