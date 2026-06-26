const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const businessRegisterSchema = z.object({
  // User fields
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
  // Business fields
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().optional(),
  businessPhone: z.string().optional(),
  logo: z.string().url('Logo must be a valid URL').optional().or(z.literal('')),
  categoryId: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  lat: z.coerce.number().min(-90, 'Latitude must be at least -90').max(90, 'Latitude must be at most 90'),
  lng: z.coerce.number().min(-180, 'Longitude must be at least -180').max(180, 'Longitude must be at most 180'),
});

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

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, 'At least one field is required');

module.exports = { registerSchema, loginSchema, businessRegisterSchema, updateProfileSchema, validate };
