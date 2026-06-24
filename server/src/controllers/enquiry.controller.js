const {
  createEnquiry,
  getBusinessEnquiries,
  markEnquiryReplied,
} = require('../services/enquiry.service');
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

const mine = async (req, res, next) => {
  try {
    const enquiries = await getBusinessEnquiries(req.user.id);
    return success(res, { enquiries, count: enquiries.length });
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

const markReplied = async (req, res, next) => {
  try {
    const enquiry = await markEnquiryReplied(req.user.id, req.params.id);
    return success(res, { enquiry }, 'Enquiry marked as replied.');
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { create, mine, markReplied };
