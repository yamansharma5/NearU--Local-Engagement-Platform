const multer = require('multer');

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(Object.assign(new Error('Only JPEG, PNG, and WebP images are allowed.'), {
        statusCode: 400,
      }));
    }
    callback(null, true);
  },
});

const uploadSingleImage = (req, res, next) => {
  uploader.single('image')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      err.statusCode = 400;
      err.message = err.code === 'LIMIT_FILE_SIZE'
        ? 'Image must be 5MB or smaller.'
        : 'Invalid image upload.';
    }
    next(err);
  });
};

module.exports = { uploadSingleImage };
