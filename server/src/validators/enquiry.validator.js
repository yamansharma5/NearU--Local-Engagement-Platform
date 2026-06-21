const { z } = require('zod');

const createEnquirySchema = z.object({
  businessId: z.string().min(1, 'businessId is required'),
  // postId is optional — enquiry can reference a specific post or just the business
  postId: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Reuse the validate pattern from auth.validator.js (validates req.body)
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  req.body = result.data;
  next();
};

module.exports = { createEnquirySchema, validate };
