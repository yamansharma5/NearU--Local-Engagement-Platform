const prisma = require('../../lib/prisma');

const httpError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

const getOwnedBusiness = async (ownerId) => {
  const business = await prisma.business.findUnique({ where: { ownerId } });
  if (!business) throw httpError('Business profile not found.', 404);
  return business;
};

const normalizeTypeFields = (data, type) => ({
  ...data,
  discount: type === 'OFFER' ? data.discount : null,
  validUntil: type === 'OFFER' ? data.validUntil : null,
  eventDate: type === 'EVENT' ? data.eventDate : null,
  venue: type === 'EVENT' ? data.venue : null,
});

const validateTypeFields = (post) => {
  if (post.type === 'OFFER' && (!post.discount || !post.validUntil)) {
    throw httpError('Offer posts require discount and validUntil.', 400);
  }
  if (post.type === 'EVENT' && (!post.eventDate || !post.venue)) {
    throw httpError('Event posts require eventDate and venue.', 400);
  }
};

const createPost = async (ownerId, data) => {
  const business = await getOwnedBusiness(ownerId);
  validateTypeFields(data);
  return prisma.post.create({
    data: {
      ...normalizeTypeFields(data, data.type),
      businessId: business.id,
      lat: business.lat,
      lng: business.lng,
    },
    include: { business: { select: { id: true, name: true } } },
  });
};

const getOwnPosts = async (ownerId) => {
  const business = await getOwnedBusiness(ownerId);
  return prisma.post.findMany({
    where: { businessId: business.id, isActive: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getOwnedPost = async (ownerId, postId) => {
  const [business, post] = await Promise.all([
    getOwnedBusiness(ownerId),
    prisma.post.findUnique({ where: { id: postId } }),
  ]);
  if (!post) throw httpError('Post not found.', 404);
  if (post.businessId !== business.id) throw httpError('You do not own this post.', 403);
  return post;
};

const updatePost = async (ownerId, postId, data) => {
  const existing = await getOwnedPost(ownerId, postId);
  if (!existing.isActive) throw httpError('Post not found.', 404);
  const merged = { ...existing, ...data };
  validateTypeFields(merged);
  return prisma.post.update({
    where: { id: postId },
    data: normalizeTypeFields(data, merged.type),
  });
};

const deactivatePost = async (ownerId, postId) => {
  const post = await getOwnedPost(ownerId, postId);
  if (!post.isActive) throw httpError('Post not found.', 404);
  return prisma.post.update({ where: { id: postId }, data: { isActive: false } });
};

module.exports = { createPost, getOwnPosts, updatePost, deactivatePost };
