const { getBusinessById } = require('../services/business.service');
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

module.exports = { getById };
