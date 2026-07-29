const prisma = require('../../lib/prisma');

const httpError = (message, statusCode) => Object.assign(new Error(message), { statusCode });
const EXPIRY_HOUR_OPTIONS = new Set([1, 3, 6, 24, 48]);

const getOwnedBusiness = async (ownerId) => {
  const business = await prisma.business.findUnique({ where: { ownerId } });
  if (!business) throw httpError('Business profile not found.', 404);
  return business;
};

const deriveOfferExpiry = (data) => {
  if (!data.expiresInHours) return data;
  const hours = Number(data.expiresInHours);
  if (!EXPIRY_HOUR_OPTIONS.has(hours)) {
    throw httpError('Choose one of: 1 hour, 3 hours, 6 hours, 24 hours, or 2 days.', 400);
  }

  return {
    ...data,
    validUntil: new Date(Date.now() + hours * 60 * 60 * 1000),
  };
};

const pickKnownFields = (data, keys) => {
  return Object.fromEntries(keys.filter((key) => key in data).map((key) => [key, data[key]]));
};

const normalizeTypeFields = (data, type) => ({
  ...pickKnownFields(data, ['type', 'title', 'content', 'image']),
  discount: type === 'OFFER' ? data.discount : null,
  validUntil: type === 'EVENT' ? null : data.validUntil,
  eventDate: type === 'EVENT' ? data.eventDate : null,
  venue: type === 'EVENT' ? data.venue : null,
});

const validateTypeFields = (post) => {
  if (post.type === 'OFFER' && (!post.discount || !post.validUntil)) {
    throw httpError('Offer posts require discount and validUntil.', 400);
  }
  if (post.type === 'OFFER' && post.validUntil <= new Date()) {
    throw httpError('Offer expiry must be in the future.', 400);
  }
  if (post.type === 'EVENT' && (!post.eventDate || !post.venue)) {
    throw httpError('Event posts require eventDate and venue.', 400);
  }
};

const createPost = async (ownerId, data) => {
  const business = await getOwnedBusiness(ownerId);
  const postData = data.type !== 'EVENT' ? deriveOfferExpiry(data) : data;
  validateTypeFields(postData);
  return prisma.post.create({
    data: {
      ...normalizeTypeFields(postData, postData.type),
      expiredAt: null,
      businessId: business.id,
      lat: business.lat,
      lng: business.lng,
    },
    include: { business: { select: { id: true, name: true, isVerified: true } } },
  });
};

const getOwnPosts = async (ownerId) => {
  const business = await getOwnedBusiness(ownerId);
  return prisma.post.findMany({
    where: {
      businessId: business.id,
      OR: [{ isActive: true }, { expiredAt: { not: null } }],
    },
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
  const canExtendExpiredOffer = existing.type === 'OFFER' && !!existing.expiredAt;
  if (!existing.isActive && !canExtendExpiredOffer) throw httpError('Post not found.', 404);
  const postData = (data.type || existing.type) !== 'EVENT' ? deriveOfferExpiry(data) : data;
  const merged = { ...existing, ...postData };
  validateTypeFields(merged);
  const shouldReactivateOffer =
    merged.type === 'OFFER' && merged.validUntil > new Date() && (!existing.isActive || existing.expiredAt);

  return prisma.post.update({
    where: { id: postId },
    data: {
      ...normalizeTypeFields(postData, merged.type),
      ...(shouldReactivateOffer ? { isActive: true, expiredAt: null } : {}),
    },
  });
};

const deactivatePost = async (ownerId, postId) => {
  const post = await getOwnedPost(ownerId, postId);
  if (!post.isActive && !post.expiredAt) throw httpError('Post not found.', 404);
  return prisma.post.update({ where: { id: postId }, data: { isActive: false, expiredAt: null } });
};

const listAllPosts = async ({ search, type } = {}) => {
  return prisma.post.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { business: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    },
    include: { business: { select: { id: true, name: true, isVerified: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
};

const toggleAdminPostStatus = async (id) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw httpError('Post not found.', 404);

  return prisma.post.update({
    where: { id },
    data: { isActive: !post.isActive },
    include: { business: { select: { id: true, name: true, isVerified: true } } },
  });
};

module.exports = {
  createPost,
  getOwnPosts,
  updatePost,
  deactivatePost,
  listAllPosts,
  toggleAdminPostStatus,
};
