const { getNearbyPosts } = require('../services/location.service');
const { success, error } = require('../utils/apiResponse');

// GET /api/posts/nearby?lat=&lng=&radius=&type=&category=
// Query params are pre-validated and coerced by nearbyQuerySchema so lat/lng/radius
// arrive here as numbers, not strings.
const nearby = async (req, res, next) => {
  try {
    const { lat, lng, radius, type, category } = req.query;

    const posts = await getNearbyPosts({
      lat,
      lng,
      radius,
      type,
      categoryId: category,
    });

    return success(res, { posts, count: posts.length });
  } catch (err) {
    next(err);
  }
};

module.exports = { nearby };
