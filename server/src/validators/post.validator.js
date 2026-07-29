const { z } = require('zod');

const expiryHourOptions = [1, 3, 6, 24, 48];

const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90, 'lat must be between -90 and 90').max(90, 'lat must be between -90 and 90'),
  lng: z.coerce.number().min(-180, 'lng must be between -180 and 180').max(180, 'lng must be between -180 and 180'),
  radius: z.coerce.number().positive().max(50, 'radius cannot exceed 50 km').default(5),
  type: z.enum(['UPDATE', 'OFFER', 'EVENT']).optional(),
  category: z.string().optional(),
});

const postFields = {
  type: z.enum(['UPDATE', 'OFFER', 'EVENT']),
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150),
  content: z.string().trim().min(10, 'Content must be at least 10 characters').max(5000),
  image: z.string().url('Image must be a valid uploaded image URL').nullable().optional(),
  discount: z.string().trim().min(1, 'Discount is required').max(100).nullable().optional(),
  expiresInHours: z.coerce
    .number()
    .refine((value) => expiryHourOptions.includes(value), 'Choose one of: 1 hour, 3 hours, 6 hours, 24 hours, or 2 days')
    .optional(),
  eventDate: z.coerce.date().nullable().optional(),
  venue: z.string().trim().min(2, 'Venue must be at least 2 characters').max(250).nullable().optional(),
};

const createPostSchema = z.object(postFields).superRefine((data, context) => {
  if (data.type !== 'EVENT' && !data.expiresInHours) {
    context.addIssue({ code: 'custom', path: ['expiresInHours'], message: 'Choose when this post should expire' });
  }

  if (data.type === 'OFFER') {
    if (!data.discount) context.addIssue({ code: 'custom', path: ['discount'], message: 'Discount is required for an offer' });
  }
  if (data.type === 'EVENT') {
    if (!data.eventDate) context.addIssue({ code: 'custom', path: ['eventDate'], message: 'eventDate is required for an event' });
    if (!data.venue) context.addIssue({ code: 'custom', path: ['venue'], message: 'Venue is required for an event' });
  }
});

const updatePostSchema = z
  .object(Object.fromEntries(Object.entries(postFields).map(([key, schema]) => [key, schema.optional()])))
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

const validationError = (res, issues) => {
  const errors = issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
  return res.status(400).json({ success: false, message: 'Validation failed', errors });
};

const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) return validationError(res, result.error.issues);
  req.query = result.data;
  next();
};

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return validationError(res, result.error.issues);
  req.body = result.data;
  next();
};

module.exports = {
  nearbyQuerySchema,
  createPostSchema,
  updatePostSchema,
  validateQuery,
  validateBody,
};
