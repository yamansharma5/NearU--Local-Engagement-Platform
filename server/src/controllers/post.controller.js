const { getNearbyPosts } = require('../services/location.service');
const {
  createPost,
  getOwnPosts,
  updatePost,
  deactivatePost,
} = require('../services/post.service');
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

const create = async (req, res, next) => {
  try {
    const post = await createPost(req.user.id, req.body);
    return success(res, { post }, 'Post created successfully.', 201);
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

const mine = async (req, res, next) => {
  try {
    const posts = await getOwnPosts(req.user.id);
    return success(res, { posts, count: posts.length });
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const post = await updatePost(req.user.id, req.params.id, req.body);
    return success(res, { post }, 'Post updated successfully.');
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await deactivatePost(req.user.id, req.params.id);
    return success(res, null, 'Post deleted successfully.');
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { nearby, create, mine, update, remove };
