const { cloudinary, hasCloudinaryConfig } = require('../config/cloudinary');
const { success, error } = require('../utils/apiResponse');

const uploadImage = async (req, res, next) => {
  if (!req.file) return error(res, 'An image file is required.', 400);
  if (!hasCloudinaryConfig) return error(res, 'Image upload is not configured.', 503);

  try {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'nearu', resource_type: 'image' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    return success(
      res,
      { url: uploaded.secure_url, publicId: uploaded.public_id },
      'Image uploaded successfully.',
      201
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
