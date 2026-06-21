const { z } = require('zod');

const nearbyQuerySchema = z.object({
  lat: z.coerce
    .number({ required_error: 'lat is required' })
    .min(-90, 'lat must be between -90 and 90')
    .max(90, 'lat must be between -90 and 90'),
  lng: z.coerce
    .number({ required_error: 'lng is required' })
    .min(-180, 'lng must be between -180 and 180')
    .max(180, 'lng must be between -180 and 180'),
  // radius is coerced so the URL string "5" becomes the number 5
  radius: z.coerce.number().positive().max(50, 'radius cannot exceed 50 km').default(5),
  type: z.enum(['UPDATE', 'OFFER', 'EVENT']).optional(),
  // category is a categoryId string; optional and just passed through
  category: z.string().optional(),
});

// Validates req.query instead of req.body and replaces it with coerced values
// so controllers receive numbers, not strings, for lat/lng/radius.
const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  req.query = result.data;
  next();
};

module.exports = { nearbyQuerySchema, validateQuery };
