const { z } = require('zod');

const updateBusinessSchema = z
  .object({
    name: z.string().trim().min(2, 'Business name must be at least 2 characters').optional(),
    description: z.string().trim().max(2000, 'Description is too long').nullable().optional(),
    phone: z.string().trim().max(30, 'Phone number is too long').nullable().optional(),
    logo: z.string().url('Logo must be a valid URL').nullable().optional(),
    categoryId: z.string().min(1, 'categoryId cannot be empty').nullable().optional(),
    address: z.string().trim().min(5, 'Address must be at least 5 characters').optional(),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  req.body = result.data;
  next();
};

module.exports = { updateBusinessSchema, validate };
