const { createEnquiry } = require('../services/enquiry.service');
const { success, error } = require('../utils/apiResponse');

// POST /api/enquiries — requires auth; userId always comes from the JWT, never from the body
const create = async (req, res, next) => {
  try {
    const { businessId, postId, message } = req.body;

    const enquiry = await createEnquiry({
      userId: req.user.id,
      businessId,
      postId,
      message,
    });

    return success(res, { enquiry }, 'Enquiry sent successfully.', 201);
  } catch (err) {
    // Re-throw with the statusCode set in enquiry.service for 404 cases
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { create };
